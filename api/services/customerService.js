const logger = require('../utils/logger');
const { DatabaseError, NotFoundError, ValidationError, BusinessError } = require('../middleware/errorHandler');
const CustomerRepository = require('../repositories/CustomerRepository');
const db = require('../utils/database');

class CustomerService {
  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  /**
   * Get all customers with optional filters
   * Business logic: Apply validation and rules before data access
   */
  async getAllCustomers(filters = {}) {
    try {
      // Business logic: Validate route number if provided
      if (filters.route_number) {
        const routeNum = parseInt(filters.route_number);
        if (isNaN(routeNum) || routeNum < 1 || routeNum > 999) {
          throw new ValidationError('Invalid route number', 'route_number', 'Route number must be between 1 and 999');
        }
        filters.route_number = routeNum;
      }

      // Business logic: Validate service day format
      if (filters.service_day) {
        const validDays = ['M', 'T', 'W', 'H', 'F', 'S', 'U'];
        if (!validDays.includes(filters.service_day.toUpperCase())) {
          throw new ValidationError('Invalid service day', 'service_day', 'Service day must be M, T, W, H, F, S, or U');
        }
        filters.service_day = filters.service_day.toUpperCase();
      }

      // Repository handles the data access
      const customers = await this.customerRepository.findAll(filters);
      
      // Business logic: Add computed fields if needed
      const enhancedCustomers = customers.map(customer => ({
        ...customer,
        display_name: `${customer.account_name} (${customer.customer_number})`,
        next_service: this.calculateNextServiceDate(customer.service_days),
        status: customer.is_active ? 'active' : 'inactive'
      }));
      
      logger.info('Customer service: getAllCustomers completed', { 
        count: enhancedCustomers.length, 
        filters,
        route: filters.route_number || 'all'
      });
      
      return enhancedCustomers;
    } catch (error) {
      if (error.name === 'APIError') {
        throw error; // Re-throw our custom errors
      }
      logger.error('Customer service: Failed to get all customers', { filters, error: error.message });
      throw new DatabaseError(`Failed to retrieve customers: ${error.message}`);
    }
  }

  /**
   * Get customer by ID with business logic validation
   */
  async getCustomerById(customerId) {
    try {
      // Business logic: Validate customer ID format
      if (!customerId || isNaN(parseInt(customerId))) {
        throw new ValidationError('Invalid customer ID', 'customer_id', 'Customer ID must be a valid number');
      }

      // Repository handles the data access
      const customer = await this.customerRepository.findById(customerId);
      
      if (!customer) {
        return null; // Let the route handler decide if this is an error
      }

      // Business logic: Add computed fields
      const enhancedCustomer = {
        ...customer,
        display_name: `${customer.account_name} (${customer.customer_number})`,
        next_service: this.calculateNextServiceDate(customer.service_days),
        status: customer.is_active ? 'active' : 'inactive',
        has_login_access: !!(customer.login_code && customer.login_code_expires)
      };
      
      logger.info('Customer service: getCustomerById completed', { 
        customerId, 
        account: customer.account_name,
        route: customer.route_number
      });
      
      return enhancedCustomer;
    } catch (error) {
      if (error.name === 'APIError') {
        throw error; // Re-throw our custom errors
      }
      logger.error('Customer service: Failed to get customer by ID', { customerId, error: error.message });
      throw new DatabaseError(`Failed to retrieve customer ${customerId}: ${error.message}`);
    }
  }

  /**
   * Business logic: Calculate next service date based on service days
   */
  calculateNextServiceDate(serviceDays) {
    try {
      if (!serviceDays || typeof serviceDays !== 'string') return null;

      const dayMap = { 'M': 1, 'T': 2, 'W': 3, 'H': 4, 'F': 5, 'S': 6, 'U': 0 };
      const today = new Date();
      const currentDay = today.getDay();
      
      // Parse service days (e.g., "M,W,F")
      const serviceDayNumbers = serviceDays.split(',')
        .map(day => dayMap[day.trim()])
        .filter(day => day !== undefined)
        .sort();

      if (serviceDayNumbers.length === 0) return null;

      // Find next service day
      let nextServiceDay = serviceDayNumbers.find(day => day > currentDay);
      if (!nextServiceDay) {
        // If no service day this week, get first day of next week
        nextServiceDay = serviceDayNumbers[0];
      }

      const daysUntilService = nextServiceDay > currentDay ? 
        nextServiceDay - currentDay : 
        7 - currentDay + nextServiceDay;

      const nextService = new Date(today);
      nextService.setDate(today.getDate() + daysUntilService);
      
      return nextService.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    } catch (error) {
      // If date calculation fails, just return null
      logger.warn('Failed to calculate next service date', { serviceDays, error: error.message });
      return null;
    }
  }

  async createCustomer(customerData) {
    const {
      customer_number,
      account_name,
      address,
      city,
      state,
      zip_code,
      route_number,
      service_frequency,
      service_days
    } = customerData;

    const query = `
      INSERT INTO customers (
        customer_number, account_name, address, city, state, 
        zip_code, route_number, service_frequency, service_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      customer_number,
      account_name,
      address,
      city,
      state || 'CA',
      zip_code,
      route_number,
      service_frequency,
      service_days
    ];

    const result = await db.run(query, params);
    return await this.getCustomerById(customer_number || result.lastID);
  }

  async updateCustomer(customerId, updates) {
    const allowedFields = [
      'account_name', 'address', 'city', 'state', 'zip_code',
      'route_number', 'service_frequency', 'service_days', 'is_active'
    ];

    const fieldsToUpdate = Object.keys(updates)
      .filter(key => allowedFields.includes(key) && updates[key] !== undefined);

    if (fieldsToUpdate.length === 0) {
      return await this.getCustomerById(customerId);
    }

    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map(field => updates[field]);
    values.push(customerId);

    const query = `
      UPDATE customers 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE customer_number = ?
    `;

    await db.run(query, values);
    return await this.getCustomerById(customerId);
  }

  async getCustomerItems(customerId) {
    const query = `
      SELECT 
        ci.*,
        ic.description,
        ic.category_id,
        cat.category_name,
        ic.unit_of_measure
      FROM customer_items ci
      JOIN item_catalog ic ON ci.item_number = ic.item_number
      LEFT JOIN categories cat ON ic.category_id = cat.category_id
      WHERE ci.customer_number = ?
      ORDER BY cat.category_name, ic.description
    `;

    return await db.query(query, [customerId]);
  }

  async addCustomerItem(customerId, itemData) {
    const { item_number, quantity, item_type, frequency, notes } = itemData;

    // First check if item already exists for customer
    const existing = await db.get(
      'SELECT * FROM customer_items WHERE customer_number = ? AND item_number = ? AND item_type = ?',
      [customerId, item_number, item_type]
    );

    if (existing) {
      // Update quantity instead of creating duplicate
      await db.run(
        'UPDATE customer_items SET quantity = ? WHERE id = ?',
        [quantity, existing.id]
      );
      return await db.get('SELECT * FROM customer_items WHERE id = ?', [existing.id]);
    }

    const query = `
      INSERT INTO customer_items (
        customer_number, item_number, quantity, item_type, frequency, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(query, [
      customerId, item_number, quantity, item_type, frequency, notes
    ]);

    return await db.get('SELECT * FROM customer_items WHERE id = ?', [result.lastID]);
  }

  async getServiceHistory(customerId, filters = {}) {
    let query = `
      SELECT 
        sh.*,
        r.driver_name,
        GROUP_CONCAT(
          si.item_number || ':' || 
          si.quantity_delivered || '/' || 
          si.quantity_picked_up
        ) as items_summary
      FROM service_history sh
      LEFT JOIN routes r ON sh.route_number = r.route_number
      LEFT JOIN service_items si ON sh.service_id = si.service_id
      WHERE sh.customer_number = ?
    `;
    const params = [customerId];

    if (filters.start_date) {
      query += ' AND sh.service_date >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND sh.service_date <= ?';
      params.push(filters.end_date);
    }

    if (filters.service_type) {
      query += ' AND sh.service_type = ?';
      params.push(filters.service_type);
    }

    query += ' GROUP BY sh.service_id ORDER BY sh.service_date DESC';

    return await db.query(query, params);
  }

  // AUTH FUNCTIONS - Your brilliant system!
  
  async validateLogin(customerNumber, loginCode) {
    const query = `
      SELECT c.*, r.driver_name 
      FROM customers c
      LEFT JOIN routes r ON c.route_number = r.route_number
      WHERE c.customer_number = ? AND c.login_code = ?
    `;
    
    const customers = await db.query(query, [customerNumber, loginCode]);
    return customers.length > 0 ? customers[0] : null;
  }

  async saveDevice(customerNumber, loginCode, deviceName) {
    // First verify the login is valid
    const customer = await this.validateLogin(customerNumber, loginCode);
    if (!customer) {
      throw new Error('Invalid customer number or login code');
    }

    // Generate a unique device token
    const deviceToken = this.generateDeviceToken(customerNumber, deviceName);

    // Check if device already exists (same customer + device name)
    const existingDevice = await db.query(
      'SELECT * FROM customer_devices WHERE customer_number = ? AND device_name = ?',
      [customerNumber, deviceName]
    );

    if (existingDevice.length > 0) {
      // Update last_used timestamp and device token
      await db.query(
        'UPDATE customer_devices SET last_used = CURRENT_TIMESTAMP, device_token = ? WHERE id = ?',
        [deviceToken, existingDevice[0].id]
      );
      
      // Return updated device with token
      const updatedDevice = await db.query(
        'SELECT * FROM customer_devices WHERE id = ?',
        [existingDevice[0].id]
      );
      return { device: updatedDevice[0], customer };
    } else {
      // Insert new device with token
      const result = await db.query(
        `INSERT INTO customer_devices (customer_number, login_code, device_name, device_token, created_at, last_used)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [customerNumber, loginCode, deviceName, deviceToken]
      );

      // Return the created device with customer data
      const newDevice = await db.query(
        'SELECT * FROM customer_devices WHERE id = ?',
        [result.lastID]
      );
      return { device: newDevice[0], customer };
    }
  }

  async getCustomerDevices(customerNumber) {
    const query = `
      SELECT id, device_name, created_at, last_used
      FROM customer_devices 
      WHERE customer_number = ?
      ORDER BY last_used DESC
    `;
    
    return await db.query(query, [customerNumber]);
  }

  // ADMIN FUNCTION - Generate login codes
  async generateLoginToken(customerNumber) {
    // Check if customer already has a valid token (within last 24 hours)
    const existing = await db.get(
      'SELECT login_code, login_code_expires FROM customers WHERE customer_number = ?',
      [customerNumber]
    );
    
    const now = new Date();
    
    // If existing token is still valid (less than 24 hours old), return it
    if (existing && existing.login_code && existing.login_code_expires) {
      const expiresAt = new Date(existing.login_code_expires);
      if (expiresAt > now) {
        logger.info('Returning existing valid token', { 
          customerNumber, 
          token: existing.login_code.substring(0, 4) + '***',
          expiresAt: existing.login_code_expires
        });
        return { 
          customer_number: customerNumber,
          login_token: existing.login_code,
          expires_at: existing.login_code_expires,
          is_new: false
        };
      }
    }

    // Generate a new 8-character token
    const token = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await db.run(
      'UPDATE customers SET login_code = ?, login_code_expires = ? WHERE customer_number = ?',
      [token, expiresAt.toISOString(), customerNumber]
    );
    
    logger.info('Generated new login token', { 
      customerNumber, 
      token: token.substring(0, 4) + '***',
      expiresAt: expiresAt.toISOString()
    });
    
    return { 
      customer_number: customerNumber,
      login_token: token,
      expires_at: expiresAt.toISOString(),
      is_new: true 
    };
  }

  // DEVICE TOKEN FUNCTIONS - Remember Me functionality
  generateDeviceToken(customerNumber, deviceName) {
    // Create a unique token based on customer, device, and timestamp
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 16);
    const tokenBase = `${customerNumber}_${deviceName}_${timestamp}_${randomPart}`;
    
    // Create a hash-like token (simple version)
    return Buffer.from(tokenBase).toString('base64').replace(/[+/=]/g, '').substr(0, 32);
  }

  async verifyDeviceToken(deviceToken) {
    const query = `
      SELECT cd.*, c.customer_number, c.account_name, c.address, c.city, c.state, c.zip_code, 
             c.route_number, c.service_frequency, c.service_days, r.driver_name
      FROM customer_devices cd
      JOIN customers c ON cd.customer_number = c.customer_number
      LEFT JOIN routes r ON c.route_number = r.route_number
      WHERE cd.device_token = ? AND c.is_active = 1
    `;
    
    const results = await db.query(query, [deviceToken]);
    
    if (results.length > 0) {
      // Update last_used timestamp
      await db.query(
        'UPDATE customer_devices SET last_used = CURRENT_TIMESTAMP WHERE device_token = ?',
        [deviceToken]
      );
      
      return results[0];
    }
    
    return null;
  }
}

module.exports = new CustomerService();