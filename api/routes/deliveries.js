const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// POST /api/deliveries/start - Start route for the day
router.post('/start', async (req, res, next) => {
  try {
    const { route_number, driver_id = 33 } = req.body;
    
    // Get all customers for today's route
    const dayMap = { 0: 'U', 1: 'M', 2: 'T', 3: 'W', 4: 'H', 5: 'F', 6: 'S' };
    const today = dayMap[new Date().getDay()];
    
    const customers = await db.query(`
      SELECT customer_number, account_name
      FROM customers
      WHERE route_number = ? 
      AND service_days LIKE ?
      AND is_active = 1
    `, [route_number, `%${today}%`]);

    // Create delivery records for each stop
    for (const customer of customers) {
      await db.run(`
        INSERT OR IGNORE INTO delivery_status (
          customer_number, route_number, delivery_date, 
          status, driver_id
        ) VALUES (?, ?, DATE('now'), 'Not Started', ?)
      `, [customer.customer_number, route_number, driver_id]);
    }

    res.json({ 
      success: true,
      stops_created: customers.length,
      message: `Route ${route_number} started with ${customers.length} stops`
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/deliveries/today - Get today's stops
router.get('/today', async (req, res, next) => {
  try {
    const { route_number = 33 } = req.query;
    
    const stops = await db.query(`
      SELECT 
        ds.*,
        c.account_name,
        c.address,
        c.city,
        c.service_frequency,
        rso.stop_order
      FROM delivery_status ds
      JOIN customers c ON ds.customer_number = c.customer_number
      LEFT JOIN route_stop_order rso ON c.customer_number = rso.customer_number
      WHERE ds.route_number = ?
      AND ds.delivery_date = DATE('now')
      ORDER BY 
        CASE ds.status 
          WHEN 'Completed' THEN 3
          WHEN 'In Progress' THEN 1
          ELSE 2 
        END,
        COALESCE(rso.stop_order, 999),
        c.account_name
    `, [route_number]);

    const summary = {
      total: stops.length,
      completed: stops.filter(s => s.status === 'Completed').length,
      remaining: stops.filter(s => s.status !== 'Completed').length
    };

    res.json({ 
      summary,
      stops 
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/deliveries/:customerId/complete - Mark stop as complete
router.put('/:customerId/complete', async (req, res, next) => {
  try {
    const { notes, issues } = req.body;
    
    await db.run(`
      UPDATE delivery_status 
      SET 
        status = 'Completed',
        completion_time = CURRENT_TIMESTAMP,
        issues_notes = ?
      WHERE customer_number = ?
      AND delivery_date = DATE('now')
    `, [issues || notes, req.params.customerId]);

    res.json({ 
      success: true,
      message: 'Delivery marked complete' 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/deliveries/:customerId/issue - Report delivery issue
router.post('/:customerId/issue', async (req, res, next) => {
  try {
    const { issue, action_taken } = req.body;
    
    await db.run(`
      UPDATE delivery_status 
      SET 
        status = 'Issue',
        issues_notes = ?
      WHERE customer_number = ?
      AND delivery_date = DATE('now')
    `, [`${issue}. Action: ${action_taken}`, req.params.customerId]);

    // Also create a customer note for history
    await db.run(`
      INSERT INTO customer_notes (
        customer_number, note_type, note_text, created_by
      ) VALUES (?, 'Delivery', ?, 33)
    `, [req.params.customerId, `${issue}. Action: ${action_taken}`]);

    res.json({ 
      success: true,
      message: 'Issue recorded' 
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/deliveries/stats - Get route statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_stops,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Issue' THEN 1 ELSE 0 END) as issues,
        MIN(completion_time) as start_time,
        MAX(completion_time) as last_stop_time
      FROM delivery_status
      WHERE delivery_date = DATE('now')
      AND route_number = ?
    `, [req.query.route_number || 33]);

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;