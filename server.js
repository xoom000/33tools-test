require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const database = require('./api/utils/database');
const config = require('./api/config');
const { errorHandler, notFoundHandler } = require('./api/middleware/errorHandler');

// Import routes
const routesRouter = require('./api/routes/routes');
const customersRouter = require('./api/routes/customers');
const itemsRouter = require('./api/routes/items');
const ordersRouter = require('./api/routes/orders');
const serviceRouter = require('./api/routes/service');
const reportsRouter = require('./api/routes/reports');
const orderRequestsRouter = require('./api/routes/order-requests');
const deliveriesRouter = require('./api/routes/deliveries');
const adminRouter = require('./api/routes/admin');
const driversRouter = require('./api/routes/drivers');
const configRouter = require('./api/routes/config');
const debugRouter = require('./api/routes/debug');
const morningPrepRouter = require('./api/routes/morning-prep');
const databaseUpdateRouter = require('./api/routes/database-update');
const devTransferRouter = require('./api/routes/dev-transfer');
const reliefDriverRouter = require('./api/routes/relief-driver');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan(config.logging.format));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.server.environment,
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/routes', routesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/service', serviceRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/order-requests', orderRequestsRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/config', configRouter);
app.use('/api/debug', debugRouter);
app.use('/api/morning-prep', morningPrepRouter);
app.use('/api/admin/database-update', databaseUpdateRouter);
app.use('/api/dev-transfer', devTransferRouter);
app.use('/api/relief-driver', reliefDriverRouter);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler with mobile-friendly responses
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await database.connect();
    
    app.listen(config.server.port, () => {
      console.log(`33 Tools API server running on port ${config.server.port}`);
      console.log(`Environment: ${config.server.environment}`);
      console.log(`Active routes: ${Object.keys(config.routes).join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

startServer();