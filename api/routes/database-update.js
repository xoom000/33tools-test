const express = require('express');
const multer = require('multer');
const path = require('path');
const { DatabaseUpdateService } = require('../services/databaseUpdateService');
const { RouteOptimizationService } = require('../services/routeOptimizationService');

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
const routeOptimizationService = new RouteOptimizationService();

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

    // Get admin user info for security and logging
    const adminUser = req.user; // Assumes authentication middleware sets req.user
    
    const result = await databaseUpdateService.applyUpdates(updateId, selectedChanges, adminUser);
    
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

    // Get admin user info for security check
    const adminUser = req.user;
    
    const result = await databaseUpdateService.rollbackUpdates(updateId, adminUser);
    
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

// ROUTE OPTIMIZATION COMPARISON ENDPOINT
router.post('/route-optimization-compare', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No RouteOptimization CSV file uploaded' });
    }

    // Validate file type
    const extension = path.extname(req.file.originalname).toLowerCase();
    if (extension !== '.csv') {
      return res.status(400).json({ 
        error: 'RouteOptimization file must be in CSV format',
        received: extension 
      });
    }

    console.log('Processing RouteOptimization CSV:', req.file.originalname);
    
    const comparison = await routeOptimizationService.compareCustomerData(req.file.path);
    
    res.json({
      success: true,
      filename: req.file.originalname,
      ...comparison
    });
    
  } catch (error) {
    console.error('RouteOptimization comparison failed:', error);
    res.status(500).json({ 
      error: 'RouteOptimization comparison failed',
      details: error.message 
    });
  }
});

// 🔄 NIGEL'S BACKUP MANAGEMENT ENDPOINTS - Admin Only

// CREATE MANUAL BACKUP
router.post('/backup/create', async (req, res) => {
  try {
    const adminUser = req.user;
    const { reason = 'manual' } = req.body;
    
    const backup = await databaseUpdateService.createDatabaseBackup(reason);
    
    res.json({
      success: true,
      message: 'Database backup created successfully',
      ...backup
    });
    
  } catch (error) {
    console.error('Manual backup failed:', error);
    res.status(500).json({ 
      error: 'Backup creation failed',
      details: error.message 
    });
  }
});

// LIST AVAILABLE BACKUPS
router.get('/backups', async (req, res) => {
  try {
    const adminUser = req.user;
    
    const backups = await databaseUpdateService.getAvailableBackups(adminUser);
    
    res.json({
      success: true,
      backups,
      count: backups.length
    });
    
  } catch (error) {
    console.error('Failed to list backups:', error);
    res.status(500).json({ 
      error: 'Failed to list backups',
      details: error.message 
    });
  }
});

// RESTORE FROM SPECIFIC BACKUP
router.post('/restore', async (req, res) => {
  try {
    const adminUser = req.user;
    const { backupPath } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({ error: 'Backup path required' });
    }
    
    const result = await databaseUpdateService.restoreFromBackup(backupPath, adminUser);
    
    res.json(result);
    
  } catch (error) {
    console.error('Database restore failed:', error);
    res.status(500).json({ 
      error: 'Database restore failed',
      details: error.message 
    });
  }
});

module.exports = router;