const express = require('express');
const { getUsers, getUserById, updateUser, getTechnicians } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/technicians', authMiddleware, getTechnicians);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), updateUser);

module.exports = router;