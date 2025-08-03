import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Component
const Toast = ({ toast, onRemove }) => {
  const getToastStyles = (type) => {
    const base = "relative rounded-lg shadow-lg p-4 text-white min-w-[320px] max-w-md";
    switch (type) {
      case 'success': 
        return `${base} bg-gradient-to-r from-green-500 to-green-600`;
      case 'warning': 
        return `${base} bg-gradient-to-r from-yellow-500 to-yellow-600`;
      case 'info': 
        return `${base} bg-gradient-to-r from-blue-500 to-blue-600`;
      case 'loading':
        return `${base} bg-gradient-to-r from-slate-500 to-slate-600`;
      default: 
        return `${base} bg-gradient-to-r from-red-500 to-red-600`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'loading':
        return (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Auto-remove timer (except for loading toasts)
  React.useEffect(() => {
    if (toast.type === 'loading') return; // Don't auto-remove loading toasts
    
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, toast.type, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={getToastStyles(toast.type)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold text-sm mb-1">{toast.title}</div>
            )}
            <div className="text-sm">{toast.message}</div>
            {toast.action && (
              <button
                onClick={toast.action.handler}
                className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        </div>
        
        {toast.type !== 'loading' && (
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Progress bar for auto-dismissing toasts */}
      {toast.type !== 'loading' && toast.showProgress !== false && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
        />
      )}
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = React.useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'error',
      title: options.title,
      duration: options.duration || 5000,
      showProgress: options.showProgress !== false,
      action: options.action // { label: 'Retry', handler: () => {} }
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Return the toast ID so caller can remove it if needed
    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const updateToast = React.useCallback((id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  const clearAllToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  // Helper methods for common toast types
  const toast = {
    success: (message, options = {}) => 
      addToast(message, { ...options, type: 'success' }),
    
    error: (message, options = {}) => 
      addToast(message, { ...options, type: 'error' }),
    
    warning: (message, options = {}) => 
      addToast(message, { ...options, type: 'warning' }),
    
    info: (message, options = {}) => 
      addToast(message, { ...options, type: 'info' }),
    
    loading: (message, options = {}) => 
      addToast(message, { ...options, type: 'loading', duration: 0 }),
    
    // API error handler with retry functionality
    apiError: (error, retryHandler = null) => {
      const message = error.message || 'An unexpected error occurred';
      const action = retryHandler ? {
        label: 'Retry',
        handler: retryHandler
      } : null;
      
      return addToast(message, {
        type: 'error',
        title: 'Request Failed',
        action,
        duration: 7000
      });
    },

    // Promise-based loading toast
    promise: async (promise, messages = {}) => {
      const loadingId = addToast(
        messages.loading || 'Processing...', 
        { type: 'loading' }
      );

      try {
        const result = await promise;
        removeToast(loadingId);
        addToast(
          messages.success || 'Success!',
          { type: 'success' }
        );
        return result;
      } catch (error) {
        removeToast(loadingId);
        addToast(
          messages.error || error.message || 'Something went wrong',
          { type: 'error' }
        );
        throw error;
      }
    }
  };

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearAllToasts,
    toast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              className="pointer-events-auto"
              layout
            >
              <Toast 
                toast={toast} 
                onRemove={removeToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};