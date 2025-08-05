import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Mock the OptimizedAuthProvider to simplify testing
jest.mock('./auth/OptimizedAuthProvider', () => ({
  OptimizedAuthProvider: ({ children }) => children
}));

// Mock logger to prevent console noise
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock component to test the AuthContext
const TestComponent = () => {
  const { 
    currentUser, 
    isLoggedIn, 
    userType, 
    loginDriver,
    loginCustomer, 
    logout, 
    isLoading,
    isCustomer,
    isDriver,
    isAdmin,
    getUserDisplayName
  } = useAuth();

  return (
    <div>
      <div data-testid="user-role">{userType || 'none'}</div>
      <div data-testid="authenticated">{isLoggedIn ? 'true' : 'false'}</div>
      <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="user-name">{currentUser?.name || currentUser?.account_name || 'no user'}</div>
      <div data-testid="display-name">{getUserDisplayName() || 'no display name'}</div>
      <div data-testid="is-customer">{isCustomer('CUST456') ? 'true' : 'false'}</div>
      <div data-testid="is-driver">{isDriver() ? 'true' : 'false'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'true' : 'false'}</div>
      
      <button onClick={() => loginDriver({ name: 'Test Driver', route_number: 33, role: 'admin' }, 'token123')}>
        Login Driver
      </button>
      <button onClick={() => loginCustomer({ account_name: 'Test Customer', customer_number: 'CUST456' }, 'device123')}>
        Login Customer
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    // Mock window.location to prevent navigation errors
    delete window.location;
    window.location = { href: '', pathname: '/' };
    
    // Mock fetch to prevent actual API calls during initialization
    fetch.mockResolvedValue({ ok: false });
  });

  test('provides initial unauthenticated state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user-role')).toHaveTextContent('none');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    expect(screen.getByTestId('is-customer')).toHaveTextContent('false');
    expect(screen.getByTestId('is-driver')).toHaveTextContent('false');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  test('handles driver login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByText('Login Driver'));

    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('driver');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test Driver');
      expect(screen.getByTestId('display-name')).toHaveTextContent('Test Driver (Route 33)');
      expect(screen.getByTestId('is-driver')).toHaveTextContent('true');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true'); // Route 33 or admin role
    });
  });

  test('handles customer login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByText('Login Customer'));

    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test Customer');
      expect(screen.getByTestId('display-name')).toHaveTextContent('Test Customer (CUST456)');
      expect(screen.getByTestId('is-customer')).toHaveTextContent('true');
      expect(screen.getByTestId('is-driver')).toHaveTextContent('false');
    });
  });

  test('handles logout successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // First login
    fireEvent.click(screen.getByText('Login Driver'));
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Then logout
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('none');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    });
  });

  test('saves data to localStorage on login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByText('Login Driver'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Check that data was saved to localStorage
    expect(localStorage.getItem('driverData')).toBeTruthy();
    expect(localStorage.getItem('driverToken')).toBe('token123');
    
    const savedData = JSON.parse(localStorage.getItem('driverData'));
    expect(savedData.name).toBe('Test Driver');
    expect(savedData.route_number).toBe(33);
  });

  test('clears localStorage on logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Login first
    fireEvent.click(screen.getByText('Login Driver'));
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Verify data exists
    expect(localStorage.getItem('driverData')).toBeTruthy();

    // Then logout
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    // Check that localStorage was cleared
    expect(localStorage.getItem('driverData')).toBeNull();
    expect(localStorage.getItem('driverToken')).toBeNull();
    expect(localStorage.getItem('customerAuth')).toBeNull();
    expect(localStorage.getItem('deviceToken')).toBeNull();
  });

  test('restores auth state from localStorage', async () => {
    // Pre-populate localStorage
    const driverData = { name: 'Stored Driver', route_number: 1 };
    localStorage.setItem('driverData', JSON.stringify(driverData));
    localStorage.setItem('driverToken', 'stored-token');
    
    // Mock successful token verification
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for auth initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Should be automatically logged in with restored data
    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('driver');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Stored Driver');
    });
  });

  test('handles corrupted localStorage data gracefully', async () => {
    // Set corrupted data
    localStorage.setItem('driverData', 'invalid json');
    localStorage.setItem('driverToken', 'token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should handle corruption and remain unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user-role')).toHaveTextContent('none');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  test('utility functions work correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Test customer login and utility functions
    fireEvent.click(screen.getByText('Login Customer'));

    await waitFor(() => {
      expect(screen.getByTestId('is-customer')).toHaveTextContent('true');
      expect(screen.getByTestId('is-driver')).toHaveTextContent('false');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    });
  });

  test('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});