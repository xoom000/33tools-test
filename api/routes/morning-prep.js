const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// Get automated load list for a route
router.get('/load-list/:route_id', async (req, res) => {
    try {
        const { route_id } = req.params;
        
        // Get all items needed for today's route based on customer par levels and pending orders
        const query = `
            SELECT DISTINCT
                ri.id,
                ri.item_name as name,
                cri.quantity,
                ri.size,
                c.business_name as customer,
                CASE 
                    WHEN cri.quantity > 0 THEN 'rental'
                    ELSE 'direct_sale'
                END as type
            FROM customers c
            JOIN customer_rental_items cri ON c.id = cri.customer_id
            JOIN rental_items_catalog ri ON cri.item_id = ri.id
            WHERE c.route_id = ?
            AND cri.quantity > 0
            
            UNION ALL
            
            SELECT DISTINCT
                ds.id,
                ds.item_name as name,
                ds.quantity,
                ds.size,
                c.business_name as customer,
                'direct_sale' as type
            FROM customers c
            JOIN direct_sales ds ON c.id = ds.customer_id
            WHERE c.route_id = ?
            AND ds.status = 'pending'
            
            ORDER BY customer, type, name
        `;
        
        const items = await db.query(query, [route_id, route_id]);
        
        // Add completion status (default false for new loads)
        const loadList = items.map(item => ({
            ...item,
            completed: false
        }));
        
        res.json(loadList);
        
    } catch (error) {
        console.error('Error generating load list:', error);
        res.status(500).json({ error: 'Failed to generate load list' });
    }
});

// Get pending uniform orders for a route
router.get('/uniform-orders/:route_id', async (req, res) => {
    try {
        const { route_id } = req.params;
        
        // Get uniform orders that need to be delivered
        const query = `
            SELECT 
                ds.id,
                c.business_name as customer_name,
                ds.item_name,
                ds.quantity,
                ds.size,
                ds.order_date,
                ds.status
            FROM direct_sales ds
            JOIN customers c ON ds.customer_id = c.id
            WHERE c.route_id = ?
            AND ds.status IN ('pending', 'ready')
            AND (ds.item_name LIKE '%shirt%' 
                 OR ds.item_name LIKE '%uniform%' 
                 OR ds.item_name LIKE '%polo%'
                 OR ds.item_name LIKE '%pant%'
                 OR ds.item_name LIKE '%coverall%')
            ORDER BY ds.order_date ASC
        `;
        
        const orders = await db.all(query, [route_id]);
        
        // Group by customer
        const groupedOrders = orders.reduce((acc, order) => {
            const existingCustomer = acc.find(group => group.customer_name === order.customer_name);
            
            if (existingCustomer) {
                existingCustomer.items.push({
                    id: order.id,
                    item_name: order.item_name,
                    quantity: order.quantity,
                    size: order.size
                });
            } else {
                acc.push({
                    id: order.id,
                    customer_name: order.customer_name,
                    order_date: order.order_date,
                    items: [{
                        id: order.id,
                        item_name: order.item_name,
                        quantity: order.quantity,
                        size: order.size
                    }]
                });
            }
            
            return acc;
        }, []);
        
        res.json(groupedOrders);
        
    } catch (error) {
        console.error('Error getting uniform orders:', error);
        res.status(500).json({ error: 'Failed to get uniform orders' });
    }
});

// Get important customer notes for today's route
router.get('/customer-notes/:route_id', async (req, res) => {
    try {
        const { route_id } = req.params;
        
        const query = `
            SELECT 
                cn.id,
                c.business_name as customer_name,
                cn.note,
                cn.priority,
                cn.created_date
            FROM customer_notes cn
            JOIN customers c ON cn.customer_id = c.id
            WHERE c.route_id = ?
            AND cn.active = 1
            AND (cn.priority = 'high' OR cn.note LIKE '%today%' OR cn.note LIKE '%morning%')
            ORDER BY 
                CASE cn.priority 
                    WHEN 'high' THEN 1 
                    WHEN 'medium' THEN 2 
                    ELSE 3 
                END,
                cn.created_date DESC
            LIMIT 20
        `;
        
        const notes = await db.all(query, [route_id]);
        res.json(notes);
        
    } catch (error) {
        console.error('Error getting customer notes:', error);
        res.status(500).json({ error: 'Failed to get customer notes' });
    }
});

// Save relief driver notes
router.post('/relief-notes/:route_id', async (req, res) => {
    try {
        const { route_id } = req.params;
        const { notes, special_instructions, uniform_updates } = req.body;
        
        // Save to a relief_driver_notes table (would need to create this)
        const query = `
            INSERT INTO relief_driver_notes (route_id, notes, special_instructions, uniform_updates, created_date)
            VALUES (?, ?, ?, ?, datetime('now'))
        `;
        
        await db.run(query, [route_id, notes, special_instructions, uniform_updates]);
        
        res.json({ success: true, message: 'Relief notes saved' });
        
    } catch (error) {
        console.error('Error saving relief notes:', error);
        res.status(500).json({ error: 'Failed to save relief notes' });
    }
});

module.exports = router;