import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import logger from '../utils/logger';

// Create the context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Unified Auth Provider - Handles both customers and drivers
export const AuthProvider = ({ children }) => {
  
  // Unified authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' | 'driver'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize authentication from stored data
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Check for driver authentication first
      const driverToken = localStorage.getItem('driverToken');
      const driverData = localStorage.getItem('driverData');
      
      if (driverToken && driverData) {
        const driver = JSON.parse(driverData);
        
        // Verify driver token is still valid
        const isValid = await verifyDriverToken(driverToken);
        if (isValid) {
          setCurrentUser(driver);
          setUserType('driver');
          setIsLoggedIn(true);
          logger.info('Driver auth restored from storage', { 
            driver: driver.name, 
            route: driver.route_number 
          });
          return;
        } else {
          // Clear invalid driver data
          localStorage.removeItem('driverToken');
          localStorage.removeItem('driverData');
        }
      }

      // Check for customer authentication
      const customerData = localStorage.getItem('customerAuth');
      const deviceToken = localStorage.getItem('deviceToken');
      
      if (customerData && deviceToken) {
        const customer = JSON.parse(customerData);
        
        // Verify customer device token is still valid
        const isValid = await verifyCustomerDevice(deviceToken);
        if (isValid) {
          setCurrentUser(customer);
          setUserType('customer');
          setIsLoggedIn(true);
          logger.info('Customer auth restored from storage', { 
            customer: customer.account_name,
            customerNumber: customer.customer_number
          });
          return;
        } else {
          // Clear invalid customer data
          localStorage.removeItem('customerAuth');
          localStorage.removeItem('deviceToken');
        }
      }

      // No valid authentication found
      logger.info('No valid authentication found in storage');
      
    } catch (error) {
      logger.error('Failed to initialize auth', { error: error.message });
      setAuthError('Failed to restore login session');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array since it only uses setState functions

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Verify driver token with backend
  const verifyDriverToken = async (token) => {
    try {
      const response = await fetch('/api/drivers/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      return response.ok;
    } catch (error) {
      logger.warn('Driver token verification failed', { error: error.message });
      return false;
    }
  };

  // Verify customer device token with backend
  const verifyCustomerDevice = async (deviceToken) => {
    try {
      const response = await fetch('/api/customers/verify-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_token: deviceToken })
      });
      return response.ok;
    } catch (error) {
      logger.warn('Customer device verification failed', { error: error.message });
      return false;
    }
  };

  // Customer login function
  const loginCustomer = (customerData, deviceToken = null) => {
    try {
      setCurrentUser(customerData);
      setUserType('customer');
      setIsLoggedIn(true);
      setAuthError(null);
      
      // Save to localStorage for persistence
      localStorage.setItem('customerAuth', JSON.stringify(customerData));
      if (deviceToken) {
        localStorage.setItem('deviceToken', deviceToken);
      }
      
      logger.info('Customer logged in', { 
        customer: customerData.account_name,
        customerNumber: customerData.customer_number,
        hasDeviceToken: !!deviceToken
      });
      
    } catch (error) {
      logger.error('Customer login failed', { error: error.message });
      setAuthError('Failed to save login session');
    }
  };

  // Driver login function
  const loginDriver = (driverData, token) => {
    try {
      setCurrentUser(driverData);
      setUserType('driver');
      setIsLoggedIn(true);
      setAuthError(null);
      
      // Save to localStorage for persistence
      localStorage.setItem('driverData', JSON.stringify(driverData));
      localStorage.setItem('driverToken', token);
      
      logger.info('Driver logged in', { 
        driver: driverData.name,
        route: driverData.route_number,
        role: driverData.role
      });
      
    } catch (error) {
      logger.error('Driver login failed', { error: error.message });
      setAuthError('Failed to save login session');
    }
  };

  // Unified logout function
  const logout = (redirectPath = '/') => {
    try {
      const loggedOutUser = currentUser;
      const loggedOutType = userType;
      
      // Clear state
      setCurrentUser(null);
      setUserType(null);
      setIsLoggedIn(false);
      setAuthError(null);
      
      // Clear localStorage
      localStorage.removeItem('customerAuth');
      localStorage.removeItem('deviceToken');
      localStorage.removeItem('driverData');
      localStorage.removeItem('driverToken');
      
      logger.info('User logged out', { 
        userType: loggedOutType,
        user: loggedOutType === 'driver' ? loggedOutUser?.name : loggedOutUser?.account_name
      });
      
      // Redirect if path provided
      if (redirectPath && window.location.pathname !== redirectPath) {
        window.location.href = redirectPath;
      }
      
    } catch (error) {
      logger.error('Logout failed', { error: error.message });
    }
  };

  // Check if current user is a specific customer
  const isCustomer = (customerNumber) => {
    return userType === 'customer' && currentUser?.customer_number === customerNumber;
  };

  // Check if current user is a driver for a specific route
  const isDriver = (routeNumber = null) => {
    if (userType !== 'driver') return false;
    if (routeNumber === null) return true;
    return currentUser?.route_number === routeNumber;
  };

  // Check if current user has admin privileges
  const isAdmin = () => {
    return userType === 'driver' && (
      currentUser?.role === 'admin' || 
      currentUser?.route_number === 33 // Nigel has admin privileges
    );
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!currentUser) return null;
    
    if (userType === 'driver') {
      return `${currentUser.name} (Route ${currentUser.route_number})`;
    } else if (userType === 'customer') {
      return `${currentUser.account_name} (${currentUser.customer_number})`;
    }
    
    return 'Unknown User';
  };

  // Refresh authentication (re-verify tokens)
  const refreshAuth = async () => {
    if (isLoggedIn) {
      await initializeAuth();
    }
  };

  // The context value that components can access
  const value = {
    // State
    currentUser,
    userType,
    isLoggedIn,
    isLoading,
    authError,
    
    // Functions
    loginCustomer,
    loginDriver,
    logout,
    refreshAuth,
    
    // Utility functions
    isCustomer,
    isDriver,
    isAdmin,
    getUserDisplayName,
    
    // Legacy compatibility (for existing components)
    currentCustomer: userType === 'customer' ? currentUser : null,
    login: loginCustomer, // Backwards compatibility
    setIsLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;