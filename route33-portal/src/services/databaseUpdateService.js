// COMPOSE, NEVER DUPLICATE - Ultimate Database Update System! ⚔️
// Handles CSV, XML, XLSX, and eventually IMAGES for database updates

// File Processing Pipeline
class DatabaseUpdateService {
  constructor() {
    this.API_BASE = '/api/admin/database-update';
    this.supportedFormats = ['csv', 'xml', 'xlsx', 'jpg', 'png', 'pdf'];
  }

  // UNIFIED FILE UPLOAD - Handles ALL formats
  async uploadFile(file, updateType, options = {}) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('updateType', updateType); // 'customers', 'routes', 'items', etc.
      formData.append('options', JSON.stringify(options));

      // Upload and process
      const response = await fetch(`${this.API_BASE}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33' // Your route authentication
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Database update failed:', error);
      throw error;
    }
  }

  // FILE VALIDATION - Unified validation for all formats
  validateFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB max
    const extension = file.name.split('.').pop().toLowerCase();

    if (!this.supportedFormats.includes(extension)) {
      return {
        isValid: false,
        error: `Unsupported format: ${extension}. Supported: ${this.supportedFormats.join(', ')}`
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 50MB`
      };
    }

    return { isValid: true };
  }

  // PREVIEW UPDATES - See what will change before applying
  async previewUpdates(file, updateType, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('updateType', updateType);
      formData.append('options', JSON.stringify({ ...options, previewOnly: true }));

      const response = await fetch(`${this.API_BASE}/preview`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Preview failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Preview failed:', error);
      throw error;
    }
  }

  // APPLY UPDATES - Execute the database changes
  async applyUpdates(updateId, selectedChanges = null) {
    try {
      const response = await fetch(`${this.API_BASE}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Route-Number': '33'
        },
        body: JSON.stringify({
          updateId,
          selectedChanges // Allow partial updates
        })
      });

      if (!response.ok) {
        throw new Error(`Apply failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Apply updates failed:', error);
      throw error;
    }
  }

  // ROLLBACK UPDATES - Undo changes if needed
  async rollbackUpdates(updateId) {
    try {
      const response = await fetch(`${this.API_BASE}/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Route-Number': '33'
        },
        body: JSON.stringify({ updateId })
      });

      if (!response.ok) {
        throw new Error(`Rollback failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }

  // GET UPDATE HISTORY - Track all database updates
  async getUpdateHistory(limit = 50) {
    try {
      const response = await fetch(`${this.API_BASE}/history?limit=${limit}`, {
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`History fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('History fetch failed:', error);
      throw error;
    }
  }

  // ===== NEW STAGING WORKFLOW METHODS =====

  // STAGE CUSTOMER SHELLS - Stage customer additions for driver validation
  async stageCustomerShells(file, options = {}) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);
      if (options.batchId) {
        formData.append('batch_id', options.batchId);
      }

      const response = await fetch(`${this.API_BASE}/stage-customer-shells`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Customer shell staging failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer shell staging failed:', error);
      throw error;
    }
  }

  // STAGE CUSTOMER REMOVALS - Stage customer removals for driver validation
  async stageCustomerRemovals(file, options = {}) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);
      if (options.batchId) {
        formData.append('batch_id', options.batchId);
      }

      const response = await fetch(`${this.API_BASE}/stage-customer-removals`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Customer removal staging failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer removal staging failed:', error);
      throw error;
    }
  }

  // STAGE CUSTOMER UPDATES - Stage customer updates for driver validation
  async stageCustomerUpdates(file, options = {}) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);
      if (options.batchId) {
        formData.append('batch_id', options.batchId);
      }

      const response = await fetch(`${this.API_BASE}/stage-customer-updates`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Customer update staging failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer update staging failed:', error);
      throw error;
    }
  }

  // STAGE INVENTORY POPULATION - Stage inventory for existing customer shells
  async stageInventoryPopulation(file, batchId, options = {}) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('batch_id', batchId);

      const response = await fetch(`${this.API_BASE}/stage-inventory-population`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Inventory staging failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Inventory staging failed:', error);
      throw error;
    }
  }

  // GET PENDING CHANGES - Get staged changes for a specific route
  async getPendingChanges(routeNumber) {
    try {
      const response = await fetch(`${this.API_BASE}/pending-changes/${routeNumber}`, {
        headers: {
          'X-Route-Number': routeNumber.toString()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get pending changes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get pending changes:', error);
      throw error;
    }
  }

  // VALIDATE/APPROVE CHANGES - Driver approves/rejects changes for their route
  async validateChanges(routeNumber, approvedChangeIds, rejectedChangeIds = []) {
    try {
      const response = await fetch(`${this.API_BASE}/validate-changes/${routeNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Route-Number': routeNumber.toString()
        },
        body: JSON.stringify({
          approved_change_ids: approvedChangeIds,
          rejected_change_ids: rejectedChangeIds
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to validate changes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to validate changes:', error);
      throw error;
    }
  }

  // GET VALIDATION STATUS - Get validation status for all routes
  async getValidationStatus() {
    try {
      const response = await fetch(`${this.API_BASE}/validation-status`, {
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get validation status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get validation status:', error);
      throw error;
    }
  }

  // COMPARE ROUTE OPTIMIZATION - Compare CSV against current database
  async compareRouteOptimization(file) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.API_BASE}/route-optimization-compare`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Route-Number': '33'
        }
      });

      if (!response.ok) {
        throw new Error(`Route optimization comparison failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Route optimization comparison failed:', error);
      throw error;
    }
  }

  // FORMAT-SPECIFIC HELPERS
  getFormatIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const icons = {
      csv: '📊',
      xml: '🏷️', 
      xlsx: '📗',
      jpg: '🖼️',
      png: '🖼️',
      pdf: '📄'
    };
    return icons[extension] || '📄';
  }

  getUpdateTypeOptions() {
    return [
      { value: 'customers', label: 'Customer Data', description: 'Update customer information, addresses, routes' },
      { value: 'routes', label: 'Route Information', description: 'Update driver assignments, route schedules' },
      { value: 'items', label: 'Rental Items', description: 'Update product catalog, pricing, categories' },
      { value: 'sales', label: 'Sales Data', description: 'Update sales records, transactions' },
      { value: 'inventory', label: 'Inventory Levels', description: 'Update stock levels, par levels' },
      { value: 'route_optimization', label: 'RouteOptimization CSV', description: 'Compare RouteOptimization CSV against current database' },
      { value: 'stage_customer_shells', label: 'Stage Customer Shells', description: 'Stage customer additions for driver validation (NEW WORKFLOW)' },
      { value: 'stage_customer_removals', label: 'Stage Customer Removals', description: 'Stage customer removals for driver validation (NEW WORKFLOW)' },
      { value: 'stage_customer_updates', label: 'Stage Customer Updates', description: 'Stage customer updates for driver validation (NEW WORKFLOW)' },
      { value: 'stage_inventory_population', label: 'Stage Inventory Population', description: 'Stage inventory for customer shells (requires batch_id)' },
      { value: 'mixed', label: 'Mixed Data', description: 'Auto-detect and update multiple data types' }
    ];
  }
}

// Export singleton instance
export const databaseUpdateService = new DatabaseUpdateService();
export default databaseUpdateService;