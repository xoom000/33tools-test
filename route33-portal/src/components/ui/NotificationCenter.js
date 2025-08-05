import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { NOTIFICATION_MESSAGES } from '../../config/notificationConfigs';

// COMPOSE, NEVER DUPLICATE - Notification Center with predefined messages! ⚔️
const NotificationCenter = () => {
  const { toast } = useToast();

  // Helper methods for common notification scenarios
  const notify = {
    // CRUD operations
    crud: {
      created: (itemName = 'Item') => 
        toast.success(`${itemName} created successfully`, {
          title: NOTIFICATION_MESSAGES.crud.created.title
        }),
      
      updated: (itemName = 'Item') => 
        toast.success(`${itemName} updated successfully`, {
          title: NOTIFICATION_MESSAGES.crud.updated.title
        }),
      
      deleted: (itemName = 'Item') => 
        toast.success(`${itemName} deleted successfully`, {
          title: NOTIFICATION_MESSAGES.crud.deleted.title
        }),

      failed: (operation, itemName = 'Item', error = null) => {
        const messages = {
          create: NOTIFICATION_MESSAGES.crud.createFailed,
          update: NOTIFICATION_MESSAGES.crud.updateFailed,
          delete: NOTIFICATION_MESSAGES.crud.deleteFailed
        };
        
        const config = messages[operation] || messages.create;
        toast.error(error?.message || `${operation} ${itemName.toLowerCase()} failed`, {
          title: config.title
        });
      }
    },

    // Authentication
    auth: {
      loginSuccess: (userName = '') => 
        toast.success(
          userName ? `Welcome back, ${userName}!` : NOTIFICATION_MESSAGES.auth.loginSuccess.message,
          { title: NOTIFICATION_MESSAGES.auth.loginSuccess.title }
        ),
      
      loginFailed: (reason = '') => 
        toast.error(
          reason || NOTIFICATION_MESSAGES.auth.loginFailed.message,
          { title: NOTIFICATION_MESSAGES.auth.loginFailed.title }
        ),
      
      sessionExpired: () =>
        toast.warning(NOTIFICATION_MESSAGES.auth.sessionExpired.message, {
          title: NOTIFICATION_MESSAGES.auth.sessionExpired.title,
          duration: 0 // Persistent until dismissed
        })
    },

    // Data operations
    data: {
      syncSuccess: (itemCount = '') => 
        toast.success(
          itemCount ? `${itemCount} items synchronized` : NOTIFICATION_MESSAGES.data.syncSuccess.message,
          { title: NOTIFICATION_MESSAGES.data.syncSuccess.title }
        ),
      
      syncFailed: (error = null) =>
        toast.error(
          error?.message || NOTIFICATION_MESSAGES.data.syncFailed.message,
          { 
            title: NOTIFICATION_MESSAGES.data.syncFailed.title,
            action: {
              label: 'Retry',
              handler: () => console.log('Retry sync requested')
            }
          }
        ),
      
      loading: (message = '') =>
        toast.loading(
          message || NOTIFICATION_MESSAGES.data.loading.message,
          { title: NOTIFICATION_MESSAGES.data.loading.title }
        ),
      
      exportSuccess: (fileName = '') =>
        toast.success(
          fileName ? `${fileName} downloaded successfully` : NOTIFICATION_MESSAGES.data.exportSuccess.message,
          { title: NOTIFICATION_MESSAGES.data.exportSuccess.title }
        )
    },

    // Network status
    network: {
      offline: () =>
        toast.warning(NOTIFICATION_MESSAGES.network.offline.message, {
          title: NOTIFICATION_MESSAGES.network.offline.title,
          duration: 0 // Persistent
        }),
      
      online: () =>
        toast.success(NOTIFICATION_MESSAGES.network.online.message, {
          title: NOTIFICATION_MESSAGES.network.online.title,
          duration: 3000
        }),
      
      slowConnection: () =>
        toast.info(NOTIFICATION_MESSAGES.network.slowConnection.message, {
          title: NOTIFICATION_MESSAGES.network.slowConnection.title
        })
    },

    // Custom notifications
    custom: {
      success: (message, options = {}) => toast.success(message, options),
      error: (message, options = {}) => toast.error(message, options),
      warning: (message, options = {}) => toast.warning(message, options),
      info: (message, options = {}) => toast.info(message, options),
      loading: (message, options = {}) => toast.loading(message, options),
      
      // Promise-based notifications
      promise: (promise, messages = {}) => toast.promise(promise, messages)
    }
  };

  // Return the notification methods for use in other components
  return { notify };
};

// Hook for using notifications
export const useNotifications = () => {
  const { notify } = NotificationCenter();
  return notify;
};

// Higher-order component to provide notifications to components
export const withNotifications = (Component) => {
  return function WrappedComponent(props) {
    const notify = useNotifications();
    return <Component {...props} notify={notify} />;
  };
};

export default NotificationCenter;