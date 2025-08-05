import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedToastProvider } from './toast/OptimizedToastProvider';
import { 
  TOAST_STYLES, 
  NOTIFICATION_TYPES, 
  NOTIFICATION_ICONS, 
  NOTIFICATION_DURATIONS,
  NOTIFICATION_ANIMATIONS 
} from '../config/notificationConfigs';

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
    const styles = TOAST_STYLES;
    const variant = styles.variants[type] || styles.variants[NOTIFICATION_TYPES.ERROR];
    return `${styles.base} ${variant}`;
  };

  const getIcon = (type) => {
    const iconConfig = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS[NOTIFICATION_TYPES.ERROR];
    
    if (type === NOTIFICATION_TYPES.LOADING) {
      return (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      );
    }
    
    // Use emoji icons for simplicity (SVGs can be added later if needed)
    return <span className="text-lg">{iconConfig.emoji}</span>;
  };

  // Auto-remove timer (except for loading toasts)
  React.useEffect(() => {
    if (toast.type === 'loading') return; // Don't auto-remove loading toasts
    
    const defaultDuration = NOTIFICATION_DURATIONS.defaults[toast.type] || NOTIFICATION_DURATIONS.normal;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || defaultDuration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, toast.type, onRemove]);

  const animations = NOTIFICATION_ANIMATIONS;
  
  return (
    <motion.div
      layout
      {...animations.enter.slideInRight}
      exit={animations.exit.slideOutRight}
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
          transition={{ 
            duration: (toast.duration || NOTIFICATION_DURATIONS.defaults[toast.type] || NOTIFICATION_DURATIONS.normal) / 1000, 
            ease: 'linear' 
          }}
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

  // Use optimized split context provider for better performance
  return (
    <OptimizedToastProvider
      toasts={toasts}
      addToast={addToast}
      removeToast={removeToast}
      updateToast={updateToast}
      clearAllToasts={clearAllToasts}
      toast={toast}
    >
      {/* Legacy context for backward compatibility */}
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
    </OptimizedToastProvider>
  );
};