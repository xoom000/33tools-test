// COMPOSE, NEVER DUPLICATE - Component Configurations! ⚔️

import { BUTTON_VARIANTS, BUTTON_SIZES, STATUS_COLORS, LOADING_MESSAGES } from '../constants/ui';

export const COMPONENT_CONFIGS = {
  // Default button configurations for common actions
  buttons: {
    save: { 
      variant: BUTTON_VARIANTS.PRIMARY, 
      size: BUTTON_SIZES.MEDIUM,
      loadingText: LOADING_MESSAGES.PROCESSING
    },
    cancel: { 
      variant: BUTTON_VARIANTS.SECONDARY, 
      size: BUTTON_SIZES.MEDIUM 
    },
    delete: { 
      variant: BUTTON_VARIANTS.DANGER, 
      size: BUTTON_SIZES.SMALL,
      confirmRequired: true
    },
    edit: { 
      variant: BUTTON_VARIANTS.OUTLINE, 
      size: BUTTON_SIZES.SMALL 
    },
    back: {
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.MEDIUM,
      icon: '←'
    },
    next: {
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MEDIUM,
      icon: '→'
    },
    close: {
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.MEDIUM
    }
  },

  // Stats card configurations
  statsCards: {
    customerAdditions: { 
      color: STATUS_COLORS.SUCCESS, 
      icon: '➕',
      animate: true
    },
    customerRemovals: { 
      color: STATUS_COLORS.ERROR, 
      icon: '➖',
      animate: true
    },
    customerUpdates: { 
      color: STATUS_COLORS.WARNING, 
      icon: '✏️',
      animate: true
    },
    totalChanges: { 
      color: STATUS_COLORS.NEUTRAL, 
      icon: '📊',
      animate: true
    }
  },

  // Grid/Table default configurations
  grids: {
    stats: {
      columns: 3,
      gap: 'lg',
      responsive: true,
      animation: 'slideUp'
    },
    customers: {
      columns: 1,
      gap: 'md',
      selectable: true,
      sortable: true
    }
  },

  // File upload configurations
  fileUpload: {
    default: {
      dragAndDrop: true,
      showProgress: true,
      acceptedTypes: ['.csv', '.xlsx', '.json'],
      maxSize: 50 * 1024 * 1024, // 50MB
      maxSizeDisplay: '50MB'
    },
    csv: {
      acceptedTypes: ['.csv'],
      validateHeaders: true,
      showPreview: true
    },
    images: {
      acceptedTypes: ['.jpg', '.jpeg', '.png', '.gif'],
      maxSize: 5 * 1024 * 1024, // 5MB
      showThumbnails: true
    }
  },

  // Toast/Notification configurations  
  notifications: {
    success: {
      duration: 4000,
      position: 'top-right',
      showIcon: true,
      closeable: true
    },
    error: {
      duration: 6000,
      position: 'top-right', 
      showIcon: true,
      closeable: true,
      persistent: true
    },
    info: {
      duration: 3000,
      position: 'top-right',
      showIcon: true
    }
  },

  // Loading skeleton configurations
  skeletons: {
    card: { lines: 3, showAvatar: false, animate: true },
    list: { lines: 5, showAvatar: true, animate: true },
    table: { rows: 8, columns: 4, animate: true },
    stats: { cards: 4, animate: true }
  }
};