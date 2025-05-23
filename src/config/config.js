require('dotenv').config();

// Check if DB_HOST is a connection string (starts with postgres://)
const isConnectionString = process.env.DB_HOST && process.env.DB_HOST.startsWith('postgres://');

// Base configuration for all environments
const baseConfig = isConnectionString 
  ? {
      // If DB_HOST is a connection string, use it directly
      use_env_variable: 'DB_HOST',
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  : {
      // Otherwise use individual connection parameters
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'qr_verification_dev',
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: 'postgres',
      logging: false
    };

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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};