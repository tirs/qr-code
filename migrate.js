require('dotenv').config();
const { Sequelize } = require('sequelize');

// Source database connection (old database)
const SOURCE_DB_URL = 'postgres://tsdbadmin:v212tkorc287ryeh@q4pajbpw8l.dfemjj9zm0.tsdb.cloud.timescale.com:31044/tsdb?sslmode=require';

// Target database connection (new Railway database)
let TARGET_DB_URL = process.env.DB_HOST;
if (TARGET_DB_URL && TARGET_DB_URL.startsWith('postgresql://')) {
  TARGET_DB_URL = TARGET_DB_URL.replace('postgresql://', 'postgres://');
  console.log('Converted postgresql:// to postgres:// for Sequelize compatibility');
}

console.log('Source DB:', SOURCE_DB_URL.split('@')[1].split('/')[0]);
console.log('Target DB:', TARGET_DB_URL.split('@')[1].split('/')[0]);

// SSL configuration
const sslConfig = {
  require: true,
  rejectUnauthorized: false
};

// Create Sequelize instances
const sourceDb = new Sequelize(SOURCE_DB_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: sslConfig }
});

const targetDb = new Sequelize(TARGET_DB_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: sslConfig }
});

// Models to migrate
const models = ['User', 'Product', 'QRCode', 'Verification'];

async function migrateData() {
  try {
    // Test connections
    console.log('Testing source database connection...');
    await sourceDb.authenticate();
    console.log('Source database connection successful');
    
    console.log('Testing target database connection...');
    await targetDb.authenticate();
    console.log('Target database connection successful');
    
    // Import the models
    const db = require('./src/models');
    
    // Sync models with target database
    console.log('Syncing models with target database...');
    await db.sequelize.sync();
    console.log('Models synced with target database');
    
    // Migrate each model
    for (const model of models) {
      console.log(`Migrating ${model}...`);
      
      try {
        // Get data from source
        const [sourceData] = await sourceDb.query(`SELECT * FROM "${model}s"`);
        console.log(`Retrieved ${sourceData.length} ${model} records from source`);
        
        if (sourceData.length === 0) {
          console.log(`No ${model} data to migrate`);
          continue;
        }
        
        // Insert into target
        for (const record of sourceData) {
          try {
            const columns = Object.keys(record).join('", "');
            const values = Object.values(record).map(v => 
              typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : 
              v === null ? 'NULL' : v
            ).join(', ');
            
            await targetDb.query(`INSERT INTO "${model}s" ("${columns}") VALUES (${values})`);
          } catch (err) {
            console.error(`Error inserting ${model} record:`, err.message);
          }
        }
        
        console.log(`${model} migration completed`);
      } catch (err) {
        console.error(`Error migrating ${model}:`, err.message);
      }
    }
    
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await sourceDb.close();
    await targetDb.close();
  }
}

migrateData();