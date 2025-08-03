import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

export const useToastCleanup = () => {
  const { toast, clearAllToasts } = useToast();

  // Clear any persistent loading toasts on component mount (fixes stuck printer loading toast)
  useEffect(() => {
    // Only clear loading toasts, not all toasts - but we don't have a selective clear function
    // So we'll disable this auto-clear for now since it's killing all toasts after 400ms
    // const timer = setTimeout(() => {
    //   clearAllToasts();
    // }, 400);

    // Add keyboard shortcut to manually clear toasts (Ctrl+Shift+C)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearAllToasts();
        toast.info('All toasts cleared', {
          title: 'Toast Cleanup',
          duration: 4000
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // clearTimeout(timer); // Commented out since timer is disabled
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearAllToasts, toast]);

  return {
    clearAllToasts,
    toast
  };
};