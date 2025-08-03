import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Base Modal with enhanced focus management
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'medium',
  className = '',
  autoFocus = true,
  trapFocus = true,
  closeOnEscape = true,
  ...extraProps
}) => {
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const firstFocusableElementRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previouslyFocusedElementRef.current = document.activeElement;

    // Focus management after modal opens
    const timer = setTimeout(() => {
      if (!modalRef.current) return;

      // Find focusable elements
      const focusableElements = modalRef.current.querySelectorAll(
        'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0 && autoFocus) {
        firstFocusableElementRef.current = focusableElements[0];
        focusableElements[0].focus();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Restore focus to the previously focused element when modal closes
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen, autoFocus]);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Close on Escape
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trapping
      if (trapFocus && e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, trapFocus, closeOnEscape]);

  const sizes = {
    small: 'max-w-xs sm:max-w-sm md:max-w-md',
    medium: 'max-w-sm sm:max-w-md lg:max-w-lg', 
    large: 'max-w-md sm:max-w-lg lg:max-w-xl',
    xlarge: 'max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl'
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="flex items-center justify-center min-h-full p-3 sm:p-4">
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${sizes[size]} ${className}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            {...extraProps}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 pb-4">
                {title && (
                  <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;