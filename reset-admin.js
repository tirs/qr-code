require('dotenv').config();
const { User } = require('./src/models');

async function resetAdmin() {
  try {
    console.log('Resetting admin user...');
    
    // Find admin user
    const admin = await User.findOne({ 
      where: { username: process.env.ADMIN_USERNAME || 'admin' }
    });
    
    if (admin) {
      // Update with plain text password (will be hashed by hooks)
      await admin.update({
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      console.log('Admin password reset successfully');
    } else {
      // Create new admin with plain text password (will be hashed by hooks)
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin user:', error);
    process.exit(1);
  }
}

resetAdmin();