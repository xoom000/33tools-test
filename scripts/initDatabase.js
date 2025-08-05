const fs = require('fs');
const path = require('path');
const database = require('../api/utils/database');

async function initializeDatabase() {
  try {
    console.log('Initializing Route 33 database...');
    
    // Connect to database
    await database.connect();
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'create_database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        try {
          await database.run(trimmed);
          console.log('✓ Executed:', trimmed.substring(0, 50) + '...');
        } catch (error) {
          console.error('Error executing statement:', trimmed.substring(0, 50) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;