const express = require('express');
const router = express.Router();
const driverService = require('../services/driverService');
const { authenticateDriver, requireAdmin } = require('../middleware/authenticateDriver');
const logger = require('../utils/logger');
const db = require('../utils/database');

/**
 * Create relief driver token (Admin only)
 * POST /api/relief-driver/create-token
 */
router.post('/create-token', authenticateDriver, requireAdmin, async (req, res) => {
  try {
    const { driver_id, expiration_hours = 168 } = req.body;

    if (!driver_id) {
      return res.status(400).json({
        success: false,
        error: 'driver_id is required'
      });
    }

    // Verify driver exists
    const driver = await db.get(
      'SELECT * FROM drivers WHERE driver_id = ? AND is_active = 1',
      [driver_id]
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    const tokenData = await driverService.createReliefDriverToken(driver_id, expiration_hours);

    logger.info('Relief driver token created by admin', {
      adminRoute: req.user.route_number,
      targetDriverId: driver_id,
      tokenId: tokenData.token_id
    });

    res.json({
      success: true,
      data: {
        token: tokenData.token,
        expires_at: tokenData.expires_at,
        driver_name: driver.name,
        driver_route: driver.route_number
      }
    });

  } catch (error) {
    logger.error('Error creating relief driver token', {
      error: error.message,
      adminRoute: req.user.route_number
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create relief driver token'
    });
  }
});

/**
 * Activate relief driver with token
 * POST /api/relief-driver/activate
 */
router.post('/activate', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Relief driver token is required'
      });
    }

    const driverData = await driverService.validateReliefDriverToken(token);

    if (!driverData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired relief driver token'
      });
    }

    // Generate auth token for the now-activated relief driver
    const authToken = driverService.generateDriverToken(driverData);

    logger.info('Relief driver activated', {
      driverId: driverData.driver_id,
      driverName: driverData.name,
      routeNumber: driverData.route_number
    });

    res.json({
      success: true,
      data: {
        message: 'Relief driver status activated',
        driver: {
          driver_id: driverData.driver_id,
          name: driverData.name,
          username: driverData.username,
          route_number: driverData.route_number,
          is_relief_driver: true
        },
        auth_token: authToken
      }
    });

  } catch (error) {
    logger.error('Error activating relief driver', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to activate relief driver'
    });
  }
});

/**
 * Deactivate relief driver (Admin only)
 * POST /api/relief-driver/deactivate
 */
router.post('/deactivate', authenticateDriver, requireAdmin, async (req, res) => {
  try {
    const { driver_id } = req.body;

    if (!driver_id) {
      return res.status(400).json({
        success: false,
        error: 'driver_id is required'
      });
    }

    const result = await driverService.deactivateReliefDriver(driver_id);

    logger.info('Relief driver deactivated by admin', {
      adminRoute: req.user.route_number,
      targetDriverId: driver_id
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Error deactivating relief driver', {
      error: error.message,
      adminRoute: req.user.route_number
    });

    res.status(500).json({
      success: false,
      error: 'Failed to deactivate relief driver'
    });
  }
});

/**
 * Get relief driver status and accessible routes
 * GET /api/relief-driver/status
 */
router.get('/status', authenticateDriver, async (req, res) => {
  try {
    if (!req.user.is_relief_driver) {
      return res.json({
        success: true,
        data: {
          is_relief_driver: false,
          accessible_routes: [req.user.route_number]
        }
      });
    }

    // Get all active routes for relief driver
    const routes = await db.query(
      'SELECT route_number, driver_name FROM routes WHERE is_active = 1 ORDER BY CAST(route_number AS INTEGER)'
    );

    res.json({
      success: true,
      data: {
        is_relief_driver: true,
        accessible_routes: 'all',
        routes: routes,
        relief_driver_info: {
          driver_id: req.user.driver_id,
          name: req.user.driver_name,
          primary_route: req.user.route_number
        }
      }
    });

  } catch (error) {
    logger.error('Error getting relief driver status', {
      error: error.message,
      driverId: req.user.driver_id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get relief driver status'
    });
  }
});

module.exports = router;