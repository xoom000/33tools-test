const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const compression = require('compression');
const config = require('../api/config');

const app = express();

// NOTE: Don't parse body for proxy - let the proxy handle raw requests

// CRITICAL SECURITY: Implement Content Security Policy and security headers
app.use((req, res, next) => {
  // Content Security Policy - Prevents XSS attacks
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self';"
  );
  
  // Additional security headers
  res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Legacy XSS protection
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); // Control referrer info
  
  next();
});

// Critical Performance Optimization: Enable compression
app.use(compression({
  level: 6, // Good balance between compression and CPU usage
  threshold: 1024, // Only compress if larger than 1KB
  filter: (req, res) => {
    // Don't compress if the request includes a cache-control no-transform directive
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

// Proxy API calls to backend - add back the /api prefix that gets stripped
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${config.server.port}`,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/(.*)': '/api/$1'  // Add /api prefix to whatever path remains
  }
}));

// Performance: Add caching headers for static assets
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: false, // Disable ETags for better caching
  setHeaders: (res, path) => {
    // Different caching strategies for different file types
    if (path.endsWith('.html')) {
      // HTML files should not be cached (for SPA routing)
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css)$/)) {
      // JS/CSS files with hash in filename can be cached long-term
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2)$/)) {
      // Images and fonts can be cached for a month
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }
}));

// Handle React routing - send all non-API requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Add error handling to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - keep server running
});

// Add error handling to the server
const server = app.listen(config.server.frontendPort, () => {
  console.log(`33 Tools Frontend Proxy running on http://localhost:${config.server.frontendPort}`);
  console.log(`API calls /api/* will be proxied to http://localhost:${config.server.port}`);
  console.log(`Serving React build from: ${path.join(__dirname, 'build')}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.server.frontendPort} is already in use`);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});