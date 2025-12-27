const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTechnician,
  removeTechnician,
  deleteTeam
} = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const teamValidation = [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('specialization').isIn(['MECHANICAL', 'ELECTRICAL', 'IT', 'HVAC', 'GENERAL'])
    .withMessage('Invalid specialization')
];

const technicianValidation = [
  body('technicianId').isMongoId().withMessage('Valid technician ID is required')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', roleMiddleware('ADMIN', 'MANAGER'), teamValidation, createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.put('/:id', roleMiddleware('ADMIN', 'MANAGER'), updateTeam);
router.post('/:id/technicians', roleMiddleware('ADMIN', 'MANAGER'), technicianValidation, addTechnician);
router.delete('/:id/technicians/:technicianId', roleMiddleware('ADMIN', 'MANAGER'), removeTechnician);
router.delete('/:id', roleMiddleware('ADMIN'), deleteTeam);

module.exports = router;