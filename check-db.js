const { sequelize } = require('./src/models');

async function checkDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Get all tables
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in the database:');
    results.forEach(result => {
      console.log(`- ${result.table_name}`);
    });
    
    // Check if specific tables exist
    const requiredTables = ['Products', 'VerificationCodes', 'VerificationLogs', 'Users', 'Sessions'];
    const missingTables = requiredTables.filter(table => 
      !results.some(result => result.table_name.toLowerCase() === table.toLowerCase())
    );
    
    if (missingTables.length === 0) {
      console.log('\nAll required tables exist in the database.');
    } else {
      console.log('\nMissing tables:');
      missingTables.forEach(table => {
        console.log(`- ${table}`);
      });
    }
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

checkDatabase();