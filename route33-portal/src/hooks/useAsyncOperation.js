import { useState, useCallback } from 'react';
import logger from '../utils/logger';

// COMPOSE, NEVER DUPLICATE - Base async operation hook! ⚔️
export const useAsyncOperation = ({
  initialLoading = false,
  enableToast = false,
  logContext = ''
} = {}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState('');

  const execute = useCallback(async ({
    operation,
    successMessage,
    errorMessage,
    logSuccess,
    logError,
    showSuccessToast = false,
    showErrorToast = false,
    successToastOptions = {},
    retryFunction = null,
    loadingToastMessage = null,
    toast = null
  }) => {
    setLoading(true);
    setError('');

    let loadingToastId = null;
    if (loadingToastMessage && toast) {
      loadingToastId = toast.loading(loadingToastMessage.message, {
        title: loadingToastMessage.title
      });
    }

    try {
      const result = await operation();

      // Remove loading toast
      if (loadingToastId && toast) {
        toast.removeToast(loadingToastId);
      }

      // Log success
      if (logSuccess) {
        logger.info(logSuccess.message, logSuccess.data || {});
      }

      // Show success toast
      if (showSuccessToast && successMessage && toast) {
        toast.success(successMessage, successToastOptions);
      }

      return result;

    } catch (err) {
      // Remove loading toast
      if (loadingToastId && toast) {
        toast.removeToast(loadingToastId);
      }

      // Set error state
      const finalErrorMessage = errorMessage || 'Operation failed. Please try again.';
      setError(finalErrorMessage);

      // Log error
      if (logError) {
        logger.error(logError.message, { 
          error: err.message, 
          context: logContext,
          ...(logError.data || {})
        });
      }

      // Show error toast
      if (showErrorToast && toast) {
        if (retryFunction) {
          toast.apiError(err, retryFunction);
        } else {
          toast.error(finalErrorMessage);
        }
      }

      throw err;

    } finally {
      setLoading(false);
    }
  }, [logContext]);

  const clearError = useCallback(() => setError(''), []);

  const reset = useCallback(() => {
    setLoading(false);
    setError('');
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
    reset
  };
};

export default useAsyncOperation;