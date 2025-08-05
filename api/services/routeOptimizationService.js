const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

class RouteOptimizationService {
  constructor() {
    // STAGING DATABASE - Use staging database that matches API endpoints
    this.dbPath = path.join(__dirname, '../../route33-staging.db');
    console.log(`🔧 RouteOptimizationService using STAGING database: ${this.dbPath}`);
  }

  /**
   * Compare RouteOptimization CSV against current customer database
   * @param {string} filePath - Path to uploaded CSV file
   * @returns {Object} Comparison results showing additions/removals needed
   */
  async compareCustomerData(filePath) {
    try {
      console.log('Starting RouteOptimization CSV comparison...');
      
      // Step 1: Parse CSV data
      const csvCustomers = await this.parseRouteOptimizationCSV(filePath);
      console.log(`Found ${csvCustomers.length} customers in CSV`);
      
      // Step 2: Get current database customers
      const dbCustomers = await this.getCurrentCustomers();
      console.log(`Found ${dbCustomers.length} customers in database`);
      
      // Step 3: Compare and identify differences
      const comparison = this.performComparison(csvCustomers, dbCustomers);
      
      // Step 4: Generate detailed report
      const report = this.generateComparisonReport(comparison, csvCustomers, dbCustomers);
      
      return report;
      
    } catch (error) {
      console.error('RouteOptimization comparison failed:', error);
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

  /**
   * Parse RouteOptimization CSV and extract customer data
   */
  async parseRouteOptimizationCSV(filePath) {
    return new Promise((resolve, reject) => {
      const customers = [];
      const stream = require('fs').createReadStream(filePath);
      
      stream
        .pipe(csv())
        .on('data', (row) => {
          // Extract customer number from LocationID (first field)
          const locationId = row['LocationID'] || row['﻿LocationID']; // Handle BOM
          if (locationId && locationId.trim()) {
            const territory = row['Territory'] || '';
            
            // 🚫 FILTER OUT: Skip route 1 and route 3 accounts (Territory ending in -01 or -03)
            if (territory.endsWith('-01') || territory.endsWith('-03')) {
              return; // Skip this customer
            }
            
            const customer = {
              customer_number: parseInt(locationId.trim()),
              account_name: row['dlvr_name'] || '',
              address: row['dlvr_Addr'] || '',
              city: row['dlvr_city'] || '',
              state: row['dlvr_state'] || 'CA',
              zip_code: row['dlvr_Zip'] || '',
              territory: territory,
              service_days: this.parseServiceDays(row['DaysVisited'] || ''),
              amount_per_cycle: row['AmountPerCycle'] || '$0',
              account_type: row['AccountTypeID'] || '',
              plant: row['Plant'] || '',
              delivery_id: row['DeliveryID'] || '',
              latitude: parseFloat(row['latitude']) || null,
              longitude: parseFloat(row['longitude']) || null
            };
            
            if (customer.customer_number && !isNaN(customer.customer_number)) {
              customers.push(customer);
            }
          }
        })
        .on('end', () => {
          console.log(`Parsed ${customers.length} valid customers from CSV`);
          resolve(customers);
        })
        .on('error', reject);
    });
  }

  /**
   * Get all current customers from database
   */
  async getCurrentCustomers() {
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      return await this.getAllQuery(db, `
        SELECT 
          customer_number,
          account_name,
          address,
          city,
          state,
          zip_code,
          route_number,
          service_frequency,
          service_days,
          is_active,
          created_at,
          updated_at
        FROM customers 
        WHERE route_number NOT IN (1, 3)
        ORDER BY customer_number
      `);
    } finally {
      db.close();
    }
  }

  /**
   * Perform the comparison between CSV and database customers
   * Uses the same logic as bash commands: comm -23 and comm -13
   */
  performComparison(csvCustomers, dbCustomers) {
    console.log('🔍 Performing customer comparison using comm-style logic...');
    
    // Extract customer numbers and sort them (like bash sort command)
    const csvNumbers = csvCustomers.map(c => c.customer_number).sort((a, b) => a - b);
    const dbNumbers = dbCustomers.map(c => c.customer_number).sort((a, b) => a - b);
    
    // Create Sets for faster lookup
    const csvSet = new Set(csvNumbers);
    const dbSet = new Set(dbNumbers);
    
    console.log(`📊 CSV customers: ${csvNumbers.length}, DB customers: ${dbNumbers.length}`);
    console.log(`🔍 First 10 CSV numbers:`, csvNumbers.slice(0, 10));
    console.log(`🔍 First 10 DB numbers:`, dbNumbers.slice(0, 10));
    console.log(`🔍 Looking for these specific numbers in CSV:`, [323986, 323995, 324517, 325038, 325496]);
    console.log(`🔍 Are they in CSV?`, [323986, 323995, 324517, 325038, 325496].map(n => csvSet.has(n)));
    console.log(`🔍 Are they in DB?`, [323986, 323995, 324517, 325038, 325496].map(n => dbSet.has(n)));
    
    // Find customers to ADD (in CSV but not in DB) - equivalent to comm -23
    const customersToAddNumbers = csvNumbers.filter(num => !dbSet.has(num));
    const toAdd = csvCustomers.filter(c => customersToAddNumbers.includes(c.customer_number));
    
    // Find customers to REMOVE (in DB but not in CSV) - equivalent to comm -13  
    const customersToRemoveNumbers = dbNumbers.filter(num => !csvSet.has(num));
    const toRemove = dbCustomers.filter(c => customersToRemoveNumbers.includes(c.customer_number));
    
    // Find customers that exist in both (potential updates)
    const matchingNumbers = csvNumbers.filter(num => dbSet.has(num));
    const existing = csvCustomers.filter(c => matchingNumbers.includes(c.customer_number));
    const potentialUpdates = [];
    
    existing.forEach(csvCustomer => {
      const dbCustomer = dbCustomers.find(db => db.customer_number === csvCustomer.customer_number);
      const differences = this.compareCustomerRecords(dbCustomer, csvCustomer);
      
      if (differences.length > 0) {
        potentialUpdates.push({
          customer_number: csvCustomer.customer_number,
          csvData: csvCustomer,
          dbData: dbCustomer,
          differences
        });
      }
    });
    
    console.log(`✅ Comparison complete: ${toAdd.length} to add, ${toRemove.length} to remove, ${potentialUpdates.length} updates`);
    
    return {
      toAdd,
      toRemove,
      potentialUpdates,
      csvTotal: csvCustomers.length,
      dbTotal: dbCustomers.length,
      matching: existing.length,
      // Additional debug info
      csvNumbers: csvNumbers,
      dbNumbers: dbNumbers,
      customersToAddNumbers,
      customersToRemoveNumbers
    };
  }

  /**
   * Compare individual customer records to find differences
   */
  compareCustomerRecords(dbCustomer, csvCustomer) {
    const differences = [];
    
    // Compare key fields
    const fieldsToCompare = [
      { db: 'account_name', csv: 'account_name', label: 'Account Name' },
      { db: 'address', csv: 'address', label: 'Address' },
      { db: 'city', csv: 'city', label: 'City' },
      { db: 'state', csv: 'state', label: 'State' },
      { db: 'zip_code', csv: 'zip_code', label: 'Zip Code' }
    ];
    
    fieldsToCompare.forEach(field => {
      const dbValue = (dbCustomer[field.db] || '').toString().trim();
      const csvValue = (csvCustomer[field.csv] || '').toString().trim();
      
      if (dbValue !== csvValue) {
        differences.push({
          field: field.label,
          database: dbValue,
          csv: csvValue
        });
      }
    });
    
    return differences;
  }

  /**
   * Generate comprehensive comparison report
   */
  generateComparisonReport(comparison, csvCustomers, dbCustomers) {
    const { toAdd, toRemove, potentialUpdates, csvTotal, dbTotal, matching } = comparison;
    
    return {
      summary: {
        csv_customers: csvTotal,
        database_customers: dbTotal,
        matching_customers: matching,
        customers_to_add: toAdd.length,
        customers_to_remove: toRemove.length,
        potential_updates: potentialUpdates.length
      },
      
      customers_to_add: toAdd.map(customer => ({
        customer_number: customer.customer_number,
        account_name: customer.account_name,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        territory: customer.territory,
        service_days: customer.service_days,
        amount_per_cycle: customer.amount_per_cycle
      })),
      
      customers_to_remove: toRemove.map(customer => ({
        customer_number: customer.customer_number,
        account_name: customer.account_name,
        address: customer.address,
        city: customer.city,
        last_updated: customer.updated_at,
        is_active: customer.is_active
      })),
      
      potential_updates: potentialUpdates.slice(0, 50), // Limit to first 50 for performance
      
      actions_needed: this.generateActionPlan(toAdd, toRemove, potentialUpdates),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate action plan based on comparison results
   */
  generateActionPlan(toAdd, toRemove, potentialUpdates) {
    const actions = [];
    
    if (toAdd.length > 0) {
      actions.push({
        action: 'ADD_CUSTOMERS',
        priority: 'HIGH',
        count: toAdd.length,
        description: `Add ${toAdd.length} new customers from RouteOptimization data`,
        estimated_time: `${Math.ceil(toAdd.length / 10)} minutes`
      });
    }
    
    if (toRemove.length > 0) {
      actions.push({
        action: 'REVIEW_REMOVALS',
        priority: 'MEDIUM',
        count: toRemove.length,
        description: `Review ${toRemove.length} customers that may no longer be active`,
        estimated_time: `${Math.ceil(toRemove.length / 5)} minutes`
      });
    }
    
    if (potentialUpdates.length > 0) {
      actions.push({
        action: 'UPDATE_CUSTOMER_INFO',
        priority: 'LOW',
        count: potentialUpdates.length,
        description: `Update customer information for ${potentialUpdates.length} existing customers`,
        estimated_time: `${Math.ceil(potentialUpdates.length / 20)} minutes`
      });
    }
    
    if (actions.length === 0) {
      actions.push({
        action: 'NO_CHANGES_NEEDED',
        priority: 'INFO',
        count: 0,
        description: 'Customer database is already in sync with RouteOptimization data',
        estimated_time: '0 minutes'
      });
    }
    
    return actions;
  }

  /**
   * Parse service days from RouteOptimization format
   */
  parseServiceDays(daysVisited) {
    if (!daysVisited) return '';
    
    // Convert RouteOptimization format to our format
    // RouteOptimization uses: M, T, W, R, F, MWF, etc.
    // We use: M, T, W, H, F
    return daysVisited.replace(/R/g, 'H'); // Thursday = R in their system, H in ours
  }

  // Database helper methods
  async getAllQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
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

  async runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  /**
   * Stage customer shell creation for driver validation (NEW WORKFLOW)
   */
  async stageCustomerShellsForValidation(customersToAdd, batchId) {
    if (!customersToAdd || customersToAdd.length === 0) {
      return [];
    }

    console.log(`🏗️ Staging ${customersToAdd.length} customer shells for validation...`);
    
    const db = new sqlite3.Database(this.dbPath);
    const stagedChanges = [];
    
    try {
      // Create backup before staging changes
      const backupResult = await this.createBackup('before_staging_shells');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      for (const customer of customersToAdd) {
        try {
          // Extract route number from territory
          const routeNumber = this.extractRouteFromTerritory(customer.territory);
          
          // Stage the customer creation for validation
          const changeData = {
            customer_number: customer.customer_number,
            account_name: customer.account_name,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            zip_code: customer.zip_code,
            route_number: routeNumber,
            service_frequency: 'Weekly',
            service_days: customer.service_days,
            territory: customer.territory
          };
          
          await this.runQuery(db, `
            INSERT INTO pending_route_changes (
              route_number,
              change_type,
              customer_number,
              customer_name,
              change_data,
              batch_id
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            routeNumber,
            'add_customer',
            customer.customer_number,
            customer.account_name,
            JSON.stringify(changeData),
            batchId
          ]);
          
          stagedChanges.push({
            customer_number: customer.customer_number,
            account_name: customer.account_name,
            route_number: routeNumber,
            status: 'staged_for_validation'
          });
          
          console.log(`✅ Staged shell for validation: ${customer.customer_number} - ${customer.account_name} (Route ${routeNumber})`);
          
        } catch (stageError) {
          console.error(`❌ Failed to stage shell for ${customer.customer_number}:`, stageError.message);
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      console.log(`🎉 Successfully staged ${stagedChanges.length} customer shells for driver validation`);
      
      return stagedChanges;
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      console.error('Shell staging failed, transaction rolled back:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Create customer shells from new customers identified in comparison (LEGACY - DIRECT DB)
   */
  async createCustomerShells(customersToAdd) {
    if (!customersToAdd || customersToAdd.length === 0) {
      return [];
    }

    console.log(`🏗️ Creating ${customersToAdd.length} customer shells...`);
    
    const db = new sqlite3.Database(this.dbPath);
    const shellsCreated = [];
    
    try {
      // Create backup before making changes
      const backupResult = await this.createBackup('before_shell_creation');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      for (const customer of customersToAdd) {
        try {
          // Extract route number from territory (2502-05 → route 5, 2502-33 → route 33)
          const routeNumber = this.extractRouteFromTerritory(customer.territory);
          
          // Create minimal customer shell
          const result = await this.runQuery(db, `
            INSERT INTO customers (
              customer_number,
              account_name,
              address,
              city,
              state,
              zip_code,
              route_number,
              service_frequency,
              service_days,
              is_active,
              created_at,
              updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
          `, [
            customer.customer_number,
            customer.account_name,
            customer.address,
            customer.city,
            customer.state,
            customer.zip_code,
            routeNumber,
            'Weekly', // Default frequency
            customer.service_days,
          ]);
          
          shellsCreated.push({
            customer_number: customer.customer_number,
            account_name: customer.account_name,
            route_number: routeNumber,
            status: 'shell_created'
          });
          
          console.log(`✅ Shell created: ${customer.customer_number} - ${customer.account_name}`);
          
        } catch (insertError) {
          console.error(`❌ Failed to create shell for ${customer.customer_number}:`, insertError.message);
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      console.log(`🎉 Successfully created ${shellsCreated.length} customer shells`);
      
      return shellsCreated;
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      console.error('Shell creation failed, transaction rolled back:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Extract route number from territory field (2502-05 → 5, 2502-33 → 33)
   */
  extractRouteFromTerritory(territory) {
    if (!territory) return null;
    const match = territory.match(/-(\d+)$/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Create database backup
   */
  async createBackup(reason) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, `../../database-backups/backup_${timestamp}_${reason}.db`);
    
    // Create backup directory if it doesn't exist
    const backupDir = path.dirname(backupPath);
    await fs.mkdir(backupDir, { recursive: true });
    
    // Simple file copy backup
    await fs.copyFile(this.dbPath, backupPath);
    
    return { backupPath, timestamp, reason };
  }

  /**
   * Stage customer removals for driver validation (NEW WORKFLOW)
   */
  async stageCustomerRemovalsForValidation(customersToRemove, batchId) {
    if (!customersToRemove || customersToRemove.length === 0) {
      return [];
    }

    console.log(`🗑️ Staging ${customersToRemove.length} customer removals for validation...`);
    
    const db = new sqlite3.Database(this.dbPath);
    const stagedChanges = [];
    
    try {
      // Create backup before staging changes
      const backupResult = await this.createBackup('before_staging_removals');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      for (const customer of customersToRemove) {
        try {
          // Get the route number from the database since it's not in the comparison data
          const dbCustomer = await this.getQuery(db, `
            SELECT route_number FROM customers WHERE customer_number = ?
          `, [customer.customer_number]);
          
          if (!dbCustomer || !dbCustomer.route_number) {
            console.warn(`⚠️ Customer ${customer.customer_number} not found in database or has no route - skipping removal staging`);
            continue;
          }
          
          // Stage the customer removal for validation
          const changeData = {
            customer_number: customer.customer_number,
            account_name: customer.account_name,
            address: customer.address,
            city: customer.city,
            route_number: dbCustomer.route_number,
            reason: 'Not found in RouteOptimization CSV - may no longer be active'
          };
          
          await this.runQuery(db, `
            INSERT INTO pending_route_changes (
              route_number,
              change_type,
              customer_number,
              customer_name,
              change_data,
              batch_id
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            dbCustomer.route_number,
            'remove_customer',
            customer.customer_number,
            customer.account_name,
            JSON.stringify(changeData),
            batchId
          ]);
          
          stagedChanges.push({
            customer_number: customer.customer_number,
            account_name: customer.account_name,
            route_number: dbCustomer.route_number,
            status: 'staged_for_removal_validation'
          });
          
          console.log(`✅ Staged removal for validation: ${customer.customer_number} - ${customer.account_name} (Route ${dbCustomer.route_number})`);
          
        } catch (stageError) {
          console.error(`❌ Failed to stage removal for ${customer.customer_number}:`, stageError.message);
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      console.log(`🎉 Successfully staged ${stagedChanges.length} customer removals for driver validation`);
      
      return stagedChanges;
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      console.error('Removal staging failed, transaction rolled back:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Stage customer updates for driver validation (NEW WORKFLOW)
   */
  async stageCustomerUpdatesForValidation(potentialUpdates, batchId) {
    if (!potentialUpdates || potentialUpdates.length === 0) {
      return [];
    }

    console.log(`📝 Staging ${potentialUpdates.length} customer updates for validation...`);
    
    const db = new sqlite3.Database(this.dbPath);
    const stagedChanges = [];
    
    try {
      // Create backup before staging changes
      const backupResult = await this.createBackup('before_staging_updates');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      for (const update of potentialUpdates) {
        try {
          // Extract route number from CSV data
          const routeNumber = this.extractRouteFromTerritory(update.csvData.territory);
          
          // Stage the customer update for validation
          const changeData = {
            customer_number: update.customer_number,
            account_name: update.csvData.account_name,
            current_data: update.dbData,
            new_data: update.csvData,
            differences: update.differences,
            reason: `${update.differences.length} field(s) need updating: ${update.differences.map(d => d.field).join(', ')}`
          };
          
          await this.runQuery(db, `
            INSERT INTO pending_route_changes (
              route_number,
              change_type,
              customer_number,
              customer_name,
              change_data,
              batch_id
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            routeNumber,
            'update_customer',
            update.customer_number,
            update.csvData.account_name,
            JSON.stringify(changeData),
            batchId
          ]);
          
          stagedChanges.push({
            customer_number: update.customer_number,
            account_name: update.csvData.account_name,
            route_number: routeNumber,
            differences_count: update.differences.length,
            status: 'staged_for_update_validation'
          });
          
          console.log(`✅ Staged update for validation: ${update.customer_number} - ${update.csvData.account_name} (${update.differences.length} changes)`);
          
        } catch (stageError) {
          console.error(`❌ Failed to stage update for ${update.customer_number}:`, stageError.message);
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      console.log(`🎉 Successfully staged ${stagedChanges.length} customer updates for driver validation`);
      
      return stagedChanges;
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      console.error('Update staging failed, transaction rolled back:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Stage inventory population for driver validation (NEW WORKFLOW)
   */
  async stageInventoryPopulationForValidation(filePath, batchId) {
    console.log('🔍 Staging inventory population for driver validation...');
    
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      // Step 1: Find empty customer shells (only those staged for addition in this batch)
      const emptyShells = await this.findEmptyShells(db, batchId);
      console.log(`📋 Found ${emptyShells.length} customer shells staged for addition in batch ${batchId}`);
      
      if (emptyShells.length === 0) {
        return {
          emptyShellsFound: 0,
          stagedForValidation: 0,
          stagedChanges: []
        };
      }
      
      // Step 2: Parse CustomerMasterAnalysis CSV
      const inventoryData = await this.parseCustomerMasterAnalysisCSV(filePath);
      console.log(`📦 Parsed inventory data for ${Object.keys(inventoryData).length} customers`);
      
      // Step 3: Create backup before staging changes
      const backupResult = await this.createBackup('before_staging_inventory');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      // Step 4: Stage inventory additions for validation
      const result = await this.stageInventoryForValidation(db, emptyShells, inventoryData, batchId);
      
      console.log(`🎉 Successfully staged inventory for ${result.stagedForValidation} shells`);
      return result;
      
    } catch (error) {
      console.error('Inventory staging failed:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Stage inventory items for driver validation
   */
  async stageInventoryForValidation(db, emptyShells, inventoryData, batchId) {
    let stagedForValidation = 0;
    const stagedChanges = [];
    
    await this.runQuery(db, 'BEGIN TRANSACTION');
    
    try {
      for (const shell of emptyShells) {
        const customerInventory = inventoryData[shell.customer_number];
        
        if (customerInventory && customerInventory.items.length > 0) {
          console.log(`🔧 Staging ${customerInventory.items.length} items for customer ${shell.customer_number} validation`);
          
          // Stage the inventory addition for this customer
          const changeData = {
            customer_number: shell.customer_number,
            items: customerInventory.items.map(item => ({
              item_number: item.item_number,
              description: item.description,
              quantity: item.regular_qty || item.special_qty || 0,
              item_type: 'rental',
              frequency: item.delivery_freq || 'Weekly',
              unit_price: item.unit_price,
              size_misc: item.size_misc,
              notes: item.size_misc ? `Size: ${item.size_misc}, Price: $${item.unit_price}` : `Price: $${item.unit_price}`
            }))
          };
          
          await this.runQuery(db, `
            INSERT INTO pending_route_changes (
              route_number,
              change_type,
              customer_number,
              customer_name,
              change_data,
              batch_id
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            shell.route_number,
            'add_items',
            shell.customer_number,
            shell.account_name,
            JSON.stringify(changeData),
            batchId
          ]);
          
          stagedChanges.push({
            customer_number: shell.customer_number,
            account_name: shell.account_name,
            route_number: shell.route_number,
            items_to_add: customerInventory.items.length,
            status: 'staged_for_validation'
          });
          
          stagedForValidation++;
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      
      return {
        emptyShellsFound: emptyShells.length,
        stagedForValidation,
        stagedChanges
      };
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      throw error;
    }
  }

  /**
   * Find empty customer shells and populate with inventory from CustomerMasterAnalysis CSV (LEGACY - DIRECT DB)
   */
  async populateInventoryShells(filePath) {
    throw new Error('DEPRECATED: Direct inventory population is no longer supported. Use staging workflow with batch ID instead.');
  }

  // Keep this for reference but it shouldn't be used
  async populateInventoryShellsLegacy(filePath) {
    console.log('🔍 Finding empty customer shells and populating with inventory...');
    
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      // Step 1: Find empty customer shells (customers with no inventory items)
      // THIS IS THE BUG - it finds ALL customers without items, not just staged ones
      const emptyShells = await this.getAllQuery(db, `
        SELECT 
          c.customer_number,
          c.account_name,
          c.route_number,
          c.created_at
        FROM customers c
        LEFT JOIN customer_items ci ON c.customer_number = ci.customer_number
        WHERE ci.customer_number IS NULL
          AND c.is_active = 1
          AND c.route_number NOT IN (1, 3)
        ORDER BY c.customer_number
      `);
      console.log(`📋 Found ${emptyShells.length} empty customer shells`);
      
      if (emptyShells.length === 0) {
        return {
          emptyShellsFound: 0,
          shellsPopulated: 0,
          itemsAdded: 0,
          populatedShells: []
        };
      }
      
      // Step 2: Parse CustomerMasterAnalysis CSV
      const inventoryData = await this.parseCustomerMasterAnalysisCSV(filePath);
      console.log(`📦 Parsed inventory data for ${Object.keys(inventoryData).length} customers`);
      
      // Step 3: Create backup before making changes
      const backupResult = await this.createBackup('before_inventory_population');
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      // Step 4: Populate shells with inventory
      const result = await this.populateShellsWithInventory(db, emptyShells, inventoryData);
      
      console.log(`🎉 Successfully populated ${result.shellsPopulated} shells with ${result.itemsAdded} items`);
      return result;
      
    } catch (error) {
      console.error('Shell inventory population failed:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Find customers with no inventory items (empty shells)
   */
  async findEmptyShells(db, batchId) {
    // Only find customers that were staged for addition in this specific batch
    // These are the ONLY customers that should get inventory populated
    return await this.getAllQuery(db, `
      SELECT DISTINCT
        prc.customer_number,
        prc.customer_name as account_name,
        json_extract(prc.change_data, '$.route_number') as route_number
      FROM pending_route_changes prc
      WHERE prc.change_type = 'add_customer'
        AND prc.batch_id = ?
        AND prc.validated = FALSE
      ORDER BY prc.customer_number
    `, [batchId]);
  }

  /**
   * Parse CustomerMasterAnalysis CSV and organize by customer number
   */
  async parseCustomerMasterAnalysisCSV(filePath) {
    return new Promise((resolve, reject) => {
      const customerInventory = {};
      const stream = require('fs').createReadStream(filePath);
      
      stream
        .pipe(csv())
        .on('data', (row) => {
          // Extract data from CustomerMasterAnalysis format
          const customerNum = row['CustomerNum'] || row['﻿CustomerNum']; // Handle BOM
          
          if (customerNum && customerNum.trim()) {
            const customerNumber = parseInt(customerNum.trim());
            
            if (!isNaN(customerNumber)) {
              // Initialize customer if not exists
              if (!customerInventory[customerNumber]) {
                customerInventory[customerNumber] = {
                  customer_number: customerNumber,
                  account_name: row['dlvr_name'] || '',
                  items: []
                };
              }
              
              // Add item data
              const itemNum = row['item_num'];
              if (itemNum && itemNum.trim()) {
                customerInventory[customerNumber].items.push({
                  item_number: itemNum.trim(),
                  description: row['item_desc'] || '',
                  size_misc: row['size_misc'] || '',
                  regular_qty: parseInt(row['reg_invty_qty']) || 0,
                  special_qty: parseInt(row['spec_invty_qty']) || 0,
                  unit_price: parseFloat(row['unit_price']) || 0,
                  delivery_freq: row['dlvr_freq'] || '',
                  avg_delivery: parseFloat(row['avg_delivery']) || 0
                });
              }
            }
          }
        })
        .on('end', () => {
          console.log(`📊 Parsed inventory for ${Object.keys(customerInventory).length} customers`);
          resolve(customerInventory);
        })
        .on('error', reject);
    });
  }

  /**
   * Populate empty shells with their inventory items
   */
  async populateShellsWithInventory(db, emptyShells, inventoryData) {
    let shellsPopulated = 0;
    let itemsAdded = 0;
    const populatedShells = [];
    
    await this.runQuery(db, 'BEGIN TRANSACTION');
    
    try {
      for (const shell of emptyShells) {
        const customerInventory = inventoryData[shell.customer_number];
        
        if (customerInventory && customerInventory.items.length > 0) {
          console.log(`🔧 Populating shell ${shell.customer_number} with ${customerInventory.items.length} items`);
          
          for (const item of customerInventory.items) {
            try {
              // Insert into customer_items table (matching actual database schema)
              console.log(`🔧 Attempting to insert item ${item.item_number} for customer ${shell.customer_number}`);
              const insertResult = await this.runQuery(db, `
                INSERT INTO customer_items (
                  customer_number,
                  item_number,
                  quantity,
                  item_type,
                  frequency,
                  notes
                ) VALUES (?, ?, ?, ?, ?, ?)
              `, [
                shell.customer_number,
                item.item_number,
                item.regular_qty || item.special_qty || 0,
                'rental', // Default to rental
                item.delivery_freq || 'Weekly',
                item.size_misc ? `Size: ${item.size_misc}, Price: $${item.unit_price}` : `Price: $${item.unit_price}`
              ]);
              
              console.log(`✅ Successfully inserted item ${item.item_number} for customer ${shell.customer_number}, insertId: ${insertResult.lastID}`);
              itemsAdded++;
              
            } catch (itemError) {
              console.error(`❌ Failed to add item ${item.item_number} to customer ${shell.customer_number}:`, itemError.message);
              console.error(`❌ Item data:`, JSON.stringify(item, null, 2));
              console.error(`❌ SQL Values:`, [
                shell.customer_number,
                item.item_number,
                item.description,
                item.regular_qty || item.special_qty || 0,
                'rental',
                item.delivery_freq || 'Weekly',
                item.unit_price,
                item.size_misc ? `Size: ${item.size_misc}` : '',
              ]);
            }
          }
          
          populatedShells.push({
            customer_number: shell.customer_number,
            account_name: shell.account_name,
            route_number: shell.route_number,
            items_added: customerInventory.items.length,
            status: 'populated'
          });
          
          shellsPopulated++;
        }
      }
      
      await this.runQuery(db, 'COMMIT');
      
      return {
        emptyShellsFound: emptyShells.length,
        shellsPopulated,
        itemsAdded,
        populatedShells
      };
      
    } catch (error) {
      await this.runQuery(db, 'ROLLBACK');
      throw error;
    }
  }

  /**
   * Validate and apply pending changes for a specific route
   */
  async validateRouteChanges(routeNumber, approvedChangeIds, rejectedChangeIds = []) {
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      console.log(`🔍 Validating ${approvedChangeIds.length} changes for Route ${routeNumber}...`);
      
      // Create backup before applying changes
      const backupResult = await this.createBackup(`before_route_${routeNumber}_validation`);
      console.log(`✅ Backup created: ${backupResult.backupPath}`);
      
      let approvedChanges = 0;
      let rejectedChanges = 0;
      let databaseChangesApplied = 0;
      
      await this.runQuery(db, 'BEGIN TRANSACTION');
      
      try {
        // Process approved changes
        for (const changeId of approvedChangeIds) {
          const pendingChange = await this.getQuery(db, `
            SELECT * FROM pending_route_changes 
            WHERE id = ? AND route_number = ? AND validated = FALSE
          `, [changeId, routeNumber]);
          
          if (!pendingChange) {
            console.warn(`⚠️ Change ${changeId} not found or already validated`);
            continue;
          }
          
          const changeData = JSON.parse(pendingChange.change_data);
          
          // Apply the change to the database
          if (pendingChange.change_type === 'add_customer') {
            await this.applyCustomerAddition(db, changeData);
            databaseChangesApplied++;
            console.log(`✅ Added customer: ${changeData.customer_number} - ${changeData.account_name}`);
            
          } else if (pendingChange.change_type === 'remove_customer') {
            await this.applyCustomerRemoval(db, changeData);
            databaseChangesApplied++;
            console.log(`✅ Removed customer: ${changeData.customer_number} - ${changeData.account_name}`);
            
          } else if (pendingChange.change_type === 'update_customer') {
            await this.applyCustomerUpdate(db, changeData);
            databaseChangesApplied++;
            console.log(`✅ Updated customer: ${changeData.customer_number} - ${changeData.account_name}`);
            
          } else if (pendingChange.change_type === 'add_items') {
            const itemsAdded = await this.applyInventoryAddition(db, changeData);
            databaseChangesApplied += itemsAdded;
            console.log(`✅ Added ${itemsAdded} items to customer: ${changeData.customer_number}`);
          }
          
          // Mark change as validated
          await this.runQuery(db, `
            UPDATE pending_route_changes 
            SET validated = TRUE, validated_at = datetime('now')
            WHERE id = ?
          `, [changeId]);
          
          approvedChanges++;
        }
        
        // Mark rejected changes as validated (but don't apply them)
        for (const changeId of rejectedChangeIds) {
          await this.runQuery(db, `
            UPDATE pending_route_changes 
            SET validated = TRUE, validated_at = datetime('now')
            WHERE id = ? AND route_number = ?
          `, [changeId, routeNumber]);
          
          rejectedChanges++;
        }
        
        await this.runQuery(db, 'COMMIT');
        
        console.log(`🎉 Route ${routeNumber} validation complete: ${approvedChanges} approved, ${rejectedChanges} rejected, ${databaseChangesApplied} database changes applied`);
        
        return {
          approved_changes: approvedChanges,
          rejected_changes: rejectedChanges,
          database_changes_applied: databaseChangesApplied
        };
        
      } catch (applyError) {
        await this.runQuery(db, 'ROLLBACK');
        throw applyError;
      }
      
    } finally {
      db.close();
    }
  }

  /**
   * Apply customer addition to database
   */
  async applyCustomerAddition(db, changeData) {
    await this.runQuery(db, `
      INSERT INTO customers (
        customer_number,
        account_name,
        address,
        city,
        state,
        zip_code,
        route_number,
        service_frequency,
        service_days,
        is_active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `, [
      changeData.customer_number,
      changeData.account_name,
      changeData.address,
      changeData.city,
      changeData.state,
      changeData.zip_code,
      changeData.route_number,
      changeData.service_frequency || 'Weekly',
      changeData.service_days
    ]);
  }

  /**
   * Apply customer removal to database
   */
  async applyCustomerRemoval(db, changeData) {
    // Set customer as inactive instead of hard delete (safer)
    await this.runQuery(db, `
      UPDATE customers 
      SET is_active = 0, updated_at = datetime('now')
      WHERE customer_number = ?
    `, [changeData.customer_number]);
    
    console.log(`🗑️ Deactivated customer: ${changeData.customer_number} - ${changeData.account_name}`);
  }

  /**
   * Apply customer update to database
   */
  async applyCustomerUpdate(db, changeData) {
    const newData = changeData.new_data;
    
    await this.runQuery(db, `
      UPDATE customers 
      SET account_name = ?, 
          address = ?, 
          city = ?, 
          state = ?, 
          zip_code = ?, 
          service_days = ?,
          updated_at = datetime('now')
      WHERE customer_number = ?
    `, [
      newData.account_name,
      newData.address,
      newData.city,
      newData.state,
      newData.zip_code,
      newData.service_days,
      changeData.customer_number
    ]);
    
    console.log(`📝 Updated customer: ${changeData.customer_number} - ${changeData.account_name}`);
  }

  /**
   * Apply inventory addition to database
   */
  async applyInventoryAddition(db, changeData) {
    let itemsAdded = 0;
    
    for (const item of changeData.items) {
      try {
        await this.runQuery(db, `
          INSERT INTO customer_items (
            customer_number,
            item_number,
            quantity,
            item_type,
            frequency,
            notes
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          changeData.customer_number,
          item.item_number,
          item.quantity,
          item.item_type,
          item.frequency,
          item.notes
        ]);
        
        itemsAdded++;
        
      } catch (itemError) {
        console.error(`❌ Failed to add item ${item.item_number} to customer ${changeData.customer_number}:`, itemError.message);
      }
    }
    
    return itemsAdded;
  }
}

module.exports = { RouteOptimizationService };