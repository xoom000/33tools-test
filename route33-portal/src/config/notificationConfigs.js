// COMPOSE, NEVER DUPLICATE - Notification Pattern Configuration System! ⚔️

// Notification types and their configurations
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Toast styling configurations
export const TOAST_STYLES = {
  // Base styling patterns
  base: 'relative rounded-lg shadow-lg p-4 text-white min-w-[320px] max-w-md',
  
  // Type-specific styling
  variants: {
    [NOTIFICATION_TYPES.SUCCESS]: 'bg-gradient-to-r from-green-500 to-green-600',
    [NOTIFICATION_TYPES.ERROR]: 'bg-gradient-to-r from-red-500 to-red-600',
    [NOTIFICATION_TYPES.WARNING]: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    [NOTIFICATION_TYPES.INFO]: 'bg-gradient-to-r from-blue-500 to-blue-600',
    [NOTIFICATION_TYPES.LOADING]: 'bg-gradient-to-r from-slate-500 to-slate-600'
  },
  
  // Position variants
  positions: {
    topRight: 'fixed top-4 right-4 z-50',
    topLeft: 'fixed top-4 left-4 z-50',
    topCenter: 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    bottomRight: 'fixed bottom-4 right-4 z-50',
    bottomLeft: 'fixed bottom-4 left-4 z-50',
    bottomCenter: 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
  },
  
  // Size variants
  sizes: {
    compact: 'min-w-[280px] max-w-sm p-3',
    normal: 'min-w-[320px] max-w-md p-4',
    large: 'min-w-[360px] max-w-lg p-5'
  }
};

// Notification icons configuration
export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    svg: `<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>`,
    emoji: '✅',
    unicode: '✓'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    svg: `<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>`,
    emoji: '❌',
    unicode: '×'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    svg: `<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>`,
    emoji: '⚠️',
    unicode: '⚠'
  },
  [NOTIFICATION_TYPES.INFO]: {
    svg: `<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>`,
    emoji: 'ℹ️',
    unicode: 'i'
  },
  [NOTIFICATION_TYPES.LOADING]: {
    spinner: '<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>',
    emoji: '⏳',
    unicode: '...'
  }
};

// Animation configurations for notifications
export const NOTIFICATION_ANIMATIONS = {
  // Entry animations
  enter: {
    slideInRight: {
      initial: { opacity: 0, x: 300, scale: 0.3 },
      animate: { opacity: 1, x: 0, scale: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    slideInLeft: {
      initial: { opacity: 0, x: -300, scale: 0.3 },
      animate: { opacity: 1, x: 0, scale: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    slideInTop: {
      initial: { opacity: 0, y: -100, scale: 0.3 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    slideInBottom: {
      initial: { opacity: 0, y: 100, scale: 0.3 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    fade: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },
  
  // Exit animations
  exit: {
    slideOutRight: {
      opacity: 0, x: 300, scale: 0.5,
      transition: { duration: 0.2, ease: 'easeIn' }
    },
    slideOutLeft: {
      opacity: 0, x: -300, scale: 0.5,
      transition: { duration: 0.2, ease: 'easeIn' }
    },
    fade: {
      opacity: 0, scale: 0.8,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  }
};

// Duration configurations
export const NOTIFICATION_DURATIONS = {
  short: 3000,
  normal: 5000,
  long: 7000,
  persistent: 0, // Don't auto-dismiss
  
  // Type-specific defaults
  defaults: {
    [NOTIFICATION_TYPES.SUCCESS]: 4000,
    [NOTIFICATION_TYPES.ERROR]: 6000,
    [NOTIFICATION_TYPES.WARNING]: 5000,
    [NOTIFICATION_TYPES.INFO]: 4000,
    [NOTIFICATION_TYPES.LOADING]: 0 // Persistent until manually dismissed
  }
};

// Predefined notification messages for common scenarios
export const NOTIFICATION_MESSAGES = {
  // CRUD operations
  crud: {
    created: {
      title: 'Created Successfully',
      message: 'Item has been created successfully',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    updated: {
      title: 'Updated Successfully', 
      message: 'Changes have been saved',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    deleted: {
      title: 'Deleted Successfully',
      message: 'Item has been removed',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    createFailed: {
      title: 'Creation Failed',
      message: 'Unable to create item. Please try again.',
      type: NOTIFICATION_TYPES.ERROR
    },
    updateFailed: {
      title: 'Update Failed',
      message: 'Unable to save changes. Please try again.',
      type: NOTIFICATION_TYPES.ERROR
    },
    deleteFailed: {
      title: 'Deletion Failed',
      message: 'Unable to delete item. Please try again.',
      type: NOTIFICATION_TYPES.ERROR
    }
  },

  // Authentication
  auth: {
    loginSuccess: {
      title: 'Welcome Back!',
      message: 'You have been successfully logged in',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    loginFailed: {
      title: 'Login Failed',
      message: 'Invalid credentials. Please check your route number and password.',
      type: NOTIFICATION_TYPES.ERROR
    },
    sessionExpired: {
      title: 'Session Expired',
      message: 'Please log in again to continue',
      type: NOTIFICATION_TYPES.WARNING
    }
  },

  // Data operations
  data: {
    syncSuccess: {
      title: 'Sync Complete',
      message: 'Data has been synchronized successfully',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    syncFailed: {
      title: 'Sync Failed',
      message: 'Unable to synchronize data. Check your connection.',
      type: NOTIFICATION_TYPES.ERROR
    },
    loading: {
      title: 'Loading',
      message: 'Please wait while we fetch your data...',
      type: NOTIFICATION_TYPES.LOADING
    },
    exportSuccess: {
      title: 'Export Complete',
      message: 'File has been downloaded successfully',
      type: NOTIFICATION_TYPES.SUCCESS
    }
  },

  // Network and connectivity
  network: {
    offline: {
      title: 'Connection Lost',
      message: 'You are currently offline. Some features may be limited.',
      type: NOTIFICATION_TYPES.WARNING,
      duration: NOTIFICATION_DURATIONS.persistent
    },
    online: {
      title: 'Connection Restored',
      message: 'You are back online!',
      type: NOTIFICATION_TYPES.SUCCESS
    },
    slowConnection: {
      title: 'Slow Connection',
      message: 'Your connection seems slow. This may affect performance.',
      type: NOTIFICATION_TYPES.INFO
    }
  }
};

// Alert/banner configurations (for persistent messages)
export const ALERT_CONFIGS = {
  // Alert variants
  variants: {
    [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-50 border-green-200 text-green-800',
    [NOTIFICATION_TYPES.ERROR]: 'bg-red-50 border-red-200 text-red-800',
    [NOTIFICATION_TYPES.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    [NOTIFICATION_TYPES.INFO]: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  
  // Base styling
  base: 'border rounded-lg p-4 mb-4',
  
  // Icon colors for alerts
  iconColors: {
    [NOTIFICATION_TYPES.SUCCESS]: 'text-green-400',
    [NOTIFICATION_TYPES.ERROR]: 'text-red-400',
    [NOTIFICATION_TYPES.WARNING]: 'text-yellow-400',
    [NOTIFICATION_TYPES.INFO]: 'text-blue-400'
  }
};

// Status indicator configurations
export const STATUS_INDICATORS = {
  // Connection status
  connection: {
    online: {
      icon: '🟢',
      label: 'Online',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    offline: {
      icon: '🔴',
      label: 'Offline', 
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    connecting: {
      icon: '🟡',
      label: 'Connecting',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  },
  
  // Sync status
  sync: {
    synced: {
      icon: '✅',
      label: 'Synced',
      color: 'text-green-600'
    },
    syncing: {
      icon: '🔄',
      label: 'Syncing...',
      color: 'text-blue-600',
      animate: 'animate-spin'
    },
    error: {
      icon: '❌',
      label: 'Sync Error',
      color: 'text-red-600'
    }
  },
  
  // Process status
  process: {
    idle: {
      icon: '⚪',
      label: 'Ready',
      color: 'text-slate-600'
    },
    processing: {
      icon: '🔄',
      label: 'Processing...',
      color: 'text-blue-600',
      animate: 'animate-spin'
    },
    completed: {
      icon: '✅',
      label: 'Completed',
      color: 'text-green-600'
    },
    failed: {
      icon: '❌',
      label: 'Failed',
      color: 'text-red-600'
    }
  }
};

// Badge configurations for status display
export const STATUS_BADGES = {
  // Base badge styling
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  
  // Variant styling
  variants: {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800', 
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-slate-100 text-slate-800'
  },
  
  // Size variants
  sizes: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  }
};

// Notification action configurations
export const NOTIFICATION_ACTIONS = {
  // Common actions
  retry: {
    label: 'Retry',
    className: 'mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors'
  },
  dismiss: {
    label: 'Dismiss',
    className: 'mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors'
  },
  viewDetails: {
    label: 'View Details',
    className: 'mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors'
  },
  undo: {
    label: 'Undo',
    className: 'mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors'
  }
};