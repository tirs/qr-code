require('dotenv').config();
const { sequelize } = require('./src/models');
const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function initDatabase() {
  try {
    console.log('Initializing cloud database...');
    
    // Sync all models with the database
    // force: true will drop tables if they exist
    // Use with caution in production!
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    // Create admin user
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create the admin user
    await User.create({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log(`Admin user '${adminUsername}' created successfully.`);
    console.log('Database initialization completed.');
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Ask for confirmation before proceeding
console.log('WARNING: This will delete all existing data in the database.');
console.log('Are you sure you want to proceed? (y/n)');

process.stdin.once('data', async (data) => {
  const input = data.toString().trim().toLowerCase();
  if (input === 'y' || input === 'yes') {
    await initDatabase();
  } else {
    console.log('Database initialization cancelled.');
  }
  process.exit(0);
});