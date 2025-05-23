const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Render verification page
router.get('/verify/:productId', verificationController.renderVerificationPage);

// Verify product
router.post('/verify', verificationController.verifyProduct);

module.exports = router;