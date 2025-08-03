// API Service - Talks to your localhost:3334 backend
// This keeps all the backend communication in one place

// Use relative URLs - will go to same domain as frontend
const API_BASE = '/api';

// Simple API helper function with authentication
const apiCall = async (endpoint, options = {}) => {
  try {
    // Get current route from URL or default to 33
    const routeNumber = window.location.pathname.match(/\/route\/(\d+)/) ? 
                       window.location.pathname.match(/\/route\/(\d+)/)[1] : '33';
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Route-Number': routeNumber, // Send route for authentication
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// AUTH FUNCTIONS - Your brilliant working system!
export const authService = {
  
  // Step 1: Check if account number + login code combo exists
  validateLogin: async (accountNumber, loginCode) => {
    console.log('Validating login:', { accountNumber, loginCode });
    
    // Call your REAL working endpoint!
    const customer = await apiCall(`/customers/${accountNumber}/validate`, {
      method: 'POST',
      body: JSON.stringify({ loginCode })
    });
    
    return customer;
  },

  // Step 2: Save device name after successful login (now returns device token)
  saveDevice: async (customerNumber, loginCode, deviceName) => {
    console.log('Saving device:', { customerNumber, loginCode, deviceName });
    
    // Call your REAL working endpoint!
    const result = await apiCall(`/customers/${customerNumber}/devices`, {
      method: 'POST',
      body: JSON.stringify({ loginCode, deviceName })
    });
    
    return result;
  },

  // NEW: Verify device token for auto-login
  verifyDeviceToken: async (deviceToken) => {
    console.log('Verifying device token');
    
    const result = await apiCall('/customers/verify-device', {
      method: 'POST',
      body: JSON.stringify({ deviceToken })
    });
    
    return result;
  },

  // EXTEND: Driver authentication methods - COMPOSE, NEVER DUPLICATE! ⚔️
  loginDriver: async (username, password) => {
    console.log('Driver login:', { username });
    
    const result = await apiCall('/drivers/login-username', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    return result;
  },

  validateSetupToken: async (token) => {
    console.log('Validating setup token');
    
    const result = await apiCall('/drivers/validate-setup-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    
    return result;
  },

  createDriverAccount: async (token, username, password) => {
    console.log('Creating driver account:', { username });
    
    const result = await apiCall('/drivers/create-account', {
      method: 'POST',
      body: JSON.stringify({ token, username, password })
    });
    
    return result;
  },

  validateDemoToken: async (token) => {
    console.log('Validating demo token');
    
    const result = await apiCall('/drivers/validate-demo-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    
    return result;
  }
};

// CUSTOMER DATA FUNCTIONS - For the portal
export const customerService = {
  
  // Get customer details and their regular items
  getCustomerData: async (customerNumber) => {
    const customer = await apiCall(`/customers/${customerNumber}`);
    return customer;
  },

  // Get customer's regular items (rental/standing orders)
  getCustomerItems: async (customerNumber) => {
    const response = await apiCall(`/customers/${customerNumber}/items`);
    return response;
  }
};

// ADMIN FUNCTIONS - For your code generation
export const adminService = {
  
  // Get list of customers for code generation
  getCustomers: async (routeNumber = 33) => {
    const result = await apiCall(`/admin/customers?route_number=${routeNumber}`);
    return result; // Returns { count, customers }
  },

  // Generate login token for a customer  
  generateLoginToken: async (customerNumber) => {
    const result = await apiCall(`/admin/customers/${customerNumber}/generate-code`, {
      method: 'POST'
    });
    return result; // Returns { success, customer_number, login_token, expires_at, is_new, message }
  },

  // Update order button configuration for customers
  updateOrderConfig: async (customerNumbers) => {
    const result = await apiCall('/admin/customers/order-config', {
      method: 'PUT',
      body: JSON.stringify({ customerNumbers })
    });
    return result; // Returns { success, message, enabled }
  }
};

export default { authService, customerService, adminService };