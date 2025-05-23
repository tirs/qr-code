const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();

// Import database models
const db = require('./src/models');

// Import routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product');
const verificationRoutes = require('./src/routes/verification');
const adminRoutes = require('./src/routes/admin');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Set up session with Sequelize store
const sequelizeSessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: 'Sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Create the session table if it doesn't exist
sequelizeSessionStore.sync();

// Set up EJS with layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Routes
app.use('/', verificationRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user 
  });
});

// Health check route for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: 'Something went wrong!',
    user: req.session.user
  });
});

// Sync database and start server
const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    
    // Sync database models
    await db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
    
    // Create admin user if it doesn't exist
    const authController = require('./src/controllers/authController');
    await authController.initAdmin();
    console.log('Admin user initialized successfully');
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Initialize database and start server
initializeDatabase();