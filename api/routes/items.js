const express = require('express');
const router = express.Router();
const itemService = require('../services/itemService');

// GET /api/items - List all items with filters
router.get('/', async (req, res, next) => {
  try {
    const { item_type, category, vendor, search, active } = req.query;
    const items = await itemService.getAllItems({
      item_type,
      category,
      vendor,
      search,
      active
    });
    
    res.json({
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/rental - List rental items only
router.get('/rental', async (req, res, next) => {
  try {
    const items = await itemService.getRentalItems();
    res.json({
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/sales - List sales items only
router.get('/sales', async (req, res, next) => {
  try {
    const { category, vendor, search } = req.query;
    const items = await itemService.getSalesItems({ category, vendor, search });
    res.json({
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/categories - Get all categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await itemService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id - Get specific item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id/pricing - Get item pricing
router.get('/:id/pricing', async (req, res, next) => {
  try {
    const { customer_number, quantity } = req.query;
    const pricing = await itemService.getItemPricing(
      req.params.id,
      customer_number,
      quantity
    );
    res.json(pricing);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id/availability - Check item availability
router.get('/:id/availability', async (req, res, next) => {
  try {
    const availability = await itemService.checkAvailability(req.params.id);
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

module.exports = router;