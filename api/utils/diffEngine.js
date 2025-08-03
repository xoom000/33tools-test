const database = require('./database');

/**
 * Database Diff Engine
 * Compares CSV data against current database state and generates change sets
 */
class DatabaseDiffEngine {
  constructor() {
    this.changes = {
      customers: {
        toAdd: [],
        toUpdate: [],
        toRemove: []
      },
      customerItems: {
        toAdd: [],
        toUpdate: [],
        toRemove: []
      },
      items: {
        toAdd: [],
        toUpdate: []
      }
    };
  }

  /**
   * Main diff method - compares CSV data with database
   */
  async generateDiff(csvData) {
    console.log('Generating database diff...');
    
    try {
      // Get current database state
      const currentState = await this.getCurrentDatabaseState();
      
      // Compare customers
      await this.diffCustomers(csvData.customers, currentState.customers);
      
      // Compare customer items
      await this.diffCustomerItems(csvData.customerItems, currentState.customerItems);
      
      // Compare items catalog
      await this.diffItems(csvData.items, currentState.items);
      
      // Generate summary
      const summary = this.generateSummary();
      
      console.log('Diff generation complete');
      return {
        changes: this.changes,
        summary: summary
      };
      
    } catch (error) {
      console.error('Error generating diff:', error);
      throw error;
    }
  }

  /**
   * Get current database state
   */
  async getCurrentDatabaseState() {
    const [customers, customerItems, items] = await Promise.all([
      this.getCurrentCustomers(),
      this.getCurrentCustomerItems(),
      this.getCurrentItems()
    ]);

    return { customers, customerItems, items };
  }

  /**
   * Get current customers from database
   */
  async getCurrentCustomers() {
    const query = `
      SELECT customer_number, account_name, address, city, state, zip_code, 
             route_number, service_frequency, service_days, is_active,
             created_at, updated_at
      FROM customers 
      WHERE is_active = 1
    `;
    
    const rows = await database.query(query);
    const customers = new Map();
    
    rows.forEach(row => {
      customers.set(row.customer_number, row);
    });
    
    return customers;
  }

  /**
   * Get current customer items from database
   */
  async getCurrentCustomerItems() {
    const query = `
      SELECT customer_number, item_number, quantity, item_type, frequency, notes
      FROM customer_items
    `;
    
    const rows = await database.query(query);
    const customerItems = new Map();
    
    rows.forEach(row => {
      const key = `${row.customer_number}_${row.item_number}`;
      customerItems.set(key, row);
    });
    
    return customerItems;
  }

  /**
   * Get current items catalog from database
   */
  async getCurrentItems() {
    const query = `
      SELECT item_number, sku, description, item_type, category_id, 
             unit_of_measure, case_quantity, is_active
      FROM item_catalog
    `;
    
    const rows = await database.query(query);
    const items = new Map();
    
    rows.forEach(row => {
      items.set(row.item_number, row);
    });
    
    return items;
  }

  /**
   * Compare customers data
   */
  async diffCustomers(csvCustomers, dbCustomers) {
    console.log(`Comparing ${csvCustomers.length} CSV customers with ${dbCustomers.size} DB customers`);
    
    for (const csvCustomer of csvCustomers) {
      const customerNumber = csvCustomer.customer_number;
      const dbCustomer = dbCustomers.get(customerNumber);
      
      if (!dbCustomer) {
        // Customer doesn't exist in database - add it
        this.changes.customers.toAdd.push(csvCustomer);
      } else {
        // Customer exists - check for changes
        if (this.customerHasChanged(csvCustomer, dbCustomer)) {
          this.changes.customers.toUpdate.push({
            ...csvCustomer,
            updated_at: new Date().toISOString()
          });
        }
        // Mark as processed
        dbCustomers.delete(customerNumber);
      }
    }
    
    // Remaining database customers not in CSV should be removed (marked inactive)
    for (const [customerNumber, dbCustomer] of dbCustomers) {
      this.changes.customers.toRemove.push({
        customer_number: customerNumber,
        is_active: 0,
        updated_at: new Date().toISOString()
      });
    }
  }

  /**
   * Compare customer items data
   */
  async diffCustomerItems(csvCustomerItems, dbCustomerItems) {
    console.log(`Comparing ${csvCustomerItems.length} CSV items with ${dbCustomerItems.size} DB items`);
    
    for (const csvItem of csvCustomerItems) {
      const key = `${csvItem.customer_number}_${csvItem.item_number}`;
      const dbItem = dbCustomerItems.get(key);
      
      if (!dbItem) {
        // Item relationship doesn't exist - add it
        this.changes.customerItems.toAdd.push(csvItem);
      } else {
        // Item exists - check for changes
        if (this.customerItemHasChanged(csvItem, dbItem)) {
          this.changes.customerItems.toUpdate.push(csvItem);
        }
        // Mark as processed
        dbCustomerItems.delete(key);
      }
    }
    
    // Remaining database items not in CSV should be removed
    for (const [key, dbItem] of dbCustomerItems) {
      this.changes.customerItems.toRemove.push({
        customer_number: dbItem.customer_number,
        item_number: dbItem.item_number
      });
    }
  }

  /**
   * Compare items catalog
   */
  async diffItems(csvItems, dbItems) {
    console.log(`Comparing ${csvItems.length} CSV catalog items with ${dbItems.size} DB catalog items`);
    
    for (const csvItem of csvItems) {
      const itemNumber = csvItem.item_number;
      const dbItem = dbItems.get(itemNumber);
      
      if (!dbItem) {
        // Item doesn't exist in catalog - add it
        this.changes.items.toAdd.push(csvItem);
      } else {
        // Item exists - check for changes
        if (this.itemHasChanged(csvItem, dbItem)) {
          this.changes.items.toUpdate.push(csvItem);
        }
      }
    }
  }

  /**
   * Check if customer data has changed
   */
  customerHasChanged(csvCustomer, dbCustomer) {
    const fieldsToCompare = [
      'account_name', 'address', 'city', 'state', 'zip_code',
      'route_number', 'service_frequency', 'service_days'
    ];
    
    for (const field of fieldsToCompare) {
      if (csvCustomer[field] !== dbCustomer[field]) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check if customer item has changed
   */
  customerItemHasChanged(csvItem, dbItem) {
    return csvItem.quantity !== dbItem.quantity;
  }

  /**
   * Check if catalog item has changed
   */
  itemHasChanged(csvItem, dbItem) {
    return csvItem.description !== dbItem.description;
  }

  /**
   * Generate summary of changes
   */
  generateSummary() {
    return {
      customers: {
        toAdd: this.changes.customers.toAdd.length,
        toUpdate: this.changes.customers.toUpdate.length,
        toRemove: this.changes.customers.toRemove.length
      },
      customerItems: {
        toAdd: this.changes.customerItems.toAdd.length,
        toUpdate: this.changes.customerItems.toUpdate.length,
        toRemove: this.changes.customerItems.toRemove.length
      },
      items: {
        toAdd: this.changes.items.toAdd.length,
        toUpdate: this.changes.items.toUpdate.length
      },
      totalChanges: this.getTotalChanges()
    };
  }

  /**
   * Get total number of changes
   */
  getTotalChanges() {
    const c = this.changes;
    return c.customers.toAdd.length + c.customers.toUpdate.length + c.customers.toRemove.length +
           c.customerItems.toAdd.length + c.customerItems.toUpdate.length + c.customerItems.toRemove.length +
           c.items.toAdd.length + c.items.toUpdate.length;
  }

  /**
   * Get detailed change report
   */
  getChangeReport() {
    const summary = this.generateSummary();
    
    return {
      summary,
      details: {
        newCustomers: this.changes.customers.toAdd.map(c => ({
          number: c.customer_number,
          name: c.account_name,
          city: c.city
        })),
        updatedCustomers: this.changes.customers.toUpdate.map(c => ({
          number: c.customer_number,
          name: c.account_name
        })),
        removedCustomers: this.changes.customers.toRemove.map(c => ({
          number: c.customer_number
        })),
        newItems: this.changes.items.toAdd.length,
        updatedItems: this.changes.items.toUpdate.length
      }
    };
  }
}

module.exports = DatabaseDiffEngine;