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

// Simple health check route that always returns OK for Railway
// This ensures the service can start even if the DB is temporarily unavailable
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'running',
    timestamp: new Date().toISOString() 
  });
});

// Detailed health check route that includes database status
app.get('/health/detailed', async (req, res) => {
  try {
    // Check database connection
    await db.sequelize.authenticate();
    res.status(200).json({ 
      status: 'ok', 
      service: 'running',
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Detailed health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      service: 'running',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
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
    console.log('🔄 Connecting to database...');
    console.log(`Database config: ${process.env.NODE_ENV} mode`);
    
    // Log database connection info (without sensitive data)
    if (process.env.DB_HOST && process.env.DB_HOST.startsWith('postgres://')) {
      try {
        const dbUrlParts = new URL(process.env.DB_HOST);
        console.log(`Database connection: postgres://${dbUrlParts.hostname}:${dbUrlParts.port}${dbUrlParts.pathname}`);
        console.log(`SSL Mode: ${process.env.DB_HOST.includes('sslmode=require') ? 'required' : 'not specified'}`);
      } catch (urlError) {
        console.error('❌ Error parsing database URL:', urlError.message);
      }
    } else {
      console.log(`Database connection: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '5432'}`);
    }
    
    // Log Sequelize configuration
    const dbConfig = require('./src/config/config.js')[process.env.NODE_ENV || 'development'];
    console.log('Database configuration:', {
      dialect: dbConfig.dialect,
      useEnvVariable: dbConfig.use_env_variable || 'none',
      ssl: dbConfig.dialectOptions?.ssl ? 'enabled' : 'disabled'
    });
    
    // Test database connection with retry
    let connected = false;
    let retries = 5;
    
    while (!connected && retries > 0) {
      try {
        console.log(`Attempting database connection (${retries} retries left)...`);
        await db.sequelize.authenticate();
        connected = true;
        console.log('✅ Database connection has been established successfully.');
      } catch (dbError) {
        retries--;
        console.error(`❌ Database connection attempt failed:`, dbError.message);
        
        if (retries > 0) {
          console.log(`Waiting 5 seconds before retrying...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.error('❌ All database connection attempts failed.');
          throw dbError;
        }
      }
    }
    
    // Sync database models
    await db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized successfully');
    
    // Create admin user if it doesn't exist
    const authController = require('./src/controllers/authController');
    await authController.initAdmin();
    console.log('✅ Admin user initialized successfully');
    
    // Start server
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Health check available at: http://localhost:${PORT}/health`);
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    // Wait a bit before exiting to ensure logs are written
    setTimeout(() => process.exit(1), 1000);
  }
};

// Initialize database and start server
initializeDatabase();