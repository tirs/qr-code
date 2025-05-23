const { User, Product, VerificationCode, VerificationLog } = require('./src/models');

async function checkData() {
  try {
    // Check Users
    const userCount = await User.count();
    console.log(`Users: ${userCount}`);
    if (userCount > 0) {
      const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
      console.log('User list:');
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
      });
    }
    
    // Check Products
    const productCount = await Product.count();
    console.log(`\nProducts: ${productCount}`);
    if (productCount > 0) {
      const products = await Product.findAll({ attributes: ['id', 'name', 'sku'] });
      console.log('Product list:');
      products.forEach(product => {
        console.log(`- ID: ${product.id}, Name: ${product.name}, SKU: ${product.sku}`);
      });
    }
    
    // Check Verification Codes
    const codeCount = await VerificationCode.count();
    console.log(`\nVerification Codes: ${codeCount}`);
    if (codeCount > 0) {
      const codes = await VerificationCode.findAll({ 
        limit: 5,
        attributes: ['id', 'code', 'isUsed', 'productId'] 
      });
      console.log('Sample verification codes:');
      codes.forEach(code => {
        console.log(`- ID: ${code.id}, Code: ${code.code}, Used: ${code.isUsed}, Product ID: ${code.productId}`);
      });
    }
    
    // Check Verification Logs
    const logCount = await VerificationLog.count();
    console.log(`\nVerification Logs: ${logCount}`);
    if (logCount > 0) {
      const logs = await VerificationLog.findAll({ 
        limit: 5,
        attributes: ['id', 'code', 'isValid', 'productId'] 
      });
      console.log('Sample verification logs:');
      logs.forEach(log => {
        console.log(`- ID: ${log.id}, Code: ${log.code}, Valid: ${log.isValid}, Product ID: ${log.productId}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
}

checkData();