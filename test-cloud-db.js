require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
  console.log('Testing connection to cloud database...');
  console.log(`Connection string: ${process.env.DB_HOST}`);
  
  try {
    // Create a new Sequelize instance with the connection string
    const sequelize = new Sequelize(process.env.DB_HOST, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: console.log
    });
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Get database version
    const [results] = await sequelize.query('SELECT version();');
    console.log('Database version:', results[0].version);
    
    // Close the connection
    await sequelize.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();