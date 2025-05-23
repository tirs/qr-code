// Authentication middleware
exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Admin middleware
exports.isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { 
      error: 'Access denied. You do not have permission to access this page.',
      user: req.session.user
    });
  }
  next();
};