const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');

const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    await equipment.populate(['assignedEmployee', 'maintenanceTeam']);
    res.status(201).json({ success: true, equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEquipments = async (req, res) => {
  try {
    const { department, status, assignedEmployee } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (assignedEmployee) filter.assignedEmployee = assignedEmployee;

    const equipments = await Equipment.find(filter)
      .populate('assignedEmployee', 'name email')
      .populate('maintenanceTeam', 'name specialization')
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
      .populate('maintenanceTeam', 'name specialization technicians');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ success: true, equipment });
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
    ).populate(['assignedEmployee', 'maintenanceTeam']);

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
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status: 'SCRAPPED' },
      { new: true }
    );

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

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