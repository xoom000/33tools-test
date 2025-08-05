import '@testing-library/jest-dom';
import { authService, customerService, adminService } from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    
    // Mock window.location for route detection
    delete window.location;
    window.location = { pathname: '/route/33' };
    
    // Mock successful response by default
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: {} }),
      text: async () => 'success',
      headers: new Map([['content-type', 'application/json']])
    });
  });

  describe('authService', () => {
    describe('validateLogin', () => {
      test('validates customer login correctly', async () => {
        const mockResponse = {
          success: true,
          customer_number: 'CUST123',
          name: 'John Customer'
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await authService.validateLogin('CUST123', 'LOGIN456');

        expect(fetch).toHaveBeenCalledWith('/api/customers/CUST123/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ loginCode: 'LOGIN456' })
        });
        
        expect(result).toEqual(mockResponse);
      });

      test('handles validation failure', async () => {
        fetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => 'Invalid login code',
          headers: new Map([['content-type', 'application/json']])
        });

        await expect(authService.validateLogin('INVALID', 'WRONG')).rejects.toThrow('API Error: 400 - Invalid login code');
      });
    });

    describe('saveDevice', () => {
      test('saves device successfully', async () => {
        const mockResponse = {
          success: true,
          device_token: 'device123'
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await authService.saveDevice('CUST123', 'LOGIN456', 'iPhone');

        expect(fetch).toHaveBeenCalledWith('/api/customers/CUST123/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ loginCode: 'LOGIN456', deviceName: 'iPhone' })
        });
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('verifyDeviceToken', () => {
      test('verifies device token successfully', async () => {
        const mockResponse = {
          success: true,
          customer: { customer_number: 'CUST123' }
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await authService.verifyDeviceToken('device123');

        expect(fetch).toHaveBeenCalledWith('/api/customers/verify-device', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ deviceToken: 'device123' })
        });
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('loginDriver', () => {
      test('logs in driver successfully', async () => {
        const mockResponse = {
          success: true,
          driver: { route_number: 1, name: 'John Driver' },
          token: 'driver-token-123'
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await authService.loginDriver('john_driver', 'password123');

        expect(fetch).toHaveBeenCalledWith('/api/drivers/login-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ username: 'john_driver', password: 'password123' })
        });
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('validateSetupToken', () => {
      test('validates setup token successfully', async () => {
        const mockResponse = {
          success: true,
          driver: { route_number: 1, name: 'New Driver' }
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await authService.validateSetupToken('setup-token-123');

        expect(fetch).toHaveBeenCalledWith('/api/drivers/validate-setup-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ token: 'setup-token-123' })
        });
        
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('customerService', () => {
    describe('getCustomerData', () => {
      test('fetches customer data successfully', async () => {
        const mockCustomerData = {
          customer_number: 'CUST123',
          name: 'Jane Customer',
          address: '123 Main St'
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockCustomerData,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await customerService.getCustomerData('CUST123');

        expect(fetch).toHaveBeenCalledWith('/api/customers/CUST123', {
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          }
        });
        
        expect(result).toEqual(mockCustomerData);
      });
    });

    describe('getCustomerItems', () => {
      test('fetches customer items successfully', async () => {
        const mockItems = {
          items: [
            { id: 'ITEM1', name: 'Milk', quantity: 2 },
            { id: 'ITEM2', name: 'Bread', quantity: 1 }
          ]
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockItems,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await customerService.getCustomerItems('CUST123');

        expect(fetch).toHaveBeenCalledWith('/api/customers/CUST123/items', {
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          }
        });
        
        expect(result).toEqual(mockItems);
      });
    });
  });

  describe('adminService', () => {
    describe('getCustomers', () => {
      test('fetches customers for route', async () => {
        const mockCustomers = {
          count: 2,
          customers: [
            { customer_number: 'CUST1', name: 'Customer 1' },
            { customer_number: 'CUST2', name: 'Customer 2' }
          ]
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockCustomers,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await adminService.getCustomers(33);

        expect(fetch).toHaveBeenCalledWith('/api/admin/customers?route_number=33', {
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          }
        });
        
        expect(result).toEqual(mockCustomers);
      });

      test('uses default route number', async () => {
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ count: 0, customers: [] }),
          headers: new Map([['content-type', 'application/json']])
        });

        await adminService.getCustomers();

        expect(fetch).toHaveBeenCalledWith('/api/admin/customers?route_number=33', expect.any(Object));
      });
    });

    describe('generateLoginToken', () => {
      test('generates login token successfully', async () => {
        const mockResponse = {
          success: true,
          customer_number: 'CUST123',
          login_token: 'LOGIN456',
          expires_at: '2025-01-15T10:00:00Z',
          is_new: false,
          message: 'Token generated successfully'
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const result = await adminService.generateLoginToken('CUST123');

        expect(fetch).toHaveBeenCalledWith('/api/admin/customers/CUST123/generate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          }
        });
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateOrderConfig', () => {
      test('updates order configuration successfully', async () => {
        const mockResponse = {
          success: true,
          message: 'Order configuration updated',
          enabled: true
        };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Map([['content-type', 'application/json']])
        });

        const customerNumbers = ['CUST1', 'CUST2', 'CUST3'];
        const result = await adminService.updateOrderConfig(customerNumbers);

        expect(fetch).toHaveBeenCalledWith('/api/admin/customers/order-config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Route-Number': '33'
          },
          body: JSON.stringify({ customerNumbers })
        });
        
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.validateLogin('CUST123', 'LOGIN456')).rejects.toThrow('Network error');
    });

    test('handles API errors with status codes', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Customer not found',
        headers: new Map([['content-type', 'application/json']])
      });

      await expect(customerService.getCustomerData('INVALID')).rejects.toThrow('API Error: 404 - Customer not found');
    });

    test('handles route extraction from URL', () => {
      // Test route extraction logic
      window.location.pathname = '/route/55';
      
      // The route should be extracted in the next API call
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Map()
      });

      authService.validateLogin('TEST', 'TEST');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Route-Number': '55'
          })
        })
      );
    });

    test('defaults to route 33 when no route in URL', () => {
      window.location.pathname = '/dashboard';
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Map()
      });

      authService.validateLogin('TEST', 'TEST');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Route-Number': '33'
          })
        })
      );
    });
  });
});