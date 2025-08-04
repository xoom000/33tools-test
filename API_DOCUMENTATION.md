# 📚 33 Tools Staging API Documentation

## 🌐 Base URL  
- **Staging API**: `http://localhost:2210/api` (TOOLS33STAGING_API)
- **Frontend Proxy**: `http://localhost:2220/api` (TOOLS33STAGING_WEB)
- **Public Access**: `https://test.route33.app/api`

## 🔑 Authentication
### **Multi-Layer Auth System**
- **Driver Authentication**: 
  - Username + bcrypt password (modern)
  - Route number + password (legacy)
  - Setup tokens for account creation
  - Demo tokens for limited access
- **Customer Authentication**: 
  - Customer number + 8-character login codes (7-day expiry)
  - Device tokens for "remember me" functionality
- **Admin Operations**: Route-based access control
- **Security**: bcrypt salt rounds 12, JWT tokens, comprehensive audit logging

---

## 📍 Core API Endpoints

### 🚚 Routes

#### GET /api/routes
Get all delivery routes with driver assignments and customer counts.

**Response:**
```json
{
  "count": 6,
  "routes": [{
    "route_number": 33,
    "driver_name": "Nigel Whaley",
    "is_active": 1,
    "created_at": "2025-07-24 03:25:10",
    "customer_count": 120
  }]
}
```

#### GET /api/routes/:id
Get specific route details.

**Parameters:**
- `id` - Route number (e.g., 33)

---

### 👥 Customers

#### GET /api/customers
List all customers with optional filters.

**Query Parameters:**
- `route_number` - Filter by route (e.g., 33)
- `service_day` - Filter by service day (M, T, W, H, F)
- `city` - Filter by city
- `active` - Filter by active status (true/false)

**Example:** `/api/customers?route_number=33&service_day=F`

**Response:**
```json
{
  "count": 25,
  "customers": [{
    "customer_number": 170449,
    "account_name": "F M Valero",
    "address": "1 Sutter St",
    "city": "Red Bluff",
    "state": "CA",
    "zip_code": "96080",
    "route_number": 33,
    "service_frequency": "Weekly",
    "service_days": "F",
    "is_active": 1,
    "driver_name": "Nigel Whaley"
  }]
}
```

#### GET /api/customers/:id
Get specific customer details.

**Parameters:**
- `id` - Customer number

**Response:** Single customer object with driver name

#### POST /api/customers
Create new customer.

**Request Body:**
```json
{
  "account_name": "New Business",
  "address": "123 Main St",
  "city": "Redding",
  "state": "CA",
  "zip_code": "96001",
  "route_number": 33,
  "service_frequency": "Weekly",
  "service_days": "M"
}
```

**Response:** Created customer object

#### PUT /api/customers/:id
Update existing customer.

**Parameters:**
- `id` - Customer number

**Request Body:** Any customer fields to update

**Response:** Updated customer object

#### GET /api/customers/:id/items
Get customer's rental items and standing orders.

**Parameters:**
- `id` - Customer number

**Response:**
```json
{
  "count": 3,
  "items": [{
    "item_number": "11281619",
    "description": "Uniforms Heavy Soil",
    "quantity": 100,
    "item_type": "rental",
    "frequency": "Weekly",
    "unit_of_measure": "EA"
  }]
}
```

#### POST /api/customers/:id/items
Add rental item or standing order to customer.

**Request Body:**
```json
{
  "item_number": "11281619",
  "quantity": 100,
  "item_type": "rental",
  "frequency": "Weekly",
  "notes": "Deliver with kitchen towels"
}
```

#### GET /api/customers/:id/history
Get customer's service history.

**Query Parameters:**
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "count": 5,
  "history": [{
    "service_date": "2025-07-26",
    "service_type": "delivery",
    "driver_name": "Nigel Whaley",
    "items_delivered": 3,
    "items_picked_up": 2,
    "notes": "Left at back door",
    "items_summary": "11281619:60/0,11720000:20/0"
  }]
}
```

#### POST /api/customers/:id/validate
**Customer login authentication** with customer number and login code.

**Parameters:**
- `id` - Customer number

**Request Body:**
```json
{
  "loginCode": "ABC123XY"
}
```

**Response:**
```json
{
  "success": true,
  "customer": {
    "customer_number": 170449,
    "account_name": "F M Valero",
    "route_number": 33,
    "service_days": "F"
  },
  "message": "Login successful"
}
```

#### POST /api/customers/:id/devices
**Save customer device** for "remember me" functionality.

**Parameters:**
- `id` - Customer number

**Request Body:**
```json
{
  "loginCode": "ABC123XY",
  "deviceName": "John's iPhone"
}
```

**Response:**
```json
{
  "success": true,
  "device_token": "dev_abc123xyz789",
  "device_info": {
    "device_name": "John's iPhone",
    "registered_at": "2025-07-24T11:45:00Z"
  },
  "customer": { /* customer object */ }
}
```

#### GET /api/customers/:id/devices
**Get customer's saved devices**.

**Response:**
```json
{
  "devices": [{
    "device_name": "John's iPhone",
    "device_token": "dev_abc123xyz789",
    "registered_at": "2025-07-24T11:45:00Z",
    "last_used": "2025-07-24T11:45:00Z"
  }]
}
```

#### POST /api/customers/verify-device
**Verify device token** for automatic login.

**Request Body:**
```json
{
  "device_token": "dev_abc123xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "customer": { /* customer object */ }
}
```

---

### 📦 Items

#### GET /api/items
List rental items catalog.

**Query Parameters:**
- `category` - Filter by category
- `active` - Filter by active status
- `search` - Search in description

**Response:**
```json
{
  "count": 150,
  "items": [{
    "item_number": "11281619",
    "description": "Uniforms Heavy Soil",
    "category": "Uniforms",
    "unit_of_measure": "EA",
    "is_active": 1,
    "base_price": 2.50
  }]
}
```

#### GET /api/items/:id
Get specific item details with pricing.

#### POST /api/items
Create new item.

#### PUT /api/items/:id
Update item.

#### DELETE /api/items/:id
Delete item.

---

### 📋 Orders

#### GET /api/orders
List orders for route.

**Query Parameters:**
- `route_number` - Filter by route
- `status` - Filter by status (pending, completed, cancelled)
- `date` - Filter by date

#### POST /api/orders
Create new order.

#### PUT /api/orders/:id
Update order status.

#### DELETE /api/orders/:id
Delete order.

---

### 📑 Order Requests

#### GET /api/order-requests
List customer order requests.

**Query Parameters:**
- `status` - Filter by status (Pending, Approved, Declined)
- `route_number` - Filter by route

**Response:**
```json
{
  "count": 3,
  "orders": [{
    "id": 1,
    "customer_number": 170449,
    "customer_name": "F M Valero",
    "items": "Uniforms x50, Towels x20",
    "status": "Pending",
    "created_at": "2025-07-24T10:00:00Z",
    "route_number": 33
  }]
}
```

#### POST /api/order-requests
Create order request.

#### PUT /api/order-requests/:id/status
Update request status.

---

### 🚛 Service & Deliveries

#### GET /api/service/customers/:route
Service day customers.

#### GET /api/deliveries
Delivery status tracking.

#### POST /api/deliveries
Create delivery record.

---

### 🔧 Driver Authentication

#### POST /api/drivers/login-username
**Modern driver login** with username and password.

**Request Body:**
```json
{
  "username": "driver_username",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "driver": {
    "id": 7,
    "username": "driver_username",
    "name": "Driver Name",
    "route_number": 33,
    "role": "Driver"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/drivers/verify-token
**Verify driver JWT token** for authentication.

**Request Body:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true
}
```

#### POST /api/drivers/validate-setup-token
**Validate driver setup token** for account creation.

#### POST /api/drivers/create-account
**Create driver account** using setup token.

#### POST /api/drivers/validate-demo-token
**Validate demo token** for limited access.

---

### ⚙️ Admin Endpoints

#### GET /api/admin/customers
**Get all customers** with admin-level details including device info.

**Query Parameters:**
- `route_number` - Filter by route
- `include_inactive` - Include inactive customers
- `has_login` - Filter by login code status

**Response:**
```json
{
  "count": 120,
  "customers": [{
    "customer_number": 170449,
    "account_name": "F M Valero",
    "address": "1 Sutter St",
    "city": "Red Bluff",
    "state": "CA",
    "zip_code": "96080",
    "route_number": 33,
    "service_frequency": "Weekly",
    "service_days": "F",
    "is_active": 1,
    "login_code": "ABC123XY",
    "login_code_expires": "2025-07-31T10:00:00Z",
    "order_button": 1,
    "driver_name": "Nigel Whaley",
    "device_count": 2,
    "last_login": "2025-07-24T11:45:00Z"
  }]
}
```

#### POST /api/admin/customers/:id/generate-code
**Generate customer login code** for customer access.

**Parameters:**
- `id` - Customer number

**Response:**
```json
{
  "success": true,
  "customer_number": 170449,
  "login_token": "ABC123XY",
  "expires_at": "2025-07-31T10:00:00Z",
  "is_new": true,
  "message": "Login token generated for F M Valero"
}
```

#### PUT /api/admin/customers/order-config
**Update customer order configuration** and service settings.

**Request Body:**
```json
{
  "customerNumbers": [170449, 170450, 170451]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order button configuration updated for 3 customers",
  "enabled": 3,
  "route": 33
}
```

---

## 📁 Database Update System with Automatic Backup & Rollback

### Base Endpoint: `/api/admin/database-update`

**🛡️ Safety Features:**
- **Automatic backups** created before every update
- **Admin-only rollback** (Route 33 / Nigel only)
- **Transaction safety** with rollback on errors
- **Preview before apply** workflow

---

### 📤 File Upload & Processing

#### POST /api/admin/database-update/upload
Upload and process files for database updates with automatic backup creation.

**Supported Formats:**
- CSV files (.csv) - Smart field mapping for various column names
- Excel spreadsheets (.xlsx) - Full XLSX support
- XML data files (.xml) - Automatic XML-to-object conversion

**Supported Update Types:**
- `customers` - Customer master data updates
- `routes` - Route and driver assignments
- `items` - Item catalog updates

**Request:**
```bash
curl -X POST /api/admin/database-update/upload \
  -F "file=@customers.csv" \
  -F "updateType=customers" \
  -F "options={\"hasHeaders\":true,\"validateData\":true}"
```

**Response:**
```json
{
  "success": true,
  "uploadId": "upload_20250804_abc123",
  "format": "csv",
  "records": 150,
  "changes": {
    "creates": 15,
    "updates": 3,
    "conflicts": 1
  },
  "preview": [
    {
      "action": "create",
      "data": {"customer_number": "170449", "account_name": "New Customer"}
    }
  ]
}
```

#### GET /api/admin/database-update/preview/:uploadId
Preview changes before applying to database.

**Response:**
```json
{
  "success": true,
  "uploadId": "upload_20250804_abc123",
  "totalChanges": 18,
  "changes": [
    {
      "action": "create",
      "table": "customers",
      "data": {"customer_number": "170500", "account_name": "Joe's Diner"}
    },
    {
      "action": "update", 
      "table": "customers",
      "data": {"customer_number": "170449"},
      "changes": {"address": {"old": "123 Main St", "new": "456 Oak Ave"}}
    }
  ],
  "conflicts": [
    {
      "customer_number": "170449",
      "field": "route_number",
      "csv_value": 33,
      "database_value": 25,
      "requires_decision": true
    }
  ]
}
```

---

### 🔄 Database Operations with Auto-Backup

#### POST /api/admin/database-update/apply/:uploadId
Apply previewed changes to database with automatic backup creation.

**🛡️ Safety Process:**
1. **Automatic backup created** before any changes
2. **Database transaction** begins
3. **Changes applied** atomically  
4. **Success** → Backup path stored for rollback
5. **Error** → Transaction rolled back, no changes made

**Request:**
```json
{
  "updateId": "upload_20250804_abc123",
  "selectedChanges": ["create_170500", "update_170449"]
}
```

**Response:**
```json
{
  "success": true,
  "appliedChanges": 15,
  "message": "Successfully applied 15 changes",
  "backupCreated": {
    "backupPath": "/database-backups/backup_2025-08-04T15-30-45_before_update_abc123.db",
    "size": 622592,
    "timestamp": "2025-08-04T15:30:45Z"
  }
}
```

---

### 🔄 Backup & Rollback System (Admin Only)

**🔐 Security:** Only Route 33 (Nigel) can access backup/rollback features

#### GET /api/admin/database-update/backups
List all available database backups.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "backups": [
    {
      "filename": "backup_2025-08-04T15-30-45_before_update_abc123.db",
      "timestamp": "2025-08-04T15:30:45Z", 
      "reason": "before_update_abc123",
      "size": 622592,
      "created": "2025-08-04T15:30:45.123Z",
      "ageMinutes": 15
    }
  ]
}
```

#### POST /api/admin/database-update/backup/create
Create manual database backup.

**Request:**
```json
{
  "reason": "before_major_changes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Database backup created successfully",
  "backupPath": "/database-backups/backup_2025-08-04T16-00-00_before_major_changes.db",
  "size": 622592,
  "timestamp": "2025-08-04T16:00:00Z"
}
```

#### POST /api/admin/database-update/restore
Restore database from specific backup.

**🛡️ Safety:** Creates safety backup of current state before restore

**Request:**
```json
{
  "backupPath": "backup_2025-08-04T15-30-45_before_update_abc123.db"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Database successfully restored",
  "restoredFrom": "/database-backups/backup_2025-08-04T15-30-45_before_update_abc123.db",
  "safetyBackup": "/database-backups/backup_2025-08-04T16-05-00_pre_restore_safety.db",
  "timestamp": "2025-08-04T16:05:00Z"
}
```

#### POST /api/admin/database-update/rollback/:updateId
Rollback specific database update using its backup.

**Request:**
```bash
curl -X POST /api/admin/database-update/rollback \
  -H "Content-Type: application/json" \
  -d '{"updateId": "upload_20250804_abc123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Database successfully restored",
  "rolledBackUpdate": "upload_20250804_abc123",
  "restoredFrom": "/database-backups/backup_2025-08-04T15-30-45_before_update_abc123.db"
}
```

---

### 🎯 RouteOptimization CSV Comparison

#### POST /api/admin/database-update/route-optimization-compare
Compare RouteOptimization CSV against current customer database.

**Request:**
```bash
curl -X POST /api/admin/database-update/route-optimization-compare \
  -F "file=@RouteOptimization.csv"
```

**Response:**
```json
{
  "success": true,
  "filename": "RouteOptimization.csv",
  "totalCustomers": 120,
  "matches": 110,
  "missing": 10,
  "newCustomers": 5,
  "details": {
    "matchingCustomers": ["170449", "170450"],
    "missingFromDatabase": ["170999"],
    "newInCSV": ["171000"]
  }
}
```

---

## 🚀 Dev Transfer System (Development Only)

### Base Endpoint: `/api/dev-transfer`

#### POST /api/dev-transfer/upload
Upload files for development/testing.

**Request:**
```bash
curl -X POST /api/dev-transfer/upload \
  -F "file=@test-data.csv"
```

**Response:**
```json
{
  "success": true,
  "filename": "1754318579471_336ed46f_test-data.csv",
  "originalName": "test-data.csv",
  "size": 2048
}
```

#### GET /api/dev-transfer/files
List uploaded files.

#### GET /api/dev-transfer/download/:filename
Download uploaded file.

#### DELETE /api/dev-transfer/delete/:filename
Delete uploaded file.

---

### 🛠️ Utility & Debug Endpoints

#### GET /api/debug/status
**Mobile-friendly system status** with HTML interface.

#### GET /api/debug/errors
**Recent errors** in mobile-friendly format.

#### GET /api/debug/routes-info
**Route debugging information** for troubleshooting.

#### GET /api/morning-prep/load-list/:route
**Route load list** for morning preparation.

#### POST /api/morning-prep/print
**Print preparation docs**.

---

## 📊 Reports (Framework Ready)

#### GET /api/reports/route-summary/:route
Route summary report.

#### GET /api/reports/customer-activity
Customer activity report.

#### GET /api/reports/route-load
Route load reports.

#### GET /api/reports/inventory
Inventory reports.

---

## 🔧 Common Patterns

### Error Responses
```json
{
  "error": "Customer not found",
  "status": 404
}
```

### Validation Errors
```json
{
  "errors": [{
    "msg": "Invalid zip code",
    "param": "zip_code",
    "location": "body"
  }]
}
```

### Pagination (Coming Soon)
```
GET /api/customers?page=1&limit=50
```

### Sorting (Coming Soon)
```
GET /api/customers?sort=account_name&order=asc
```

---

## 🛡️ Security & Configuration

### Authentication Headers
- **X-Route-Number**: Route number for route-based access control
- **Authorization**: Bearer JWT token for driver authentication
- **Content-Type**: application/json for POST/PUT requests

### File Upload Limits
- **Max Size**: 100MB per file
- **Auto-cleanup**: Files deleted after 24 hours
- **Security**: File type validation, sanitized filenames

### Rate Limiting
- Standard rate limiting applied to all endpoints
- Enhanced limits for admin operations

---

## 📱 Frontend Integration Examples

### Customer Authentication
```javascript
const authenticateCustomer = async (customerNumber, loginCode) => {
  const response = await fetch(`/api/customers/${customerNumber}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginCode })
  });
  const data = await response.json();
  return data.customer;
};
```

### Get Route Customers  
```javascript
const response = await fetch('/api/admin/customers?route_number=33');
const data = await response.json();
console.log(`Found ${data.count} customers`);
```

### Driver Authentication
```javascript
const loginDriver = async (username, password) => {
  const response = await fetch('/api/drivers/login-username', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

---

## 🏗️ Database Schema Overview

### Core Tables
- **routes** - Delivery routes with drivers
- **customers** - Customer accounts and service schedules
- **item_catalog** - Master list of all items (rental & sales)
- **customer_items** - Which items each customer has/uses
- **pricing** - Flexible pricing (base, customer, volume)
- **orders** - One-time purchase orders
- **service_history** - Delivery/pickup records
- **drivers** - Driver accounts with authentication
- **driver_setup_tokens** - Temporary tokens for account creation
- **demo_tokens** - Limited access tokens
- **customer_devices** - Device tokens for auto-login

---

*Last Updated: August 4, 2025*  
*Environment: Staging (Port 2210)*  
*Version: 3.1.0 - Added Automatic Backup & Rollback System*  
*New Features: Admin-only database rollback, automatic backups, restore functionality*