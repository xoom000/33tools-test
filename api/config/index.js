/**
 * 33 Tools - Centralized Configuration Management
 * 
 * All system settings in one place for easy management across all routes
 */

const config = {
  // Server Configuration - NEW PORT ARCHITECTURE (22XX = Staging)
  server: {
    port: process.env.PORT || 2210, // 22XX = Staging, 1X = Backend
    environment: process.env.NODE_ENV || 'staging',
    // Frontend proxy server port
    frontendPort: process.env.FRONTEND_PORT || 2220 // 22XX = Staging, 2X = Frontend
  },

  // Database Configuration  
  database: {
    path: process.env.DATABASE_PATH || './route33-staging.db',
    timeout: parseInt(process.env.DB_TIMEOUT) || 5000,
    enableForeignKeys: true
  },

  // Authentication & Security
  auth: {
    // Bcrypt salt rounds for password hashing
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 12,
    
    // JWT token settings
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    
    // Customer login token settings  
    customerTokenLength: 8,
    customerTokenExpiry: process.env.CUSTOMER_TOKEN_EXPIRY_DAYS || 7
  },

  // CORS Configuration
  cors: {
    // Allowed origins for API access - STAGING PORTS (22XX)
    origins: [
      'http://localhost:2220',  // TOOLS33STAGING_WEB
      'http://192.168.50.173:2220', 
      'http://localhost:2230',  // TOOLS33STAGING_TUNNEL
      'http://192.168.50.173:2230',
      'http://localhost:2240',  // TOOLS33STAGING_PROXY
      'http://192.168.50.173:2240'
    ],
    credentials: true
  },

  // 33 Tools Route Configuration
  routes: {
    5: {
      driver: 'Anthony Hendry',
      active: true,
      servicesDays: ['M', 'T', 'W', 'H', 'F']
    },
    9: {
      driver: 'Skyler Glashan', 
      active: true,
      servicesDays: ['M', 'T', 'W', 'H', 'F']
    },
    11: {
      driver: 'Josh Weliver',
      active: true, 
      servicesDays: ['M', 'T', 'W', 'H', 'F']
    },
    12: {
      driver: 'Cory Mathews',
      active: true,
      servicesDays: ['M', 'T', 'W', 'H', 'F'] 
    },
    33: {
      driver: 'Nigel Whaley',
      active: true,
      servicesDays: ['M', 'T', 'W', 'H', 'F'],
      isAdmin: true  // Nigel has admin privileges
    },
    75: {
      driver: 'Ed Steppin',
      active: true,
      servicesDays: ['M', 'T', 'W', 'H', 'F']
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    enableConsole: process.env.NODE_ENV !== 'production'
  },

  // Business Rules
  business: {
    // Driver setup token expiry
    setupTokenExpiryHours: 24,
    
    // Maximum items per customer order
    maxItemsPerOrder: 50,
    
    // Default service day if not specified
    defaultServiceDay: 'Tuesday'
  }
};

module.exports = config;