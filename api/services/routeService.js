const db = require('../utils/database');

class RouteService {
  async getAllRoutes() {
    const query = `
      SELECT 
        r.*,
        COUNT(c.customer_number) as customer_count
      FROM routes r
      LEFT JOIN customers c ON r.route_number = c.route_number
      WHERE r.is_active = 1
      GROUP BY r.route_number
      ORDER BY r.route_number
    `;

    return await db.query(query);
  }

  async getRouteById(routeNumber) {
    const query = `
      SELECT 
        r.*,
        COUNT(c.customer_number) as customer_count
      FROM routes r
      LEFT JOIN customers c ON r.route_number = c.route_number
      WHERE r.route_number = ?
      GROUP BY r.route_number
    `;

    return await db.get(query, [routeNumber]);
  }

  async getRouteStops(routeNumber, serviceDay = null) {
    let query = `
      SELECT 
        c.customer_number,
        c.account_name,
        c.address,
        c.city,
        c.service_frequency,
        c.service_days,
        rso.stop_order,
        rso.estimated_time
      FROM customers c
      LEFT JOIN route_stop_order rso ON c.customer_number = rso.customer_number
      WHERE c.route_number = ?
      AND c.is_active = 1
    `;
    const params = [routeNumber];

    if (serviceDay) {
      query += ' AND c.service_days LIKE ?';
      params.push(`%${serviceDay}%`);
    }

    query += ' ORDER BY COALESCE(rso.stop_order, 999), c.account_name';

    return await db.query(query, params);
  }

  async getRouteLoad(routeNumber, serviceDay, date = null) {
    // Get rental items needed for this route/day
    const rentalQuery = `
      SELECT 
        ci.item_number,
        ic.description,
        SUM(ci.quantity) as total_quantity,
        ic.unit_of_measure,
        cat.category_name
      FROM customer_items ci
      JOIN customers c ON ci.customer_number = c.customer_number
      JOIN item_catalog ic ON ci.item_number = ic.item_number
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      WHERE c.route_number = ?
      AND ci.item_type = 'rental'
      AND c.service_days LIKE ?
      AND c.is_active = 1
      GROUP BY ci.item_number, ic.description
      ORDER BY cat.category_name, ic.description
    `;

    const rentalItems = await db.query(rentalQuery, [routeNumber, `%${serviceDay}%`]);

    // Get any scheduled orders for this date
    let ordersQuery = `
      SELECT 
        oi.item_number,
        ic.description,
        SUM(oi.quantity) as order_quantity,
        ic.unit_of_measure
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN customers c ON o.customer_number = c.customer_number
      JOIN item_catalog ic ON oi.item_number = ic.item_number
      WHERE c.route_number = ?
      AND o.status = 'confirmed'
    `;
    const orderParams = [routeNumber];

    if (date) {
      ordersQuery += ' AND o.delivery_date = ?';
      orderParams.push(date);
    } else {
      ordersQuery += ' AND o.delivery_date = CURRENT_DATE';
    }

    ordersQuery += ' GROUP BY oi.item_number';

    const orderItems = await db.query(ordersQuery, orderParams);

    return {
      rental_items: rentalItems,
      order_items: orderItems,
      summary: {
        total_rental_items: rentalItems.length,
        total_order_items: orderItems.length,
        total_rental_quantity: rentalItems.reduce((sum, item) => sum + item.total_quantity, 0)
      }
    };
  }

  async optimizeRoute(routeNumber) {
    // Simple optimization - just return current stops ordered by stop_order
    // In a real implementation, you'd use geographical optimization
    const query = `
      SELECT 
        c.customer_number,
        c.account_name,
        c.address,
        c.city,
        COALESCE(rso.stop_order, 999) as current_order
      FROM customers c
      LEFT JOIN route_stop_order rso ON c.customer_number = rso.customer_number
      WHERE c.route_number = ?
      AND c.is_active = 1
      ORDER BY current_order, c.city, c.account_name
    `;

    const stops = await db.query(query, [routeNumber]);

    // Update stop orders
    for (let i = 0; i < stops.length; i++) {
      await db.run(`
        INSERT OR REPLACE INTO route_stop_order (route_number, customer_number, stop_order)
        VALUES (?, ?, ?)
      `, [routeNumber, stops[i].customer_number, i + 1]);
    }

    return stops.map((stop, index) => ({
      ...stop,
      new_order: index + 1
    }));
  }
}

module.exports = new RouteService();