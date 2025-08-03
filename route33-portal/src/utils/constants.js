// AdminDashboard Constants
// Extracted constants for better maintainability

export const DAY_NAMES = {
  "M": "Monday",
  "T": "Tuesday",
  "W": "Wednesday",
  "H": "Thursday",
  "F": "Friday"
};

export const BUTTON_CLASSES = {
  SMALL: 'text-xs px-2 py-1'
};

// Morning Workspace Constants - COMPOSE, NEVER DUPLICATE! ⚔️
export const MORNING_CHECKLIST = [
  'Clock in',
  'Review load list', 
  'Check uniform orders',
  'Read customer notes',
  'Complete DVIR',
  'Load vehicle',
  'Grab invoices',
  'Final double-check'
];

export const MORNING_STATS_CONFIG = [
  {
    key: 'loadComplete',
    title: 'Load Complete',
    color: 'blue',
    icon: '📦',
    calculateValue: (data) => Math.round(((data.loadList?.filter(item => item.completed).length || 0) / Math.max(data.loadList?.length || 1, 1)) * 100) + '%'
  },
  {
    key: 'uniformOrders',
    title: 'Uniform Orders',
    color: 'green',
    icon: '👔',
    calculateValue: (data) => data.uniformOrders?.length || 0
  },
  {
    key: 'specialNotes',
    title: 'Special Notes',
    color: 'purple',
    icon: '📋',
    calculateValue: (data) => data.customerNotes?.length || 0
  },
  {
    key: 'route',
    title: 'Route',
    color: 'yellow',
    icon: '🚚',
    calculateValue: (data) => data.user?.route_id || 'N/A'
  }
];

// Service related constants
export const SERVICE_FREQUENCIES = [
  'Weekly',
  'Bi-Weekly',
  'Monthly', 
  'On-Demand'
];

export const SERVICE_DAYS = ['M', 'T', 'W', 'H', 'F'];

// Negative constants - things to avoid/filter out
export const FORBIDDEN_PATTERNS = {
  EMOJIS: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
  PROFANITY: /\b(damn|hell|crap)\b/gi, // Add more as needed
  SENSITIVE_DATA: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g // Credit card patterns
};

// Icon alternatives (text-based)
export const ICONS = {
  PACKAGE: '[Package]',
  SEARCH: '[Search]', 
  SUCCESS: '[Success]',
  ERROR: '[Error]',
  LOADING: '[Loading]',
  ADD: '[+]',
  REMOVE: '[-]',
  PRINT: '[Print]',
  REFRESH: '[Refresh]'
};

// Dashboard tab configuration
export const DASHBOARD_TABS = [
  { id: 'orders', label: 'Order Requests' },
  { id: 'loadlist', label: 'Load List' },
  { id: 'customers', label: 'Customer Management' },
  { id: 'items', label: 'Item Management' },
  { id: 'reports', label: 'Route Reports' },
  { id: 'settings', label: 'Settings' }
];

// Export all as default
export default {
  DAY_NAMES: DAY_NAMES,
  POWER_APPS_BASE_URL: '',
  BUTTON_CLASSES: BUTTON_CLASSES,
  SERVICE_FREQUENCIES,
  SERVICE_DAYS
};
