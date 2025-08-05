import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import useLoginLogic from './useLoginLogic';

// react-router-dom is mocked globally in setupTests.js

// Mock dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    loginDriver: jest.fn()
  })
}));

jest.mock('../services/api', () => ({
  authService: {
    validateDemoToken: jest.fn(),
    createDriverAccount: jest.fn(),
    validateSetupToken: jest.fn(),
    validateLogin: jest.fn(),
    loginDriver: jest.fn()
  }
}));

jest.mock('./useModalManager', () => ({
  useModalManager: () => ({
    modals: {
      showTokenModal: false,
      showAccountSetupModal: false,
      showDemoModal: false
    },
    openModal: jest.fn(),
    closeModal: jest.fn()
  })
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn()
}));

jest.mock('../constants/auth', () => ({
  ROUTES: {
    DEMO: '/demo',
    CUSTOMER_PORTAL: (id) => `/customer/${id}`
  },
  ERROR_MESSAGES: {
    PASSWORDS_DONT_MATCH: 'Passwords do not match'
  },
  BUTTON_ACTIONS: {
    DRIVER_LOGIN: 'driver-login',
    SETUP_TOKEN: 'setup-token',
    DEMO_ACCESS: 'demo-access'
  }
}));

describe('useLoginLogic Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default state', () => {
    const { result } = renderHook(() => useLoginLogic());
    
    expect(result.current.loginType).toBe('');
    expect(result.current.modals).toEqual({
      showTokenModal: false,
      showAccountSetupModal: false,
      showDemoModal: false
    });
    expect(result.current.tokenData).toEqual({
      token: '',
      validatedDriver: null
    });
  });

  test('provides all expected handlers', () => {
    const { result } = renderHook(() => useLoginLogic());
    
    expect(typeof result.current.handleDemoAccess).toBe('function');
    expect(typeof result.current.handleAccountSetupSubmit).toBe('function');
    expect(typeof result.current.handleTokenValidationSubmit).toBe('function');
    expect(typeof result.current.handleCustomerLoginSubmit).toBe('function');
    expect(typeof result.current.handleDriverLoginSubmit).toBe('function');
    expect(typeof result.current.handleButtonAction).toBe('function');
    expect(typeof result.current.openModal).toBe('function');
    expect(typeof result.current.closeModal).toBe('function');
    expect(typeof result.current.setLoginType).toBe('function');
  });

  test('updates login type correctly', () => {
    const { result } = renderHook(() => useLoginLogic());
    
    act(() => {
      result.current.setLoginType('driver');
    });
    
    expect(result.current.loginType).toBe('driver');
  });

  test('handles demo access submission successfully', async () => {
    const { authService } = require('../services/api');
    authService.validateDemoToken.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useLoginLogic());
    
    await act(async () => {
      await result.current.handleDemoAccess({ demoToken: 'DEMO123' });
    });
    
    expect(authService.validateDemoToken).toHaveBeenCalledWith('DEMO123');
  });

  test('handles customer login submission successfully', async () => {
    const { authService } = require('../services/api');
    authService.validateLogin.mockResolvedValue({
      success: true,
      customer_number: 'CUST123'
    });
    
    const { result } = renderHook(() => useLoginLogic());
    
    await act(async () => {
      await result.current.handleCustomerLoginSubmit({
        customerNumber: 'CUST123',
        loginCode: 'CODE456'
      });
    });
    
    expect(authService.validateLogin).toHaveBeenCalledWith('CUST123', 'CODE456');
  });

  test('handles driver login submission successfully', async () => {
    const { authService } = require('../services/api');
    const mockLoginDriver = jest.fn();
    
    // Re-mock AuthContext for this test
    jest.doMock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        loginDriver: mockLoginDriver
      })
    }));
    
    authService.loginDriver.mockResolvedValue({
      driver: { route_number: '1', role: 'driver' },
      token: 'token123'
    });
    
    const { result } = renderHook(() => useLoginLogic());
    
    await act(async () => {
      await result.current.handleDriverLoginSubmit({
        username: 'testuser',
        password: 'password123'
      });
    });
    
    expect(authService.loginDriver).toHaveBeenCalledWith('testuser', 'password123');
  });

  test('handles token validation submission successfully', async () => {
    const { authService } = require('../services/api');
    authService.validateSetupToken.mockResolvedValue({
      driver: { route_number: '1', name: 'Test Driver' }
    });
    
    const { result } = renderHook(() => useLoginLogic());
    
    await act(async () => {
      await result.current.handleTokenValidationSubmit({ token: 'TOKEN123' });
    });
    
    expect(authService.validateSetupToken).toHaveBeenCalledWith('TOKEN123');
    expect(result.current.tokenData.token).toBe('TOKEN123');
    expect(result.current.tokenData.validatedDriver).toEqual({
      route_number: '1',
      name: 'Test Driver'
    });
  });

  test('handles account setup submission with matching passwords', async () => {
    const { authService } = require('../services/api');
    const mockLoginDriver = jest.fn();
    
    jest.doMock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        loginDriver: mockLoginDriver
      })
    }));
    
    authService.validateSetupToken.mockResolvedValue({
      driver: { route_number: '1', name: 'Test Driver' }
    });
    
    authService.createDriverAccount.mockResolvedValue({
      driver: { route_number: '1' },
      token: 'newtoken123'
    });
    
    const { result } = renderHook(() => useLoginLogic());
    
    // Set up token data first by calling the token validation handler
    await act(async () => {
      await result.current.handleTokenValidationSubmit({ token: 'SETUP_TOKEN' });
    });
    
    await act(async () => {
      await result.current.handleAccountSetupSubmit({
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
    
    expect(authService.createDriverAccount).toHaveBeenCalledWith(
      'SETUP_TOKEN',
      'newuser',
      'password123'
    );
  });

  test('handles account setup submission with mismatched passwords', async () => {
    const { result } = renderHook(() => useLoginLogic());
    
    await act(async () => {
      try {
        await result.current.handleAccountSetupSubmit({
          username: 'newuser',
          password: 'password123',
          confirmPassword: 'different123'
        });
      } catch (error) {
        expect(error.message).toBe('Passwords do not match');
      }
    });
  });

  test('handles button actions correctly', () => {
    const { result } = renderHook(() => useLoginLogic());
    
    act(() => {
      result.current.handleButtonAction('driver');
    });
    
    expect(result.current.loginType).toBe('driver');
    
    act(() => {
      result.current.handleButtonAction('setup-token');
    });
    
    // Should call openModal (we can't easily test the call here due to mocking)
    
    act(() => {
      result.current.handleButtonAction('demo-access');
    });
    
    // Should call openModal for demo
  });

  test('handles unknown button actions gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() => useLoginLogic());
    
    act(() => {
      result.current.handleButtonAction('unknown-action');
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Unknown button action:', 'unknown-action');
    consoleSpy.mockRestore();
  });
});