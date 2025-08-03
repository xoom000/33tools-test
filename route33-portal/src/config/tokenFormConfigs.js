// Token form configurations - COMPOSE, NOT DUPLICATE!
export const TOKEN_FORM_CONFIGS = {
  customer: {
    title: 'Generate Customer Token',
    description: 'This will generate a new login code for the specified customer.',
    fields: [
      {
        name: 'customerNumber',
        label: 'Customer Number',
        type: 'text',
        placeholder: 'Enter customer number (e.g., 170449)',
        required: true
      }
    ],
    validation: (data) => data.customerNumber.trim() !== ''
  },

  driver: {
    title: 'Generate Driver Token',
    description: 'The driver will use this token once to create their permanent account.',
    fields: [
      {
        name: 'routeNumber',
        label: 'Select Route',
        type: 'select',
        placeholder: 'Choose a route...',
        required: true
      },
      {
        name: 'expiresIn',
        label: 'Token Expires In (hours)',
        type: 'number',
        defaultValue: '24',
        min: '1',
        max: '168',
        required: true
      }
    ],
    validation: (data) => data.routeNumber !== ''
  },

  demo: {
    title: 'Generate Demo Token',
    description: 'Demo access will automatically expire after the specified time.',
    fields: [
      {
        name: 'demoName', 
        label: 'Demo Name',
        type: 'text',
        placeholder: 'e.g., Sales Demo for ABC Company',
        required: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'Brief description of demo purpose'
      },
      {
        name: 'expiresIn',
        label: 'Access Duration (hours)',
        type: 'number',
        defaultValue: '2',
        min: '1',
        max: '72',
        required: true
      },
      {
        name: 'permissions',
        label: 'Permissions',
        type: 'select',
        defaultValue: 'read_only',
        options: [
          { value: 'read_only', label: 'Read Only' },
          { value: 'limited_edit', label: 'Limited Edit' },
          { value: 'full_demo', label: 'Full Demo Access' }
        ]
      }
    ],
    validation: (data) => data.demoName.trim() !== ''
  }
};