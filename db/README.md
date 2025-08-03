# Database Structure Extraction

This directory contains the extracted SQL structure and data from master.db.

## Directory Structure

```
db/
├── tables/          # Individual table SQL files with CREATE TABLE and INSERT statements
│   ├── categories.sql
│   ├── customer_notes.sql
│   ├── customer_par_levels.sql
│   ├── customer_product_list.sql
│   ├── customer_rental_items.sql
│   ├── customers.sql
│   ├── delivery_status.sql
│   ├── direct_sales.sql
│   ├── drivers.sql
│   ├── order_items.sql
│   ├── order_requests.sql
│   ├── rental_items_catalog.sql
│   ├── route_load_summary.sql
│   ├── route_stop_order.sql
│   ├── routes.sql
│   ├── sales.sql
│   ├── transactions.sql
│   └── users.sql
└── indexes/         # Database indexes
    └── indexes.sql

```

## Table Files

Each table file in the `tables/` directory contains:
1. The complete CREATE TABLE statement with all column definitions
2. All data from the table as INSERT statements

## Index File

The `indexes/indexes.sql` file contains all CREATE INDEX statements for query optimization.

## Usage

To recreate the database structure:
1. Create a new SQLite database
2. Execute each .sql file in the tables/ directory
3. Execute the indexes.sql file to create indexes

Example:
```bash
sqlite3 new_database.db < db/tables/customers.sql
sqlite3 new_database.db < db/tables/routes.sql
# ... repeat for all tables
sqlite3 new_database.db < db/indexes/indexes.sql
```

Or to recreate all at once:
```bash
for file in db/tables/*.sql; do sqlite3 new_database.db < "$file"; done
sqlite3 new_database.db < db/indexes/indexes.sql
```