// COMPOSE, NEVER DUPLICATE - Auth constants! ⚔️

export const DEMO_TOKENS = {
  DEFAULT: 'DEMO426B'
};

export const API_ENDPOINTS = {
  // Customer endpoints
  VALIDATE_CUSTOMER: (customerNumber) => `/api/customers/${customerNumber}/validate`,
  
  // Driver endpoints  
  CREATE_DRIVER_ACCOUNT: '/api/drivers/create-account',
  VALIDATE_SETUP_TOKEN: '/api/drivers/validate-setup-token',
  LOGIN_DRIVER: '/api/drivers/login-username'
};

export const ROUTES = {
  DEMO: '/demo',
  CUSTOMER_PORTAL: (customerNumber) => `/portal/${customerNumber}`,
  DRIVER_DASHBOARD: (routeNumber) => `/dashboard/${routeNumber}`
};

export const ERROR_MESSAGES = {
  INVALID_DEMO_TOKEN: 'Invalid demo token. Please check and try again.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  ACCOUNT_CREATION_FAILED: 'Account creation failed',
  INVALID_SETUP_TOKEN: 'Invalid setup token',
  INVALID_CUSTOMER_LOGIN: 'Invalid customer number or login code',
  LOGIN_FAILED: 'Login failed'
};

export const BUTTON_ACTIONS = {
  DRIVER_LOGIN: 'driver-login',
  SETUP_TOKEN: 'setup-token', 
  DEMO_ACCESS: 'demo-access'
};