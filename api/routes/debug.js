/**
 * 33 Tools - Mobile Debugging Endpoints
 * 
 * Special endpoints designed for Nigel's mobile development workflow:
 * - Quick system status checks from phone
 * - Recent error summaries for Claude Code
 * - Mobile-friendly debugging interface
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config');
const db = require('../utils/database');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * GET /api/debug/status
 * Quick system health check - perfect for phone curl commands
 */
router.get('/status', asyncHandler(async (req, res) => {
  const status = {
    timestamp: new Date().toISOString(),
    system: '33 Tools v2.0',
    environment: config.server.environment,
    ports: {
      api: config.server.port,
      frontend: config.server.frontendPort
    },
    database: 'connected',
    routes: {
      total: Object.keys(config.routes).length,
      active: Object.values(config.routes).filter(r => r.active).length,
      list: Object.keys(config.routes).join(', ')
    }
  };

  // Test database connection
  try {
    const customerCount = await db.get('SELECT COUNT(*) as count FROM customers');
    status.database = `connected (${customerCount.count} customers)`;
  } catch (error) {
    status.database = `error: ${error.message}`;
  }

  res.json({
    success: true,
    status,
    message: '33 Tools system is operational'
  });
}));

/**
 * GET /api/debug/errors
 * Recent error summary for Claude Code debugging
 */
router.get('/errors', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    // Read recent server log entries
    const logPath = path.join(process.cwd(), 'server.log');
    const logContent = await fs.readFile(logPath, 'utf8');
    const logLines = logContent.split('\n').reverse(); // Most recent first
    
    const errors = [];
    const warnings = [];
    
    for (const line of logLines) {
      if (errors.length >= limit && warnings.length >= limit) break;
      
      if (line.includes('ERROR') && errors.length < limit) {
        try {
          const errorData = JSON.parse(line.split('ERROR: ')[1]);
          errors.push({
            timestamp: errorData.timestamp || 'unknown',
            code: errorData.errorCode || 'unknown',
            message: errorData.userMessage || errorData.message,
            url: errorData.url,
            method: errorData.method
          });
        } catch (e) {
          // Skip malformed log entries
        }
      }
      
      if (line.includes('WARN') && warnings.length < limit) {
        try {
          const warnData = JSON.parse(line.split('WARN: ')[1]);
          warnings.push({
            timestamp: warnData.timestamp || 'unknown',
            code: warnData.errorCode || 'unknown',
            message: warnData.userMessage || warnData.message,
            url: warnData.url,
            method: warnData.method
          });
        } catch (e) {
          // Skip malformed log entries
        }
      }
    }

    res.json({
      success: true,
      summary: {
        recent_errors: errors.length,
        recent_warnings: warnings.length,
        total_log_lines: logLines.length
      },
      recent_errors: errors,
      recent_warnings: warnings,
      message: `Found ${errors.length} errors and ${warnings.length} warnings`
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: 'Could not read log file',
      message: 'Log file may not exist or be accessible'
    });
  }
}));

/**
 * GET /api/debug/routes-info
 * Detailed route information for system verification
 */
router.get('/routes-info', asyncHandler(async (req, res) => {
  const routeStats = {};
  
  for (const [routeNum, routeConfig] of Object.entries(config.routes)) {
    try {
      const customerCount = await db.get(
        'SELECT COUNT(*) as count FROM customers WHERE route_number = ?',
        [parseInt(routeNum)]
      );
      
      routeStats[routeNum] = {
        driver: routeConfig.driver,
        active: routeConfig.active,
        customers: customerCount.count,
        service_days: routeConfig.servicesDays,
        is_admin: routeConfig.isAdmin || false
      };
    } catch (error) {
      routeStats[routeNum] = {
        driver: routeConfig.driver,
        active: routeConfig.active,
        customers: 'error',
        error: error.message
      };
    }
  }

  res.json({
    success: true,
    routes: routeStats,
    total_routes: Object.keys(routeStats).length,
    message: 'Route information retrieved successfully'
  });
}));

/**
 * GET /api/debug/mobile
 * Mobile-friendly HTML debug page - perfect for phone browser
 */
router.get('/mobile', asyncHandler(async (req, res) => {
  // Get basic system status
  let systemStatus;
  let customerCount = 'unknown';
  
  try {
    const result = await db.get('SELECT COUNT(*) as count FROM customers');
    customerCount = result.count;
    systemStatus = 'operational';
  } catch (error) {
    systemStatus = 'database error';
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>33 Tools Debug Panel</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            margin: 0;
            padding: 16px;
            min-height: 100vh;
        }
        .debug-panel {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .status-good { color: #22c55e; }
        .status-error { color: #ef4444; }
        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .stat-row:last-child { border-bottom: none; }
        .test-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            margin: 4px;
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .test-button:hover { background: #2563eb; }
        h2 { margin: 0 0 16px 0; font-size: 18px; }
        h3 { margin: 16px 0 8px 0; font-size: 16px; }
        .timestamp { font-size: 12px; opacity: 0.7; }
    </style>
</head>
<body>
    <div class="debug-panel">
        <h2>33 Tools System Status</h2>
        <div class="stat-row">
            <span>System</span>
            <span class="${systemStatus === 'operational' ? 'status-good' : 'status-error'}">
                ${systemStatus}
            </span>
        </div>
        <div class="stat-row">
            <span>Environment</span>
            <span>${config.server.environment}</span>
        </div>
        <div class="stat-row">
            <span>API Port</span>
            <span>${config.server.port}</span>
        </div>
        <div class="stat-row">
            <span>Frontend Port</span>
            <span>${config.server.frontendPort}</span>
        </div>
        <div class="stat-row">
            <span>Total Customers</span>
            <span>${customerCount}</span>
        </div>
        <div class="stat-row">
            <span>Active Routes</span>
            <span>${Object.keys(config.routes).join(', ')}</span>
        </div>
        <div class="timestamp">Last checked: ${new Date().toLocaleString()}</div>
    </div>

    <div class="debug-panel">
        <h3>Quick API Tests</h3>
        <a href="/api/debug/status" class="test-button">System Status JSON</a>
        <a href="/api/debug/errors" class="test-button">Recent Errors</a>
        <a href="/api/debug/routes-info" class="test-button">Routes Info</a>
        <a href="/api/customers?route_number=33" class="test-button">Route 33 Customers</a>
        <a href="/api/config/routes/33" class="test-button">Route 33 Config</a>
        <a href="/health" class="test-button">Health Check</a>
    </div>

    <div class="debug-panel">
        <h3>For Claude Code Debugging</h3>
        <p>Share these URLs for quick debugging:</p>
        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all;">
            curl http://localhost:3334/api/debug/status<br>
            curl http://localhost:3334/api/debug/errors<br>
            curl http://localhost:3334/api/debug/routes-info
        </div>
    </div>
</body>
</html>`;

  res.send(html);
}));

module.exports = router;