// COMPOSE, NEVER DUPLICATE - Workflow Constants! ⚔️

export const WORKFLOW_STEPS = {
  UPLOAD: 'upload',
  STAGING: 'staging', 
  VALIDATION: 'validation',
  COMPLETE: 'complete'
};

export const WORKFLOW_STEP_LABELS = {
  [WORKFLOW_STEPS.UPLOAD]: 'Upload',
  [WORKFLOW_STEPS.STAGING]: 'Stage',
  [WORKFLOW_STEPS.VALIDATION]: 'Validate',
  [WORKFLOW_STEPS.COMPLETE]: 'Complete'
};

export const WORKFLOW_STEP_DESCRIPTIONS = {
  [WORKFLOW_STEPS.UPLOAD]: {
    title: 'Step 1: Upload RouteOptimization CSV',
    description: 'Upload the RouteOptimization CSV to analyze customer changes'
  },
  [WORKFLOW_STEPS.STAGING]: {
    title: 'Step 2: Route Optimization Analysis Complete',
    description: 'Changes staged. Upload CustomerMasterAnalysis CSV to populate inventory.'
  },
  [WORKFLOW_STEPS.VALIDATION]: {
    title: 'Step 3: Driver Validation for Route',
    description: 'Review and approve changes before applying to database'
  },
  [WORKFLOW_STEPS.COMPLETE]: {
    title: 'Staging Complete!',
    description: 'All changes have been staged for driver validation. Drivers will be notified to review and approve changes.'
  }
};

export const FILE_UPLOAD_CONFIG = {
  ROUTE_OPTIMIZATION: {
    title: 'Upload RouteOptimization CSV',
    description: 'Upload the RouteOptimization CSV to analyze customer changes',
    acceptedTypes: '.csv'
  },
  CUSTOMER_MASTER_ANALYSIS: {
    title: 'Upload CustomerMasterAnalysis CSV', 
    description: 'This will populate the customer shells with inventory data',
    acceptedTypes: '.csv'
  }
};

export const WORKFLOW_ACTIONS = {
  BACK: 'Back',
  CLOSE: 'Close',
  APPLYING: 'Applying...',
  APPLY_CHANGES: (count) => `Apply ${count} Changes`
};

export const WORKFLOW_ICONS = {
  STAGING: '🔄',
  SUCCESS: '✅'
};