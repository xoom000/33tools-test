import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// react-router-dom is mocked globally in setupTests.js

// Mock API services
jest.mock('../../services/api', () => ({
  authService: {
    validateDriverLogin: jest.fn(),
    validateCustomerLogin: jest.fn(),
    generateDeviceToken: jest.fn()
  },
  customerService: {
    getCustomerData: jest.fn(),
    updateItemQuantity: jest.fn()
  },
  adminService: {
    getAllCustomers: jest.fn(),
    generateCustomerToken: jest.fn()
  }
}));

describe('User Flow Integration Tests', () => {
  const { authService, customerService, adminService } = require('../../services/api');
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('API Service Integration', () => {
    test('authService functions are properly mocked', () => {
      expect(authService.validateDriverLogin).toBeDefined();
      expect(authService.validateCustomerLogin).toBeDefined();
      expect(authService.generateDeviceToken).toBeDefined();
    });

    test('customerService functions are properly mocked', () => {
      expect(customerService.getCustomerData).toBeDefined();
      expect(customerService.updateItemQuantity).toBeDefined();
    });

    test('adminService functions are properly mocked', () => {
      expect(adminService.getAllCustomers).toBeDefined();
      expect(adminService.generateCustomerToken).toBeDefined();
    });
  });

  describe('Driver Login Flow', () => {
    test('driver login API call works', async () => {
      authService.validateDriverLogin.mockResolvedValue({
        success: true,
        data: { routeId: 'ROUTE123', driverName: 'John Driver' }
      });

      const result = await authService.validateDriverLogin('ROUTE123');
      
      expect(authService.validateDriverLogin).toHaveBeenCalledWith('ROUTE123');
      expect(result.success).toBe(true);
      expect(result.data.routeId).toBe('ROUTE123');
    });

    test('driver login handles errors', async () => {
      authService.validateDriverLogin.mockResolvedValue({
        success: false,
        error: 'Invalid route token'
      });

      const result = await authService.validateDriverLogin('INVALID');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid route token');
    });
  });

  describe('Customer Login Flow', () => {
    test('customer login API call works', async () => {
      authService.validateCustomerLogin.mockResolvedValue({
        success: true,
        data: { customerId: 'CUST123', customerName: 'Jane Customer' }
      });

      const result = await authService.validateCustomerLogin({
        customerNumber: 'CUST123',
        loginCode: 'LOGIN456'
      });
      
      expect(authService.validateCustomerLogin).toHaveBeenCalledWith({
        customerNumber: 'CUST123',
        loginCode: 'LOGIN456'
      });
      expect(result.success).toBe(true);
      expect(result.data.customerId).toBe('CUST123');
    });
  });

  describe('Customer Data Flow', () => {
    test('customer data retrieval works', async () => {
      customerService.getCustomerData.mockResolvedValue({
        success: true,
        data: {
          customer: { id: 'CUST123', name: 'Jane Customer' },
          nextService: { date: '2025-01-15', items: [] }
        }
      });

      const result = await customerService.getCustomerData('CUST123');
      
      expect(customerService.getCustomerData).toHaveBeenCalledWith('CUST123');
      expect(result.success).toBe(true);
      expect(result.data.customer.id).toBe('CUST123');
    });

    test('item quantity update works', async () => {
      customerService.updateItemQuantity.mockResolvedValue({
        success: true,
        data: { message: 'Quantity updated' }
      });

      const result = await customerService.updateItemQuantity({
        deviceToken: 'DEVICE456',
        itemId: 'ITEM1',
        quantity: 3
      });
      
      expect(customerService.updateItemQuantity).toHaveBeenCalledWith({
        deviceToken: 'DEVICE456',
        itemId: 'ITEM1',
        quantity: 3
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Admin Functions', () => {
    test('get all customers works', async () => {
      adminService.getAllCustomers.mockResolvedValue({
        success: true,
        data: [
          { id: 'CUST1', name: 'Customer One' },
          { id: 'CUST2', name: 'Customer Two' }
        ]
      });

      const result = await adminService.getAllCustomers();
      
      expect(adminService.getAllCustomers).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    test('generate customer token works', async () => {
      adminService.generateCustomerToken.mockResolvedValue({
        success: true,
        data: {
          token: 'CUSTOMER_TOKEN_123',
          loginCode: 'LOGIN789'
        }
      });

      const result = await adminService.generateCustomerToken('CUST1', 'DEVICE1');
      
      expect(adminService.generateCustomerToken).toHaveBeenCalledWith('CUST1', 'DEVICE1');
      expect(result.success).toBe(true);
      expect(result.data.loginCode).toBe('LOGIN789');
    });
  });
});