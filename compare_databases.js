#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Database Comparison Tool
 * Compares backup database vs current database to identify changes
 */

class DatabaseComparator {
  constructor() {
    this.currentDbPath = path.join(__dirname, 'route33-staging.db');
    this.backupDbPath = path.join(__dirname, 'database-backups/backup_2025-08-04T18-17-41-619Z_before_inventory_population.db');
  }

  async runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async compareCustomerCounts() {
    console.log('📊 COMPARING CUSTOMER COUNTS...\n');
    
    const backupDb = new sqlite3.Database(this.backupDbPath);
    const currentDb = new sqlite3.Database(this.currentDbPath);

    try {
      // Get customer counts from both databases
      const backupCount = await this.runQuery(backupDb, 'SELECT COUNT(*) as count FROM customers');
      const currentCount = await this.runQuery(currentDb, 'SELECT COUNT(*) as count FROM customers');
      
      console.log(`Backup Database Customers: ${backupCount[0].count}`);
      console.log(`Current Database Customers: ${currentCount[0].count}`);
      console.log(`Difference: ${currentCount[0].count - backupCount[0].count}`);
      
    } finally {
      backupDb.close();
      currentDb.close();
    }
  }

  async compareCustomerItems() {
    console.log('\n📦 COMPARING CUSTOMER ITEMS...\n');
    
    const backupDb = new sqlite3.Database(this.backupDbPath);
    const currentDb = new sqlite3.Database(this.currentDbPath);

    try {
      // Check if customer_items table exists in both databases
      const backupTables = await this.runQuery(backupDb, "SELECT name FROM sqlite_master WHERE type='table' AND name='customer_items'");
      const currentTables = await this.runQuery(currentDb, "SELECT name FROM sqlite_master WHERE type='table' AND name='customer_items'");
      
      console.log(`customer_items table exists in backup: ${backupTables.length > 0}`);
      console.log(`customer_items table exists in current: ${currentTables.length > 0}`);
      
      if (backupTables.length === 0 || currentTables.length === 0) {
        console.log('❌ customer_items table missing - this explains why inventory population appeared successful but didn\'t work!');
        
        // Show what tables do exist
        console.log('\nTables in backup database:');
        const backupAllTables = await this.runQuery(backupDb, "SELECT name FROM sqlite_master WHERE type='table'");
        backupAllTables.forEach(table => console.log(`  - ${table.name}`));
        
        console.log('\nTables in current database:');
        const currentAllTables = await this.runQuery(currentDb, "SELECT name FROM sqlite_master WHERE type='table'");
        currentAllTables.forEach(table => console.log(`  - ${table.name}`));
        
        return;
      }

      // If tables exist, compare counts
      const backupItemCount = await this.runQuery(backupDb, 'SELECT COUNT(*) as count FROM customer_items');
      const currentItemCount = await this.runQuery(currentDb, 'SELECT COUNT(*) as count FROM customer_items');
      
      console.log(`Backup Database Items: ${backupItemCount[0].count}`);
      console.log(`Current Database Items: ${currentItemCount[0].count}`);
      console.log(`Difference: ${currentItemCount[0].count - backupItemCount[0].count}`);
      
    } finally {
      backupDb.close();
      currentDb.close();
    }
  }

  async findNewCustomers() {
    console.log('\n👥 FINDING NEW CUSTOMERS ADDED...\n');
    
    const backupDb = new sqlite3.Database(this.backupDbPath);
    const currentDb = new sqlite3.Database(this.currentDbPath);

    try {
      // Find customers in current but not in backup
      const newCustomers = await this.runQuery(currentDb, `
        SELECT 
          c.customer_number,
          c.account_name,
          c.route_number,
          c.created_at
        FROM customers c
        WHERE c.customer_number NOT IN (
          SELECT customer_number FROM customers
        )
        ORDER BY c.customer_number
      `);

      if (newCustomers.length > 0) {
        console.log(`Found ${newCustomers.length} new customers:`);
        newCustomers.forEach(customer => {
          console.log(`  ${customer.customer_number}: ${customer.account_name} (Route ${customer.route_number}) - ${customer.created_at}`);
        });
      } else {
        console.log('No new customers found');
      }

      // Actually, let's do this properly with a different approach
      const backupCustomers = await this.runQuery(backupDb, 'SELECT customer_number FROM customers');
      const currentCustomers = await this.runQuery(currentDb, 'SELECT customer_number, account_name, route_number, created_at FROM customers');
      
      const backupNumbers = new Set(backupCustomers.map(c => c.customer_number));
      const newlyAdded = currentCustomers.filter(c => !backupNumbers.has(c.customer_number));
      
      if (newlyAdded.length > 0) {
        console.log(`\n✅ Found ${newlyAdded.length} customers added since backup:`);
        newlyAdded.forEach(customer => {
          console.log(`  ${customer.customer_number}: ${customer.account_name} (Route ${customer.route_number}) - ${customer.created_at}`);
        });
      } else {
        console.log('\n❌ No new customers found - this is unexpected!');
      }
      
    } finally {
      backupDb.close();
      currentDb.close();
    }
  }

  async checkDatabaseSizes() {
    console.log('\n💾 DATABASE FILE SIZES...\n');
    
    const fs = require('fs').promises;
    
    try {
      const backupStats = await fs.stat(this.backupDbPath);
      const currentStats = await fs.stat(this.currentDbPath);
      
      console.log(`Backup Database: ${backupStats.size} bytes`);
      console.log(`Current Database: ${currentStats.size} bytes`);
      console.log(`Size Difference: ${currentStats.size - backupStats.size} bytes`);
      
      if (currentStats.size > backupStats.size) {
        console.log('✅ Current database is larger - data was added');
      } else {
        console.log('❌ No size increase - suspicious!');
      }
      
    } catch (error) {
      console.error('Error checking file sizes:', error.message);
    }
  }

  async run() {
    console.log('🔍 DATABASE COMPARISON ANALYSIS');
    console.log('=====================================');
    console.log(`Backup:  ${this.backupDbPath}`);
    console.log(`Current: ${this.currentDbPath}\n`);

    try {
      await this.checkDatabaseSizes();
      await this.compareCustomerCounts();
      await this.compareCustomerItems();
      await this.findNewCustomers();
      
      console.log('\n📋 SUMMARY:');
      console.log('===========');
      console.log('This comparison will show us exactly what changed during the inventory population process.');
      console.log('If customer_items table is missing, that explains why items weren\'t actually added.');
      
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }
}

// Run the comparison
const comparator = new DatabaseComparator();
comparator.run().catch(console.error);