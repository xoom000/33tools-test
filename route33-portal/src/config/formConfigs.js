// COMPOSE, NEVER DUPLICATE - Form Configuration System! ⚔️

import { BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';
import { FORM_CONFIG } from './ui';

// Form field type configurations (alias to unified config)
export const FIELD_TYPES = FORM_CONFIG.fieldTypes;

// Input styling configurations (alias to unified config)
export const INPUT_STYLES = FORM_CONFIG.styles;

// Form validation configurations (alias to unified config)
export const VALIDATION_CONFIGS = FORM_CONFIG.validation;

// Form button configurations
// Button configurations (alias for FORM_BUTTONS)
export const BUTTON_CONFIGS = {
  // Common button patterns
  submit: {
    label: 'Submit',
    variant: 'primary',
    size: 'md',
    type: 'submit'
  },
  cancel: {
    label: 'Cancel', 
    variant: 'outline',
    size: 'md',
    type: 'button'
  },
  save: {
    label: 'Save',
    variant: 'primary',
    size: 'md',
    type: 'submit'
  },
  delete: {
    label: 'Delete',
    variant: 'danger',
    size: 'md',
    type: 'button'
  },
  
  // Login options configuration
  loginOptions: {
    title: 'Or choose an option',
    buttons: [
      {
        key: 'driver',
        label: 'Driver Login',
        variant: BUTTON_VARIANTS.SECONDARY,
        size: BUTTON_SIZES.MD,
        icon: '🚛'
      },
      {
        key: 'guest',
        label: 'Continue as Guest',
        variant: BUTTON_VARIANTS.OUTLINE,
        size: BUTTON_SIZES.MD,
        icon: '👤'
      }
    ]
  }
};

export const FORM_BUTTONS = {
  // Standard form actions
  actions: {
    submit: {
      primary: {
        label: 'Save',
        variant: BUTTON_VARIANTS.PRIMARY,
        size: BUTTON_SIZES.MD,
        type: 'submit'
      }
    },
    cancel: {
      label: 'Cancel',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.MD,
      type: 'button'
    }
  },
  
  // Button layouts
  layouts: {
    horizontal: 'flex gap-3 pt-4',
    center: 'flex justify-center gap-3 pt-4'
  }
};

// Complete form configurations
export const FORM_CONFIGS = {
  // Customer forms
  addCustomer: {
    title: 'Add Customer',
    fields: [
      {
        name: 'account_name',
        label: 'Account Name',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter customer name'
      },
      {
        name: 'customer_number',
        label: 'Customer Number',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'e.g., 1001'
      },
      {
        name: 'address',
        label: 'Address',
        type: FIELD_TYPES.TEXTAREA,
        required: true,
        placeholder: 'Enter full address',
        rows: 3
      }
    ]
  },
  
  // Login forms
  customerLogin: {
    title: 'Customer Login',
    fields: [
      {
        name: 'customer_number',
        label: 'Customer Number',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter your customer number'
      }
    ],
    submitButton: {
      label: 'Login',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MD
    }
  },
  
  driverLogin: {
    title: 'Driver Login',
    fields: [
      {
        name: 'token',
        label: 'Driver Token',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter your driver token'
      }
    ],
    submitButton: {
      label: 'Login',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MD
    }
  },
  
  // Customer modal configuration
  customer: {
    title: (isEditing) => isEditing ? 'Edit Customer' : 'Add Customer',
    fields: [
      {
        name: 'account_name',
        label: 'Account Name',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter customer name'
      },
      {
        name: 'customer_number',
        label: 'Customer Number',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'e.g., 1001'
      },
      {
        name: 'address',
        label: 'Address',
        type: FIELD_TYPES.TEXTAREA,
        required: true,
        placeholder: 'Enter full address',
        rows: 3
      }
    ],
    submitText: 'Add Customer',
    editingText: 'Update Customer'
  },
  
  // Item modal configuration
  item: {
    title: (isEditing) => isEditing ? 'Edit Item' : 'Add Item',
    fields: [
      {
        name: 'item_name',
        label: 'Item Name',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter item name'
      },
      {
        name: 'item_number',
        label: 'Item Number',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'e.g., 2001'
      },
      {
        name: 'description',
        label: 'Description',
        type: FIELD_TYPES.TEXTAREA,
        required: false,
        placeholder: 'Enter item description',
        rows: 2
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: FIELD_TYPES.NUMBER,
        required: true,
        placeholder: '0',
        defaultValue: 1
      }
    ],
    submitText: 'Add Item',
    editingText: 'Update Item'
  },
  
  // Order configuration modal
  orderConfiguration: {
    title: () => 'Configure Customer Ordering',
    size: 'large',
    description: 'Select customers and configure their service days for route optimization.',
    actions: {
      primary: {
        label: 'Save Configuration',
        variant: BUTTON_VARIANTS.PRIMARY,
        size: BUTTON_SIZES.MD
      },
      secondary: {
        label: 'Cancel',
        variant: BUTTON_VARIANTS.OUTLINE,
        size: BUTTON_SIZES.MD
      }
    }
  }
};