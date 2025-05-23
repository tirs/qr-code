require('dotenv').config();
const { sequelize } = require('./src/models');
const authController = require('./src/controllers/authController');

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
    
    // Create admin user if it doesn't exist
    await authController.initAdmin();
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();require('dotenv').config();
const { sequelize } = require('./src/models');
const authController = require('./src/controllers/authController');

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
    
    // Create admin user if it doesn't exist
    await authController.initAdmin();
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();