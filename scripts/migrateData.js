const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const database = require('../api/utils/database');

const CSV_DIR = './csv_data/';

async function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(CSV_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      resolve([]);
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`📊 Read ${results.length} records from ${filename}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

async function migrateRoutes() {
  console.log('🚚 Migrating routes...');
  const routes = await readCSV('routes.csv');
  
  for (const route of routes) {
    await database.run(
      'INSERT OR REPLACE INTO routes (route_number, driver_name) VALUES (?, ?)',
      [route.route_number, route.driver_name]
    );
  }
  
  console.log(`✅ Migrated ${routes.length} routes`);
}

async function migrateCustomers() {
  console.log('👥 Migrating customers...');
  const customers = await readCSV('customers.csv');
  
  // Get existing route numbers
  const existingRoutes = await database.query('SELECT route_number FROM routes');
  const routeNumbers = new Set(existingRoutes.map(r => r.route_number.toString()));
  
  let migratedCount = 0;
  for (const customer of customers) {
    // Skip customers with invalid zip codes
    const zipCode = customer.zip_code?.trim();
    if (!zipCode || zipCode.length !== 5) {
      console.log(`⚠️  Skipping customer ${customer.customer_number} - invalid zip code: "${zipCode}"`);
      continue;
    }
    
    // Check if route exists, set to null if not
    const routeNumber = customer.route_number?.trim();
    const validRouteNumber = routeNumbers.has(routeNumber) ? routeNumber : null;
    
    if (!validRouteNumber && routeNumber) {
      console.log(`⚠️  Customer ${customer.customer_number} references non-existent route ${routeNumber}, setting to null`);
    }
    
    await database.run(`
      INSERT OR REPLACE INTO customers (
        customer_number, account_name, address, city, state, 
        zip_code, route_number, service_frequency, service_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customer.customer_number,
      customer.account_name,
      customer.address,
      customer.city,
      customer.state || 'CA',
      zipCode,
      validRouteNumber,
      customer.service_frequency,
      customer.service_days
    ]);
    migratedCount++;
  }
  
  console.log(`✅ Migrated ${migratedCount} customers`);
}

async function migrateDirectSales() {
  console.log('💰 Migrating direct sales items...');
  const directSales = await readCSV('direct_sales (1).csv');
  
  // First, migrate vendors
  const vendors = [...new Set(directSales.map(item => item.vendor))];
  for (const vendor of vendors) {
    if (vendor && vendor.trim()) {
      await database.run(
        'INSERT OR IGNORE INTO vendors (vendor_name) VALUES (?)',
        [vendor.trim()]
      );
    }
  }
  
  // Get vendor IDs
  const vendorMap = {};
  const vendorRows = await database.query('SELECT vendor_id, vendor_name FROM vendors');
  vendorRows.forEach(v => vendorMap[v.vendor_name] = v.vendor_id);
  
  // Migrate items
  for (const item of directSales) {
    const vendorId = vendorMap[item.vendor];
    
    // Insert into item catalog
    await database.run(`
      INSERT OR REPLACE INTO item_catalog (
        item_number, sku, description, item_type, category_id
      ) VALUES (?, ?, ?, 'sale', ?)
    `, [
      item.sku,
      item.sku,
      item.name,
      1 // Default to first category for now
    ]);
    
    // Insert base pricing
    await database.run(`
      INSERT OR REPLACE INTO pricing (
        item_number, price_type, price, vendor_id
      ) VALUES (?, 'base', ?, ?)
    `, [
      item.sku,
      parseFloat(item.base_price) || 0,
      vendorId
    ]);
  }
  
  console.log(`✅ Migrated ${directSales.length} direct sales items`);
}

async function migrateRentalItems() {
  console.log('🏷️  Migrating rental items...');
  const rentalItems = await readCSV('customer_rental_items.csv');
  
  // Get unique items first
  const uniqueItems = [];
  const itemMap = {};
  
  for (const item of rentalItems) {
    if (!itemMap[item.item_number]) {
      itemMap[item.item_number] = {
        item_number: item.item_number,
        description: item.description
      };
      uniqueItems.push(itemMap[item.item_number]);
    }
  }
  
  // Insert unique items into catalog
  for (const item of uniqueItems) {
    await database.run(`
      INSERT OR IGNORE INTO item_catalog (
        item_number, description, item_type, category_id
      ) VALUES (?, ?, 'rental', ?)
    `, [
      item.item_number,
      item.description,
      7 // Rental Linens category
    ]);
  }
  
  // Get existing customer numbers to validate relationships
  const existingCustomers = await database.query('SELECT customer_number FROM customers');
  const customerNumbers = new Set(existingCustomers.map(c => c.customer_number.toString()));
  
  // Insert customer-item relationships
  let validItemCount = 0;
  for (const item of rentalItems) {
    // Only insert if customer exists
    if (customerNumbers.has(item.customer_number?.toString())) {
      await database.run(`
        INSERT OR REPLACE INTO customer_items (
          customer_number, item_number, quantity, item_type
        ) VALUES (?, ?, ?, 'rental')
      `, [
        item.customer_number,
        item.item_number,
        parseInt(item.quantity_used) || 0
      ]);
      validItemCount++;
    } else {
      console.log(`⚠️  Skipping rental item for non-existent customer ${item.customer_number}`);
    }
  }
  
  console.log(`✅ Migrated ${uniqueItems.length} unique rental items`);
  console.log(`✅ Migrated ${validItemCount} customer-item relationships`);
}

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...');
    
    await database.connect();
    
    // Migrate in order of dependencies
    await migrateRoutes();
    await migrateCustomers();
    await migrateDirectSales();
    await migrateRentalItems();
    
    console.log('🎉 Data migration complete!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

// Run if called directly
if (require.main === module) {
  migrateData();
}

module.exports = migrateData;