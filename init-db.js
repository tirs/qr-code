require('dotenv').config();
const { sequelize } = require('./src/models');
const authController = require('./src/controllers/authController');

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to the database...');

    // Sync models to the database schema
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized successfully.');

    // Initialize default admin user
    await authController.initAdmin();
    console.log('✅ Admin initialization complete.');

    console.log('🎉 Database initialization finished.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
