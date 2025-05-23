const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isAuthenticated, isAdmin);

// Dashboard
router.get('/dashboard', adminController.renderDashboard);

// Products (redirects to product routes)
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProduct);

// Verification logs
router.get('/logs', adminController.getVerificationLogs);

module.exports = router;