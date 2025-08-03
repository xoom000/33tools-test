const express = require('express');
const router = express.Router();
const routeService = require('../services/routeService');

// GET /api/routes - List all routes
router.get('/', async (req, res, next) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.json({
      count: routes.length,
      routes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id - Get specific route
router.get('/:id', async (req, res, next) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id/stops - Get all stops for a route
router.get('/:id/stops', async (req, res, next) => {
  try {
    const { service_day } = req.query;
    const stops = await routeService.getRouteStops(req.params.id, service_day);
    res.json({
      route_number: req.params.id,
      stop_count: stops.length,
      stops
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id/load - Get load summary for route
router.get('/:id/load', async (req, res, next) => {
  try {
    const { service_day, date } = req.query;
    const loadSummary = await routeService.getRouteLoad(
      req.params.id,
      service_day || new Date().toLocaleDateString('en-US', { weekday: 'short' })[0],
      date
    );
    res.json({
      route_number: req.params.id,
      service_day: service_day,
      date: date || new Date().toISOString().split('T')[0],
      load_summary: loadSummary
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/routes/:id/optimize - Optimize route stop order
router.post('/:id/optimize', async (req, res, next) => {
  try {
    const optimized = await routeService.optimizeRoute(req.params.id);
    res.json({
      route_number: req.params.id,
      message: 'Route optimized successfully',
      stops: optimized
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;