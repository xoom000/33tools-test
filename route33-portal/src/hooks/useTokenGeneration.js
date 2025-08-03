import { useState } from 'react';
import { useAsyncOperation } from './useAsyncOperation';

// COMPOSE, NEVER DUPLICATE - Token generation management! ⚔️
export const useTokenGeneration = () => {
  const [generatedToken, setGeneratedToken] = useState(null);
  
  // EXTEND useAsyncOperation - COMPOSE, NEVER DUPLICATE! ⚔️
  const { loading: isLoading, error, execute, clearError: clearBaseError } = useAsyncOperation({
    logContext: 'useTokenGeneration'
  });

  const generateCustomerToken = async (formData) => {
    return execute({
      operation: async () => {
        const response = await fetch(`/api/admin/customers/${formData.customerNumber}/generate-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
          const token = {
            type: 'Customer Login',
            token: data.login_code,
            customerNumber: data.customer_number,
            customerName: data.customer_name,
            instructions: `Share this code with ${data.customer_name}`,
            url: `https://orders.route33.app/?customer=${data.customer_number}&code=${data.login_code}`
          };

          setGeneratedToken(token);
          return token;
        } else {
          throw new Error(data.error || 'Failed to generate customer token');
        }
      },
      errorMessage: 'Network error. Please try again.',
      logSuccess: {
        message: 'Customer token generated',
        data: { customer: formData.customerNumber }
      },
      logError: {
        message: 'Customer token generation error'
      }
    });
  };

  const generateDriverToken = async (formData, routes) => {
    const selectedRoute = routes.find(r => r.route_number === parseInt(formData.routeNumber));
    
    return execute({
      operation: async () => {
        const response = await fetch('/api/admin/driver-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            routeNumber: parseInt(formData.routeNumber),
            expiresInHours: parseInt(formData.expiresIn)
          })
        });

        const data = await response.json();

        if (response.ok) {
          const token = {
            type: 'Driver Setup',
            token: data.token,
            routeNumber: data.route_number,
            driverName: selectedRoute?.driver_name,
            expiresAt: data.expires_at,
            instructions: `Send this token to ${selectedRoute?.driver_name}`,
            url: `https://orders.route33.app/driver-login`
          };

          setGeneratedToken(token);
          return token;
        } else {
          throw new Error(data.error || 'Failed to generate driver token');
        }
      },
      errorMessage: 'Network error. Please try again.',
      logSuccess: {
        message: 'Driver setup token generated',
        data: { route: formData.routeNumber, driver: selectedRoute?.driver_name }
      },
      logError: {
        message: 'Driver token generation error'
      }
    });
  };

  const generateDemoToken = async (formData) => {
    return execute({
      operation: async () => {
        const response = await fetch('/api/admin/demo-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            demoName: formData.demoName,
            description: formData.description,
            expiresInHours: parseInt(formData.expiresIn),
            permissions: formData.permissions
          })
        });

        const data = await response.json();

        if (response.ok) {
          const token = {
            type: 'Demo Access',
            token: data.token,
            demoName: data.demo_name,
            description: data.description,
            expiresAt: data.expires_at,
            timeLimit: `${formData.expiresIn} hours`,
            instructions: `Demo access for ${data.demo_name}`,
            url: `https://orders.route33.app/demo?token=${data.token}`
          };

          setGeneratedToken(token);
          return token;
        } else {
          throw new Error(data.error || 'Failed to generate demo token');
        }
      },
      errorMessage: 'Network error. Please try again.',
      logSuccess: {
        message: 'Demo token generated',
        data: { demo: formData.demoName, expires: formData.expiresIn }
      },
      logError: {
        message: 'Demo token generation error'
      }
    });
  };

  const generateToken = async (type, formData, routes = []) => {
    switch (type) {
      case 'customer':
        return generateCustomerToken(formData);
      case 'driver':
        return generateDriverToken(formData, routes);
      case 'demo':
        return generateDemoToken(formData);
      default:
        throw new Error('Invalid token type');
    }
  };

  const clearError = () => {
    clearBaseError();
  };
  
  const clearToken = () => setGeneratedToken(null);

  return {
    isLoading,
    error,
    generatedToken,
    generateToken,
    clearError,
    clearToken
  };
};