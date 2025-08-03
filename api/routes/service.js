const express = require('express');
const router = express.Router();

// GET /api/service/today
router.get('/today', async (req, res) => {
  res.json({ message: 'Service scheduling endpoint - coming soon' });
});

module.exports = router;