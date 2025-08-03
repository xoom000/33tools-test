const db = require('../utils/database');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const config = require('../config');
const tokenAudit = require('../utils/tokenAudit');

class DriverService {
  /**
   * Authenticate a driver with route number and password
   */
  async authenticateDriver(routeNumber, password) {
    try {
      const query = `
        SELECT driver_id, name, email, route_number, role, is_active, password_hash
        FROM drivers 
        WHERE route_number = ? AND is_active = 1
      `;
      
      const driver = await db.get(query, [routeNumber]);
      
      if (!driver) {
        logger.warn('Driver authentication failed', { 
          routeNumber, 
          reason: 'Driver not found' 
        });
        return null;
      }
      
      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password, driver.password_hash);
      if (!passwordMatch) {
        logger.warn('Driver authentication failed', { 
          routeNumber, 
          reason: 'Invalid password' 
        });
        return null;
      }

      logger.info('Driver authenticated successfully', { 
        driverId: driver.driver_id,
        routeNumber: driver.route_number,
        role: driver.role
      });

      // Don't return sensitive data
      const { password_hash, ...safeDriverData } = driver;
      return safeDriverData;
    } catch (error) {
      logger.error('Driver authentication error', { 
        error: error.message,
        routeNumber 
      });
      throw error;
    }
  }

  /**
   * Authenticate a driver with username and password
   */
  async authenticateDriverByUsername(username, password) {
    try {
      const query = `
        SELECT driver_id, name, email, username, route_number, role, is_active, password_hash
        FROM drivers 
        WHERE username = ? AND is_active = 1
      `;
      
      const driver = await db.get(query, [username]);
      
      if (!driver) {
        logger.warn('Driver authentication failed', { 
          username, 
          reason: 'Driver not found' 
        });
        return null;
      }
      
      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password, driver.password_hash);
      if (!passwordMatch) {
        logger.warn('Driver authentication failed', { 
          username, 
          reason: 'Invalid password' 
        });
        return null;
      }

      logger.info('Driver authenticated successfully', { 
        driverId: driver.driver_id,
        username: driver.username,
        routeNumber: driver.route_number,
        role: driver.role
      });

      // Don't return sensitive data
      const { password_hash, ...safeDriverData } = driver;
      return safeDriverData;
    } catch (error) {
      logger.error('Driver authentication error', { 
        error: error.message,
        username 
      });
      throw error;
    }
  }

  /**
   * Get driver info by route number
   */
  async getDriverByRoute(routeNumber) {
    try {
      const query = `
        SELECT driver_id, name, email, route_number, role, is_active
        FROM drivers 
        WHERE route_number = ? AND is_active = 1
      `;
      
      const driver = await db.get(query, [routeNumber]);
      return driver;
    } catch (error) {
      logger.error('Error fetching driver by route', { 
        error: error.message,
        routeNumber 
      });
      throw error;
    }
  }

  /**
   * Get all active drivers (admin only)
   */
  async getAllDrivers() {
    try {
      const query = `
        SELECT driver_id, name, email, route_number, role, is_active, created_at
        FROM drivers 
        WHERE is_active = 1
        ORDER BY route_number
      `;
      
      const drivers = await db.all(query);
      return drivers;
    } catch (error) {
      logger.error('Error fetching all drivers', { error: error.message });
      throw error;
    }
  }

  /**
   * Update driver password (admin function)
   */
  async updateDriverPassword(driverId, newPassword) {
    try {
      // Hash the password before storing
      const saltRounds = config.auth.saltRounds;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      const query = `
        UPDATE drivers 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE driver_id = ?
      `;
      
      const result = await db.run(query, [hashedPassword, driverId]);
      
      if (result.changes === 0) {
        throw new Error('Driver not found or no changes made');
      }

      logger.info('Driver password updated', { driverId });
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      logger.error('Error updating driver password', { 
        error: error.message,
        driverId 
      });
      throw error;
    }
  }

  /**
   * Create driver session token (simple approach)
   */
  generateDriverToken(driverData) {
    const timestamp = Date.now();
    const tokenData = {
      driver_id: driverData.driver_id,
      route_number: driverData.route_number,
      role: driverData.role,
      timestamp
    };
    
    // Simple base64 encoding (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    return token;
  }

  /**
   * Verify driver session token
   */
  verifyDriverToken(token) {
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - tokenData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge > maxAge) {
        return null;
      }
      
      return tokenData;
    } catch (error) {
      logger.warn('Invalid driver token', { error: error.message });
      return null;
    }
  }

  /**
   * Validate driver setup token
   */
  async validateSetupToken(token) {
    try {
      const query = `
        SELECT dst.*, r.driver_name
        FROM driver_setup_tokens dst
        LEFT JOIN routes r ON dst.route_number = r.route_number
        WHERE dst.token = ? AND dst.used_at IS NULL AND dst.expires_at > datetime('now')
      `;
      
      const tokenData = await db.get(query, [token]);
      
      if (!tokenData) {
        logger.warn('Invalid or expired setup token', { 
          token: token.substring(0, 4) + '***' 
        });
        
        // Log failed attempt to audit trail
        await tokenAudit.logFailedAttempt(token, 'invalid_or_expired', {
          attempted_at: new Date().toISOString(),
          ip_address: 'unknown' // Could be passed from request if needed
        });
        
        return null;
      }

      return tokenData;
    } catch (error) {
      logger.error('Error validating setup token', { 
        error: error.message,
        token: token.substring(0, 4) + '***'
      });
      throw error;
    }
  }

  /**
   * Create driver account from setup token
   */
  async createDriverAccount({ token, username, password, route_number, driver_name }) {
    try {
      // Start a transaction
      await db.run('BEGIN TRANSACTION');

      // Check if username already exists
      const existingUser = await db.get(
        'SELECT username FROM drivers WHERE username = ?', 
        [username]
      );
      
      if (existingUser) {
        await db.run('ROLLBACK');
        throw new Error('Username already exists');
      }

      // Hash the password before storing
      const saltRounds = config.auth.saltRounds;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create the driver account
      const insertQuery = `
        INSERT INTO drivers (name, username, password_hash, route_number, role, is_active)
        VALUES (?, ?, ?, ?, 'Driver', 1)
      `;
      
      const result = await db.run(insertQuery, [
        driver_name,
        username, 
        hashedPassword, // Now properly hashed!
        route_number
      ]);

      // Mark the setup token as used
      await db.run(
        'UPDATE driver_setup_tokens SET used_at = datetime("now") WHERE token = ?',
        [token]
      );

      // Log token usage to audit trail
      await tokenAudit.logUsed(token, route_number, driver_name, true);

      await db.run('COMMIT');

      // Get the created driver data
      const newDriver = await db.get(
        'SELECT * FROM drivers WHERE driver_id = ?',
        [result.lastID]
      );

      // Generate auth token
      const authToken = this.generateDriverToken(newDriver);

      logger.info('Driver account created from setup token', {
        driver_id: result.lastID,
        username,
        route_number
      });

      return {
        driver_id: result.lastID,
        name: newDriver.name,
        username: newDriver.username,
        route_number: newDriver.route_number,
        role: newDriver.role,
        auth_token: authToken
      };

    } catch (error) {
      await db.run('ROLLBACK');
      logger.error('Error creating driver account', { 
        error: error.message,
        username 
      });
      throw error;
    }
  }

  /**
   * Validate time-limited demo token
   */
  async validateDemoToken(token) {
    try {
      const query = `
        SELECT *,
          (julianday(expires_at) - julianday('now')) * 24 * 60 as time_remaining_minutes
        FROM demo_tokens 
        WHERE token = ? AND expires_at > datetime('now')
      `;
      
      const tokenData = await db.get(query, [token]);
      
      if (!tokenData) {
        logger.warn('Invalid or expired demo token', { 
          token: token.substring(0, 4) + '***' 
        });
        return null;
      }

      // Update last accessed time
      await db.run(
        'UPDATE demo_tokens SET last_accessed = datetime("now") WHERE token = ?',
        [token]
      );

      return tokenData;
    } catch (error) {
      logger.error('Error validating demo token', { 
        error: error.message,
        token: token.substring(0, 4) + '***'
      });
      throw error;
    }
  }
}

module.exports = new DriverService();