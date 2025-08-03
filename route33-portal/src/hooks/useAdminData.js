import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/api';
import { useAsyncOperation } from './useAsyncOperation';

// COMPOSE, NEVER DUPLICATE - Admin data management! ⚔️
export const useAdminData = (currentRoute) => {
  const { isLoggedIn, isDriver, currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [orderRequests, setOrderRequests] = useState([]);
  
  // EXTEND useAsyncOperation - COMPOSE, NEVER DUPLICATE! ⚔️
  const { loading, error, execute, clearError } = useAsyncOperation({
    initialLoading: true,
    logContext: 'useAdminData'
  });

  const loadCustomers = async () => {
    if (loading) return; // Prevent duplicate requests
    
    return execute({
      operation: async () => {
        const result = await adminService.getCustomers(currentRoute);
        setCustomers(result.customers || []);
        return result;
      },
      errorMessage: 'Failed to load customers',
      logSuccess: {
        message: 'Customers loaded',
        data: { route: currentRoute, count: customers.length }
      },
      logError: {
        message: 'Failed to load customers',
        data: { route: currentRoute }
      }
    });
  };

  const loadOrderRequests = async () => {
    return execute({
      operation: async () => {
        const response = await fetch('/api/order-requests?status=Pending');
        if (response.ok) {
          const data = await response.json();
          setOrderRequests(data.orders || []);
          return data;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load order requests');
        }
      },
      errorMessage: 'Failed to load order requests',
      logSuccess: {
        message: 'Order requests loaded',
        data: { route: currentRoute, count: orderRequests.length }
      },
      logError: {
        message: 'Failed to load order requests',
        data: { route: currentRoute }
      }
    });
  };

  const refreshAllData = async () => {
    await Promise.all([
      loadCustomers(),
      loadOrderRequests()
    ]);
  };

  // Load data when authentication is verified
  useEffect(() => {
    if (isLoggedIn && isDriver() && currentUser) {
      loadCustomers();
      loadOrderRequests();
    }
  }, [isLoggedIn, currentUser, currentRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    customers,
    orderRequests,
    loading,
    error,
    loadCustomers,
    loadOrderRequests,
    refreshAllData,
    setCustomers,
    setOrderRequests,
    clearError
  };
};