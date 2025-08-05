import React, { createContext, useContext } from 'react';

// Auth Utils Context - Stable utility functions
const AuthUtilsContext = createContext();

export const useAuthUtils = () => {
  const context = useContext(AuthUtilsContext);
  if (!context) {
    throw new Error('useAuthUtils must be used within an AuthProvider');
  }
  return context;
};

export const AuthUtilsProvider = ({ children, value }) => {
  return (
    <AuthUtilsContext.Provider value={value}>
      {children}
    </AuthUtilsContext.Provider>
  );
};

export default AuthUtilsContext;