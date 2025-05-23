const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render login page
router.get('/login', authController.renderLogin);

// Login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;