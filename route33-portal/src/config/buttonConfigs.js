// COMPOSE, NEVER DUPLICATE - Button Pattern Configuration System! ⚔️

import { BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';

// Action group configurations for common button patterns
export const ACTION_GROUPS = {
  // CRUD operations
  crud: {
    create: {
      label: 'Create',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MD,
      icon: '➕'
    },
    edit: {
      label: 'Edit',
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.SM,
      icon: '✏️'
    },
    delete: {
      label: 'Delete',
      variant: BUTTON_VARIANTS.DANGER,
      size: BUTTON_SIZES.SM,
      icon: '🗑️',
      confirmRequired: true
    },
    save: {
      label: 'Save',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MD,
      type: 'submit'
    },
    cancel: {
      label: 'Cancel',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.MD,
      type: 'button'
    }
  },

  // Customer management actions
  customerActions: {
    generateToken: {
      label: 'Token',
      variant: BUTTON_VARIANTS.GHOST,
      size: BUTTON_SIZES.XS,
      icon: '🔑',
      tooltip: 'Generate login token'
    },
    editCustomer: {
      label: 'Edit',
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.XS,
      icon: '✏️'
    },
    addItems: {
      label: 'Items',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.XS,
      icon: '📦'
    },
    viewOrders: {
      label: 'Orders',
      variant: BUTTON_VARIANTS.GHOST,
      size: BUTTON_SIZES.XS,
      icon: '📋'
    }
  },

  // Navigation actions
  navigation: {
    back: {
      label: 'Back',
      variant: BUTTON_VARIANTS.GHOST,
      size: BUTTON_SIZES.SM,
      icon: '←'
    },
    next: {
      label: 'Next',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.SM,
      icon: '→'
    },
    close: {
      label: 'Close',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.SM,
      icon: '×'
    }
  },

  // Data management actions
  dataActions: {
    refresh: {
      label: 'Refresh',
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.XS,
      icon: '🔄'
    },
    export: {
      label: 'Export',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.SM,
      icon: '📄'
    },
    import: {
      label: 'Import',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.SM,
      icon: '📥'
    },
    sync: {
      label: 'Sync',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.SM,
      icon: '🔄'
    }
  },

  // Modal actions
  modal: {
    confirm: {
      label: 'Confirm',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MD
    },
    cancel: {
      label: 'Cancel',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.MD
    },
    close: {
      label: 'Close',
      variant: BUTTON_VARIANTS.GHOST,
      size: BUTTON_SIZES.SM,
      icon: '×'
    }
  }
};

// Toolbar layout configurations
export const TOOLBAR_LAYOUTS = {
  // Standard horizontal toolbar
  horizontal: {
    container: 'flex items-center gap-2 flex-wrap',
    spacing: 'gap-2',
    alignment: 'items-center',
    responsive: 'flex-wrap'
  },

  // Vertical button stack
  vertical: {
    container: 'flex flex-col space-y-2',
    spacing: 'space-y-2',
    alignment: 'stretch',
    responsive: 'w-full'
  },

  // Split layout (left and right groups)
  split: {
    container: 'flex items-center justify-between flex-wrap gap-2',
    left: 'flex items-center gap-2',
    right: 'flex items-center gap-2',
    spacing: 'gap-2',
    responsive: 'flex-wrap'
  },

  // Centered toolbar
  centered: {
    container: 'flex items-center justify-center gap-2 flex-wrap',
    spacing: 'gap-2',
    alignment: 'items-center justify-center',
    responsive: 'flex-wrap'
  },

  // Floating action toolbar
  floating: {
    container: 'fixed bottom-4 right-4 flex flex-col space-y-2',
    spacing: 'space-y-2',
    alignment: 'items-end',
    position: 'fixed bottom-4 right-4',
    zIndex: 'z-50'
  }
};

// Button group patterns for specific contexts
export const BUTTON_GROUPS = {
  // Tab actions
  tabActions: {
    layout: TOOLBAR_LAYOUTS.horizontal,
    buttons: [
      ACTION_GROUPS.dataActions.refresh,
      ACTION_GROUPS.dataActions.export,
      ACTION_GROUPS.crud.create
    ]
  },

  // Modal footer
  modalFooter: {
    layout: TOOLBAR_LAYOUTS.split,
    left: [ACTION_GROUPS.modal.cancel],
    right: [ACTION_GROUPS.modal.confirm]
  },

  // Customer card actions
  customerCard: {
    layout: {
      container: 'flex flex-wrap items-center gap-1.5 md:gap-2',
      responsive: 'flex-1 sm:flex-none text-xs'
    },
    buttons: [
      ACTION_GROUPS.customerActions.generateToken,
      ACTION_GROUPS.customerActions.editCustomer,
      ACTION_GROUPS.customerActions.addItems
    ]
  },

  // Admin dashboard actions
  adminDashboard: {
    layout: TOOLBAR_LAYOUTS.horizontal,
    buttons: [
      {
        label: 'Manage Drivers',
        variant: BUTTON_VARIANTS.PRIMARY,
        size: BUTTON_SIZES.SM,
        key: 'drivers'
      },
      {
        label: 'View Reports',
        variant: BUTTON_VARIANTS.SECONDARY,
        size: BUTTON_SIZES.SM,
        key: 'reports'
      },
      {
        label: '🔄 Start Database Update',
        variant: BUTTON_VARIANTS.PRIMARY,
        size: BUTTON_SIZES.MD,
        key: 'staging',
        featured: true
      }
    ]
  }
};

// Button state configurations
export const BUTTON_STATES = {
  // Loading states
  loading: {
    disabled: true,
    spinner: true,
    text: {
      save: 'Saving...',
      delete: 'Deleting...',
      create: 'Creating...',
      update: 'Updating...',
      sync: 'Syncing...',
      default: 'Loading...'
    }
  },

  // Confirmation states
  confirmation: {
    delete: {
      initial: 'Delete',
      confirm: 'Are you sure?',
      confirmed: 'Deleted!',
      timeout: 3000
    },
    reset: {
      initial: 'Reset',
      confirm: 'Reset all data?',
      confirmed: 'Reset!',
      timeout: 2000
    }
  },

  // Success states
  success: {
    duration: 2000,
    text: {
      save: 'Saved!',
      delete: 'Deleted!',
      create: 'Created!',
      update: 'Updated!',
      sync: 'Synced!'
    },
    className: 'bg-green-500 text-white'
  }
};

// Icon configurations for buttons
export const BUTTON_ICONS = {
  // Action icons
  actions: {
    add: '➕',
    edit: '✏️',
    delete: '🗑️',
    save: '💾',
    cancel: '❌',
    close: '×',
    refresh: '🔄',
    sync: '🔄',
    export: '📄',
    import: '📥',
    search: '🔍',
    filter: '🔽',
    sort: '↕',
    settings: '⚙️'
  },

  // Navigation icons
  navigation: {
    back: '←',
    forward: '→',
    up: '↑',
    down: '↓',
    home: '🏠',
    menu: '☰'
  },

  // Status icons
  status: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳'
  }
};

// Responsive button configurations
export const RESPONSIVE_BUTTONS = {
  // Mobile-first button sizing
  mobile: {
    size: BUTTON_SIZES.SM,
    fullWidth: true,
    stackVertical: true,
    hideLabels: false,
    showIcons: true
  },

  // Desktop button sizing
  desktop: {
    size: BUTTON_SIZES.MD,
    fullWidth: false,
    stackVertical: false,
    hideLabels: false,
    showIcons: true
  },

  // Compact mode (for tight spaces)
  compact: {
    size: BUTTON_SIZES.XS,
    hideLabels: true,
    showIcons: true,
    tooltip: true
  }
};