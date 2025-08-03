import { useState, useEffect, useCallback } from 'react';
import { useAsyncOperation } from './useAsyncOperation';

// COMPOSE, NEVER DUPLICATE - Routes data management! ⚔️
export const useRoutes = (shouldLoad = false) => {
  const [routes, setRoutes] = useState([]);
  
  // EXTEND useAsyncOperation - COMPOSE, NEVER DUPLICATE! ⚔️
  const { loading: isLoading, error, execute, clearError } = useAsyncOperation({
    logContext: 'useRoutes'
  });

  const loadRoutes = useCallback(async () => {
    if (isLoading) return; // Prevent duplicate requests
    
    return execute({
      operation: async () => {
        const response = await fetch('/api/routes');
        const data = await response.json();
        
        if (response.ok) {
          setRoutes(data.routes || []);
          return data;
        } else {
          throw new Error(data.error || 'Failed to load routes');
        }
      },
      errorMessage: 'Failed to load routes',
      logSuccess: {
        message: 'Routes loaded successfully',
        data: { count: routes.length }
      },
      logError: {
        message: 'Failed to load routes'
      }
    });
  }, [isLoading, execute, routes.length]);

  // Auto-load routes when shouldLoad changes to true
  useEffect(() => {
    if (shouldLoad && routes.length === 0 && !isLoading) {
      loadRoutes();
    }
  }, [shouldLoad, routes.length, isLoading, loadRoutes]);

  return {
    routes,
    isLoading,
    error,
    loadRoutes,
    clearError
  };
};