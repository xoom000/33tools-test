// Simple error logging for debugging auth issues
class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.logs.push(logEntry);
    
    // Console output
    const style = this.getConsoleStyle(level);
    console.log(`%c[${level.toUpperCase()}] ${message}`, style, data || '');
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  getConsoleStyle(level) {
    const styles = {
      error: 'color: #ff4444; font-weight: bold;',
      warn: 'color: #ffaa00; font-weight: bold;', 
      info: 'color: #44aaff;',
      debug: 'color: #888888;'
    };
    return styles[level] || styles.info;
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  // Get searchable logs
  getLogs() {
    return this.logs;
  }

  // Search logs
  search(query) {
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(query.toLowerCase()) ||
      (log.data && JSON.stringify(log.data).toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Export logs for debugging
  export() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global logger instance
const logger = new Logger();

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.logger = logger;
}

export default logger;