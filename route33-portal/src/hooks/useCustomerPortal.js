import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useAsyncOperation } from './useAsyncOperation';

// COMPOSE, NEVER DUPLICATE - Customer portal management! ⚔️
export const useCustomerPortal = (customerNumber) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  
  // State management
  const [regularItems, setRegularItems] = useState([]);
  
  // EXTEND useAsyncOperation - COMPOSE, NEVER DUPLICATE! ⚔️
  const { loading, error, execute, clearError } = useAsyncOperation({
    initialLoading: true,
    logContext: 'useCustomerPortal'
  });

  // Load customer data
  const loadCustomerData = async () => {
    if (!customerNumber) return;
    
    return execute({
      operation: async () => {
        const itemsResponse = await customerService.getCustomerItems(customerNumber);
        setRegularItems(itemsResponse.items || []);
        return itemsResponse;
      },
      errorMessage: 'Failed to load your items. Please try again.',
      showErrorToast: true,
      retryFunction: () => loadCustomerData(),
      toast,
      logSuccess: {
        message: 'Customer portal data loaded',
        data: { customerNumber }
      },
      logError: {
        message: 'Failed to load customer data',
        data: { customerNumber }
      }
    });
  };

  // Handle customer logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Submit order functionality
  const handleSubmitOrder = async () => {
    if (regularItems.length === 0) {
      toast.warning('No items selected', {
        title: 'Cannot Submit Order',
        duration: 3000
      });
      return;
    }
    
    return execute({
      operation: async () => {
        // Prepare items for API (matching the expected format)
        const items = regularItems.map(item => ({
          item_number: item.item_number,
          quantity: item.quantity,
          notes: `${item.description} (${item.item_type})`
        }));

        const response = await fetch('/api/order-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_number: customerNumber,
            items: items,
            delivery_notes: `Order request submitted via customer portal at ${new Date().toLocaleString()}`,
            requested_date: new Date().toISOString()
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Show detailed success message
          toast.success('Order request submitted successfully!', {
            title: 'Order Confirmed',
            duration: 7000,
            action: {
              label: 'View Details',
              handler: () => {
                toast.info(`Order #${result.order_id} includes ${regularItems.length} items. Your driver will be notified and will include these items in your next delivery.`, {
                  title: 'Order Details',
                  duration: 10000
                });
              }
            }
          });
          return result;
        } else {
          throw new Error(result.message || 'Failed to submit order request');
        }
      },
      errorMessage: 'Failed to submit order request. Please try again.',
      showErrorToast: true,
      retryFunction: () => handleSubmitOrder(),
      loadingToastMessage: {
        message: 'Submitting your order request...',
        title: 'Processing Order'
      },
      toast,
      logSuccess: {
        message: 'Order request submitted successfully',
        data: { customerNumber, itemCount: regularItems.length }
      },
      logError: {
        message: 'Failed to submit order request',
        data: { customerNumber }
      }
    });
  };

  // Load data on mount and when customerNumber changes
  useEffect(() => {
    loadCustomerData();
  }, [customerNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    regularItems,
    loading,
    error,
    
    // Actions
    handleLogout,
    handleSubmitOrder,
    loadCustomerData,
    setRegularItems,
    clearError
  };
};