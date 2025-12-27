const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceTeam = require('../models/MaintenanceTeam');

const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    await equipment.populate(['assignedEmployee', 'maintenanceTeam', 'defaultTechnician']);
    res.status(201).json({ success: true, equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEquipments = async (req, res) => {
  try {
    const { department, status, assignedEmployee, category } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (assignedEmployee) filter.assignedEmployee = assignedEmployee;
    if (category) filter.category = category;

    const equipments = await Equipment.find(filter)
      .populate('assignedEmployee', 'name email')
      .populate('maintenanceTeam', 'name specialization')
      .populate('defaultTechnician', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, equipments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('assignedEmployee', 'name email department')
      .populate('maintenanceTeam', 'name specialization technicians')
      .populate('defaultTechnician', 'name email');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Get maintenance request count for smart button
    const openRequestsCount = await MaintenanceRequest.countDocuments({
      equipment: equipment._id,
      status: { $nin: ['REPAIRED', 'SCRAP'] }
    });

    res.json({ 
      success: true, 
      equipment: {
        ...equipment.toObject(),
        openRequestsCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['assignedEmployee', 'maintenanceTeam', 'defaultTechnician']);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ success: true, equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scrapEquipment = async (req, res) => {
  try {
    const { reason } = req.body;
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await equipment.markAsScrap(reason || 'Manual scrap action');

    res.json({ success: true, equipment, message: 'Equipment marked as scrapped' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  scrapEquipment
};