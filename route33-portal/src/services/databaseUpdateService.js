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
      { value: 'mixed', label: 'Mixed Data', description: 'Auto-detect and update multiple data types' }
    ];
  }
}

// Export singleton instance
export const databaseUpdateService = new DatabaseUpdateService();
export default databaseUpdateService;