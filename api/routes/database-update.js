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

// 🗑️ DEPRECATED: CREATE CUSTOMER SHELLS FROM ROUTE OPTIMIZATION (LEGACY - DIRECT DB)
router.post('/create-customer-shells', upload.single('file'), async (req, res) => {
  res.status(410).json({
    error: 'DEPRECATED: Direct customer shell creation is no longer supported',
    message: 'Use /stage-customer-shells for driver validation workflow',
    redirect: '/api/admin/database-update/stage-customer-shells',
    deprecated_since: '2025-08-04',
    reason: 'All customer changes must go through driver validation'
  });
});

// 🆕 STAGE CUSTOMER SHELLS FOR VALIDATION (NEW WORKFLOW)
router.post('/stage-customer-shells', upload.single('file'), async (req, res) => {
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

    // Use batch ID from request or generate new one
    const batchId = req.body.batch_id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // First get comparison to identify customers to add
    const comparison = await routeOptimizationService.compareCustomerData(req.file.path);
    
    // Stage shells for validation instead of creating them directly
    const stagedShells = await routeOptimizationService.stageCustomerShellsForValidation(
      comparison.customers_to_add, 
      batchId
    );
    
    res.json({
      success: true,
      filename: req.file.originalname,
      batch_id: batchId,
      shells_staged: stagedShells.length,
      staged_shells: stagedShells,
      message: `Successfully staged ${stagedShells.length} customer shells for driver validation`,
      next_step: 'Drivers must validate changes before they are applied to database'
    });
    
  } catch (error) {
    console.error('Customer shell staging failed:', error);
    res.status(500).json({ 
      error: 'Customer shell staging failed',
      details: error.message 
    });
  }
});

// 🆕 STAGE CUSTOMER REMOVALS FOR VALIDATION (NEW WORKFLOW)
router.post('/stage-customer-removals', upload.single('file'), async (req, res) => {
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

    // Use batch ID from request or generate new one
    const batchId = req.body.batch_id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // First get comparison to identify customers to remove
    const comparison = await routeOptimizationService.compareCustomerData(req.file.path);
    
    // Stage removals for validation instead of removing them directly
    const stagedRemovals = await routeOptimizationService.stageCustomerRemovalsForValidation(
      comparison.customers_to_remove, 
      batchId
    );
    
    res.json({
      success: true,
      filename: req.file.originalname,
      batch_id: batchId,
      removals_staged: stagedRemovals.length,
      staged_removals: stagedRemovals,
      message: `Successfully staged ${stagedRemovals.length} customer removals for driver validation`,
      next_step: 'Drivers must validate changes before customers are removed from database'
    });
    
  } catch (error) {
    console.error('Customer removal staging failed:', error);
    res.status(500).json({ 
      error: 'Customer removal staging failed',
      details: error.message 
    });
  }
});

// 🆕 STAGE CUSTOMER UPDATES FOR VALIDATION (NEW WORKFLOW)
router.post('/stage-customer-updates', upload.single('file'), async (req, res) => {
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

    // Use batch ID from request or generate new one
    const batchId = req.body.batch_id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // First get comparison to identify customers to update
    const comparison = await routeOptimizationService.compareCustomerData(req.file.path);
    
    // Stage updates for validation instead of updating them directly
    const stagedUpdates = await routeOptimizationService.stageCustomerUpdatesForValidation(
      comparison.potential_updates, 
      batchId
    );
    
    res.json({
      success: true,
      filename: req.file.originalname,
      batch_id: batchId,
      updates_staged: stagedUpdates.length,
      staged_updates: stagedUpdates,
      message: `Successfully staged ${stagedUpdates.length} customer updates for driver validation`,
      next_step: 'Drivers must validate changes before customer information is updated in database'
    });
    
  } catch (error) {
    console.error('Customer update staging failed:', error);
    res.status(500).json({ 
      error: 'Customer update staging failed',
      details: error.message 
    });
  }
});

// 🆕 STAGE INVENTORY POPULATION FOR VALIDATION (NEW WORKFLOW) 
router.post('/stage-inventory-population', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CustomerMasterAnalysis CSV file uploaded' });
    }

    // Validate file type
    const extension = path.extname(req.file.originalname).toLowerCase();
    if (extension !== '.csv') {
      return res.status(400).json({ 
        error: 'CustomerMasterAnalysis file must be in CSV format',
        received: extension 
      });
    }

    // Get batch ID from request or generate new one
    const batchId = req.body.batch_id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Stage inventory population for validation
    const result = await routeOptimizationService.stageInventoryPopulationForValidation(req.file.path, batchId);
    
    res.json({
      success: true,
      filename: req.file.originalname,
      batch_id: batchId,
      empty_shells_found: result.emptyShellsFound,
      staged_for_validation: result.stagedForValidation,
      staged_changes: result.stagedChanges,
      message: `Successfully staged inventory for ${result.stagedForValidation} customer shells`,
      next_step: 'Drivers must validate changes before inventory is added to database'
    });
    
  } catch (error) {
    console.error('Inventory staging failed:', error);
    res.status(500).json({ 
      error: 'Inventory staging failed',
      details: error.message 
    });
  }
});

// 🗑️ DEPRECATED: POPULATE CUSTOMER SHELLS WITH INVENTORY (LEGACY - DIRECT DB)
router.post('/populate-inventory-shells', upload.single('file'), async (req, res) => {
  res.status(410).json({
    error: 'DEPRECATED: Direct inventory population is no longer supported',
    message: 'Use /stage-inventory-population for driver validation workflow',
    redirect: '/api/admin/database-update/stage-inventory-population',
    deprecated_since: '2025-08-04',
    reason: 'All inventory changes must go through driver validation'
  });
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

// 🆕 DRIVER VALIDATION ENDPOINTS

// GET PENDING CHANGES FOR SPECIFIC ROUTE
router.get('/pending-changes/:routeNumber', async (req, res) => {
  try {
    const { routeNumber } = req.params;
    
    if (!routeNumber || isNaN(routeNumber)) {
      return res.status(400).json({ error: 'Valid route number required' });
    }

    const db = new (require('sqlite3')).Database(require('path').join(__dirname, '../../route33-staging.db'));
    
    const pendingChanges = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          id,
          change_type,
          customer_number,
          customer_name,
          change_data,
          batch_id,
          created_at
        FROM pending_route_changes 
        WHERE route_number = ? AND validated = FALSE
        ORDER BY created_at DESC, customer_number
      `, [routeNumber], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Parse the JSON change_data for easier frontend consumption
    const parsedChanges = pendingChanges.map(change => ({
      ...change,
      change_data: JSON.parse(change.change_data)
    }));

    // Group by batch_id for better organization
    const changesByBatch = parsedChanges.reduce((acc, change) => {
      if (!acc[change.batch_id]) {
        acc[change.batch_id] = [];
      }
      acc[change.batch_id].push(change);
      return acc;
    }, {});

    db.close();

    res.json({
      success: true,
      route_number: parseInt(routeNumber),
      total_pending_changes: parsedChanges.length,
      batches: Object.keys(changesByBatch).length,
      changes_by_batch: changesByBatch,
      all_changes: parsedChanges
    });

  } catch (error) {
    console.error('Failed to get pending changes:', error);
    res.status(500).json({
      error: 'Failed to get pending changes',
      details: error.message
    });
  }
});

// VALIDATE/APPROVE PENDING CHANGES FOR ROUTE
router.post('/validate-changes/:routeNumber', async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const { approved_change_ids, rejected_change_ids } = req.body;

    if (!routeNumber || isNaN(routeNumber)) {
      return res.status(400).json({ error: 'Valid route number required' });
    }

    if (!approved_change_ids || !Array.isArray(approved_change_ids)) {
      return res.status(400).json({ error: 'approved_change_ids array required' });
    }

    const result = await routeOptimizationService.validateRouteChanges(
      parseInt(routeNumber),
      approved_change_ids,
      rejected_change_ids || []
    );

    res.json({
      success: true,
      route_number: parseInt(routeNumber),
      approved_changes: result.approved_changes,
      rejected_changes: result.rejected_changes,
      database_changes_applied: result.database_changes_applied,
      message: `Successfully validated changes for Route ${routeNumber}`
    });

  } catch (error) {
    console.error('Failed to validate changes:', error);
    res.status(500).json({
      error: 'Failed to validate changes',
      details: error.message
    });
  }
});

// GET VALIDATION STATUS FOR ALL ROUTES
router.get('/validation-status', async (req, res) => {
  try {
    const db = new (require('sqlite3')).Database(require('path').join(__dirname, '../../route33-staging.db'));
    
    const validationStatus = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          route_number,
          COUNT(*) as total_changes,
          SUM(CASE WHEN validated = TRUE THEN 1 ELSE 0 END) as validated_changes,
          SUM(CASE WHEN validated = FALSE THEN 1 ELSE 0 END) as pending_changes,
          MIN(created_at) as earliest_change,
          MAX(created_at) as latest_change
        FROM pending_route_changes 
        GROUP BY route_number
        ORDER BY route_number
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    db.close();

    res.json({
      success: true,
      validation_status: validationStatus,
      total_routes_with_changes: validationStatus.length
    });

  } catch (error) {
    console.error('Failed to get validation status:', error);
    res.status(500).json({
      error: 'Failed to get validation status',
      details: error.message
    });
  }
});

module.exports = router;