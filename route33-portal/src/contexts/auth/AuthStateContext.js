import React, { createContext, useContext } from 'react';

// Auth State Context - Pure state only, changes less frequently
const AuthStateContext = createContext();

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const AuthStateProvider = ({ children, value }) => {
  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
};

export default AuthStateContext;