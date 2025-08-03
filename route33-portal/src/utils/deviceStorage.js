// Device Token Storage - Remember Me functionality
// Handles secure storage of device tokens in localStorage

const DEVICE_TOKEN_KEY = 'route33_device_token';
const CUSTOMER_DATA_KEY = 'route33_customer_data';

export const deviceStorage = {
  
  // Save device token and customer data for auto-login
  saveDeviceToken: (deviceToken, customerData) => {
    try {
      localStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customerData));
      console.log('Device token saved for remember me functionality');
    } catch (error) {
      console.error('Failed to save device token:', error);
    }
  },

  // Get stored device token
  getDeviceToken: () => {
    try {
      return localStorage.getItem(DEVICE_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  },

  // Get stored customer data
  getCustomerData: () => {
    try {
      const data = localStorage.getItem(CUSTOMER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get customer data:', error);
      return null;
    }
  },

  // Check if device is remembered
  isDeviceRemembered: () => {
    const token = deviceStorage.getDeviceToken();
    const customerData = deviceStorage.getCustomerData();
    return Boolean(token && customerData);
  },

  // Clear device token (logout)
  clearDeviceToken: () => {
    try {
      localStorage.removeItem(DEVICE_TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_DATA_KEY);
      console.log('Device token cleared - user logged out');
    } catch (error) {
      console.error('Failed to clear device token:', error);
    }
  },

  // Update last access time
  updateLastAccess: () => {
    try {
      const data = deviceStorage.getCustomerData();
      if (data) {
        data.lastAccess = new Date().toISOString();
        localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to update last access:', error);
    }
  }
};

export default deviceStorage;