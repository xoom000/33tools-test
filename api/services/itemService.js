const db = require('../utils/database');

class ItemService {
  async getAllItems(filters = {}) {
    let query = `
      SELECT 
        ic.*,
        cat.category_name,
        p.price as base_price,
        v.vendor_name
      FROM item_catalog ic
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      LEFT JOIN pricing p ON ic.item_number = p.item_number AND p.price_type = 'base'
      LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.item_type) {
      query += ' AND ic.item_type = ?';
      params.push(filters.item_type);
    }

    if (filters.category) {
      query += ' AND cat.category_name = ?';
      params.push(filters.category);
    }

    if (filters.search) {
      query += ' AND (ic.description LIKE ? OR ic.item_number LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.active !== undefined) {
      query += ' AND ic.is_active = ?';
      params.push(filters.active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY cat.category_name, ic.description';

    return await db.query(query, params);
  }

  async getRentalItems() {
    const query = `
      SELECT 
        ic.*,
        cat.category_name
      FROM item_catalog ic
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      WHERE ic.item_type IN ('rental', 'both')
      AND ic.is_active = 1
      ORDER BY cat.category_name, ic.description
    `;

    return await db.query(query);
  }

  async getSalesItems(filters = {}) {
    let query = `
      SELECT 
        ic.*,
        cat.category_name,
        p.price as base_price,
        v.vendor_name
      FROM item_catalog ic
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      LEFT JOIN pricing p ON ic.item_number = p.item_number AND p.price_type = 'base'
      LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
      WHERE ic.item_type IN ('sale', 'both')
      AND ic.is_active = 1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND cat.category_name = ?';
      params.push(filters.category);
    }

    if (filters.vendor) {
      query += ' AND v.vendor_name = ?';
      params.push(filters.vendor);
    }

    if (filters.search) {
      query += ' AND (ic.description LIKE ? OR ic.item_number LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY cat.category_name, ic.description';

    return await db.query(query, params);
  }

  async getCategories() {
    const query = `
      SELECT 
        c.*,
        COUNT(ic.item_number) as item_count
      FROM categories c
      LEFT JOIN item_catalog ic ON c.category_id = ic.category_id
      GROUP BY c.category_id
      ORDER BY c.category_name
    `;

    return await db.query(query);
  }

  async getItemById(itemNumber) {
    const query = `
      SELECT 
        ic.*,
        cat.category_name,
        i.quantity_on_hand,
        i.quantity_allocated,
        i.reorder_point
      FROM item_catalog ic
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      LEFT JOIN inventory i ON ic.item_number = i.item_number
      WHERE ic.item_number = ?
    `;

    return await db.get(query, [itemNumber]);
  }

  async getItemPricing(itemNumber, customerNumber = null, quantity = 1) {
    // Get all applicable pricing for the item
    let query = `
      SELECT 
        p.*,
        v.vendor_name,
        CASE 
          WHEN p.customer_number IS NOT NULL THEN 'customer'
          WHEN p.min_quantity <= ? THEN p.price_type
          ELSE NULL
        END as applicable_type
      FROM pricing p
      LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
      WHERE p.item_number = ?
      AND (p.customer_number IS NULL OR p.customer_number = ?)
      AND (p.end_date IS NULL OR p.end_date >= CURRENT_DATE)
      AND p.min_quantity <= ?
      ORDER BY 
        CASE WHEN p.customer_number IS NOT NULL THEN 1 ELSE 2 END,
        p.min_quantity DESC
    `;

    const params = [quantity, itemNumber, customerNumber, quantity];
    const pricing = await db.query(query, params);

    // Return the best applicable price
    const bestPrice = pricing.find(p => p.applicable_type) || pricing[0];

    return {
      item_number: itemNumber,
      customer_number: customerNumber,
      quantity: quantity,
      price: bestPrice?.price || null,
      price_type: bestPrice?.applicable_type || 'base',
      vendor: bestPrice?.vendor_name || null,
      all_pricing: pricing
    };
  }

  async checkAvailability(itemNumber) {
    const query = `
      SELECT 
        ic.item_number,
        ic.description,
        i.quantity_on_hand,
        i.quantity_allocated,
        (i.quantity_on_hand - i.quantity_allocated) as available,
        i.reorder_point,
        CASE 
          WHEN (i.quantity_on_hand - i.quantity_allocated) <= i.reorder_point 
          THEN 'low' 
          ELSE 'ok' 
        END as status
      FROM item_catalog ic
      LEFT JOIN inventory i ON ic.item_number = i.item_number
      WHERE ic.item_number = ?
    `;

    return await db.get(query, [itemNumber]);
  }
}

module.exports = new ItemService();