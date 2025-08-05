// Optimized Auth Context Exports - Performance Focused
export { useAuthState } from './AuthStateContext';
export { useAuthActions } from './AuthActionsContext'; 
export { useAuthUtils } from './AuthUtilsContext';
export { OptimizedAuthProvider } from './OptimizedAuthProvider';

// Convenience hook that combines all auth contexts (use sparingly)
import { useAuthState } from './AuthStateContext';
import { useAuthActions } from './AuthActionsContext';
import { useAuthUtils } from './AuthUtilsContext';

export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();
  const utils = useAuthUtils();
  
  return {
    ...state,
    ...actions,
    ...utils
  };
};

// Performance-optimized selective hooks for common use cases
export const useAuthUser = () => {
  const { currentUser, userType, isLoggedIn } = useAuthState();
  return { currentUser, userType, isLoggedIn };
};

export const useAuthLoading = () => {
  const { isLoading, authError } = useAuthState();  
  return { isLoading, authError };
};

export const useAuthLogin = () => {
  const { loginCustomer, loginDriver } = useAuthActions();
  return { loginCustomer, loginDriver };
};

export const useAuthLogout = () => {
  const { logout } = useAuthActions();
  return logout;
};