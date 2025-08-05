// COMPOSE, NEVER DUPLICATE - Modal Configurations! ⚔️

import { WORKFLOW_STEPS, WORKFLOW_ICONS } from '../constants/workflow';
import { MODAL_SIZES, BUTTON_VARIANTS, COMPONENT_STATES } from '../constants/ui';
import { ROUTE_CONFIG } from '../constants/business';

export const MODAL_CONFIGS = {
  stagingWorkflow: {
    size: MODAL_SIZES.LARGE,
    title: `${WORKFLOW_ICONS.STAGING} Staging Workflow`,
    subtitle: (routeNumber = ROUTE_CONFIG.DEFAULT_ROUTE) => `Route ${routeNumber}`,
    showCloseButton: true,
    closeOnEscape: true,
    focusManagement: true,
    steps: Object.values(WORKFLOW_STEPS),
    actions: {
      primary: { variant: BUTTON_VARIANTS.PRIMARY },
      secondary: { variant: BUTTON_VARIANTS.SECONDARY },
      danger: { variant: BUTTON_VARIANTS.DANGER }
    }
  },

  databaseUpdate: {
    size: MODAL_SIZES.LARGE,
    title: '🗄️ Database Update System',
    showCloseButton: true,
    closeOnEscape: false, // Prevent accidental close during critical operations
    focusManagement: true,
    states: {
      idle: {
        actions: {
          cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY },
          preview: { text: 'Preview Changes', variant: BUTTON_VARIANTS.PRIMARY }
        }
      },
      preview: {
        actions: {
          back: { text: 'Start Over', variant: BUTTON_VARIANTS.SECONDARY },
          cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.OUTLINE },
          apply: { text: 'Apply Updates', variant: BUTTON_VARIANTS.PRIMARY }
        }
      },
      uploading: {
        loadingMessage: 'Analyzing file...'
      },
      applying: {
        loadingMessage: 'Applying updates...'
      }
    }
  },

  tokenGenerator: {
    size: MODAL_SIZES.MEDIUM,
    title: '🔑 Generate Tokens',
    showCloseButton: true,
    autoFocus: true,
    actions: {
      generate: { text: 'Generate Token', variant: BUTTON_VARIANTS.PRIMARY },
      close: { text: 'Close', variant: BUTTON_VARIANTS.SECONDARY }
    }
  },

  customerAdd: {
    size: MODAL_SIZES.MEDIUM,
    title: '👥 Add New Customer',
    showCloseButton: true,
    validateOnClose: true,
    actions: {
      save: { text: 'Add Customer', variant: BUTTON_VARIANTS.PRIMARY },
      cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY }
    }
  },

  customerEdit: {
    size: MODAL_SIZES.MEDIUM,
    title: '✏️ Edit Customer',
    showCloseButton: true,
    validateOnClose: true,
    actions: {
      save: { text: 'Update Customer', variant: BUTTON_VARIANTS.PRIMARY },
      cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY }
    }
  },

  itemAdd: {
    size: MODAL_SIZES.MEDIUM,
    title: '📦 Add New Item',
    showCloseButton: true,
    actions: {
      save: { text: 'Add Item', variant: BUTTON_VARIANTS.PRIMARY },
      cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY }
    }
  },

  configureOrdering: {
    size: MODAL_SIZES.XLARGE,
    title: '⚙️ Configure Customer Ordering',
    subtitle: 'Select which customers can place orders through PowerApps',
    showCloseButton: true,
    actions: {
      save: { text: 'Save Configuration', variant: BUTTON_VARIANTS.PRIMARY },
      cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY }
    }
  },

  addItemSearch: {
    size: MODAL_SIZES.MEDIUM,
    title: '📎 Add Item to Load List',
    showCloseButton: true,
    search: {
      enabled: true,
      placeholder: 'Search items by name or number...',
      debounce: 300,
      maxResults: 20,
      icons: {
        search: '🔍',
        package: '📦',
        clear: '✖️'
      }
    },
    states: {
      empty: {
        icon: '📦',
        title: 'Search for items',
        message: 'Type item name or number to find products'
      },
      noResults: {
        icon: '🔍',
        title: 'No items found',
        message: 'Try searching with different keywords',
        action: { text: 'Clear search', action: 'clearSearch' }
      },
      resultSummary: {
        single: (count) => `Found ${count} item`,
        multiple: (count) => `Found ${count} items`,
        limited: (shown, total) => `Showing ${shown} of ${total} items`,
        none: (term) => `No items found for "${term}"`
      }
    },
    itemStates: {
      inList: {
        text: 'In List',
        color: 'green',
        classes: 'text-green-600 bg-green-100'
      },
      add: { text: 'Add' },
      addMore: { text: '+1' }
    }
  },

  syncValidation: {
    size: MODAL_SIZES.LARGE,
    title: '🔄 Database Sync Validation',
    subtitle: 'Review changes before applying to database',
    showCloseButton: true,
    className: 'max-h-[80vh]',
    focusManagement: true,
    actions: {
      cancel: { text: 'Cancel', variant: BUTTON_VARIANTS.SECONDARY },
      apply: { 
        text: (count) => `Apply Changes (${count})`, 
        variant: BUTTON_VARIANTS.PRIMARY,
        requiresSelection: true
      }
    },
    stats: {
      columns: 3,
      types: {
        additions: { 
          label: 'New Customers',
          icon: '+',
          color: 'green'
        },
        removals: { 
          label: 'Remove Customers',
          icon: '-', 
          color: 'red'
        },
        updates: { 
          label: 'Updates',
          icon: '~',
          color: 'yellow'
        }
      }
    }
  }
};