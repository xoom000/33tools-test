const express = require('express');
const router = express.Router();

// GET /api/orders
router.get('/', async (req, res) => {
  res.json({ message: 'Orders endpoint - coming soon' });
});

module.exports = router;