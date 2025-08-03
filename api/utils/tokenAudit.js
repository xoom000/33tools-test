const fs = require('fs').promises;
const path = require('path');

class TokenAuditLogger {
  constructor() {
    this.logFile = path.join(process.cwd(), 'token-audit.log');
  }

  /**
   * Log a token event to the audit file
   * @param {Object} event - Token event data
   */
  async logEvent(event) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...event
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(this.logFile, logLine, 'utf8');
      
      console.log(`Token audit logged: ${event.action} ${event.token?.substring(0, 4)}***`);
    } catch (error) {
      console.error('Failed to write token audit log:', error);
    }
  }

  /**
   * Log token generation
   */
  async logGenerated(token, routeNumber, driverName, expiresAt, createdBy = 'admin') {
    await this.logEvent({
      action: 'GENERATED',
      token,
      route: routeNumber,
      driver: driverName,
      expires: expiresAt,
      created_by: createdBy
    });
  }

  /**
   * Log token usage (when driver completes setup)
   */
  async logUsed(token, routeNumber, driverName, setupCompleted = true) {
    await this.logEvent({
      action: 'USED',
      token,
      route: routeNumber,
      driver: driverName,
      setup_completed: setupCompleted
    });
  }

  /**
   * Log token expiration
   */
  async logExpired(token, routeNumber, driverName, reason = 'timeout') {
    await this.logEvent({
      action: 'EXPIRED',
      token,
      route: routeNumber,
      driver: driverName,
      reason
    });
  }

  /**
   * Log token deletion/cleanup
   */
  async logDeleted(token, routeNumber, driverName, reason = 'cleanup') {
    await this.logEvent({
      action: 'DELETED',
      token,
      route: routeNumber,
      driver: driverName,
      reason
    });
  }

  /**
   * Log failed token attempts
   */
  async logFailedAttempt(token, reason, metadata = {}) {
    await this.logEvent({
      action: 'FAILED_ATTEMPT',
      token,
      reason,
      ...metadata
    });
  }

  /**
   * Get audit summary for a specific driver or route
   */
  async getAuditSummary(routeNumber) {
    try {
      const data = await fs.readFile(this.logFile, 'utf8');
      const lines = data.trim().split('\n').filter(line => line);
      
      const events = lines
        .map(line => JSON.parse(line))
        .filter(event => event.route === routeNumber)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return {
        total_events: events.length,
        tokens_generated: events.filter(e => e.action === 'GENERATED').length,
        tokens_used: events.filter(e => e.action === 'USED').length,
        tokens_expired: events.filter(e => e.action === 'EXPIRED').length,
        events
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { total_events: 0, tokens_generated: 0, tokens_used: 0, tokens_expired: 0, events: [] };
      }
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new TokenAuditLogger();