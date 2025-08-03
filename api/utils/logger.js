/**
 * Simple logging utility for 33 Tools API
 */

const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    // Set log level based on environment
    this.level = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`.trim();
  }

  error(message, context = {}) {
    if (this.level >= LogLevel.ERROR) {
      console.error(this.formatMessage('error', message, context));
    }
  }

  warn(message, context = {}) {
    if (this.level >= LogLevel.WARN) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  info(message, context = {}) {
    if (this.level >= LogLevel.INFO) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  debug(message, context = {}) {
    if (this.level >= LogLevel.DEBUG) {
      console.log(this.formatMessage('debug', message, context));
    }
  }
}

module.exports = new Logger();