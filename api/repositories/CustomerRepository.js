/**
 * 33 Tools - Customer Repository
 * 
 * Handles ALL database operations for customers
 * Separates data access from business logic for better testing and maintenance
 */

const db = require('../utils/database');
const logger = require('../utils/logger');
const { DatabaseError } = require('../middleware/errorHandler');

class CustomerRepository {
  constructor() {
    this.tableName = 'customers';
  }

  /**
   * Find all customers with optional filters
   */
  async findAll(filters = {}) {
    try {
      let query = `
        SELECT c.*, r.driver_name 
        FROM ${this.tableName} c
        LEFT JOIN routes r ON c.route_number = r.route_number
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.route_number) {
        query += ' AND c.route_number = ?';
        params.push(filters.route_number);
      }

      if (filters.service_day) {
        query += ' AND c.service_days LIKE ?';
        params.push(`%${filters.service_day}%`);
      }

      if (filters.city) {
        query += ' AND c.city = ?';
        params.push(filters.city);
      }

      if (filters.active !== undefined) {
        query += ' AND c.is_active = ?';
        params.push(filters.active === 'true' ? 1 : 0);
      }

      if (filters.zip_code) {
        query += ' AND c.zip_code = ?';
        params.push(filters.zip_code);
      }

      // Default ordering
      query += ' ORDER BY c.account_name';

      const customers = await db.query(query, params);
      
      logger.info('Customers found in repository', { 
        count: customers.length, 
        filters,
        table: this.tableName
      });
      
      return customers;
    } catch (error) {
      logger.error('Repository: Failed to find customers', { filters, error: error.message });
      throw new DatabaseError(`Failed to retrieve customers: ${error.message}`);
    }
  }

  /**
   * Find customer by ID (customer_number)
   */
  async findById(customerId) {
    try {
      const query = `
        SELECT c.*, r.driver_name 
        FROM ${this.tableName} c
        LEFT JOIN routes r ON c.route_number = r.route_number
        WHERE c.customer_number = ?
      `;
      
      const customer = await db.get(query, [customerId]);
      
      if (customer) {
        logger.info('Customer found by ID in repository', { 
          customerId, 
          account: customer.account_name,
          route: customer.route_number
        });
      }
      
      return customer;
    } catch (error) {
      logger.error('Repository: Failed to find customer by ID', { customerId, error: error.message });
      throw new DatabaseError(`Failed to retrieve customer ${customerId}: ${error.message}`);
    }
  }

  /**
   * Find customers by route number (optimized query)
   */
  async findByRoute(routeNumber) {
    try {
      const query = `
        SELECT c.*, r.driver_name 
        FROM ${this.tableName} c
        LEFT JOIN routes r ON c.route_number = r.route_number
        WHERE c.route_number = ? AND c.is_active = 1
        ORDER BY c.account_name
      `;
      
      const customers = await db.query(query, [routeNumber]);
      
      logger.info('Customers found by route in repository', { 
        routeNumber, 
        count: customers.length
      });
      
      return customers;
    } catch (error) {
      logger.error('Repository: Failed to find customers by route', { routeNumber, error: error.message });
      throw new DatabaseError(`Failed to retrieve customers for route ${routeNumber}: ${error.message}`);
    }
  }

  /**
   * Create new customer
   */
  async create(customerData) {
    try {
      const {
        customer_number,
        account_name,
        contact_person,
        phone,
        email,
        address,
        city,
        state,
        zip_code,
        route_number,
        service_days,
        service_frequency,
        special_instructions,
        is_active = 1
      } = customerData;

      const query = `
        INSERT INTO ${this.tableName} (
          customer_number, account_name, contact_person, phone, email,
          address, city, state, zip_code, route_number, service_days,
          service_frequency, special_instructions, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        customer_number, account_name, contact_person, phone, email,
        address, city, state, zip_code, route_number, service_days,
        service_frequency, special_instructions, is_active
      ];

      const result = await db.run(query, params);
      
      logger.info('Customer created in repository', { 
        customerId: customer_number,
        account: account_name,
        route: route_number,
        rowId: result.lastID
      });
      
      return { 
        customer_number,
        rowId: result.lastID,
        changes: result.changes 
      };
    } catch (error) {
      logger.error('Repository: Failed to create customer', { customerData, error: error.message });
      throw new DatabaseError(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Update customer
   */
  async update(customerId, updateData) {
    try {
      const fields = [];
      const params = [];

      // Build dynamic update query
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined && key !== 'customer_number') {
          fields.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(customerId);

      const query = `
        UPDATE ${this.tableName} 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE customer_number = ?
      `;

      const result = await db.run(query, params);
      
      logger.info('Customer updated in repository', { 
        customerId,
        fieldsUpdated: Object.keys(updateData),
        changes: result.changes
      });
      
      return { 
        customerId,
        changes: result.changes,
        updated: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to update customer', { customerId, updateData, error: error.message });
      throw new DatabaseError(`Failed to update customer ${customerId}: ${error.message}`);
    }
  }

  /**
   * Delete customer (soft delete - set is_active = 0)
   */
  async delete(customerId) {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP
        WHERE customer_number = ?
      `;

      const result = await db.run(query, [customerId]);
      
      logger.info('Customer deleted (soft) in repository', { 
        customerId,
        changes: result.changes
      });
      
      return { 
        customerId,
        changes: result.changes,
        deleted: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to delete customer', { customerId, error: error.message });
      throw new DatabaseError(`Failed to delete customer ${customerId}: ${error.message}`);
    }
  }

  /**
   * Count customers by route
   */
  async countByRoute(routeNumber = null) {
    try {
      let query = `SELECT route_number, COUNT(*) as count FROM ${this.tableName} WHERE is_active = 1`;
      const params = [];

      if (routeNumber) {
        query += ' AND route_number = ?';
        params.push(routeNumber);
        query += ' GROUP BY route_number';
      } else {
        query += ' GROUP BY route_number ORDER BY route_number';
      }

      const result = routeNumber ? 
        await db.get(query, params) : 
        await db.query(query, params);
      
      logger.info('Customer count by route in repository', { 
        routeNumber: routeNumber || 'all',
        result: routeNumber ? result?.count || 0 : result?.length || 0
      });
      
      return result;
    } catch (error) {
      logger.error('Repository: Failed to count customers by route', { routeNumber, error: error.message });
      throw new DatabaseError(`Failed to count customers: ${error.message}`);
    }
  }

  /**
   * Generate login token for customer
   */
  async updateLoginToken(customerId, token, expiresAt) {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET login_code = ?, login_code_expires = ?, updated_at = CURRENT_TIMESTAMP
        WHERE customer_number = ?
      `;

      const result = await db.run(query, [token, expiresAt, customerId]);
      
      logger.info('Customer login token updated in repository', { 
        customerId,
        tokenLength: token?.length || 0,
        expiresAt,
        changes: result.changes
      });
      
      return { 
        customerId,
        changes: result.changes,
        updated: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to update login token', { customerId, error: error.message });
      throw new DatabaseError(`Failed to update login token for customer ${customerId}: ${error.message}`);
    }
  }

  /**
   * Validate customer login token
   */
  async validateLoginToken(customerId, token) {
    try {
      const query = `
        SELECT customer_number, account_name, login_code, login_code_expires, route_number
        FROM ${this.tableName} 
        WHERE customer_number = ? AND login_code = ? AND is_active = 1
      `;

      const customer = await db.get(query, [customerId, token]);
      
      if (customer) {
        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(customer.login_code_expires);
        
        if (expiresAt <= now) {
          logger.warn('Customer login token expired in repository', { 
            customerId,
            expiresAt: customer.login_code_expires
          });
          return null; // Token expired
        }
        
        logger.info('Customer login token validated in repository', { 
          customerId,
          account: customer.account_name,
          route: customer.route_number
        });
      }
      
      return customer;
    } catch (error) {
      logger.error('Repository: Failed to validate login token', { customerId, error: error.message });
      throw new DatabaseError(`Failed to validate login token: ${error.message}`);
    }
  }
}

module.exports = CustomerRepository;