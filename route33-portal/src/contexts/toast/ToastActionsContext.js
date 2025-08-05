import React, { createContext, useContext } from 'react';

// Toast Actions Context - Functions only, rarely change
const ToastActionsContext = createContext();

export const useToastActions = () => {
  const context = useContext(ToastActionsContext);
  if (!context) {
    throw new Error('useToastActions must be used within a ToastProvider');
  }
  return context;
};

export const ToastActionsProvider = ({ children, value }) => {
  return (
    <ToastActionsContext.Provider value={value}>
      {children}
    </ToastActionsContext.Provider>
  );
};

export default ToastActionsContext;