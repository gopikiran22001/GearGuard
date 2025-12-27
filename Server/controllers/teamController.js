const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

const createTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.create(req.body);
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const { specialization, isActive } = req.query;
    const filter = {};
    
    if (specialization) filter.specialization = specialization;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const teams = await MaintenanceTeam.find(filter)
      .populate('technicians', 'name email role')
      .sort({ name: 1 });

    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate('technicians', 'name email role department');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('technicians', 'name email role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'TECHNICIAN') {
      return res.status(400).json({ message: 'Invalid technician' });
    }

    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.technicians.includes(technicianId)) {
      team.technicians.push(technicianId);
      await team.save();
      
      // Update user's maintenance team
      technician.maintenanceTeam = team._id;
      await technician.save();
    }

    await team.populate('technicians', 'name email role');
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.technicians = team.technicians.filter(id => id.toString() !== technicianId);
    await team.save();

    // Remove team from user
    await User.findByIdAndUpdate(technicianId, { $unset: { maintenanceTeam: 1 } });

    await team.populate('technicians', 'name email role');
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove team reference from all technicians
    await User.updateMany(
      { maintenanceTeam: req.params.id },
      { $unset: { maintenanceTeam: 1 } }
    );

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTechnician,
  removeTechnician,
  deleteTeam
};