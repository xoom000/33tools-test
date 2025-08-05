const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const customerService = require('../services/customerService');
const driverService = require('../services/driverService');
const logger = require('../utils/logger');
const tokenAudit = require('../utils/tokenAudit');
const { authenticateDriver, requireAdmin } = require('../middleware/authenticateDriver');

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

// Apply authentication to ALL admin routes
router.use(authenticateDriver);

// POST /api/admin/customers/:id/generate-code - Generate login code for customer
router.post('/customers/:id/generate-code', requireAdmin, async (req, res, next) => {
  try {
    const customerId = req.params.id;
    
    // Verify customer exists first
    const customer = await customerService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ 
        error: 'Customer not found' 
      });
    }
    
    // Generate the token
    const result = await customerService.generateLoginToken(customerId);
    
    res.json({
      success: true,
      customer_number: result.customer_number,
      login_token: result.login_token,
      expires_at: result.expires_at,
      is_new: result.is_new,
      message: `Login token ${result.is_new ? 'generated' : 'retrieved'} for ${customer.account_name}`
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/customers - Get customers for admin (same as regular customers endpoint)
router.get('/customers', requireAdmin, async (req, res, next) => {
  try {
    const { route_number = 33 } = req.query; // Default to Route 33
    const filters = { route_number };
    
    const customers = await customerService.getAllCustomers(filters);
    
    // Add device info for admin view
    const customersWithDevices = await Promise.all(
      customers.map(async (customer) => {
        const devices = await customerService.getCustomerDevices(customer.customer_number);
        return {
          ...customer,
          device_count: devices.length,
          last_login: devices.length > 0 ? devices[0].last_used : null
        };
      })
    );
    
    res.json({ 
      count: customersWithDevices.length,
      customers: customersWithDevices
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/driver-tokens
 * Generate driver setup token for account creation
 */
router.post('/driver-tokens', requireAdmin, [
  body('routeNumber')
    .isInt({ min: 1, max: 99 })
    .withMessage('Route number must be between 1 and 99'),
  body('expiresInHours')
    .isInt({ min: 1, max: 168 })
    .withMessage('Expiration must be between 1 and 168 hours')
], validateRequest, async (req, res, next) => {
  try {
    const { routeNumber, expiresInHours } = req.body;
    
    // Generate a unique token
    const token = generateToken('D', routeNumber);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    // Get route info
    const db = require('../utils/database');
    const route = await db.get('SELECT * FROM routes WHERE route_number = ?', [routeNumber]);
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    // Store the token
    await db.run(`
      INSERT INTO driver_setup_tokens (token, route_number, driver_name, expires_at)
      VALUES (?, ?, ?, ?)
    `, [token, routeNumber, route.driver_name, expiresAt.toISOString()]);
    
    // Log to audit trail
    await tokenAudit.logGenerated(
      token, 
      routeNumber, 
      route.driver_name, 
      expiresAt.toISOString(),
      'admin'
    );
    
    res.json({
      success: true,
      token,
      route_number: routeNumber,
      driver_name: route.driver_name,
      expires_at: expiresAt.toISOString(),
      expires_in_hours: expiresInHours
    });
    
    logger.info('Driver setup token generated', {
      route: routeNumber,
      driver: route.driver_name,
      token: token.substring(0, 4) + '***'
    });
    
  } catch (error) {
    logger.error('Driver token generation error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/admin/demo-tokens
 * Generate time-limited demo access token
 */
router.post('/demo-tokens', [
  body('demoName')
    .isLength({ min: 3 })
    .withMessage('Demo name must be at least 3 characters'),
  body('expiresInHours')
    .isInt({ min: 1, max: 72 })
    .withMessage('Expiration must be between 1 and 72 hours'),
  body('permissions')
    .isIn(['read_only', 'limited_edit', 'full_demo'])
    .withMessage('Invalid permissions level')
], validateRequest, async (req, res, next) => {
  try {
    const { demoName, description, expiresInHours, permissions } = req.body;
    
    // Generate a unique token
    const token = generateToken('DEMO');
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    // Store the token
    const db = require('../utils/database');
    await db.run(`
      INSERT INTO demo_tokens (token, demo_name, description, permissions, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `, [token, demoName, description || '', permissions, expiresAt.toISOString()]);
    
    res.json({
      success: true,
      token,
      demo_name: demoName,
      description: description || '',
      permissions,
      expires_at: expiresAt.toISOString(),
      expires_in_hours: expiresInHours
    });
    
    logger.info('Demo token generated', {
      demo: demoName,
      expires: expiresAt.toISOString(),
      token: token.substring(0, 4) + '***'
    });
    
  } catch (error) {
    logger.error('Demo token generation error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/admin/cleanup-tokens
 * Clean up expired tokens and log to audit trail
 */
router.post('/cleanup-tokens', async (req, res, next) => {
  try {
    const db = require('../utils/database');
    
    // Get all expired driver setup tokens that haven't been cleaned up
    const expiredTokens = await db.all(`
      SELECT token, route_number, driver_name, expires_at
      FROM driver_setup_tokens 
      WHERE expires_at < datetime('now') 
      AND used_at IS NULL
    `);
    
    let cleanedCount = 0;
    
    // Log each expired token and then delete
    for (const expiredToken of expiredTokens) {
      // Log expiration to audit trail
      await tokenAudit.logExpired(
        expiredToken.token,
        expiredToken.route_number,
        expiredToken.driver_name,
        'cleanup_expired'
      );
      
      // Delete the expired token
      await db.run(
        'DELETE FROM driver_setup_tokens WHERE token = ?',
        [expiredToken.token]
      );
      
      // Log deletion to audit trail
      await tokenAudit.logDeleted(
        expiredToken.token,
        expiredToken.route_number,
        expiredToken.driver_name,
        'expired_cleanup'
      );
      
      cleanedCount++;
    }
    
    // Also clean up expired demo tokens
    const expiredDemoTokens = await db.all(`
      SELECT token, demo_name, expires_at
      FROM demo_tokens 
      WHERE expires_at < datetime('now')
    `);
    
    for (const demoToken of expiredDemoTokens) {
      await tokenAudit.logExpired(
        demoToken.token,
        null, // No route for demo tokens
        demoToken.demo_name,
        'demo_expired'
      );
      
      await db.run(
        'DELETE FROM demo_tokens WHERE token = ?',
        [demoToken.token]
      );
      
      await tokenAudit.logDeleted(
        demoToken.token,
        null,
        demoToken.demo_name,
        'demo_expired_cleanup'
      );
      
      cleanedCount++;
    }
    
    res.json({
      success: true,
      cleaned_tokens: cleanedCount,
      driver_tokens_cleaned: expiredTokens.length,
      demo_tokens_cleaned: expiredDemoTokens.length,
      message: `Cleaned up ${cleanedCount} expired tokens`
    });
    
    logger.info('Token cleanup completed', {
      total_cleaned: cleanedCount,
      driver_tokens: expiredTokens.length,
      demo_tokens: expiredDemoTokens.length
    });
    
  } catch (error) {
    logger.error('Token cleanup error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/admin/token-audit/:routeNumber
 * Get audit summary for a specific route
 */
router.get('/token-audit/:routeNumber', async (req, res, next) => {
  try {
    const routeNumber = parseInt(req.params.routeNumber);
    
    if (isNaN(routeNumber)) {
      return res.status(400).json({ error: 'Invalid route number' });
    }
    
    const auditSummary = await tokenAudit.getAuditSummary(routeNumber);
    
    res.json({
      success: true,
      route_number: routeNumber,
      audit_summary: auditSummary
    });
    
  } catch (error) {
    logger.error('Token audit summary error', { error: error.message });
    next(error);
  }
});

/**
 * Helper function to generate unique tokens
 */
function generateToken(prefix = '', routeNumber = null) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = prefix;
  
  if (routeNumber) {
    token += routeNumber.toString().padStart(2, '0');
  }
  
  // Add random characters
  const randomLength = 8 - token.length;
  for (let i = 0; i < Math.max(4, randomLength); i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

// Bulk update order button configuration for customers
router.put('/customers/order-config', requireAdmin, async (req, res) => {
  try {
    const { customerNumbers = [] } = req.body;
    const db = require('../utils/database');
    
    logger.info('Updating order button configuration', {
      count: customerNumbers.length,
      customers: customerNumbers,
      route: req.user.route_number,
      driver: req.user.driver_name
    });

    // First, disable order button for ALL customers on this route
    await db.run(
      'UPDATE customers SET order_button = 0 WHERE route_number = ?',
      [req.user.route_number]
    );

    // Then enable for selected customers
    if (customerNumbers.length > 0) {
      const placeholders = customerNumbers.map(() => '?').join(',');
      const params = [...customerNumbers, req.user.route_number];
      
      await db.run(
        `UPDATE customers SET order_button = 1 
         WHERE customer_number IN (${placeholders}) AND route_number = ?`,
        params
      );
    }

    logger.info('Order button configuration updated successfully', {
      enabled: customerNumbers.length,
      route: req.user.route_number,
      driver: req.user.driver_name
    });

    res.json({
      success: true,
      message: `Order button configuration updated for ${customerNumbers.length} customers`,
      enabled: customerNumbers.length,
      route: req.user.route_number
    });

  } catch (error) {
    logger.error('Failed to update order button configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order button configuration'
    });
  }
});

module.exports = router;