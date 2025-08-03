const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const driverService = require('../services/driverService');
const logger = require('../utils/logger');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * POST /api/drivers/login
 * Authenticate driver with route number and password (legacy)
 */
router.post('/login', [
  body('routeNumber')
    .isInt({ min: 1, max: 99 })
    .withMessage('Route number must be between 1 and 99'),
  body('password')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters')
], validateRequest, async (req, res, next) => {
  try {
    const { routeNumber, password } = req.body;
    
    const driver = await driverService.authenticateDriver(routeNumber, password);
    
    if (!driver) {
      return res.status(401).json({ 
        error: 'Invalid route number or password'
      });
    }

    // Generate session token
    const token = driverService.generateDriverToken(driver);
    
    res.json({
      success: true,
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        route_number: driver.route_number,
        role: driver.role
      },
      token,
      message: `Welcome ${driver.name}! You're logged into Route ${driver.route_number}.`
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/drivers/login-username
 * Authenticate driver with username and password
 */
router.post('/login-username', [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters')
], validateRequest, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const driver = await driverService.authenticateDriverByUsername(username, password);
    
    if (!driver) {
      return res.status(401).json({ 
        error: 'Invalid username or password'
      });
    }

    // Generate session token
    const token = driverService.generateDriverToken(driver);
    
    res.json({
      success: true,
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        username: driver.username,
        route_number: driver.route_number,
        role: driver.role
      },
      token,
      message: `Welcome ${driver.name}! You're logged into Route ${driver.route_number}.`
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/drivers/verify-token
 * Verify driver session token
 */
router.post('/verify-token', [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
], validateRequest, async (req, res, next) => {
  try {
    const { token } = req.body;
    
    const tokenData = driverService.verifyDriverToken(token);
    
    if (!tokenData) {
      return res.status(401).json({ 
        error: 'Invalid or expired token'
      });
    }

    // Get fresh driver data
    const driver = await driverService.getDriverByRoute(tokenData.route_number);
    
    if (!driver) {
      return res.status(401).json({ 
        error: 'Driver not found or inactive'
      });
    }

    res.json({
      success: true,
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        route_number: driver.route_number,
        role: driver.role
      },
      message: 'Token verified successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/drivers/route/:routeNumber
 * Get driver info by route number (public info only)
 */
router.get('/route/:routeNumber', async (req, res, next) => {
  try {
    const routeNumber = parseInt(req.params.routeNumber);
    
    if (!routeNumber || routeNumber < 1 || routeNumber > 99) {
      return res.status(400).json({ 
        error: 'Invalid route number'
      });
    }

    const driver = await driverService.getDriverByRoute(routeNumber);
    
    if (!driver) {
      return res.status(404).json({ 
        error: 'No driver found for this route'
      });
    }

    res.json({
      success: true,
      driver: {
        name: driver.name,
        routeNumber: driver.route_number,
        role: driver.role
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/drivers/all
 * Get all drivers (admin only - will add auth middleware later)
 */
router.get('/all', async (req, res, next) => {
  try {
    const drivers = await driverService.getAllDrivers();
    
    res.json({
      success: true,
      drivers: drivers.map(d => ({
        id: d.driver_id,
        name: d.name,
        email: d.email,
        routeNumber: d.route_number,
        role: d.role,
        createdAt: d.created_at
      })),
      count: drivers.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/drivers/validate-setup-token
 * Validate a driver setup token and return driver info
 */
router.post('/validate-setup-token', [
  body('token')
    .isLength({ min: 6 })
    .withMessage('Token must be at least 6 characters')
], validateRequest, async (req, res, next) => {
  try {
    const { token } = req.body;
    
    const tokenData = await driverService.validateSetupToken(token);
    
    if (!tokenData) {
      return res.status(401).json({ 
        error: 'Invalid or expired setup token' 
      });
    }

    res.json({
      success: true,
      driver: {
        name: tokenData.driver_name,
        route_number: tokenData.route_number,
        token_expires: tokenData.expires_at
      }
    });

    logger.info('Driver setup token validated', { 
      token: token.substring(0, 4) + '***',
      route: tokenData.route_number 
    });

  } catch (error) {
    logger.error('Driver setup token validation error', { 
      error: error.message,
      token: req.body.token?.substring(0, 4) + '***'
    });
    next(error);
  }
});

/**
 * POST /api/drivers/create-account
 * Create driver account using validated setup token
 */
router.post('/create-account', [
  body('token')
    .isLength({ min: 6 })
    .withMessage('Token required'),
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], validateRequest, async (req, res, next) => {
  try {
    const { token, username, password } = req.body;
    
    // Validate token is still valid
    const tokenData = await driverService.validateSetupToken(token);
    if (!tokenData) {
      return res.status(401).json({ 
        error: 'Invalid or expired setup token' 
      });
    }

    // Create the driver account
    const result = await driverService.createDriverAccount({
      token,
      username,
      password,
      route_number: tokenData.route_number,
      driver_name: tokenData.driver_name
    });

    res.json({
      success: true,
      driver: {
        id: result.driver_id,
        name: result.name,
        username: result.username,
        routeNumber: result.route_number,
        role: result.role
      },
      token: result.auth_token
    });

    logger.info('Driver account created successfully', { 
      username,
      route: tokenData.route_number,
      driver_id: result.driver_id
    });

  } catch (error) {
    if (error.message.includes('username already exists')) {
      return res.status(409).json({ 
        error: 'Username already taken. Please choose a different username.' 
      });
    }
    
    logger.error('Driver account creation error', { 
      error: error.message,
      username: req.body.username
    });
    next(error);
  }
});

/**
 * POST /api/drivers/validate-demo-token
 * Validate a time-limited demo token
 */
router.post('/validate-demo-token', [
  body('token')
    .isLength({ min: 6 })
    .withMessage('Token must be at least 6 characters')
], validateRequest, async (req, res, next) => {
  try {
    const { token } = req.body;
    
    const tokenData = await driverService.validateDemoToken(token);
    
    if (!tokenData) {
      return res.status(401).json({ 
        error: 'Invalid or expired demo token' 
      });
    }

    res.json({
      success: true,
      demo: {
        name: tokenData.demo_name,
        description: tokenData.description,
        expires_at: tokenData.expires_at,
        permissions: tokenData.permissions,
        time_remaining: tokenData.time_remaining_minutes
      }
    });

    logger.info('Demo token validated', { 
      token: token.substring(0, 4) + '***',
      demo: tokenData.demo_name,
      time_remaining: tokenData.time_remaining_minutes
    });

  } catch (error) {
    logger.error('Demo token validation error', { 
      error: error.message,
      token: req.body.token?.substring(0, 4) + '***'
    });
    next(error);
  }
});

module.exports = router;