const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

/**
 * CSV to Database Sync Engine
 * Parses CustomerMasterAnalysisReport and prepares data for database sync
 */
class CSVSyncEngine {
  constructor() {
    this.customers = new Map(); // Deduplicated customers
    this.customerItems = []; // All customer-item relationships
    this.items = new Map(); // Unique items catalog
    this.errors = [];
  }

  /**
   * Parse CSV file and extract structured data
   */
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            this.processRow(row);
            results.push(row);
          } catch (error) {
            this.errors.push({
              row: results.length + 1,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', () => {
          console.log(`Parsed ${results.length} rows`);
          console.log(`Found ${this.customers.size} unique customers`);
          console.log(`Found ${this.customerItems.length} customer-item relationships`);
          console.log(`Found ${this.items.size} unique items`);
          
          if (this.errors.length > 0) {
            console.log(`Encountered ${this.errors.length} parsing errors`);
          }
          
          resolve({
            customers: Array.from(this.customers.values()),
            customerItems: this.customerItems,
            items: Array.from(this.items.values()),
            errors: this.errors,
            stats: {
              totalRows: results.length,
              uniqueCustomers: this.customers.size,
              customerItems: this.customerItems.length,
              uniqueItems: this.items.size,
              errors: this.errors.length
            }
          });
        })
        .on('error', reject);
    });
  }

  /**
   * Process individual CSV row
   */
  processRow(row) {
    // Extract and transform customer data
    const customerNumber = this.parseCustomerNumber(row.CustomerNum);
    if (!customerNumber) {
      throw new Error('Invalid customer number');
    }

    // Only process first occurrence of each customer for customer table
    if (!this.customers.has(customerNumber)) {
      const customer = this.extractCustomerData(row, customerNumber);
      this.customers.set(customerNumber, customer);
    }

    // Process item data (one row per customer-item relationship)
    const itemData = this.extractItemData(row, customerNumber);
    if (itemData.item_number && itemData.quantity > 0) {
      this.customerItems.push(itemData);
      
      // Add to items catalog
      const item = this.extractItemCatalogData(row);
      if (item.item_number) {
        this.items.set(item.item_number, item);
      }
    }
  }

  /**
   * Extract customer data from CSV row
   */
  extractCustomerData(row, customerNumber) {
    const cityState = this.parseCityState(row.dlvr_city || '');
    const serviceDays = this.parseServiceDays(row.trip_days || '');
    const routeNumber = this.parseRouteNumber(row.textbox1 || '');

    return {
      customer_number: customerNumber,
      account_name: (row.dlvr_name || '').trim(),
      address: (row.dlvr_addr || '').trim(),
      city: cityState.city,
      state: cityState.state || 'CA',
      zip_code: null, // Not in CSV
      route_number: routeNumber,
      service_frequency: this.parseServiceFrequency(row.stmt_freq || ''),
      service_days: serviceDays,
      is_active: 1,
      phone: null, // Not in CSV
      email: null, // Not in CSV
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Extract customer-item relationship data
   */
  extractItemData(row, customerNumber) {
    return {
      customer_number: customerNumber,
      item_number: (row.item_num || '').toString().trim(),
      quantity: parseInt(row.reg_invty_qty) || 0,
      item_type: 'rental', // Default from CSV
      frequency: null,
      notes: null
    };
  }

  /**
   * Extract item catalog data
   */
  extractItemCatalogData(row) {
    return {
      item_number: (row.item_num || '').toString().trim(),
      sku: null,
      description: (row.item_desc || '').trim(),
      item_type: 'rental',
      category_id: this.deriveCategoryId(row.item_desc || ''),
      unit_of_measure: 'EA',
      case_quantity: 1,
      is_active: 1
    };
  }

  /**
   * Parse customer number from string
   */
  parseCustomerNumber(customerNum) {
    if (!customerNum) return null;
    const parsed = parseInt(customerNum.toString().replace(/[^\d]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Parse city and state from "City, State" format
   */
  parseCityState(cityState) {
    const parts = cityState.split(',').map(p => p.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || 'CA'
    };
  }

  /**
   * Convert MTWHF format to comma-separated day codes
   */
  parseServiceDays(tripDays) {
    if (!tripDays) return '';
    
    const dayMap = {
      'M': 'M',
      'T': 'T', 
      'W': 'W',
      'H': 'H', // Thursday
      'F': 'F'
    };
    
    const days = [];
    for (const char of tripDays.toUpperCase()) {
      if (dayMap[char]) {
        days.push(dayMap[char]);
      }
    }
    
    return days.join(',');
  }

  /**
   * Parse route number from textbox1 field
   */
  parseRouteNumber(textbox1) {
    // Extract number from "Plant XXXX" format
    const match = textbox1.match(/Plant\s+(\d+)/i);
    if (match) {
      const plantNumber = parseInt(match[1]);
      // Map plant numbers to route numbers (you may need to adjust this)
      const routeMap = {
        2502: 33, // Example mapping
        // Add more mappings as needed
      };
      return routeMap[plantNumber] || 33; // Default to route 33
    }
    return 33; // Default route
  }

  /**
   * Parse service frequency from statement frequency code
   */
  parseServiceFrequency(stmtFreq) {
    const freqMap = {
      '11L': 'Weekly',
      '12L': 'Bi-Weekly',
      '13L': 'Monthly',
      // Add more mappings as needed
    };
    return freqMap[stmtFreq] || 'Weekly';
  }

  /**
   * Parse price from string (remove currency symbols)
   */
  parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleaned = priceStr.toString().replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Derive category ID from item description
   */
  deriveCategoryId(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('towel') || desc.includes('twl')) return 1;
    if (desc.includes('sheet') || desc.includes('sht')) return 2;
    if (desc.includes('gown')) return 3;
    if (desc.includes('scrub')) return 4;
    if (desc.includes('pillow') || desc.includes('plw')) return 5;
    if (desc.includes('blanket') || desc.includes('blnk')) return 6;
    if (desc.includes('hyperbaric')) return 7;
    if (desc.includes('bag') || desc.includes('bg')) return 8;
    
    return 9; // General category
  }

  /**
   * Get parsing summary
   */
  getSummary() {
    return {
      customers: this.customers.size,
      customerItems: this.customerItems.length,
      items: this.items.size,
      errors: this.errors.length,
      errorDetails: this.errors
    };
  }
}

module.exports = CSVSyncEngine;