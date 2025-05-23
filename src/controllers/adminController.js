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
        attributes: ['name', 'sku'],
        required: false // Make this a LEFT JOIN to handle products that might not exist
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    // Process logs to handle null product references
    const processedLogs = recentLogs.map(log => {
      const plainLog = log.get({ plain: true });
      // Ensure product exists, if not provide default values
      if (!plainLog.product) {
        plainLog.product = { name: 'Unknown Product', sku: 'N/A' };
      }
      return plainLog;
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
      recentLogs: processedLogs
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).render('error', { // Changed to render the error page instead
      error: 'Failed to load dashboard data. ' + error.message,
      user: req.session.user
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
        attributes: ['name', 'sku'],
        required: false // Make this a LEFT JOIN to handle products that might not exist
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    // Process logs to handle null product references
    const processedLogs = logs.map(log => {
      const plainLog = log.get({ plain: true });
      // Ensure product exists, if not provide default values
      if (!plainLog.product) {
        plainLog.product = { name: 'Unknown Product', sku: 'N/A' };
      }
      return plainLog;
    });
    
    // Get products for filter dropdown
    const products = await Product.findAll({
      attributes: ['id', 'name', 'sku']
    });
    
    res.render('admin/logs', {
      user: req.session.user,
      logs: processedLogs,
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
    res.status(500).render('error', { // Changed to render the error page instead
      error: 'Failed to fetch verification logs. ' + error.message,
      user: req.session.user
    });
  }
};