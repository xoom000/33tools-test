import { useCallback } from 'react';
import { adminService } from '../services/api';
import { useToast } from '../contexts/ToastContext';

// COMPOSE, NEVER DUPLICATE - Order configuration logic hook!
export const useOrderConfiguration = (onCustomersUpdated) => {
  const { toast } = useToast();

  const saveOrderConfiguration = useCallback(async (selectedCustomerNumbers) => {
    try {
      const result = await adminService.updateOrderConfig(selectedCustomerNumbers);
      
      if (result.success) {
        toast.success(result.message, {
          title: 'Success',
          duration: 3000
        });
        
        // Notify parent to reload customers
        if (onCustomersUpdated) {
          await onCustomersUpdated();
        }
        
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Failed to save order configuration:', error);
      toast.error('Failed to save order configuration. Please try again.', {
        title: 'Error',
        duration: 5000
      });
      return { success: false, error };
    }
  }, [toast, onCustomersUpdated]);

  return {
    saveOrderConfiguration
  };
};