const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

class RouteOptimizationService {
  constructor() {
    this.dbPath = process.env.NODE_ENV === 'test' ? 
      path.join(__dirname, '../../route33-testing.db') :
      path.join(__dirname, '../../route33-staging.db');
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
            const customer = {
              customer_number: parseInt(locationId.trim()),
              account_name: row['dlvr_name'] || '',
              address: row['dlvr_Addr'] || '',
              city: row['dlvr_city'] || '',
              state: row['dlvr_state'] || 'CA',
              zip_code: row['dlvr_Zip'] || '',
              territory: row['Territory'] || '',
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
        ORDER BY customer_number
      `);
    } finally {
      db.close();
    }
  }

  /**
   * Perform the comparison between CSV and database customers
   */
  performComparison(csvCustomers, dbCustomers) {
    const csvNumbers = new Set(csvCustomers.map(c => c.customer_number));
    const dbNumbers = new Set(dbCustomers.map(c => c.customer_number));
    
    // Find customers to add (in CSV but not in DB)
    const toAdd = csvCustomers.filter(c => !dbNumbers.has(c.customer_number));
    
    // Find customers to remove (in DB but not in CSV)
    const toRemove = dbCustomers.filter(c => !csvNumbers.has(c.customer_number));
    
    // Find customers that exist in both (potential updates)
    const existing = csvCustomers.filter(c => dbNumbers.has(c.customer_number));
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
    
    return {
      toAdd,
      toRemove,
      potentialUpdates,
      csvTotal: csvCustomers.length,
      dbTotal: dbCustomers.length,
      matching: existing.length
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
}

module.exports = { RouteOptimizationService };