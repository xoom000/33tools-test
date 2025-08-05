import React, { createContext, useContext } from 'react';

// Auth Actions Context - Stable functions, rarely change
const AuthActionsContext = createContext();

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthProvider');  
  }
  return context;
};

export const AuthActionsProvider = ({ children, value }) => {
  return (
    <AuthActionsContext.Provider value={value}>
      {children}
    </AuthActionsContext.Provider>
  );
};

export default AuthActionsContext;