const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const xml2js = require('xml2js');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

// COMPOSE, NEVER DUPLICATE - Ultimate Database Update Engine! ⚔️
class DatabaseUpdateService {
  constructor() {
    this.pendingUpdates = new Map(); // Store preview data temporarily
    this.updateHistory = [];
    this.dbPath = process.env.NODE_ENV === 'test' ? 
      path.join(__dirname, '../../route33-testing.db') :
      path.join(__dirname, '../../route33-staging.db');
  }

  // MAIN FILE PROCESSING PIPELINE
  async processFile({ filePath, originalName, updateType, options = {} }) {
    const updateId = uuidv4();
    const extension = path.extname(originalName).toLowerCase();
    
    try {
      console.log(`Processing ${extension} file for ${updateType} updates`);
      
      // Step 1: Parse file based on format
      let parsedData;
      switch (extension) {
        case '.csv':
          parsedData = await this.parseCSV(filePath);
          break;
        case '.xlsx':
          parsedData = await this.parseXLSX(filePath);
          break;
        case '.xml':
          parsedData = await this.parseXML(filePath);
          break;
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.pdf':
          parsedData = await this.parseImage(filePath); // 🚀 FUTURE: OCR processing
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      // Step 2: Validate and map data to database schema
      const mappedData = await this.mapDataToSchema(parsedData, updateType);
      
      // Step 3: Generate preview of changes
      const changes = await this.generateChangePreview(mappedData, updateType);
      
      // Step 4: Store for later application
      const updateInfo = {
        updateId,
        originalName,
        updateType,
        options,
        changes,
        mappedData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      this.pendingUpdates.set(updateId, updateInfo);
      
      // Step 5: Return preview results
      return {
        updateId,
        totalChanges: changes.length,
        newRecords: changes.filter(c => c.action === 'create').length,
        updates: changes.filter(c => c.action === 'update').length,
        conflicts: changes.filter(c => c.conflict).length,
        changes: changes.slice(0, 100), // Limit preview to first 100
        summary: this.generateSummary(changes, updateType)
      };
      
    } catch (error) {
      console.error('File processing failed:', error);
      throw error;
    } finally {
      // Clean up uploaded file
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.warn('Failed to clean up uploaded file:', e.message);
      }
    }
  }

  // CSV PARSER
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = require('fs').createReadStream(filePath);
      
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  // XLSX PARSER
  async parseXLSX(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  // XML PARSER
  async parseXML(filePath) {
    const xmlData = await fs.readFile(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    
    // Flatten XML structure to array of objects
    return this.flattenXMLData(result);
  }

  // IMAGE PARSER (Future: OCR Integration)
  async parseImage(filePath) {
    // 🚀 FUTURE IMPLEMENTATION:
    // - Use Tesseract.js for OCR
    // - Extract text from images
    // - Parse structured data from receipts/documents
    // - AI-powered data extraction
    
    throw new Error('Image processing not yet implemented - coming soon! 🚀');
  }

  // DATA MAPPING TO DATABASE SCHEMA
  async mapDataToSchema(data, updateType) {
    const mappingRules = {
      customers: this.mapCustomerData.bind(this),
      routes: this.mapRouteData.bind(this),
      items: this.mapItemData.bind(this),
      sales: this.mapSalesData.bind(this),
      inventory: this.mapInventoryData.bind(this),
      mixed: this.detectAndMapMixedData.bind(this)
    };

    const mapper = mappingRules[updateType];
    if (!mapper) {
      throw new Error(`Unknown update type: ${updateType}`);
    }

    return await mapper(data);
  }

  // CUSTOMER DATA MAPPING
  async mapCustomerData(data) {
    return data.map(row => {
      // Smart field mapping - handles various CSV column names
      const customerNumber = this.findField(row, ['customer_number', 'customer_num', 'account_number', 'account_num', 'id']);
      const accountName = this.findField(row, ['account_name', 'customer_name', 'name', 'company_name']);
      const address = this.findField(row, ['address', 'street_address', 'address1']);
      const city = this.findField(row, ['city']);
      const state = this.findField(row, ['state', 'st']) || 'CA';
      const zipCode = this.findField(row, ['zip_code', 'zip', 'postal_code']);
      const routeNumber = this.findField(row, ['route_number', 'route', 'route_num']);
      
      return {
        customer_number: parseInt(customerNumber) || null,
        account_name: accountName,
        address,
        city,
        state,
        zip_code: zipCode,
        route_number: parseInt(routeNumber) || null,
        service_frequency: this.findField(row, ['service_frequency', 'frequency']),
        service_days: this.findField(row, ['service_days', 'days'])
      };
    }).filter(customer => customer.customer_number && customer.account_name);
  }

  // ROUTE DATA MAPPING
  async mapRouteData(data) {
    return data.map(row => ({
      route_number: parseInt(this.findField(row, ['route_number', 'route', 'route_num'])),
      driver_name: this.findField(row, ['driver_name', 'driver', 'name']),
      is_active: this.parseBoolean(this.findField(row, ['is_active', 'active', 'status']))
    })).filter(route => route.route_number && route.driver_name);
  }

  // CHANGE PREVIEW GENERATOR
  async generateChangePreview(mappedData, updateType) {
    const changes = [];
    
    for (const record of mappedData) {
      const existing = await this.findExistingRecord(record, updateType);
      
      if (!existing) {
        changes.push({
          action: 'create',
          record: this.getRecordIdentifier(record, updateType),
          summary: 'New record will be created',
          data: record,
          conflict: false
        });
      } else {
        const differences = this.compareRecords(existing, record);
        if (differences.length > 0) {
          changes.push({
            action: 'update',
            record: this.getRecordIdentifier(record, updateType),
            summary: `${differences.length} fields will be updated: ${differences.join(', ')}`,
            data: record,
            existing,
            differences,
            conflict: this.hasConflicts(existing, record)
          });
        }
      }
    }
    
    return changes;
  }

  // APPLY UPDATES TO DATABASE
  async applyUpdates(updateId, selectedChanges = null, adminUser = null) {
    const updateInfo = this.pendingUpdates.get(updateId);
    if (!updateInfo) {
      throw new Error('Update not found or expired');
    }

    // 🛡️ AUTO-BACKUP: Create backup before any database changes
    console.log(`🛡️ Creating automatic backup before applying updates...`);
    const backup = await this.createDatabaseBackup(`before_update_${updateId.substring(0, 8)}`);
    console.log(`✅ Backup created: ${backup.backupPath}`);

    const db = new sqlite3.Database(this.dbPath);
    const changes = selectedChanges || updateInfo.changes;
    let appliedChanges = 0;
    
    try {
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      for (const change of changes) {
        if (change.action === 'create') {
          await this.insertRecord(db, change.data, updateInfo.updateType);
          appliedChanges++;
        } else if (change.action === 'update') {
          await this.updateRecord(db, change.data, updateInfo.updateType);
          appliedChanges++;
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      
      // Record in history with backup info for rollback
      this.updateHistory.push({
        ...updateInfo,
        status: 'completed',
        appliedChanges,
        completedAt: new Date().toISOString(),
        backupPath: backup.backupPath, // 🔄 Store backup path for rollback
        backupSize: backup.size,
        adminUser: adminUser?.driver_name || 'system'
      });
      
      // Clean up
      this.pendingUpdates.delete(updateId);
      
      return {
        success: true,
        appliedChanges,
        message: `Successfully applied ${appliedChanges} changes`
      };
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      throw error;
    } finally {
      db.close();
    }
  }

  // UTILITY METHODS
  findField(row, possibleNames) {
    for (const name of possibleNames) {
      if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
        return row[name];
      }
    }
    return null;
  }

  parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'active';
    }
    return value === 1;
  }

  async findExistingRecord(record, updateType) {
    // Implementation depends on update type
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      switch (updateType) {
        case 'customers':
          return await this.getQuery(db, 
            'SELECT * FROM customers WHERE customer_number = ?', 
            [record.customer_number]
          );
        case 'routes':
          return await this.getQuery(db, 
            'SELECT * FROM routes WHERE route_number = ?', 
            [record.route_number]
          );
        default:
          return null;
      }
    } finally {
      db.close();
    }
  }

  // DATABASE HELPER METHODS
  async runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  async getQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getRecordIdentifier(record, updateType) {
    switch (updateType) {
      case 'customers':
        return `Customer #${record.customer_number} (${record.account_name})`;
      case 'routes':
        return `Route #${record.route_number} (${record.driver_name})`;
      default:
        return 'Unknown record';
    }
  }

  compareRecords(existing, updated) {
    const differences = [];
    for (const key in updated) {
      if (existing[key] !== updated[key]) {
        differences.push(key);
      }
    }
    return differences;
  }

  hasConflicts(existing, updated) {
    // Define conflict rules based on business logic
    // For now, no conflicts - but could add rules like:
    // - Don't update customer if they have recent orders
    // - Don't change route if driver is currently active
    return false;
  }

  generateSummary(changes, updateType) {
    const creates = changes.filter(c => c.action === 'create').length;
    const updates = changes.filter(c => c.action === 'update').length;
    const conflicts = changes.filter(c => c.conflict).length;
    
    return `${creates} new ${updateType}, ${updates} updates${conflicts > 0 ? `, ${conflicts} conflicts` : ''}`;
  }

  async getUpdateHistory(limit = 50) {
    return this.updateHistory.slice(-limit).reverse();
  }

  // 🔄 NIGEL'S ROLLBACK SYSTEM - Admin Only Database Backup & Restore
  async createDatabaseBackup(reason = 'manual') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(__dirname, `../../database-backups/backup_${timestamp}_${reason}.db`);
      
      console.log(`Creating database backup: ${backupPath}`);
      
      // Create backup directory if it doesn't exist
      const backupDir = path.dirname(backupPath);
      await fs.mkdir(backupDir, { recursive: true });
      
      // Simple file copy backup (more reliable than SQLite .backup API)
      await fs.copyFile(this.dbPath, backupPath);
      
      const stats = require('fs').statSync(backupPath);
      console.log(`✅ Database backup created: ${backupPath} (${stats.size} bytes)`);
      
      return {
        success: true,
        backupPath,
        timestamp,
        reason,
        size: stats.size
      };
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  // 🔄 RESTORE DATABASE FROM BACKUP - Nigel Only!
  async restoreFromBackup(backupPath, adminUser = null) {
    try {
      // Security check - only Nigel can restore
      if (!adminUser || adminUser.route_number !== 33 || adminUser.driver_name !== 'Nigel Whaley') {
        throw new Error('Unauthorized: Only Nigel can restore database backups');
      }

      console.log(`🚨 RESTORE INITIATED by ${adminUser.driver_name}: ${backupPath}`);
      
      // Verify backup file exists
      const fullBackupPath = backupPath.startsWith('/') ? 
        backupPath : 
        path.join(__dirname, `../../database-backups/${backupPath}`);
        
      await fs.access(fullBackupPath);
      
      // Create a safety backup of current state before restore
      const safetyBackup = await this.createDatabaseBackup('pre_restore_safety');
      
      // Perform restore by copying backup over current database
      await fs.copyFile(fullBackupPath, this.dbPath);
      
      console.log(`✅ Database restored from: ${fullBackupPath}`);
      console.log(`🛡️ Safety backup created: ${safetyBackup.backupPath}`);
      
      // Log the restore action
      this.updateHistory.push({
        id: uuidv4(),
        action: 'database_restore',
        timestamp: new Date().toISOString(),
        admin: adminUser.driver_name,
        backupPath: fullBackupPath,
        safetyBackup: safetyBackup.backupPath,
        success: true
      });
      
      return {
        success: true,
        message: 'Database successfully restored',
        restoredFrom: fullBackupPath,
        safetyBackup: safetyBackup.backupPath,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Database restore failed:', error);
      throw error;
    }
  }

  // 📋 LIST AVAILABLE BACKUPS - Admin Only
  async getAvailableBackups(adminUser = null) {
    try {
      // Security check - only Nigel can see backups
      if (!adminUser || adminUser.route_number !== 33) {
        throw new Error('Unauthorized: Only admin can view backups');
      }

      const backupDir = path.join(__dirname, '../../database-backups');
      
      try {
        const files = await fs.readdir(backupDir);
        const backups = [];
        
        for (const file of files) {
          if (file.endsWith('.db')) {
            const filePath = path.join(backupDir, file);
            const stats = await fs.stat(filePath);
            
            // Parse filename for metadata
            const match = file.match(/backup_(.+?)_(.+?)\.db$/);
            const timestamp = match ? match[1].replace(/-/g, ':') : 'unknown';
            const reason = match ? match[2] : 'unknown';
            
            backups.push({
              filename: file,
              fullPath: filePath,
              timestamp,
              reason,
              size: stats.size,
              created: stats.mtime.toISOString(),
              ageMinutes: Math.round((Date.now() - stats.mtime.getTime()) / 60000)
            });
          }
        }
        
        // Sort by creation time, newest first
        return backups.sort((a, b) => new Date(b.created) - new Date(a.created));
        
      } catch (err) {
        // Backup directory doesn't exist yet
        return [];
      }
      
    } catch (error) {
      console.error('Failed to get backup list:', error);
      throw error;
    }
  }

  // 🔄 ROLLBACK SPECIFIC UPDATE - Now implemented!
  async rollbackUpdates(updateId, adminUser = null) {
    try {
      // Security check - only Nigel can rollback
      if (!adminUser || adminUser.route_number !== 33) {
        throw new Error('Unauthorized: Only admin can rollback updates');
      }

      // Find the update in history
      const update = this.updateHistory.find(u => u.id === updateId);
      if (!update) {
        throw new Error(`Update ${updateId} not found in history`);
      }

      if (!update.backupPath) {
        throw new Error(`No backup available for update ${updateId}`);
      }

      console.log(`🔄 ROLLBACK requested by ${adminUser.driver_name} for update: ${updateId}`);
      
      // Restore from the backup that was created before this update
      return await this.restoreFromBackup(update.backupPath, adminUser);
      
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}

module.exports = { DatabaseUpdateService };