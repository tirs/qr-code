require('dotenv').config();
const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function testLogin() {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log(`Testing login with username: ${username}, password: ${password}`);
    
    // Find user
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }
    
    console.log('User found:', {
      id: user.id,
      username: user.username,
      role: user.role,
      passwordHash: user.password.substring(0, 20) + '...' // Show part of the hash for debugging
    });
    
    // Test password comparison
    const isMatch = await user.comparePassword(password);
    console.log(`Password match: ${isMatch}`);
    
    // Test direct bcrypt comparison
    const directMatch = await bcrypt.compare(password, user.password);
    console.log(`Direct bcrypt comparison: ${directMatch}`);
    
    if (!isMatch) {
      console.log('Login would fail!');
    } else {
      console.log('Login would succeed!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing login:', error);
    process.exit(1);
  }
}

testLogin();