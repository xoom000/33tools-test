/**
 * Configuration API Routes
 * Provides access to system configuration for frontend components
 */

const express = require('express');
const config = require('../config');
const router = express.Router();

/**
 * GET /api/config/routes
 * Get all route configurations
 */
router.get('/routes', (req, res) => {
  try {
    res.json({
      success: true,
      routes: config.routes,
      message: 'Route configurations retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve route configurations',
      details: error.message
    });
  }
});

/**
 * GET /api/config/routes/:routeNumber
 * Get specific route configuration
 */
router.get('/routes/:routeNumber', (req, res) => {
  try {
    const routeNumber = parseInt(req.params.routeNumber);
    const route = config.routes[routeNumber];
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found',
        routeNumber
      });
    }

    res.json({
      success: true,
      route: {
        routeNumber,
        ...route
      },
      message: 'Route configuration retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve route configuration',
      details: error.message
    });
  }
});

/**
 * GET /api/config/system
 * Get basic system configuration (non-sensitive)
 */
router.get('/system', (req, res) => {
  try {
    res.json({
      success: true,
      system: {
        environment: config.server.environment,
        version: '2.0.0',
        business: config.business
      },
      message: 'System configuration retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system configuration',
      details: error.message
    });
  }
});

module.exports = router;