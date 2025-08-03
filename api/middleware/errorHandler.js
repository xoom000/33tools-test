/**
 * 33 Tools - Mobile-Friendly Error Handling Middleware
 * 
 * Designed for mobile development workflow:
 * - Clear log files for Claude Code to read
 * - User-friendly error messages for customers
 * - Error codes for quick debugging communication
 * - Mobile-optimized error responses
 */

const config = require('../config');
const logger = require('../utils/logger');

/**
 * Custom Error Classes for 33 Tools
 */
class APIError extends Error {
  constructor(message, statusCode = 500, userMessage = null, errorCode = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.userMessage = userMessage || this.getDefaultUserMessage(statusCode);
    this.errorCode = errorCode || this.generateErrorCode();
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // This is an expected error, not a bug
  }

  getDefaultUserMessage(statusCode) {
    const messages = {
      400: 'Please check your input and try again',
      401: 'Access denied - please log in',
      403: 'You don\'t have permission for this action',
      404: 'The requested item was not found',
      409: 'This conflicts with existing data',
      422: 'The provided data is invalid',
      429: 'Too many requests - please wait a moment',
      500: 'Something went wrong on our end - we\'re looking into it'
    };
    return messages[statusCode] || 'An unexpected error occurred';
  }

  generateErrorCode() {
    // Generate a 6-character error code for easy communication
    // Format: E + 5 random chars (E7A2F1)
    return 'E' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
}

/**
 * Authentication Error
 */
class AuthError extends APIError {
  constructor(message, userMessage = 'Authentication failed - please log in again') {
    super(message, 401, userMessage, 'AUTH');
  }
}

/**
 * Validation Error  
 */
class ValidationError extends APIError {
  constructor(message, field = null, userMessage = null) {
    const defaultMessage = field ? 
      `Please check the ${field} field and try again` : 
      'Please check your input and try again';
    
    super(message, 422, userMessage || defaultMessage, 'VALID');
    this.field = field;
  }
}

/**
 * Database Error
 */
class DatabaseError extends APIError {
  constructor(message, userMessage = 'Database temporarily unavailable - please try again') {
    super(message, 500, userMessage, 'DB');
  }
}

/**
 * Route/Customer Not Found Error
 */
class NotFoundError extends APIError {
  constructor(resource = 'item', userMessage = null) {
    const message = `${resource} not found`;
    const defaultUserMessage = userMessage || `The requested ${resource} was not found`;
    super(message, 404, defaultUserMessage, 'NOTFND');
    this.resource = resource;
  }
}

/**
 * Business Logic Error (like token expired, route mismatch)
 */
class BusinessError extends APIError {
  constructor(message, userMessage, statusCode = 400) {
    super(message, statusCode, userMessage, 'BIZ');
  }
}

/**
 * Main Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with context for debugging
  const errorContext = {
    errorCode: err.errorCode || 'UNKNOWN',
    message: err.message,
    statusCode: err.statusCode || 500,
    userMessage: err.userMessage,
    url: req.originalUrl,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    timestamp: new Date().toISOString(),
    stack: err.stack
  };

  // Log based on error severity
  if (err.statusCode >= 500) {
    logger.error('Server Error', errorContext);
  } else if (err.statusCode >= 400) {
    logger.warn('Client Error', errorContext);
  } else {
    logger.info('Error Handled', errorContext);
  }

  // Prepare response for client
  const response = {
    success: false,
    error: {
      code: err.errorCode || 'UNKNOWN',
      message: err.userMessage || 'An error occurred',
      timestamp: err.timestamp || new Date().toISOString()
    }
  };

  // Add technical details in development mode
  if (config.server.environment === 'development') {
    response.debug = {
      technical_message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    };
  }

  // Add field-specific errors for validation
  if (err instanceof ValidationError && err.field) {
    response.error.field = err.field;
  }

  // Mobile-friendly error page for browser requests
  const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
  
  if (!acceptsJson && err.statusCode >= 400 && err.statusCode < 500) {
    // Return a mobile-friendly HTML error page
    const htmlResponse = generateMobileErrorPage(err, req);
    return res.status(err.statusCode || 500).send(htmlResponse);
  }

  // JSON response for API calls
  res.status(err.statusCode || 500).json(response);
};

/**
 * Generate Mobile-Friendly Error Page
 */
function generateMobileErrorPage(err, req) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>33 Tools - Error ${err.errorCode}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .error-code {
            font-size: 24px;
            font-weight: bold;
            color: #f87171;
            margin-bottom: 16px;
        }
        .error-message {
            font-size: 18px;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .error-details {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 14px;
            text-align: left;
        }
        .back-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .back-button:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">Error ${err.errorCode}</div>
        <div class="error-message">${err.userMessage}</div>
        <div class="error-details">
            <strong>What happened:</strong><br>
            ${err.message}<br><br>
            <strong>When:</strong><br>
            ${new Date().toLocaleString()}<br><br>
            <strong>For debugging:</strong><br>
            ${req.method} ${req.originalUrl}
        </div>
        <a href="/" class="back-button">← Back to 33 Tools</a>
    </div>
</body>
</html>`;
}

/**
 * Async Error Wrapper for Route Handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Handler for Unknown Routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError('endpoint', `The URL ${req.originalUrl} was not found`);
  next(error);
};

module.exports = {
  APIError,
  AuthError,
  ValidationError,
  DatabaseError,
  NotFoundError,
  BusinessError,
  errorHandler,
  asyncHandler,
  notFoundHandler
};