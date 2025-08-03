import logger from './logger';

// Clipboard text templates for different use cases
export const CLIPBOARD_TEMPLATES = {
  CUSTOMER_LOGIN_TOKEN: (data) => `Route 33 Portal Access

Customer: ${data.customerName}
Account: ${data.customerNumber}
Login Token: ${data.loginToken}

Instructions:
1. Visit: ${data.portalUrl || 'https://orders.route33.app'}
2. Enter your Account Number: ${data.customerNumber}
3. Enter your Customer Token: ${data.loginToken}
4. Click "Access Portal"

Token expires: ${data.expirationDate}

Questions? Contact your route driver.`,

  CUSTOMER_SIMPLE: (data) => `${data.customerName} (${data.customerNumber}) - Token: ${data.loginToken}`,

  DRIVER_CREDENTIALS: (data) => `Driver Access
Route: ${data.routeNumber}
Driver: ${data.driverName}
Login Code: ${data.loginToken}
Valid until: ${data.expirationDate}`,

  ORDER_DETAILS: (data) => `Order #${data.orderId}
Customer: ${data.customerName}
Items: ${data.itemCount} items
Total: $${data.total}
Notes: ${data.notes || 'None'}`
};

// Main clipboard utility function
export const copyToClipboard = async (template, data, options = {}) => {
  try {
    const {
      logContext = {},
      successMessage = 'Content copied to clipboard',
      onSuccess = null,
      onError = null
    } = options;

    // Generate text using template function
    const clipboardText = typeof template === 'function' 
      ? template(data) 
      : template;

    // Copy to clipboard
    await navigator.clipboard.writeText(clipboardText);

    // Log success
    logger.info('Content copied to clipboard', {
      template: template.name || 'custom',
      dataKeys: Object.keys(data),
      ...logContext
    });

    // Success callback
    if (onSuccess) {
      onSuccess(clipboardText);
    }

    console.log(successMessage);
    return { success: true, text: clipboardText };

  } catch (error) {
    // Log error
    logger.error('Failed to copy to clipboard', { 
      error: error.message,
      template: template.name || 'custom',
      ...options.logContext
    });

    // Error callback
    if (options.onError) {
      options.onError(error);
    }

    return { success: false, error: error.message };
  }
};

// Convenience functions for common use cases
export const copyCustomerLoginToken = async (customerData, loginToken, options = {}) => {
  const data = {
    customerName: customerData.account_name,
    customerNumber: customerData.customer_number,
    loginToken: loginToken.token,
    expirationDate: new Date(loginToken.expires_at).toLocaleDateString(),
    portalUrl: options.portalUrl || 'https://orders.route33.app'
  };

  return copyToClipboard(CLIPBOARD_TEMPLATES.CUSTOMER_LOGIN_TOKEN, data, {
    logContext: {
      customerNumber: customerData.customer_number,
      token: loginToken.token.substring(0, 4) + '***',
      isNew: loginToken.is_new
    },
    successMessage: `${loginToken.is_new ? 'New token generated' : 'Existing token retrieved'} and copied to clipboard!`,
    ...options
  });
};

export const copySimpleCustomerInfo = async (customerData, loginToken, options = {}) => {
  const data = {
    customerName: customerData.account_name,
    customerNumber: customerData.customer_number,
    loginToken: loginToken.token
  };

  return copyToClipboard(CLIPBOARD_TEMPLATES.CUSTOMER_SIMPLE, data, options);
};

// Hook for clipboard functionality in React components
export const useClipboard = () => {
  const copy = async (template, data, options = {}) => {
    return copyToClipboard(template, data, options);
  };

  const copyCustomerToken = async (customerData, loginToken, options = {}) => {
    return copyCustomerLoginToken(customerData, loginToken, options);
  };

  return {
    copy,
    copyCustomerToken,
    templates: CLIPBOARD_TEMPLATES
  };
};