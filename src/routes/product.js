const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isAuthenticated, isAdmin);

// Get all products
router.get('/', productController.getAllProducts);

// Get single product
router.get('/:id', productController.getProduct);

// Create product
router.post('/', productController.createProduct);

// Update product
router.post('/:id', productController.updateProduct);

// Delete product
router.get('/:id/delete', productController.deleteProduct);

// Add verification code
router.post('/:id/codes', productController.addVerificationCode);

// Delete verification code
router.get('/:productId/codes/:codeId/delete', productController.deleteVerificationCode);

module.exports = router;