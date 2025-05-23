require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('./src/models');

async function createAdmin() {
  try {
    console.log('Attempting to create admin user...');
    
    // Check if admin exists
    const adminExists = await User.findOne({ 
      where: { username: process.env.ADMIN_USERNAME || 'admin' }
    });
    
    if (adminExists) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123', 
        salt
      );
      
      // Update the admin user
      await adminExists.update({
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin password updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123', 
        salt
      );
      
      // Create the admin user
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin user created successfully');
    }
    
    // List all users
    const users = await User.findAll();
    console.log('\nAll users in database:');
    users.forEach(user => {
      console.log(`- Username: ${user.username}, Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
    process.exit(1);
  }
}

createAdmin();