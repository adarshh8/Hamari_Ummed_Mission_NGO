const express = require('express');
const { register, login, getMe, logout, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.post('/logout', logout); // Public — client clears token itself

module.exports = router;
