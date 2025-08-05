import '@testing-library/jest-dom';
import { databaseUpdateService } from './databaseUpdateService';

// Mock fetch globally
global.fetch = jest.fn();

describe('DatabaseUpdateService', () => {
  const mockApiUrl = '/api/admin/database-update';

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('uploadFile', () => {
    test('uploads file successfully', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      const mockResponse = {
        success: true,
        updateId: 'update_123',
        message: 'File uploaded successfully'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.uploadFile(mockFile, 'customers');

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/upload`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: {
            'X-Route-Number': '33'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles file upload validation errors', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      await expect(
        databaseUpdateService.uploadFile(mockFile, 'customers')
      ).rejects.toThrow('Unsupported format: txt');
    });

    test('handles file size validation', async () => {
      // Create a mock file that's too large (over 50MB)
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      Object.defineProperty(mockFile, 'size', { value: 60 * 1024 * 1024 }); // 60MB

      await expect(
        databaseUpdateService.uploadFile(mockFile, 'customers')
      ).rejects.toThrow('File too large');
    });
  });

  describe('previewUpdates', () => {
    test('previews database updates successfully', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      const mockResponse = {
        success: true,
        changes: [
          { type: 'add', table: 'customers', data: { name: 'New Customer' } }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.previewUpdates(mockFile, 'customers');

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/preview`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: {
            'X-Route-Number': '33'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles preview errors', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(
        databaseUpdateService.previewUpdates(mockFile, 'customers')
      ).rejects.toThrow('Preview failed: 400');
    });
  });

  describe('applyUpdates', () => {
    test('applies database updates successfully', async () => {
      const mockResponse = {
        success: true,
        applied: 5,
        message: 'Updates applied successfully'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.applyUpdates('update_123');

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/apply`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({
            updateId: 'update_123',
            selectedChanges: null
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles apply updates failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(
        databaseUpdateService.applyUpdates('update_123')
      ).rejects.toThrow('Apply failed: 500');
    });
  });

  describe('rollbackUpdates', () => {
    test('rolls back database updates successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Updates rolled back successfully'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.rollbackUpdates('update_123');

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/rollback`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ updateId: 'update_123' })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles rollback failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(
        databaseUpdateService.rollbackUpdates('update_123')
      ).rejects.toThrow('Rollback failed: 400');
    });
  });

  describe('getUpdateHistory', () => {
    test('fetches update history successfully', async () => {
      const mockResponse = {
        success: true,
        history: [
          { id: 'update_1', date: '2025-01-01', type: 'customers' },
          { id: 'update_2', date: '2025-01-02', type: 'routes' }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.getUpdateHistory();

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/history?limit=50`,
        expect.objectContaining({
          headers: {
            'X-Route-Number': '33'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('accepts custom limit parameter', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, history: [] })
      });

      await databaseUpdateService.getUpdateHistory(25);

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/history?limit=25`,
        expect.any(Object)
      );
    });
  });

  describe('validateFile', () => {
    test('validates CSV file format', () => {
      const validFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = databaseUpdateService.validateFile(validFile);
      
      expect(result.isValid).toBe(true);
    });

    test('validates XLSX file format', () => {
      const validFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const result = databaseUpdateService.validateFile(validFile);
      
      expect(result.isValid).toBe(true);
    });

    test('rejects unsupported file format', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = databaseUpdateService.validateFile(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported format: txt');
    });

    test('rejects files that are too large', () => {
      const largeFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      Object.defineProperty(largeFile, 'size', { value: 60 * 1024 * 1024 }); // 60MB
      
      const result = databaseUpdateService.validateFile(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File too large');
    });
  });

  describe('Staging Workflow', () => {
    test('stages customer shells successfully', async () => {
      const mockFile = new File(['test'], 'customers.csv', { type: 'text/csv' });
      const mockResponse = {
        success: true,
        batchId: 'batch_123',
        staged: 10
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.stageCustomerShells(mockFile);

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/stage-customer-shells`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: {
            'X-Route-Number': '33'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('gets pending changes for route', async () => {
      const mockResponse = {
        success: true,
        pendingChanges: [
          { id: 'change_1', type: 'add', customer: 'New Customer' }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.getPendingChanges(1);

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/pending-changes/1`,
        expect.objectContaining({
          headers: {
            'X-Route-Number': '1'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('validates changes successfully', async () => {
      const mockResponse = {
        success: true,
        validated: 5,
        rejected: 2
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.validateChanges(1, ['change_1', 'change_2'], ['change_3']);

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/validate-changes/1`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '1'
          },
          body: JSON.stringify({
            approved_change_ids: ['change_1', 'change_2'],
            rejected_change_ids: ['change_3']
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Route Optimization', () => {
    test('compares route optimization successfully', async () => {
      const mockFile = new File(['test'], 'routes.csv', { type: 'text/csv' });
      const mockResponse = {
        success: true,
        comparison: {
          added: 5,
          removed: 2,
          changed: 3
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await databaseUpdateService.compareRouteOptimization(mockFile);

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/route-optimization-compare`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          headers: {
            'X-Route-Number': '33'
          }
        })
      );
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Helper Methods', () => {
    test('returns correct format icons', () => {
      expect(databaseUpdateService.getFormatIcon('test.csv')).toBe('📊');
      expect(databaseUpdateService.getFormatIcon('test.xlsx')).toBe('📗');
      expect(databaseUpdateService.getFormatIcon('test.xml')).toBe('🏷️');
      expect(databaseUpdateService.getFormatIcon('test.jpg')).toBe('🖼️');
      expect(databaseUpdateService.getFormatIcon('test.unknown')).toBe('📄');
    });

    test('returns update type options', () => {
      const options = databaseUpdateService.getUpdateTypeOptions();
      
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]).toHaveProperty('value');
      expect(options[0]).toHaveProperty('label');
      expect(options[0]).toHaveProperty('description');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        databaseUpdateService.uploadFile(mockFile, 'customers')
      ).rejects.toThrow('Network error');
    });

    test('handles HTTP errors', async () => {
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(
        databaseUpdateService.previewUpdates(mockFile, 'customers')
      ).rejects.toThrow('Preview failed: 500');
    });

    test('handles invalid file validation', async () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      await expect(
        databaseUpdateService.stageCustomerShells(invalidFile)
      ).rejects.toThrow('Unsupported format: txt');
    });
  });
});