const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let dashboardData = {};

    if (userRole === 'EMPLOYEE') {
      // Employee dashboard data
      const [myEquipment, myRequests] = await Promise.all([
        Equipment.find({ assignedEmployee: userId, status: 'ACTIVE' }),
        MaintenanceRequest.find({ createdBy: userId })
          .populate('equipment', 'name')
          .sort({ createdAt: -1 })
      ]);

      const pendingRequests = myRequests.filter(req => 
        req.status !== 'REPAIRED' && req.status !== 'SCRAP'
      );

      dashboardData = {
        myEquipment: myEquipment.length,
        myRequests: myRequests.length,
        pendingRequests: pendingRequests.length,
        recentRequests: myRequests.slice(0, 5).map(req => ({
          id: req._id,
          subject: req.subject,
          equipmentName: req.equipment[0]?.name || 'Unknown',
          status: req.status,
          date: req.createdAt.toLocaleDateString()
        }))
      };

    } else if (userRole === 'TECHNICIAN') {
      // Technician dashboard data
      const user = await User.findById(userId);
      const [myTasks, teamTasks, allRequests] = await Promise.all([
        MaintenanceRequest.find({ assignedTechnician: userId })
          .populate('equipment', 'name'),
        MaintenanceRequest.find({ 
          maintenanceTeam: user.maintenanceTeam,
          assignedTechnician: { $exists: false },
          status: { $nin: ['REPAIRED', 'SCRAP'] }
        }),
        MaintenanceRequest.find({ assignedTechnician: userId })
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completedToday = allRequests.filter(req => 
        req.completedDate && 
        req.completedDate >= today && 
        req.completedDate < tomorrow
      );

      const overdue = myTasks.filter(req => {
        if (!req.scheduledDate || req.status === 'REPAIRED' || req.status === 'SCRAP') return false;
        return new Date(req.scheduledDate) < new Date();
      });

      dashboardData = {
        myTasks: myTasks.length,
        teamTasks: teamTasks.length,
        completedToday: completedToday.length,
        overdueCount: overdue.length,
        workQueue: myTasks.slice(0, 5).map(req => ({
          id: req._id,
          subject: req.subject,
          equipment: req.equipment[0]?.name || 'Unknown',
          status: req.status,
          priority: req.priority,
          dueDate: req.scheduledDate ? req.scheduledDate.toLocaleDateString() : 'No due date'
        }))
      };

    } else {
      // Manager/Admin dashboard data
      const [allRequests, allEquipment, allTeams] = await Promise.all([
        MaintenanceRequest.find({})
          .populate('equipment', 'name')
          .populate('assignedTechnician', 'name')
          .populate('maintenanceTeam', 'name'),
        Equipment.find({ status: 'ACTIVE' }),
        MaintenanceTeam.find({}).populate('technicians', 'name')
      ]);

      const openRequests = allRequests.filter(req => 
        req.status !== 'REPAIRED' && req.status !== 'SCRAP'
      );

      const overdue = allRequests.filter(req => {
        if (!req.scheduledDate || req.status === 'REPAIRED' || req.status === 'SCRAP') return false;
        return new Date(req.scheduledDate) < new Date();
      });

      const completed = allRequests.filter(req => req.status === 'REPAIRED');
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
      const nextWeek = new Date(thisWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const preventiveThisWeek = allRequests.filter(req => 
        req.requestType === 'PREVENTIVE' &&
        req.scheduledDate &&
        req.scheduledDate >= thisWeek &&
        req.scheduledDate < nextWeek
      );

      // Team statistics
      const teamStats = allTeams.map(team => {
        const teamRequests = allRequests.filter(req => 
          req.maintenanceTeam._id.toString() === team._id.toString()
        );
        const activeRequests = teamRequests.filter(req => 
          req.status !== 'REPAIRED' && req.status !== 'SCRAP'
        );
        
        return {
          name: team.name,
          activeRequests: activeRequests.length,
          workload: Math.min((activeRequests.length / Math.max(team.technicians.length, 1)) * 20, 100)
        };
      });

      // Recent activity
      const recentActivity = allRequests
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(req => ({
          id: req._id,
          action: `${req.assignedTechnician?.name || 'Someone'} updated ${req.subject}`,
          user: req.assignedTechnician?.name || 'System',
          time: req.updatedAt.toLocaleString()
        }));

      dashboardData = {
        totalRequests: openRequests.length,
        overdueRequests: overdue.length,
        teamPerformance: allRequests.length > 0 ? Math.round((completed.length / allRequests.length) * 100) : 0,
        preventiveScheduled: preventiveThisWeek.length,
        teamStats,
        recentActivity
      };
    }

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardData
};