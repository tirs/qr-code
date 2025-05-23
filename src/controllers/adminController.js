const { Product, VerificationCode, VerificationLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Render admin dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Get counts
    const productCount = await Product.count();
    const totalCodes = await VerificationCode.count();
    const usedCodes = await VerificationCode.count({ where: { isUsed: true } });
    
    // Get recent verification logs
    const recentLogs = await VerificationLog.findAll({
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'sku']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    // Get verification stats
    const validVerifications = await VerificationLog.count({ where: { isValid: true } });
    const invalidVerifications = await VerificationLog.count({ where: { isValid: false } });
    
    res.render('admin/dashboard', {
      user: req.session.user,
      stats: {
        productCount,
        totalCodes,
        usedCodes,
        validVerifications,
        invalidVerifications
      },
      recentLogs
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).render('admin/dashboard', {
      user: req.session.user,
      stats: {
        productCount: 0,
        totalCodes: 0,
        usedCodes: 0,
        validVerifications: 0,
        invalidVerifications: 0
      },
      recentLogs: [],
      error: 'Failed to load dashboard data'
    });
  }
};

// Get verification logs
exports.getVerificationLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Build filter
    const where = {};
    if (req.query.productId) where.productId = req.query.productId;
    if (req.query.isValid === 'true') where.isValid = true;
    if (req.query.isValid === 'false') where.isValid = false;
    
    // Get logs
    const { rows: logs, count: total } = await VerificationLog.findAndCountAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'sku']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    // Get products for filter dropdown
    const products = await Product.findAll({
      attributes: ['id', 'name', 'sku']
    });
    
    res.render('admin/logs', {
      user: req.session.user,
      logs,
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      filter: req.query
    });
  } catch (error) {
    console.error('Error fetching verification logs:', error);
    res.status(500).render('admin/logs', {
      user: req.session.user,
      logs: [],
      products: [],
      pagination: {
        current: 1,
        pages: 1,
        total: 0
      },
      filter: req.query,
      error: 'Failed to fetch verification logs'
    });
  }
};