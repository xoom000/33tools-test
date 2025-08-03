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
  async applyUpdates(updateId, selectedChanges = null) {
    const updateInfo = this.pendingUpdates.get(updateId);
    if (!updateInfo) {
      throw new Error('Update not found or expired');
    }

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
      
      // Record in history
      this.updateHistory.push({
        ...updateInfo,
        status: 'completed',
        appliedChanges,
        completedAt: new Date().toISOString()
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
}

module.exports = { DatabaseUpdateService };