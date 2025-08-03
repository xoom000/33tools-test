const logger = require('../utils/logger');

/**
 * Authentication middleware for driver/admin routes
 * 
 * For now, we'll use a simple session-based approach:
 * - Frontend sends route_number in headers or query params
 * - We validate the route exists and is active
 * - We set req.user with driver info
 * 
 * TODO: In the future, replace with proper JWT or session tokens
 */

const authenticateDriver = async (req, res, next) => {
  try {
    // Get route number from multiple sources (headers, query, body)
    const routeNumber = req.headers['x-route-number'] || 
                       req.query.route_number || 
                       req.body.route_number || 
                       33; // Default to Route 33 for backward compatibility

    logger.info('Authentication attempt', {
      route: routeNumber,
      endpoint: req.path,
      method: req.method,
      ip: req.ip
    });

    // Validate route number
    if (!routeNumber || isNaN(routeNumber)) {
      logger.warn('Invalid route number in authentication', { routeNumber });
      return res.status(401).json({ 
        success: false,
        error: 'Invalid or missing route number' 
      });
    }

    // Check if route exists and is active
    const db = require('../utils/database');
    const route = await db.get(
      'SELECT * FROM routes WHERE route_number = ? AND is_active = 1', 
      [routeNumber]
    );

    if (!route) {
      logger.warn('Route not found or inactive', { routeNumber });
      return res.status(401).json({ 
        success: false,
        error: 'Route not found or inactive' 
      });
    }

    // Set user info for route handlers
    req.user = {
      route_number: parseInt(routeNumber),
      driver_name: route.driver_name,
      role: 'driver',
      is_admin: routeNumber == 33 // Route 33 is admin (Nigel)
    };

    logger.info('Authentication successful', {
      route: routeNumber,
      driver: route.driver_name,
      isAdmin: req.user.is_admin
    });

    next();

  } catch (error) {
    logger.error('Authentication middleware error', { 
      error: error.message,
      stack: error.stack 
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Authentication system error' 
    });
  }
};

/**
 * Admin-only middleware (requires Route 33 or admin flag)
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }

  if (!req.user.is_admin && req.user.route_number !== 33) {
    logger.warn('Admin access denied', {
      route: req.user.route_number,
      driver: req.user.driver_name
    });
    
    return res.status(403).json({ 
      success: false,
      error: 'Admin access required' 
    });
  }

  next();
};

/**
 * Route ownership middleware (user can only access their own route data)
 */
const requireRouteOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }

  // Extract route from URL params or query
  const requestedRoute = req.params.routeNumber || 
                        req.query.route_number || 
                        req.user.route_number;

  // Admin (Route 33) can access any route
  if (req.user.is_admin) {
    return next();
  }

  // Regular drivers can only access their own route
  if (parseInt(requestedRoute) !== req.user.route_number) {
    logger.warn('Route access denied', {
      userRoute: req.user.route_number,
      requestedRoute: requestedRoute,
      driver: req.user.driver_name
    });
    
    return res.status(403).json({ 
      success: false,
      error: 'Access denied: can only access your own route data' 
    });
  }

  next();
};

module.exports = {
  authenticateDriver,
  requireAdmin,
  requireRouteOwnership
};