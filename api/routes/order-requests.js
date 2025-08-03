const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// POST /api/order-requests - Customer submits order request
router.post('/', async (req, res, next) => {
  try {
    const { 
      customer_number, 
      items, // Array of { item_number, quantity, notes }
      delivery_notes,
      requested_date 
    } = req.body;

    // Create order request record
    const result = await db.run(`
      INSERT INTO order_requests (
        customer_number, 
        status, 
        driver_id,
        total_amount,
        note,
        submitted_at
      ) VALUES (?, 'Pending', 33, 0, ?, CURRENT_TIMESTAMP)
    `, [customer_number, delivery_notes]);

    const order_id = result.lastID;

    // Add items to order
    for (const item of items) {
      await db.run(`
        INSERT INTO order_items (order_id, sku, quantity, price_at_order)
        VALUES (?, ?, ?, 0)
      `, [order_id, item.item_number, item.quantity]);
    }

    // TODO: Send notification to driver (SMS/Telegram/Email)
    
    res.status(201).json({
      success: true,
      order_id,
      message: 'Order request submitted successfully!'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/order-requests - Get all pending requests
router.get('/', async (req, res, next) => {
  try {
    const { status = 'Pending' } = req.query;
    
    const orders = await db.query(`
      SELECT 
        o.*,
        c.account_name,
        c.address,
        0 as item_count
      FROM order_requests o
      JOIN customers c ON o.customer_number = c.customer_number
      WHERE o.status = ?
      ORDER BY o.submitted_at DESC
    `, [status]);

    res.json({ 
      count: orders.length,
      orders 
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/order-requests/:id/approve - Driver approves request
router.put('/:id/approve', async (req, res, next) => {
  try {
    await db.run(`
      UPDATE order_requests 
      SET status = 'Approved', approved_at = CURRENT_TIMESTAMP
      WHERE order_id = ?
    `, [req.params.id]);

    res.json({ 
      success: true,
      message: 'Order approved' 
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/order-requests/:id/complete - Mark as delivered
router.put('/:id/complete', async (req, res, next) => {
  try {
    const { notes } = req.body;
    
    await db.run(`
      UPDATE order_requests 
      SET status = 'Delivered', note = ?
      WHERE order_id = ?
    `, [notes, req.params.id]);

    res.json({ 
      success: true,
      message: 'Order marked as delivered' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;