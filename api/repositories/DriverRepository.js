/**
 * 33 Tools - Driver Repository
 * 
 * Handles ALL database operations for drivers
 * Separates data access from business logic for better testing and maintenance
 */

const db = require('../utils/database');
const logger = require('../utils/logger');
const { DatabaseError } = require('../middleware/errorHandler');

class DriverRepository {
  constructor() {
    this.tableName = 'drivers';
  }

  /**
   * Find all drivers
   */
  async findAll(activeOnly = true) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];

      if (activeOnly) {
        query += ' WHERE is_active = 1';
      }

      query += ' ORDER BY route_number';

      const drivers = await db.query(query, params);
      
      logger.info('Drivers found in repository', { 
        count: drivers.length,
        activeOnly,
        table: this.tableName
      });
      
      return drivers;
    } catch (error) {
      logger.error('Repository: Failed to find drivers', { activeOnly, error: error.message });
      throw new DatabaseError(`Failed to retrieve drivers: ${error.message}`);
    }
  }

  /**
   * Find driver by ID
   */
  async findById(driverId) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE driver_id = ?`;
      const driver = await db.get(query, [driverId]);
      
      if (driver) {
        logger.info('Driver found by ID in repository', { 
          driverId,
          name: driver.name,
          route: driver.route_number
        });
      }
      
      return driver;
    } catch (error) {
      logger.error('Repository: Failed to find driver by ID', { driverId, error: error.message });
      throw new DatabaseError(`Failed to retrieve driver ${driverId}: ${error.message}`);
    }
  }

  /**
   * Find driver by route number
   */
  async findByRoute(routeNumber) {
    try {
      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE route_number = ? AND is_active = 1
      `;
      
      const driver = await db.get(query, [routeNumber]);
      
      if (driver) {
        logger.info('Driver found by route in repository', { 
          routeNumber,
          driverId: driver.driver_id,
          name: driver.name
        });
      }
      
      return driver;
    } catch (error) {
      logger.error('Repository: Failed to find driver by route', { routeNumber, error: error.message });
      throw new DatabaseError(`Failed to retrieve driver for route ${routeNumber}: ${error.message}`);
    }
  }

  /**
   * Find driver by username
   */
  async findByUsername(username) {
    try {
      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE username = ? AND is_active = 1
      `;
      
      const driver = await db.get(query, [username]);
      
      if (driver) {
        logger.info('Driver found by username in repository', { 
          username,
          driverId: driver.driver_id,
          name: driver.name,
          route: driver.route_number
        });
      }
      
      return driver;
    } catch (error) {
      logger.error('Repository: Failed to find driver by username', { username, error: error.message });
      throw new DatabaseError(`Failed to retrieve driver by username: ${error.message}`);
    }
  }

  /**
   * Create new driver
   */
  async create(driverData) {
    try {
      const {
        name,
        email,
        username,
        password_hash,
        route_number,
        role = 'driver',
        is_active = 1
      } = driverData;

      const query = `
        INSERT INTO ${this.tableName} (
          name, email, username, password_hash, route_number, role, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [name, email, username, password_hash, route_number, role, is_active];
      const result = await db.run(query, params);
      
      logger.info('Driver created in repository', { 
        name,
        username,
        route: route_number,
        role,
        driverId: result.lastID
      });
      
      return { 
        driver_id: result.lastID,
        changes: result.changes 
      };
    } catch (error) {
      logger.error('Repository: Failed to create driver', { driverData: { ...driverData, password_hash: '[HIDDEN]' }, error: error.message });
      throw new DatabaseError(`Failed to create driver: ${error.message}`);
    }
  }

  /**
   * Update driver
   */
  async update(driverId, updateData) {
    try {
      const fields = [];
      const params = [];

      // Build dynamic update query
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined && key !== 'driver_id') {
          fields.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(driverId);

      const query = `
        UPDATE ${this.tableName} 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE driver_id = ?
      `;

      const result = await db.run(query, params);
      
      logger.info('Driver updated in repository', { 
        driverId,
        fieldsUpdated: Object.keys(updateData),
        changes: result.changes
      });
      
      return { 
        driverId,
        changes: result.changes,
        updated: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to update driver', { driverId, updateData: { ...updateData, password_hash: updateData.password_hash ? '[HIDDEN]' : undefined }, error: error.message });
      throw new DatabaseError(`Failed to update driver ${driverId}: ${error.message}`);
    }
  }

  /**
   * Update driver password hash
   */
  async updatePassword(driverId, passwordHash) {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE driver_id = ?
      `;

      const result = await db.run(query, [passwordHash, driverId]);
      
      logger.info('Driver password updated in repository', { 
        driverId,
        changes: result.changes
      });
      
      return { 
        driverId,
        changes: result.changes,
        updated: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to update driver password', { driverId, error: error.message });
      throw new DatabaseError(`Failed to update driver password: ${error.message}`);
    }
  }

  /**
   * Deactivate driver (soft delete)
   */
  async deactivate(driverId) {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP
        WHERE driver_id = ?
      `;

      const result = await db.run(query, [driverId]);
      
      logger.info('Driver deactivated in repository', { 
        driverId,
        changes: result.changes
      });
      
      return { 
        driverId,
        changes: result.changes,
        deactivated: result.changes > 0
      };
    } catch (error) {
      logger.error('Repository: Failed to deactivate driver', { driverId, error: error.message });
      throw new DatabaseError(`Failed to deactivate driver ${driverId}: ${error.message}`);
    }
  }

  /**
   * Get driver statistics
   */
  async getStats(driverId = null) {
    try {
      let query;
      let params = [];

      if (driverId) {
        // Stats for specific driver
        query = `
          SELECT 
            d.driver_id,
            d.name,
            d.route_number,
            COUNT(c.customer_number) as customer_count,
            COUNT(CASE WHEN c.is_active = 1 THEN 1 END) as active_customers
          FROM ${this.tableName} d
          LEFT JOIN customers c ON d.route_number = c.route_number
          WHERE d.driver_id = ? AND d.is_active = 1
          GROUP BY d.driver_id
        `;
        params = [driverId];
      } else {
        // Stats for all drivers
        query = `
          SELECT 
            d.driver_id,
            d.name,
            d.route_number,
            COUNT(c.customer_number) as customer_count,
            COUNT(CASE WHEN c.is_active = 1 THEN 1 END) as active_customers
          FROM ${this.tableName} d
          LEFT JOIN customers c ON d.route_number = c.route_number
          WHERE d.is_active = 1
          GROUP BY d.driver_id
          ORDER BY d.route_number
        `;
      }

      const result = driverId ? 
        await db.get(query, params) : 
        await db.query(query, params);
      
      logger.info('Driver stats retrieved in repository', { 
        driverId: driverId || 'all',
        resultCount: driverId ? (result ? 1 : 0) : (result?.length || 0)
      });
      
      return result;
    } catch (error) {
      logger.error('Repository: Failed to get driver stats', { driverId, error: error.message });
      throw new DatabaseError(`Failed to get driver statistics: ${error.message}`);
    }
  }
}

module.exports = DriverRepository;