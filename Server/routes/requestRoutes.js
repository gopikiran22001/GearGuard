const express = require('express');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  assignTechnician,
  getRequestsByEquipment,
  getCalendarRequests
} = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const requestValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('equipment').isMongoId().withMessage('Valid equipment ID is required'),
  body('requestType').isIn(['CORRECTIVE', 'PREVENTIVE']).withMessage('Invalid request type'),
  body('scheduledDate').optional().isISO8601().withMessage('Valid scheduled date required')
];

const statusUpdateValidation = [
  body('status').isIn(['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP']).withMessage('Invalid status'),
  body('hoursSpent').optional().isNumeric().withMessage('Hours spent must be a number')
];

const assignTechnicianValidation = [
  body('technicianId').isMongoId().withMessage('Valid technician ID is required')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', requestValidation, createRequest);
router.get('/', getRequests);
router.get('/calendar', getCalendarRequests);
router.get('/equipment/:equipmentId', getRequestsByEquipment);
router.get('/:id', getRequestById);
router.patch('/:id/status', statusUpdateValidation, updateRequestStatus);
router.patch('/:id/assign', roleMiddleware('ADMIN', 'MANAGER'), assignTechnicianValidation, assignTechnician);

module.exports = router;