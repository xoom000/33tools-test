const express = require('express');
const router = express.Router();

// GET /api/reports/route-load
router.get('/route-load', async (req, res) => {
  res.json({ message: 'Route load reports - coming soon' });
});

// GET /api/reports/inventory
router.get('/inventory', async (req, res) => {
  res.json({ message: 'Inventory reports - coming soon' });
});

module.exports = router;