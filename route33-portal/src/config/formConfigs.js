// Form field configurations - COMPOSE, NEVER DUPLICATE!
export const FORM_CONFIGS = {
  orderConfiguration: {
    title: () => 'Configure Customer Ordering',
    description: 'Select which customers can place orders through PowerApps',
    submitText: 'Save Configuration',
    cancelText: 'Cancel',
    size: 'xlarge',
    fields: [] // Custom component will handle customer selection
  },
  customer: {
    title: (isEditing) => isEditing ? 'Edit Customer' : 'Add New Customer',
    submitText: 'Add Customer',
    editingText: 'Update Customer',
    fields: [
      {
        name: 'account_name',
        label: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Enter business name'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        required: true,
        placeholder: 'Enter street address'
      },
      {
        name: 'city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'Enter city'
      },
      {
        name: 'state',
        label: 'State',
        type: 'select',
        defaultValue: 'CA',
        required: true,
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NV', label: 'Nevada' },
          { value: 'AZ', label: 'Arizona' },
          { value: 'OR', label: 'Oregon' },
          { value: 'WA', label: 'Washington' }
        ]
      },
      {
        name: 'zip_code',
        label: 'ZIP Code',
        type: 'text',
        required: true,
        placeholder: 'Enter ZIP code'
      },
      {
        name: 'service_frequency',
        label: 'Service Frequency',
        type: 'select',
        defaultValue: 'Weekly',
        required: true,
        options: [
          { value: 'Weekly', label: 'Weekly' },
          { value: 'Bi-weekly', label: 'Bi-weekly' },
          { value: 'Monthly', label: 'Monthly' },
          { value: 'As needed', label: 'As needed' }
        ]
      },
      {
        name: 'service_days',
        label: 'Service Days',
        type: 'text',
        placeholder: 'e.g., Monday, Wednesday'
      },
      {
        name: 'route_number',
        label: 'Route Number',
        type: 'number',
        defaultValue: 33,
        required: true
      }
    ]
  },

  item: {
    title: (isEditing) => isEditing ? 'Edit Item' : 'Add New Item',
    submitText: 'Add Item',
    editingText: 'Update Item',
    fields: [
      {
        name: 'item_name',
        label: 'Item Name',
        type: 'text',
        required: true,
        placeholder: 'Enter item name'
      },
      {
        name: 'item_type',
        label: 'Item Type',
        type: 'select',
        defaultValue: 'rental',
        required: true,
        options: [
          { value: 'rental', label: 'Rental' },
          { value: 'purchase', label: 'Purchase' },
          { value: 'service', label: 'Service' },
          { value: 'supply', label: 'Supply' }
        ]
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        defaultValue: 1,
        required: true,
        min: 1
      },
      {
        name: 'unit_price',
        label: 'Unit Price',
        type: 'number',
        defaultValue: 0,
        step: '0.01',
        min: 0,
        placeholder: '0.00'
      },
      {
        name: 'frequency',
        label: 'Frequency',
        type: 'select',
        defaultValue: 'weekly',
        required: true,
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'one-time', label: 'One-time' }
        ]
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Enter item description'
      }
    ]
  },

  // LOGIN FORMS - COMPOSE, NEVER DUPLICATE! ♻️
  customerLogin: {
    title: 'Customer Login',
    submitText: 'Login',
    size: 'medium',
    fields: [
      {
        name: 'customerNumber',
        label: 'Customer Number',
        type: 'text',
        required: true,
        placeholder: 'Enter your customer number'
      },
      {
        name: 'loginCode',
        label: 'Login Code',
        type: 'text',
        required: true,
        placeholder: 'Enter your login code'
      }
    ]
  },

  driverLogin: {
    title: 'Driver Login',
    submitText: 'Login',
    size: 'medium',
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Enter your username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter your password'
      }
    ]
  },

  tokenSetup: {
    title: 'Setup Driver Token',
    submitText: 'Validate Token',
    size: 'medium',
    fields: [
      {
        name: 'token',
        label: 'Driver Token',
        type: 'text',
        required: true,
        placeholder: 'Enter your driver token'
      }
    ]
  },

  accountSetup: {
    title: 'Setup Your Account',
    submitText: 'Create Account',
    size: 'medium',
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Choose a username'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Choose a password'
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        required: true,
        placeholder: 'Confirm your password'
      }
    ]
  },

  demoSetup: {
    title: 'Demo Access',
    submitText: 'Access Demo',
    size: 'medium',
    fields: [
      {
        name: 'demoToken',
        label: 'Demo Token',
        type: 'text',
        required: true,
        placeholder: 'Enter demo token'
      }
    ]
  }
};

// BUTTON GROUP CONFIGS - COMPOSE, NEVER DUPLICATE! ⚔️
export const BUTTON_CONFIGS = {
  loginOptions: {
    title: 'Driver access?',
    size: 'small',
    buttons: [
      {
        key: 'driver-login',
        text: 'Driver Dashboard',
        variant: 'outline',
        className: 'border-slate-300 text-slate-700 hover:bg-slate-50'
      },
      {
        key: 'setup-token',
        text: 'I have a setup token',
        variant: 'ghost',
        className: 'text-slate-500 hover:text-slate-700'
      },
      {
        key: 'demo-access',
        text: 'Demo Access',
        variant: 'secondary',
        className: 'text-slate-600 hover:text-slate-800'
      }
    ]
  }
};