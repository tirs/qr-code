require('dotenv').config();

// Check if DB_HOST is a connection string (starts with postgres:// or postgresql://)
const isConnectionString = process.env.DB_HOST && 
  (process.env.DB_HOST.startsWith('postgres://') || process.env.DB_HOST.startsWith('postgresql://'));

// Keep the original postgresql:// protocol
// Commenting out the conversion to maintain the original database link
/*
if (process.env.DB_HOST && process.env.DB_HOST.startsWith('postgresql://')) {
  process.env.DB_HOST = process.env.DB_HOST.replace('postgresql://', 'postgres://');
  console.log('Converted postgresql:// to postgres:// for Sequelize compatibility');
}
*/

// SSL configuration for all environments
const sslConfig = {
  require: true,
  rejectUnauthorized: false
};

// Base configuration for all environments
const baseConfig = isConnectionString 
  ? {
      // If DB_HOST is a connection string, use it directly
      use_env_variable: 'DB_HOST',
      dialect: 'postgres',
      logging: console.log, // Enable logging for troubleshooting
      dialectOptions: {
        ssl: sslConfig
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      retry: {
        match: [
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/,
          /TimeoutError/,
          /SequelizeDatabaseError/
        ],
        max: 5
      }
    }
  : {
      // Otherwise use individual connection parameters
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'qr_verification_dev',
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: 'postgres',
      logging: console.log, // Enable logging for troubleshooting
      dialectOptions: {
        ssl: sslConfig
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

// Disable logging in production
if (process.env.NODE_ENV === 'production') {
  baseConfig.logging = false;
}

module.exports = {
  development: {
    ...baseConfig
  },
  test: {
    ...baseConfig,
    database: !isConnectionString ? (process.env.DB_NAME || 'qr_verification_test') : undefined
  },
  production: {
    ...baseConfig,
    logging: false
  }
};