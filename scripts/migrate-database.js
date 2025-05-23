require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Source database connection (old database)
const SOURCE_DB_HOST = 'postgres://tsdbadmin:v212tkorc287ryeh@q4pajbpw8l.dfemjj9zm0.tsdb.cloud.timescale.com:31044/tsdb?sslmode=require';

// Target database connection (new Railway database)
const TARGET_DB_HOST = process.env.DB_HOST;

// Convert postgresql:// to postgres:// if needed
let targetDbUrl = TARGET_DB_HOST;
if (targetDbUrl && targetDbUrl.startsWith('postgresql://')) {
  targetDbUrl = targetDbUrl.replace('postgresql://', 'postgres://');
  console.log('Converted postgresql:// to postgres:// for Sequelize compatibility');
}

// SSL configuration
const sslConfig = {
  require: true,
  rejectUnauthorized: false
};

// Create Sequelize instances for source and target databases
const sourceDb = new Sequelize(SOURCE_DB_HOST, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: sslConfig
  }
});

const targetDb = new Sequelize(targetDbUrl, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: sslConfig
  }
});

// Load models
const modelsDir = path.join(__dirname, '../src/models');
const modelFiles = fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

console.log('Models to migrate:', modelFiles);

// Function to migrate data for a specific model
async function migrateModel(modelName, sourceDb, targetDb) {
  console.log(`\n🔄 Migrating model: ${modelName}`);
  
  try {
    // Get all data from source database
    const [sourceData] = await sourceDb.query(`SELECT * FROM "${modelName}s"`);
    console.log(`✅ Retrieved ${sourceData.length} records from source database`);
    
    if (sourceData.length === 0) {
      console.log(`ℹ️ No data to migrate for ${modelName}`);
      return;
    }
    
    // Check if target table exists
    try {
      await targetDb.query(`SELECT 1 FROM "${modelName}s" LIMIT 1`);
    } catch (error) {
      console.log(`⚠️ Target table "${modelName}s" doesn't exist yet. Creating...`);
      // We'll let the sync process create it
    }
    
    // Insert data into target database
    // We'll use individual inserts to handle any potential issues with specific records
    let successCount = 0;
    let errorCount = 0;
    
    for (const record of sourceData) {
      try {
        // Convert record to a proper INSERT statement
        const columns = Object.keys(record).map(key => `"${key}"`).join(', ');
        const placeholders = Object.keys(record).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(record);
        
        // Execute the insert
        await targetDb.query(
          `INSERT INTO "${modelName}s" (${columns}) VALUES (${placeholders})`,
          { 
            bind: values,
            type: Sequelize.QueryTypes.INSERT
          }
        );
        
        successCount++;
      } catch (insertError) {
        console.error(`❌ Error inserting record:`, insertError.message);
        errorCount++;
      }
    }
    
    console.log(`✅ Migration complete for ${modelName}:`);
    console.log(`   - ${successCount} records successfully migrated`);
    console.log(`   - ${errorCount} records failed`);
    
  } catch (error) {
    console.error(`❌ Error migrating ${modelName}:`, error.message);
  }
}

// Main migration function
async function migrateDatabase() {
  console.log('🚀 Starting database migration');
  console.log(`Source: ${SOURCE_DB_HOST.split('@')[1].split('/')[0]}`);
  console.log(`Target: ${targetDbUrl.split('@')[1].split('/')[0]}`);
  
  try {
    // Test connections
    console.log('🔄 Testing source database connection...');
    await sourceDb.authenticate();
    console.log('✅ Source database connection successful');
    
    console.log('🔄 Testing target database connection...');
    await targetDb.authenticate();
    console.log('✅ Target database connection successful');
    
    // Load and sync models with target database
    console.log('🔄 Syncing models with target database...');
    
    // Import the db object to use its sequelize instance
    const db = require('../src/models');
    await db.sequelize.sync({ alter: true });
    console.log('✅ Models synced with target database');
    
    // Migrate data for each model
    for (const modelFile of modelFiles) {
      const modelName = path.basename(modelFile, '.js');
      await migrateModel(modelName, sourceDb, targetDb);
    }
    
    console.log('\n✅ Database migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    // Close connections
    await sourceDb.close();
    await targetDb.close();
    process.exit(0);
  }
}

// Run the migration
migrateDatabase();