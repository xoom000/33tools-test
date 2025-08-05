import React, { useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/classNames';
import { COMPONENT_ANIMATIONS, MICRO_ANIMATIONS } from '../../config/animations';

// Modal Context for compound component communication
const ModalContext = createContext();

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
};

// Main Modal Component (Container)
const Modal = ({
  isOpen,
  onClose,
  children,
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

  // Use centralized animation configurations
  const overlayAnimation = COMPONENT_ANIMATIONS.modal.backdrop;
  const modalAnimation = COMPONENT_ANIMATIONS.modal.content;

  if (!isOpen) return null;

  // Context value for compound components
  const contextValue = {
    onClose,
    size,
    isOpen
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            {...overlayAnimation}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-full p-3 sm:p-4">
            <motion.div
              ref={modalRef}
              {...modalAnimation}
              className={cn(
                'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              {...extraProps}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

// Modal Header Compound Component
const ModalHeader = ({ children, className = '', showCloseButton = true }) => {
  const { onClose } = useModalContext();
  
  return (
    <div className={cn("flex items-center justify-between p-6 pb-4", className)}>
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && (
        <motion.button
          onClick={onClose}
          {...MICRO_ANIMATIONS.hover.scale}
          {...MICRO_ANIMATIONS.tap.scale}
          className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

// Modal Title Compound Component
const ModalTitle = ({ children, className = '', id = "modal-title" }) => {
  return (
    <h3 id={id} className={cn("text-lg font-semibold text-slate-900", className)}>
      {children}
    </h3>
  );
};

// Modal Body Compound Component
const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={cn("px-6", className)}>
      {children}
    </div>
  );
};

// Modal Footer Compound Component
const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200", className)}>
      {children}
    </div>
  );
};

// Modal Close Button Compound Component
const ModalCloseButton = ({ children = "Close", variant = "outline", className = '' }) => {
  const { onClose } = useModalContext();
  
  const variants = {
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-slate-600 text-white hover:bg-slate-700"
  };
  
  return (
    <button
      onClick={onClose}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

// Legacy compatibility wrapper - maintains backward compatibility
const LegacyModal = ({ title, showCloseButton = true, children, ...props }) => {
  return (
    <Modal {...props}>
      {(title || showCloseButton) && (
        <ModalHeader showCloseButton={showCloseButton}>
          {title && <ModalTitle>{title}</ModalTitle>}
        </ModalHeader>
      )}
      <ModalBody>
        {children}
      </ModalBody>
    </Modal>
  );
};

// Attach compound components to main Modal
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;
Modal.Legacy = LegacyModal; // For backward compatibility

export default Modal;