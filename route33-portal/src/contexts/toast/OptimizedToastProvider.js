import React, { useMemo } from 'react';
import { ToastStateProvider } from './ToastStateContext';
import { ToastActionsProvider } from './ToastActionsContext';

// Optimized Toast Provider that splits context for better performance
export const OptimizedToastProvider = ({ 
  children,
  toasts,
  addToast,
  removeToast,
  updateToast,
  clearAllToasts,
  toast
}) => {
  // Memoize toast state - changes frequently during animations
  const toastState = useMemo(() => ({
    toasts
  }), [toasts]);

  // Memoize toast actions - stable functions, rarely change
  const toastActions = useMemo(() => ({
    addToast,
    removeToast,
    updateToast,
    clearAllToasts,
    toast,
    // Convenience methods that don't require state
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    loading: toast.loading,
    apiError: toast.apiError,
    promise: toast.promise
  }), [addToast, removeToast, updateToast, clearAllToasts, toast]);

  return (
    <ToastStateProvider value={toastState}>
      <ToastActionsProvider value={toastActions}>
        {children}
      </ToastActionsProvider>
    </ToastStateProvider>
  );
};

export default OptimizedToastProvider;