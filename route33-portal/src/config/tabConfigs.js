// COMPOSE, NEVER DUPLICATE - Tab Configuration System! ⚔️

import { BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';
import { VARIANTS, TYPOGRAPHY, COLORS, SPACING } from '../theme';

// Tab styling patterns
export const TAB_STYLES = {
  // Navigation tab styles
  navigation: {
    container: `${VARIANTS.card.base} p-1 mb-4`,
    tabList: 'flex space-x-1 overflow-x-auto scrollbar-hide lg:justify-center xl:justify-start',
    tab: {
      base: 'flex-shrink-0 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-sm lg:text-base font-medium transition-all whitespace-nowrap',
      active: VARIANTS.button.primary.replace('shadow-lg hover:shadow-xl', 'shadow-lg'),
      inactive: 'text-slate-600 hover:bg-slate-50'
    }
  },
  
  // Content tab styles
  content: {
    container: 'space-y-6',
    animation: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 }
    }
  },
  
  // Tab panel wrapper styles
  panel: {
    base: 'bg-white rounded-2xl shadow-sm border border-slate-100',
    withPadding: 'bg-white rounded-2xl shadow-sm border border-slate-100 p-6',
    minimal: 'bg-white rounded-xl shadow-sm border border-slate-100 p-4'
  }
};

// Tab content configurations
export const TAB_CONFIGS = {
  // Orders tab configuration
  orders: {
    id: 'orders',
    label: 'Order Requests',
    animation: 'slideRight',
    header: {
      title: 'Order Requests',
      showCount: true,
      actions: [
        {
          label: 'Refresh',
          variant: BUTTON_VARIANTS.SECONDARY,
          size: BUTTON_SIZES.XS,
          key: 'refresh'
        }
      ]
    },
    content: {
      type: 'list',
      itemCard: {
        swipeEnabled: true,
        expandable: true,
        statusTracking: true
      }
    },
    emptyState: {
      icon: '📋',
      title: 'No Order Requests',
      description: 'When customers place orders through PowerApps, they\'ll appear here for processing.',
      actions: [
        {
          label: 'Refresh Orders',
          variant: BUTTON_VARIANTS.OUTLINE,
          size: BUTTON_SIZES.XS,
          key: 'refresh'
        }
      ]
    }
  },

  // Load List tab configuration
  loadlist: {
    id: 'loadlist',
    label: 'Load List',
    animation: 'slideRight',
    header: {
      title: 'Load List',
      showCount: true,
      actions: [
        {
          label: 'Export PDF',
          variant: BUTTON_VARIANTS.OUTLINE,
          size: BUTTON_SIZES.XS,
          icon: '📄',
          key: 'export'
        },
        {
          label: 'Refresh',
          variant: BUTTON_VARIANTS.SECONDARY,
          size: BUTTON_SIZES.XS,
          key: 'refresh'
        }
      ]
    },
    content: {
      type: 'checklist',
      groupBy: 'customer',
      sortable: true
    },
    emptyState: {
      icon: '📦',
      title: 'No Items to Load',
      description: 'Your load list will appear here when orders are processed.',
      actions: [
        {
          label: 'Refresh Load List',
          variant: BUTTON_VARIANTS.OUTLINE,
          size: BUTTON_SIZES.XS,
          key: 'refresh'
        }
      ]
    }
  },

  // Customers tab configuration
  customers: {
    id: 'customers',
    label: 'Customer Management',
    animation: 'slideRight',
    header: {
      title: 'Customer Management',
      showCount: true,
      actions: [
        {
          label: 'Add Customer',
          variant: BUTTON_VARIANTS.PRIMARY,
          size: BUTTON_SIZES.SM,
          icon: '➕',
          key: 'add'
        },
        {
          label: 'Import',
          variant: BUTTON_VARIANTS.OUTLINE,
          size: BUTTON_SIZES.SM,
          key: 'import'
        }
      ]
    },
    content: {
      type: 'grid',
      itemComponent: 'CustomerCard',
      searchable: true,
      filterable: true
    },
    emptyState: {
      icon: '👥',
      title: 'No Customers Found',
      description: 'Start by adding customers to your route or import from existing data.',
      actions: [
        {
          label: 'Add First Customer',
          variant: BUTTON_VARIANTS.PRIMARY,
          size: BUTTON_SIZES.SM,
          key: 'add'
        },
        {
          label: 'Import Customers',
          variant: BUTTON_VARIANTS.OUTLINE,
          size: BUTTON_SIZES.SM,
          key: 'import'
        }
      ]
    }
  },

  // Admin tab configuration (Route 33 only)
  admin: {
    id: 'admin',
    label: 'System Admin',
    animation: 'slideRight',
    restrictedTo: [33], // Only Route 33 has access
    header: {
      title: 'System Administration',
      subtitle: 'Manage drivers, reports, and database operations'
    },
    content: {
      type: 'admin-grid',
      sections: [
        {
          title: 'Driver Management',
          description: 'Manage all 6 route drivers and their access',
          action: {
            label: 'Manage Drivers',
            variant: BUTTON_VARIANTS.PRIMARY,
            size: BUTTON_SIZES.SM,
            key: 'drivers'
          },
          color: 'blue'
        },
        {
          title: 'System Reports',
          description: 'View cross-route analytics and usage',
          action: {
            label: 'View Reports',
            variant: BUTTON_VARIANTS.SECONDARY,
            size: BUTTON_SIZES.SM,
            key: 'reports'
          },
          color: 'green'
        },
        {
          title: 'Data Management',
          description: 'Database updates and sync operations',
          action: {
            label: '🔄 Start Database Update',
            variant: BUTTON_VARIANTS.PRIMARY,
            size: BUTTON_SIZES.MD,
            key: 'staging',
            className: 'w-full'
          },
          color: 'purple',
          featured: true
        }
      ]
    }
  },

  // Generic tab configuration for unimplemented tabs
  placeholder: {
    animation: 'slideRight',
    content: {
      type: 'placeholder',
      title: 'Coming Soon',
      description: 'This section is under development.',
      className: 'bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center'
    }
  }
};

// Tab navigation configurations
export const TAB_NAVIGATION_CONFIGS = {
  // Main dashboard tabs
  dashboard: {
    base: [
      TAB_CONFIGS.orders,
      TAB_CONFIGS.loadlist,
      TAB_CONFIGS.customers,
      { id: 'items', label: 'Item Management' },
      { id: 'reports', label: 'Route Reports' },
      { id: 'settings', label: 'Settings' }
    ],
    // Add admin tab for Route 33
    withAdmin: function(currentRoute) {
      return currentRoute === 33 
        ? [...this.base, TAB_CONFIGS.admin]
        : this.base;
    }
  }
};

// Tab action handlers mapping
export const TAB_ACTION_HANDLERS = {
  orders: {
    refresh: 'onRefresh',
    toggleExpanded: 'onToggleExpanded',
    markAsLoaded: 'onMarkAsLoaded',
    deleteOrder: 'onDeleteOrder'
  },
  loadlist: {
    refresh: 'onRefresh',
    export: 'onExportPDF',
    toggleComplete: 'onToggleComplete'
  },
  customers: {
    add: 'onAddCustomer',
    import: 'onImportCustomers',
    edit: 'onEditCustomer',
    generateToken: 'onGenerateToken',
    addItems: 'onAddItems'
  },
  admin: {
    drivers: 'onManageDrivers',
    reports: 'onViewReports',
    staging: 'onShowStagingWorkflow'
  }
};

// Tab content type renderers
export const TAB_CONTENT_TYPES = {
  list: 'ListContent',
  grid: 'GridContent',
  checklist: 'ChecklistContent',
  'admin-grid': 'AdminGridContent',
  placeholder: 'PlaceholderContent'
};

// Animation variants for different tab transitions
export const TAB_ANIMATIONS = {
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  }
};