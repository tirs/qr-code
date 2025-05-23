const { Product, VerificationCode, VerificationLog } = require('../models');
const { Op } = require('sequelize');

// Render verification page
exports.renderVerificationPage = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).render('verify', { 
        error: 'Invalid product QR code',
        success: null,
        productId: null
      });
    }
    
    res.render('verify', { 
      error: null,
      success: null,
      productId
    });
  } catch (error) {
    console.error('Error rendering verification page:', error);
    res.status(500).render('verify', { 
      error: 'An error occurred. Please try again.',
      success: null,
      productId: null
    });
  }
};

// Verify product code
exports.verifyProduct = async (req, res) => {
  try {
    const { productId, lastFourDigits } = req.body;
    
    if (!lastFourDigits || !productId) {
      return res.status(400).render('verify', { 
        error: 'Verification code is required',
        success: null,
        productId
      });
    }
    
    // Validate that lastFourDigits is exactly 4 characters (can be digits or letters)
    if (!/^[A-Za-z0-9]{4}$/.test(lastFourDigits)) {
      return res.status(400).render('verify', { 
        error: 'Please enter the last 4 characters of your verification code',
        success: null,
        productId
      });
    }
    
    // Find product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).render('verify', { 
        error: 'Invalid product',
        success: null,
        productId: null
      });
    }
    
    // Find verification code by last 4 digits
    const verificationCode = await VerificationCode.findOne({
      where: {
        productId,
        code: {
          [Op.like]: `%${lastFourDigits}`
        }
      }
    });
    
    // Log verification attempt
    await VerificationLog.create({
      productId: product.id,
      verificationCodeId: verificationCode ? verificationCode.id : null,
      code: lastFourDigits,
      isValid: !!verificationCode,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // If code not found
    if (!verificationCode) {
      return res.render('verify', { 
        error: 'Invalid verification code',
        success: null,
        productId
      });
    }
    
    // If code already used
    if (verificationCode.isUsed) {
      return res.render('verify', { 
        error: 'This verification code has already been used',
        success: null,
        productId
      });
    }
    
    // Mark code as used
    verificationCode.isUsed = true;
    verificationCode.usedAt = new Date();
    verificationCode.usedBy = req.ip;
    await verificationCode.save();
    
    // Return success
    res.render('verify', { 
      error: null,
      success: {
        message: 'Product verified successfully!',
        product: {
          name: product.name,
          description: product.description,
          sku: product.sku
        }
      },
      productId
    });
  } catch (error) {
    console.error('Error verifying product:', error);
    res.status(500).render('verify', { 
      error: 'An error occurred during verification',
      success: null,
      productId: req.body.productId
    });
  }
};