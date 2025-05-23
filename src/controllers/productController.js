const { Product, VerificationCode } = require('../models');
const { Op } = require('sequelize');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate a random 16-digit alphanumeric code
const generateVerificationCode = () => {
  // Generate a 16-character code (alphanumeric)
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: VerificationCode,
        as: 'verificationCodes'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.render('admin/products', { 
      products,
      user: req.session.user,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('admin/products', { 
      products: [],
      user: req.session.user,
      success: null,
      error: 'Failed to fetch products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: VerificationCode,
        as: 'verificationCodes'
      }]
    });
    
    if (!product) {
      return res.status(404).redirect('/admin/products?error=Product not found');
    }
    
    // Generate QR code URL for the product
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify/${product.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
    
    // Format verification codes with last 4 digits highlighted
    const formattedCodes = product.verificationCodes.map(code => {
      const fullCode = code.code;
      const lastFourDigits = fullCode.slice(-4);
      
      return {
        id: code.id,
        fullCode,
        lastFourDigits,
        isUsed: code.isUsed,
        usedAt: code.usedAt,
        usedBy: code.usedBy
      };
    });
    
    res.render('admin/product-detail', { 
      product,
      verificationCodes: formattedCodes,
      qrCodeUrl: qrCodeDataUrl,
      verificationUrl,
      user: req.session.user,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).redirect('/admin/products?error=Failed to fetch product details');
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, sku, codeCount } = req.body;
    
    // Check if product with SKU already exists
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).redirect('/admin/products?error=Product with this SKU already exists');
    }
    
    // Create product
    const product = await Product.create({
      name,
      description,
      sku
    });
    
    // Generate verification codes
    const count = parseInt(codeCount) || 1;
    const verificationCodes = [];
    
    for (let i = 0; i < count; i++) {
      verificationCodes.push({
        code: generateVerificationCode(),
        productId: product.id
      });
    }
    
    // Create verification codes
    await VerificationCode.bulkCreate(verificationCodes);
    
    res.redirect(`/admin/products/${product.id}?success=Product created successfully`);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).redirect('/admin/products?error=Failed to create product');
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, sku } = req.body;
    const productId = req.params.id;
    
    // Check if another product with the same SKU exists
    const existingProduct = await Product.findOne({ 
      where: {
        sku,
        id: { [Op.ne]: productId }
      }
    });
    
    if (existingProduct) {
      return res.status(400).redirect(`/admin/products/${productId}?error=Another product with this SKU already exists`);
    }
    
    // Update product
    const [updated] = await Product.update(
      { name, description, sku },
      { where: { id: productId } }
    );
    
    if (!updated) {
      return res.status(404).redirect('/admin/products?error=Product not found');
    }
    
    res.redirect(`/admin/products/${productId}?success=Product updated successfully`);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).redirect(`/admin/products/${req.params.id}?error=Failed to update product`);
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Delete product (cascade will delete associated verification codes)
    const deleted = await Product.destroy({ where: { id: productId } });
    
    if (!deleted) {
      return res.status(404).redirect('/admin/products?error=Product not found');
    }
    
    res.redirect('/admin/products?success=Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).redirect('/admin/products?error=Failed to delete product');
  }
};

// Add verification code
exports.addVerificationCode = async (req, res) => {
  try {
    const { count } = req.body;
    const productId = req.params.id;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).redirect('/admin/products?error=Product not found');
    }
    
    // Generate new verification codes
    const codeCount = parseInt(count) || 1;
    const verificationCodes = [];
    
    for (let i = 0; i < codeCount; i++) {
      verificationCodes.push({
        code: generateVerificationCode(),
        productId
      });
    }
    
    // Create verification codes
    await VerificationCode.bulkCreate(verificationCodes);
    
    res.redirect(`/admin/products/${productId}?success=Verification codes added successfully`);
  } catch (error) {
    console.error('Error adding verification codes:', error);
    res.status(500).redirect(`/admin/products/${req.params.id}?error=Failed to add verification codes`);
  }
};

// Delete verification code
exports.deleteVerificationCode = async (req, res) => {
  try {
    const { productId, codeId } = req.params;
    
    // Delete verification code
    const deleted = await VerificationCode.destroy({
      where: {
        id: codeId,
        productId
      }
    });
    
    if (!deleted) {
      return res.status(404).redirect(`/admin/products/${productId}?error=Verification code not found`);
    }
    
    res.redirect(`/admin/products/${productId}?success=Verification code deleted successfully`);
  } catch (error) {
    console.error('Error deleting verification code:', error);
    res.status(500).redirect(`/admin/products/${req.params.productId}?error=Failed to delete verification code`);
  }
};