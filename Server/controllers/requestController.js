const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const { validateStateTransition, validateTechnicianAccess } = require('../utils/stateValidator');

const createRequest = async (req, res) => {
  try {
    const { equipment: equipmentId, requestType, scheduledDate } = req.body;

    // Auto-fill maintenance team from equipment
    const equipment = await Equipment.findById(equipmentId).populate('maintenanceTeam');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.status === 'SCRAPPED') {
      return res.status(400).json({ message: 'Cannot create request for scrapped equipment' });
    }

    // Validate preventive request has scheduled date
    if (requestType === 'PREVENTIVE' && !scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required for preventive maintenance' });
    }

    const request = await MaintenanceRequest.create({
      ...req.body,
      maintenanceTeam: equipment.maintenanceTeam._id,
      createdBy: req.user.id
    });

    await request.populate([
      { path: 'equipment', select: 'name serialNumber location' },
      { path: 'maintenanceTeam', select: 'name specialization' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const { status, requestType, equipmentId, teamId, technicianId, startDate, endDate } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'TECHNICIAN') {
      filter.$or = [
        { assignedTechnician: req.user.id },
        { maintenanceTeam: req.user.maintenanceTeam }
      ];
    }

    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;
    if (equipmentId) filter.equipment = equipmentId;
    if (teamId) filter.maintenanceTeam = teamId;
    if (technicianId) filter.assignedTechnician = technicianId;

    // Date range filtering for calendar support
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const requests = await MaintenanceRequest.find(filter)
      .populate('equipment', 'name serialNumber location')
      .populate('maintenanceTeam', 'name specialization')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment', 'name serialNumber location department')
      .populate('maintenanceTeam', 'name specialization technicians')
      .populate('assignedTechnician', 'name email role')
      .populate('createdBy', 'name email role');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check technician access
    if (!validateTechnicianAccess(request, req.user)) {
      return res.status(403).json({ message: 'Access denied to this request' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, hoursSpent, notes } = req.body;
    
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Validate state transition
    if (!validateStateTransition(request.status, status)) {
      return res.status(400).json({ 
        message: `Invalid status transition from ${request.status} to ${status}` 
      });
    }

    // Check technician access
    if (!validateTechnicianAccess(request, req.user)) {
      return res.status(403).json({ message: 'Access denied to this request' });
    }

    // Handle scrap logic
    if (status === 'SCRAP') {
      await Equipment.findByIdAndUpdate(request.equipment, { status: 'SCRAPPED' });
    }

    const updateData = { status };
    if (hoursSpent !== undefined) updateData.hoursSpent = hoursSpent;
    if (notes) updateData.notes = notes;

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate([
      { path: 'equipment', select: 'name serialNumber location' },
      { path: 'maintenanceTeam', select: 'name specialization' },
      { path: 'assignedTechnician', select: 'name email' }
    ]);

    res.json({ success: true, request: updatedRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    // Only managers and admins can assign technicians
    if (!['MANAGER', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only managers can assign technicians' });
    }

    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('maintenanceTeam');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify technician belongs to the maintenance team
    if (!request.maintenanceTeam.technicians.includes(technicianId)) {
      return res.status(400).json({ 
        message: 'Technician must belong to the assigned maintenance team' 
      });
    }

    request.assignedTechnician = technicianId;
    if (request.status === 'NEW') {
      request.status = 'IN_PROGRESS';
    }
    
    await request.save();
    await request.populate('assignedTechnician', 'name email');

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestsByEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    
    const requests = await MaintenanceRequest.find({ equipment: equipmentId })
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCalendarRequests = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const filter = {
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
    };

    // Role-based filtering
    if (req.user.role === 'TECHNICIAN') {
      filter.$or = [
        { assignedTechnician: req.user.id },
        { maintenanceTeam: req.user.maintenanceTeam }
      ];
    }

    const requests = await MaintenanceRequest.find(filter)
      .populate('equipment', 'name location')
      .populate('assignedTechnician', 'name')
      .select('subject scheduledDate status requestType priority')
      .sort({ scheduledDate: 1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  assignTechnician,
  getRequestsByEquipment,
  getCalendarRequests
};