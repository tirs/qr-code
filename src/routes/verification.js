const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Render verification page with product ID
router.get('/verify/:productId', verificationController.renderVerificationPage);

// Render verification page without product ID
router.get('/verify', (req, res) => {
  res.render('verify', { 
    error: null,
    success: null,
    productId: null
  });
});

// Verify product
router.post('/verify', verificationController.verifyProduct);

module.exports = router;