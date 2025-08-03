import { adminService } from '../services/api';
import { copyCustomerLoginToken } from '../utils/clipboardUtils';
import logger from '../utils/logger';

export const useCustomerManagement = (customers, setCustomers) => {
  
  const generateLoginToken = async (customerNumber) => {
    try {
      const result = await adminService.generateLoginToken(customerNumber);
      if (result.success) {
        // Update customer in state
        setCustomers(prev => prev.map(c => 
          c.customer_number === customerNumber 
            ? { ...c, login_code: result.login_token }
            : c
        ));
        
        // Copy login token to clipboard using reusable utility
        const customer = customers.find(c => c.customer_number === customerNumber);
        const loginTokenData = {
          token: result.login_token,
          expires_at: result.expires_at,
          is_new: result.is_new
        };
        
        await copyCustomerLoginToken(customer, loginTokenData);
        return { success: true, result };
      }
      return { success: false, error: 'Token generation failed' };
    } catch (error) {
      logger.error('Failed to generate login token', { error: error.message });
      return { success: false, error: error.message };
    }
  };

  const saveCustomer = async (customerData) => {
    try {
      if (customerData.customer_number) {
        // Edit existing customer - this would need a backend API
        logger.info('Updating customer', { customerNumber: customerData.customer_number });
        // TODO: Implement customer update API
      } else {
        // Add new customer - this would need a backend API
        logger.info('Adding new customer', { customerData });
        // TODO: Implement customer creation API
      }
      // Note: Caller should refresh customer list
      return { success: true };
    } catch (error) {
      logger.error('Failed to save customer', { error: error.message });
      throw error;
    }
  };

  const saveItem = async (itemData) => {
    try {
      logger.info('Adding/updating item', { itemData });
      // TODO: Implement item save API
      // This would save to customer_items table
      return { success: true };
    } catch (error) {
      logger.error('Failed to save item', { error: error.message });
      throw error;
    }
  };

  return {
    generateLoginToken,
    saveCustomer,
    saveItem
  };
};