const express = require('express');
const {
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  scrapEquipment
} = require('../controllers/equipmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const equipmentValidation = [
  body('name').trim().notEmpty().withMessage('Equipment name is required'),
  body('serialNumber').trim().notEmpty().withMessage('Serial number is required'),
  body('purchaseDate').isISO8601().withMessage('Valid purchase date is required'),
  body('warrantyExpiry').isISO8601().withMessage('Valid warranty expiry date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('assignedEmployee').isMongoId().withMessage('Valid assigned employee ID is required'),
  body('maintenanceTeam').isMongoId().withMessage('Valid maintenance team ID is required')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', roleMiddleware('ADMIN', 'MANAGER'), equipmentValidation, createEquipment);
router.get('/', getEquipments);
router.get('/:id', getEquipmentById);
router.put('/:id', roleMiddleware('ADMIN', 'MANAGER'), updateEquipment);
router.delete('/:id', roleMiddleware('ADMIN'), deleteEquipment);
router.patch('/:id/scrap', roleMiddleware('ADMIN', 'MANAGER'), scrapEquipment);

module.exports = router;