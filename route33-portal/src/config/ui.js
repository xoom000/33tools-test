/**
 * COMPOSE, NEVER DUPLICATE - Unified UI Configuration System
 * Consolidates all UI component configurations into one source of truth
 * Based on React best practices for maintainable component systems
 */

import { BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';

// ============================================================================
// BUTTON CONFIGURATIONS
// ============================================================================

export const BUTTON_CONFIG = {
  // Action group configurations for common button patterns
  actions: {
    // CRUD operations
    create: { label: 'Create', variant: BUTTON_VARIANTS.PRIMARY, size: BUTTON_SIZES.MD, icon: '➕' },
    edit: { label: 'Edit', variant: BUTTON_VARIANTS.SECONDARY, size: BUTTON_SIZES.SM, icon: '✏️' },
    delete: { label: 'Delete', variant: BUTTON_VARIANTS.DANGER, size: BUTTON_SIZES.SM, icon: '🗑️', confirmRequired: true },
    save: { label: 'Save', variant: BUTTON_VARIANTS.PRIMARY, size: BUTTON_SIZES.MD, type: 'submit' },
    cancel: { label: 'Cancel', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.MD, type: 'button' },

    // Data operations
    refresh: { label: 'Refresh', variant: BUTTON_VARIANTS.SECONDARY, size: BUTTON_SIZES.XS, icon: '🔄' },
    export: { label: 'Export', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.SM, icon: '📄' },
    import: { label: 'Import', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.SM, icon: '📥' },
    sync: { label: 'Sync', variant: BUTTON_VARIANTS.PRIMARY, size: BUTTON_SIZES.SM, icon: '🔄' },

    // Navigation
    back: { label: 'Back', variant: BUTTON_VARIANTS.GHOST, size: BUTTON_SIZES.SM, icon: '←' },
    next: { label: 'Next', variant: BUTTON_VARIANTS.PRIMARY, size: BUTTON_SIZES.SM, icon: '→' },
    close: { label: 'Close', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.SM, icon: '×' }
  },

  // Context-specific button groups
  groups: {
    customerCard: [
      { label: 'Token', variant: BUTTON_VARIANTS.GHOST, size: BUTTON_SIZES.XS, icon: '🔑', tooltip: 'Generate token' },
      { label: 'Edit', variant: BUTTON_VARIANTS.SECONDARY, size: BUTTON_SIZES.XS, icon: '✏️' },
      { label: 'Items', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.XS, icon: '📦' }
    ],
    modalFooter: {
      cancel: { label: 'Cancel', variant: BUTTON_VARIANTS.OUTLINE, size: BUTTON_SIZES.MD },
      confirm: { label: 'Confirm', variant: BUTTON_VARIANTS.PRIMARY, size: BUTTON_SIZES.MD }
    }
  },

  // Button states
  states: {
    loading: {
      disabled: true,
      spinner: true,
      text: { save: 'Saving...', delete: 'Deleting...', create: 'Creating...', default: 'Loading...' }
    },
    success: { duration: 2000, className: 'bg-green-500 text-white' }
  },

  // Layout configurations
  layouts: {
    horizontal: 'flex items-center gap-2 flex-wrap',
    vertical: 'flex flex-col space-y-2',
    split: 'flex items-center justify-between flex-wrap gap-2',
    centered: 'flex items-center justify-center gap-2 flex-wrap'
  }
};

// ============================================================================
// FORM CONFIGURATIONS
// ============================================================================

export const FORM_CONFIG = {
  // Field types
  fieldTypes: {
    TEXT: 'text', EMAIL: 'email', PASSWORD: 'password', NUMBER: 'number',
    TEL: 'tel', URL: 'url', DATE: 'date', TIME: 'time',
    TEXTAREA: 'textarea', SELECT: 'select', CHECKBOX: 'checkbox', 
    RADIO: 'radio', FILE: 'file', HIDDEN: 'hidden'
  },

  // Input styling configurations
  styles: {
    base: {
      container: 'space-y-2',
      label: 'block text-sm font-medium text-slate-700',
      requiredIndicator: 'text-red-500 ml-1',
      input: 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200',
      error: 'text-sm text-red-600',
      helper: 'text-sm text-slate-500'
    },
    enhanced: {
      container: 'mb-4',
      label: 'block text-sm font-medium text-slate-700 mb-2',
      inputWrapper: 'relative',
      input: {
        base: 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white',
        withLeftIcon: 'pl-10',
        withRightIcon: 'pr-10',
        disabled: 'bg-gray-100 cursor-not-allowed'
      },
      states: {
        default: 'border-slate-300 focus:ring-primary-500',
        focused: 'border-primary-500 focus:ring-primary-500',
        valid: 'border-green-500 focus:ring-green-500',
        invalid: 'border-red-500 focus:ring-red-500'
      }
    }
  },

  // Validation configurations
  validation: {
    rules: {
      required: (value) => ({
        isValid: value && value.toString().trim().length > 0,
        message: 'This field is required'
      }),
      email: (value) => ({
        isValid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      }),
      number: (value) => ({
        isValid: !value || !isNaN(value),
        message: 'Please enter a valid number'
      })
    },
    timing: { immediate: 0, fast: 300, normal: 500 }
  },

  // Common form templates
  templates: {
    addCustomer: {
      title: 'Add Customer',
      fields: [
        { name: 'account_name', label: 'Account Name', type: 'text', required: true, placeholder: 'Enter customer name' },
        { name: 'customer_number', label: 'Customer Number', type: 'text', required: true, placeholder: 'e.g., 1001' },
        { name: 'address', label: 'Address', type: 'textarea', required: true, placeholder: 'Enter full address', rows: 3 }
      ]
    }
  }
};

// ============================================================================
// CARD CONFIGURATIONS
// ============================================================================

export const CARD_CONFIG = {
  // Base card styles
  styles: {
    base: 'bg-white rounded-2xl border border-slate-100',
    shadow: { sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' },
    interactive: 'hover:shadow-md transition-shadow duration-200'
  },

  // Card types
  types: {
    default: { base: true, shadow: 'sm' },
    elevated: { base: true, shadow: 'lg' },
    interactive: { base: true, shadow: 'sm', interactive: true },
    floating: { base: true, shadow: 'xl', interactive: true }
  },

  // Content layouts
  layouts: {
    padding: { xs: 'p-3', sm: 'p-4', md: 'p-6', lg: 'p-8' },
    spacing: { xs: 'space-y-2', sm: 'space-y-3', md: 'space-y-4', lg: 'space-y-6' }
  }
};

// ============================================================================
// MODAL CONFIGURATIONS
// ============================================================================

export const MODAL_CONFIG = {
  // Size variants
  sizes: {
    xs: 'max-w-md',
    sm: 'max-w-lg', 
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  },

  // Modal styles
  styles: {
    backdrop: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
    container: 'bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto',
    header: 'flex items-center justify-between p-6 border-b border-slate-200',
    content: 'p-6',
    footer: 'flex items-center justify-end gap-3 p-6 border-t border-slate-200'
  },

  // Common modal configurations
  types: {
    confirmation: { size: 'sm', hasFooter: true },
    form: { size: 'md', hasFooter: true },
    details: { size: 'lg', hasFooter: false },
    fullscreen: { size: 'full', hasFooter: true }
  }
};

// ============================================================================
// TABLE CONFIGURATIONS
// ============================================================================

export const TABLE_CONFIG = {
  // Table styles
  styles: {
    container: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-slate-200',
    thead: 'bg-slate-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-slate-200',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-slate-900',
    row: {
      default: '',
      hover: 'hover:bg-slate-50',
      selected: 'bg-primary-50'
    }
  },

  // Column configurations
  columns: {
    actions: { width: 'w-20', align: 'text-center' },
    id: { width: 'w-16', align: 'text-center' },
    name: { width: 'w-48', align: 'text-left' },
    status: { width: 'w-24', align: 'text-center' },
    date: { width: 'w-32', align: 'text-right' }
  }
};

// ============================================================================
// NOTIFICATION CONFIGURATIONS
// ============================================================================

export const NOTIFICATION_CONFIG = {
  // Notification types
  types: {
    success: { icon: '✅', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-200' },
    error: { icon: '❌', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-200' },
    warning: { icon: '⚠️', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
    info: { icon: 'ℹ️', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' }
  },

  // Positioning
  positions: {
    topRight: 'top-4 right-4',
    topLeft: 'top-4 left-4', 
    bottomRight: 'bottom-4 right-4',
    bottomLeft: 'bottom-4 left-4',
    topCenter: 'top-4 left-1/2 transform -translate-x-1/2'
  },

  // Timing
  durations: { fast: 2000, normal: 4000, slow: 6000, persistent: 0 }
};

// INPUT_STYLES and VALIDATION_CONFIGS are now exported from formConfigs.js
// to avoid conflicting star exports in config/index.js