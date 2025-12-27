const User = require('../models/User');
const MaintenanceTeam = require('../models/MaintenanceTeam');

const getUsers = async (req, res) => {
  try {
    const { role, department, team } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (team) filter.maintenanceTeam = team;

    const users = await User.find(filter)
      .populate('maintenanceTeam', 'name specialization')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('maintenanceTeam', 'name specialization')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { maintenanceTeam, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('maintenanceTeam', 'name specialization')
     .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update team membership if maintenanceTeam is provided
    if (maintenanceTeam) {
      await MaintenanceTeam.findByIdAndUpdate(
        maintenanceTeam,
        { $addToSet: { technicians: user._id } }
      );
      
      user.maintenanceTeam = maintenanceTeam;
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTechnicians = async (req, res) => {
  try {
    const { team } = req.query;
    const filter = { role: { $in: ['TECHNICIAN', 'MANAGER'] } };
    
    if (team) filter.maintenanceTeam = team;

    const technicians = await User.find(filter)
      .populate('maintenanceTeam', 'name specialization')
      .select('name email role department maintenanceTeam')
      .sort({ name: 1 });

    res.json({ success: true, technicians });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  getTechnicians
};