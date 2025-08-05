// COMPOSE, NEVER DUPLICATE - Table/Grid/List Configurations! ⚔️

import { STATUS_COLORS, BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';
import { TYPOGRAPHY, SPACING, VARIANTS } from '../theme';

export const TABLE_CONFIGS = {
  customers: {
    columns: [
      { 
        key: 'account_name', 
        label: 'Business Name', 
        sortable: true,
        searchable: true,
        width: '300px',
        primary: true
      },
      { 
        key: 'address', 
        label: 'Address', 
        width: '250px',
        truncate: true
      },
      { 
        key: 'city', 
        label: 'City', 
        width: '120px',
        sortable: true
      },
      { 
        key: 'service_frequency', 
        label: 'Frequency', 
        width: '120px',
        badge: true
      },
      { 
        key: 'service_days', 
        label: 'Service Days', 
        width: '150px',
        wrap: true
      },
      { 
        key: 'route_number', 
        label: 'Route', 
        width: '80px',
        align: 'center',
        sortable: true
      },
      { 
        key: 'actions', 
        label: 'Actions', 
        width: '120px', 
        align: 'right',
        sticky: 'right'
      }
    ],
    pagination: { 
      pageSize: 25, 
      showSizeSelector: true,
      sizes: [10, 25, 50, 100]
    },
    sorting: { 
      defaultSort: 'account_name', 
      direction: 'asc' 
    },
    search: {
      enabled: true,
      placeholder: 'Search customers...',
      debounce: 300,
      columns: ['account_name', 'address', 'city']
    },
    actions: {
      edit: { icon: '✏️', tooltip: 'Edit Customer' },
      delete: { icon: '🗑️', tooltip: 'Delete Customer', confirm: true },
      addItem: { icon: '📦', tooltip: 'Add Item' },
      generateToken: { icon: '🔑', tooltip: 'Generate Token' }
    }
  },

  orders: {
    columns: [
      { 
        key: 'order_date', 
        label: 'Date', 
        sortable: true, 
        type: 'date',
        width: '120px'
      },
      { 
        key: 'customer_name', 
        label: 'Customer', 
        sortable: true,
        searchable: true,
        primary: true,
        width: '250px'
      },
      { 
        key: 'items_count', 
        label: 'Items', 
        align: 'center',
        width: '80px',
        type: 'number'
      },
      { 
        key: 'total_amount', 
        label: 'Total', 
        align: 'right',
        type: 'currency',
        width: '100px'
      },
      { 
        key: 'status', 
        label: 'Status', 
        type: 'badge',
        width: '120px',
        badges: {
          pending: { color: STATUS_COLORS.WARNING, text: 'Pending' },
          approved: { color: STATUS_COLORS.SUCCESS, text: 'Approved' },
          rejected: { color: STATUS_COLORS.ERROR, text: 'Rejected' }
        }
      },
      { 
        key: 'actions', 
        label: 'Actions', 
        width: '100px', 
        align: 'right'
      }
    ],
    pagination: { pageSize: 50 },
    sorting: { defaultSort: 'order_date', direction: 'desc' },
    filters: {
      status: {
        type: 'select',
        options: ['pending', 'approved', 'rejected'],
        multiple: true
      },
      date_range: {
        type: 'dateRange',
        label: 'Order Date Range'
      }
    }
  },

  loadList: {
    columns: [
      { 
        key: 'item_name', 
        label: 'Item', 
        primary: true,
        expandable: true,
        width: '300px'
      },
      { 
        key: 'quantity', 
        label: 'Qty', 
        type: 'editable',
        align: 'center',
        width: '80px'
      },
      { 
        key: 'unit_price', 
        label: 'Price', 
        type: 'currency',
        align: 'right',
        width: '100px'
      },
      { 
        key: 'total', 
        label: 'Total', 
        type: 'currency',
        align: 'right',
        width: '100px',
        calculated: true
      },
      { 
        key: 'actions', 
        label: '', 
        width: '60px',
        swipeable: true
      }
    ],
    groupBy: 'customer_name',
    expandable: true,
    swipeActions: {
      edit: { icon: '✏️', color: STATUS_COLORS.INFO },
      delete: { icon: '🗑️', color: STATUS_COLORS.ERROR }
    }
  },

  inventory: {
    columns: [
      { key: 'item_code', label: 'Code', width: '100px', monospace: true },
      { key: 'item_name', label: 'Item Name', primary: true },
      { key: 'category', label: 'Category', width: '120px', badge: true },
      { key: 'quantity_on_hand', label: 'On Hand', align: 'center', width: '100px' },
      { key: 'quantity_available', label: 'Available', align: 'center', width: '100px' },
      { key: 'unit_price', label: 'Price', type: 'currency', align: 'right', width: '100px' },
      { key: 'last_updated', label: 'Updated', type: 'datetime', width: '150px' }
    ],
    search: {
      enabled: true,
      placeholder: 'Search inventory...',
      columns: ['item_code', 'item_name', 'category']
    },
    filters: {
      category: { type: 'select', multiple: true },
      availability: { type: 'select', options: ['in_stock', 'low_stock', 'out_of_stock'] }
    }
  }
};

// List configuration patterns
export const LIST_CONFIGS = {
  // Order card list configuration
  orderCards: {
    itemType: 'card',
    layout: {
      container: 'space-y-4',
      item: 'bg-slate-50 rounded-xl p-4 border border-slate-200',
      header: 'flex items-start justify-between'
    },
    animation: {
      stagger: 0.1,
      variant: 'slideUp'
    },
    content: {
      title: {
        className: `${TYPOGRAPHY.weights.semibold} text-slate-800`,
        field: 'customer'
      },
      subtitle: {
        className: `${TYPOGRAPHY.sizes.sm} text-slate-600`,
        template: '{items} items • {time}'
      }
    },
    actions: {
      approve: {
        variant: BUTTON_VARIANTS.PRIMARY,
        size: BUTTON_SIZES.SM,
        label: 'Approve',
        condition: 'status === "pending"'
      }
    },
    status: {
      field: 'status',
      badges: {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-emerald-100 text-emerald-700'
      },
      className: `${TYPOGRAPHY.sizes.xs} px-2 py-1 rounded-full`
    }
  },

  // Load list configuration
  loadList: {
    itemType: 'expandable',
    layout: {
      container: 'space-y-4',
      item: 'rounded-lg border overflow-hidden transition-all duration-200 relative',
      header: 'p-4 select-none relative',
      expandedContent: 'border-t border-slate-200 bg-white p-4'
    },
    states: {
      default: 'bg-slate-50 border-slate-200 hover:border-slate-300',
      loaded: 'bg-gray-100 border-gray-200 opacity-60',
      animating: 'scale-90 opacity-0'
    },
    swipe: {
      enabled: true,
      threshold: 50,
      actions: {
        right: {
          action: 'markLoaded',
          color: 'bg-green-500',
          icon: '✓',
          label: 'Load'
        },
        left: {
          action: 'unload',
          color: 'bg-red-500',
          icon: '×',
          label: 'Unload'
        }
      }
    },
    content: {
      title: {
        field: 'item_name',
        className: 'font-semibold truncate text-slate-800'
      },
      subtitle: {
        template: 'Item #{item_number}',
        className: 'text-sm text-slate-600'
      }
    },
    sorting: {
      loadedToBottom: true
    }
  },

  // Customer list configuration
  customers: {
    itemType: 'card',
    layout: {
      container: 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      item: 'bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all'
    },
    content: {
      avatar: {
        enabled: true,
        field: 'account_name',
        className: 'w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0'
      },
      title: {
        field: 'account_name',
        className: 'font-semibold text-slate-800 text-sm leading-tight'
      },
      subtitle: {
        template: '#{customer_number}',
        className: 'text-slate-600 text-xs truncate'
      },
      description: {
        field: 'address',
        className: 'text-xs text-slate-600 leading-relaxed'
      }
    },
    badges: {
      serviceFrequency: {
        field: 'service_frequency',
        className: 'text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full'
      },
      serviceDays: {
        field: 'service_days',
        className: 'text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full'
      }
    },
    actions: {
      generateToken: {
        variant: BUTTON_VARIANTS.GHOST,
        size: BUTTON_SIZES.XS,
        label: 'Token'
      },
      edit: {
        variant: BUTTON_VARIANTS.SECONDARY,
        size: BUTTON_SIZES.XS,
        label: 'Edit'
      },
      addItems: {
        variant: BUTTON_VARIANTS.OUTLINE,
        size: BUTTON_SIZES.XS,
        label: 'Items'
      }
    }
  }
};

// List styling patterns
export const LIST_STYLES = {
  // Empty state patterns
  emptyState: {
    container: 'text-center py-12',
    icon: {
      container: 'w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4',
      text: 'text-slate-400 text-2xl'
    },
    title: 'text-lg font-medium text-slate-600 mb-2',
    description: 'text-slate-500 max-w-sm mx-auto',
    actions: 'mt-4'
  },

  // List headers
  header: {
    container: 'flex items-center justify-between mb-6',
    title: `${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.semibold} text-slate-800`,
    count: `${TYPOGRAPHY.sizes.sm} text-slate-500`,
    actions: 'flex gap-2'
  },

  // List search and filters
  controls: {
    container: 'flex items-center gap-4 flex-wrap mb-4',
    search: {
      container: 'relative flex-1 min-w-64',
      input: 'w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
    },
    filters: 'flex gap-2'
  }
};

// List interaction patterns
export const LIST_INTERACTIONS = {
  // Swipe gesture configuration
  swipe: {
    threshold: 50,
    resistance: 0.5,
    snapBack: true,
    animation: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },

  // Expand/collapse configuration
  expand: {
    animation: {
      duration: 0.2,
      ease: 'easeInOut'
    },
    indicator: {
      collapsed: 'v',
      expanded: '^'
    }
  },

  // Selection configuration
  selection: {
    multiple: false,
    highlightColor: 'bg-primary-50 border-primary-200',
    checkboxes: false
  }
};

// Unified data display configurations
export const DATA_DISPLAY_CONFIGS = {
  // Common column types
  columnTypes: {
    text: { align: 'left' },
    number: { align: 'right', format: 'number' },
    currency: { align: 'right', format: 'currency' },
    date: { align: 'left', format: 'date' },
    datetime: { align: 'left', format: 'datetime' },
    badge: { align: 'center', format: 'badge' },
    boolean: { align: 'center', format: 'boolean' }
  },

  // Common sorting patterns
  sorting: {
    indicators: {
      asc: '↑',
      desc: '↓',
      none: '↕'
    },
    className: {
      sortable: 'cursor-pointer hover:bg-slate-50',
      active: 'bg-slate-100'
    }
  },

  // Common pagination patterns
  pagination: {
    sizes: [10, 25, 50, 100],
    defaultSize: 25,
    showSizeSelector: true,
    showPageInfo: true,
    maxVisiblePages: 7
  },

  // Common search patterns
  search: {
    debounceMs: 300,
    minChars: 2,
    placeholder: 'Search...',
    caseSensitive: false
  }
};