import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Icons for validation feedback
const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// Enhanced FormInput with real-time validation
const FormInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  multiline = false,
  rows = 3,
  className = '',
  validator,
  showValidation = true,
  validationDelay = 500,
  ...extraProps
}) => {
  const [validationState, setValidationState] = useState(null); // null, 'valid', 'invalid'
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Real-time validation with debounce
  useEffect(() => {
    if (!validator || !showValidation || !hasBeenBlurred) return;
    
    const timer = setTimeout(() => {
      if (value || required) {
        const result = validator(value);
        setValidationState(result.isValid ? 'valid' : 'invalid');
        setValidationMessage(result.message || '');
      } else {
        setValidationState(null);
        setValidationMessage('');
      }
    }, validationDelay);

    return () => clearTimeout(timer);
  }, [value, validator, showValidation, hasBeenBlurred, required, validationDelay]);

  const getInputClasses = () => {
    let classes = `
      w-full px-3 py-2 border rounded-lg 
      focus:outline-none focus:ring-2 
      transition-all duration-200
      ${leftIcon ? 'pl-10' : ''}
      ${(rightIcon || (showValidation && validationState)) ? 'pr-10' : ''}
      ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
      ${className}
    `;
    
    // Validation states override error prop
    if (validationState === 'valid') {
      classes += ' border-green-500 focus:ring-green-500';
    } else if (validationState === 'invalid' || error) {
      classes += ' border-red-500 focus:ring-red-500';
    } else if (isFocused) {
      classes += ' border-blue-500 focus:ring-blue-500';
    } else {
      classes += ' border-slate-300 focus:ring-blue-500';
    }
    
    return classes;
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (extraProps.onFocus) extraProps.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasBeenBlurred(true);
    if (extraProps.onBlur) extraProps.onBlur(e);
  };

  return (
    <div className="mb-4">
      {label && (
        <motion.label 
          className="block text-sm font-medium text-slate-700 mb-2"
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">{leftIcon}</span>
          </div>
        )}
        
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            rows={rows}
            className={getInputClasses()}
            {...extraProps}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={getInputClasses()}
            {...extraProps}
          />
        )}
        
        {/* Validation icon or custom right icon */}
        {showValidation && validationState && !rightIcon && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {validationState === 'valid' ? <CheckIcon /> : <XIcon />}
          </motion.div>
        )}
        
        {rightIcon && !showValidation && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-slate-400">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {/* Error messages with priority: validation > prop error */}
      {validationState === 'invalid' && hasBeenBlurred && validationMessage && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <XIcon />
          {validationMessage}
        </motion.p>
      )}
      
      {!validationMessage && error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
      
      {/* Success message for valid state */}
      {validationState === 'valid' && hasBeenBlurred && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-500 text-sm mt-1 flex items-center gap-1"
        >
          <CheckIcon />
          Looks good!
        </motion.p>
      )}
      
      {/* Helper text when no errors */}
      {helperText && !error && !validationMessage && (
        <p className="text-slate-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;