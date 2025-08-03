const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const customerService = require('../services/customerService');
const { 
  ValidationError, 
  NotFoundError, 
  asyncHandler 
} = require('../middleware/errorHandler');

// Enhanced validation middleware with error codes
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new ValidationError(
      `Validation failed: ${firstError.msg}`,
      firstError.param,
      `Please check the ${firstError.param} field: ${firstError.msg}`
    );
  }
  next();
};

// GET /api/customers - List all customers with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const { route_number, service_day, city, active } = req.query;
  const filters = { route_number, service_day, city, active };
  
  const customers = await customerService.getAllCustomers(filters);
  res.json({ 
    success: true,
    count: customers.length,
    customers,
    message: `Found ${customers.length} customers`
  });
}));

// GET /api/customers/:id - Get specific customer
router.get('/:id', asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  if (!customer) {
    throw new NotFoundError('customer', `Customer account ${req.params.id} was not found`);
  }
  
  res.json({
    success: true,
    customer,
    message: `Customer ${customer.account_name} retrieved successfully`
  });
}));

// POST /api/customers - Create new customer
router.post('/', [
  body('account_name').notEmpty().trim(),
  body('route_number').isInt(),
  body('zip_code').isLength({ min: 5, max: 5 }),
  body('service_frequency').isIn(['Weekly', 'Bi-Weekly', 'Monthly', 'On-Demand']),
  validateRequest
], async (req, res, next) => {
  try {
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', [
  body('zip_code').optional().isLength({ min: 5, max: 5 }),
  body('service_frequency').optional().isIn(['Weekly', 'Bi-Weekly', 'Monthly', 'On-Demand']),
  validateRequest
], async (req, res, next) => {
  try {
    const updated = await customerService.updateCustomer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id/items - Get customer's rental/standing order items
router.get('/:id/items', async (req, res, next) => {
  try {
    const items = await customerService.getCustomerItems(req.params.id);
    res.json({ 
      customer_number: req.params.id,
      count: items.length,
      items 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/:id/items - Add item to customer
router.post('/:id/items', [
  body('item_number').notEmpty(),
  body('quantity').isInt({ min: 1 }),
  body('item_type').isIn(['rental', 'standing_order']),
  validateRequest
], async (req, res, next) => {
  try {
    const item = await customerService.addCustomerItem(req.params.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id/history - Get service history
router.get('/:id/history', async (req, res, next) => {
  try {
    const { start_date, end_date, service_type } = req.query;
    const history = await customerService.getServiceHistory(req.params.id, {
      start_date,
      end_date,
      service_type
    });
    res.json({ 
      customer_number: req.params.id,
      count: history.length,
      history 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/:id/validate - Validate login credentials
router.post('/:id/validate', [
  body('loginCode').notEmpty().withMessage('Login code is required')
], validateRequest, async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { loginCode } = req.body;
    
    const customer = await customerService.validateLogin(customerId, loginCode);
    
    if (!customer) {
      return res.status(401).json({ 
        error: 'Invalid account number or login code' 
      });
    }
    
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/:id/devices - Save device information
router.post('/:id/devices', [
  body('loginCode').notEmpty().withMessage('Login code is required'),
  body('deviceName').notEmpty().withMessage('Device name is required')
], validateRequest, async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { loginCode, deviceName } = req.body;
    
    const result = await customerService.saveDevice(customerId, loginCode, deviceName);
    
    console.log('Device response structure:', JSON.stringify(result, null, 2));
    console.log('Device token:', result.device?.device_token);
    
    res.json({ 
      success: true,
      device: result,
      deviceToken: result.device?.device_token
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id/devices - Get customer's devices
router.get('/:id/devices', async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const devices = await customerService.getCustomerDevices(customerId);
    
    res.json({
      customer_number: customerId,
      count: devices.length,
      devices
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/verify-device - Verify device token and auto-login
router.post('/verify-device', [
  body('deviceToken').notEmpty().withMessage('Device token is required')
], validateRequest, async (req, res, next) => {
  try {
    const { deviceToken } = req.body;
    
    const customerData = await customerService.verifyDeviceToken(deviceToken);
    
    if (!customerData) {
      return res.status(401).json({ error: 'Invalid or expired device token' });
    }
    
    res.json({
      success: true,
      customer: customerData,
      message: 'Device verified, welcome back!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;