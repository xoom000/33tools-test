const express = require('express');
const multer = require('multer');
const path = require('path');
const { DatabaseUpdateService } = require('../services/databaseUpdateService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `upload_${timestamp}${extension}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xml', '.xlsx', '.jpg', '.jpeg', '.png', '.pdf'];
    const extension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${extension}`), false);
    }
  }
});

const databaseUpdateService = new DatabaseUpdateService();

// UPLOAD AND PREVIEW ENDPOINT
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { updateType, options = '{}' } = req.body;
    const parsedOptions = JSON.parse(options);
    
    // Process file and generate preview
    const result = await databaseUpdateService.processFile({
      filePath: req.file.path,
      originalName: req.file.originalname,
      updateType,
      options: parsedOptions
    });

    res.json(result);
  } catch (error) {
    console.error('Upload processing failed:', error);
    res.status(500).json({ 
      error: 'File processing failed',
      details: error.message 
    });
  }
});

// PREVIEW ENDPOINT (Alternative to upload)
router.post('/preview', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { updateType, options = '{}' } = req.body;
    const parsedOptions = JSON.parse(options);
    
    // Force preview mode
    parsedOptions.previewOnly = true;
    
    const result = await databaseUpdateService.processFile({
      filePath: req.file.path,
      originalName: req.file.originalname,
      updateType,
      options: parsedOptions
    });

    res.json(result);
  } catch (error) {
    console.error('Preview failed:', error);
    res.status(500).json({ 
      error: 'Preview failed',
      details: error.message 
    });
  }
});

// APPLY UPDATES ENDPOINT
router.post('/apply', async (req, res) => {
  try {
    const { updateId, selectedChanges } = req.body;
    
    if (!updateId) {
      return res.status(400).json({ error: 'Update ID required' });
    }

    const result = await databaseUpdateService.applyUpdates(updateId, selectedChanges);
    
    res.json(result);
  } catch (error) {
    console.error('Apply updates failed:', error);
    res.status(500).json({ 
      error: 'Apply updates failed',
      details: error.message 
    });
  }
});

// ROLLBACK ENDPOINT
router.post('/rollback', async (req, res) => {
  try {
    const { updateId } = req.body;
    
    if (!updateId) {
      return res.status(400).json({ error: 'Update ID required' });
    }

    const result = await databaseUpdateService.rollbackUpdates(updateId);
    
    res.json(result);
  } catch (error) {
    console.error('Rollback failed:', error);
    res.status(500).json({ 
      error: 'Rollback failed',
      details: error.message 
    });
  }
});

// UPDATE HISTORY ENDPOINT
router.get('/history', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const history = await databaseUpdateService.getUpdateHistory(parseInt(limit));
    
    res.json(history);
  } catch (error) {
    console.error('History fetch failed:', error);
    res.status(500).json({ 
      error: 'History fetch failed',
      details: error.message 
    });
  }
});

// GET UPDATE STATUS
router.get('/status/:updateId', async (req, res) => {
  try {
    const { updateId } = req.params;
    
    const status = await databaseUpdateService.getUpdateStatus(updateId);
    
    res.json(status);
  } catch (error) {
    console.error('Status fetch failed:', error);
    res.status(500).json({ 
      error: 'Status fetch failed',
      details: error.message 
    });
  }
});

module.exports = router;