import React, { useMemo } from 'react';
import { AuthStateProvider } from './AuthStateContext';
import { AuthActionsProvider } from './AuthActionsContext';
import { AuthUtilsProvider } from './AuthUtilsContext';

// Optimized Auth Provider that splits context for better performance
export const OptimizedAuthProvider = ({ 
  children,
  currentUser,
  userType,
  isLoggedIn,
  isLoading,
  authError,
  loginCustomer,
  loginDriver,
  logout,
  refreshAuth,
  setIsLoading
}) => {
  // Memoize auth state - changes when user data or loading state changes
  const authState = useMemo(() => ({
    currentUser,
    userType,
    isLoggedIn,
    isLoading,
    authError,
    // Legacy compatibility
    currentCustomer: userType === 'customer' ? currentUser : null,
    setIsLoading
  }), [currentUser, userType, isLoggedIn, isLoading, authError, setIsLoading]);

  // Memoize auth actions - stable functions, rarely change
  const authActions = useMemo(() => ({
    loginCustomer,
    loginDriver,
    logout,
    refreshAuth,
    // Legacy compatibility
    login: loginCustomer
  }), [loginCustomer, loginDriver, logout, refreshAuth]);

  // Memoize auth utilities - pure functions based on current state
  const authUtils = useMemo(() => {
    const isCustomer = () => userType === 'customer';
    const isDriver = () => userType === 'driver';
    const isAdmin = () => userType === 'driver' && currentUser?.role === 'admin';
    
    const getUserDisplayName = () => {
      if (!currentUser) return 'Unknown User';
      
      if (userType === 'customer') {
        return currentUser.account_name || currentUser.customer_name || `Customer #${currentUser.customer_number}`;
      }
      
      if (userType === 'driver') {
        return currentUser.name || `Driver ${currentUser.route_number}`;
      }
      
      return 'Unknown User';
    };

    return {
      isCustomer,
      isDriver, 
      isAdmin,
      getUserDisplayName
    };
  }, [userType, currentUser]);

  return (
    <AuthStateProvider value={authState}>
      <AuthActionsProvider value={authActions}>
        <AuthUtilsProvider value={authUtils}>
          {children}
        </AuthUtilsProvider>
      </AuthActionsProvider>
    </AuthStateProvider>
  );
};

export default OptimizedAuthProvider;