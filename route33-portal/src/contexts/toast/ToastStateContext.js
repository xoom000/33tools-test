import React, { createContext, useContext } from 'react';

// Toast State Context - Visual state only for ToastContainer
const ToastStateContext = createContext();

export const useToastState = () => {
  const context = useContext(ToastStateContext);
  if (!context) {
    throw new Error('useToastState must be used within a ToastProvider');
  }
  return context;
};

export const ToastStateProvider = ({ children, value }) => {
  return (
    <ToastStateContext.Provider value={value}>
      {children}
    </ToastStateContext.Provider>
  );
};

export default ToastStateContext;