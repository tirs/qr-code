const { User } = require('../models');

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).render('login', { 
        error: 'Invalid username or password',
        username
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login', { 
        error: 'Invalid username or password',
        username
      });
    }
    
    // Set session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    
    // Redirect based on role
    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { 
      error: 'An error occurred during login',
      username: req.body.username
    });
  }
};

// Logout controller
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
};

// Render login page
exports.renderLogin = (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/');
  }
  res.render('login', { error: null, username: '' });
};

// Initialize admin user
exports.initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ 
      where: { username: process.env.ADMIN_USERNAME }
    });
    
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};