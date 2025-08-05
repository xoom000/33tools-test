// Optimized Toast Context Exports - Performance Focused
export { useToastState } from './ToastStateContext';
export { useToastActions } from './ToastActionsContext';
export { OptimizedToastProvider } from './OptimizedToastProvider';

// Convenience hook that combines toast contexts (use sparingly)
import { useToastState } from './ToastStateContext';
import { useToastActions } from './ToastActionsContext';

export const useToast = () => {
  const state = useToastState();
  const actions = useToastActions();
  
  return {
    ...state,
    ...actions
  };
};

// Performance-optimized hooks for common use cases
export const useToastNotify = () => {
  const actions = useToastActions();
  return {
    success: actions.success,
    error: actions.error,
    info: actions.info,
    warning: actions.warning,
    loading: actions.loading
  };
};