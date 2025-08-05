import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';
import { FORM_CONFIG } from '../../config/ui';
import { COMPONENT_ANIMATIONS } from '../../config/animations';

// Validation icons
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

/**
 * COMPOSE, NEVER DUPLICATE - Unified Input Component
 * 
 * Combines BaseInput simplicity with FormInput enhanced features
 * Progressive enhancement based on props provided
 * 
 * Features:
 * - Basic mode: Simple input with label and error
 * - Enhanced mode: Real-time validation, icons, animations
 * - Supports all HTML input types plus textarea
 * - Consistent styling via configuration system
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - 'base' or 'enhanced' (auto-detected based on features used)
 * @param {boolean} props.validation - Enable real-time validation features
 * @param {Function} props.validator - Validation function for enhanced mode
 * @param {React.Node} props.leftIcon - Icon to display on left side
 * @param {React.Node} props.rightIcon - Icon to display on right side
 * @param {boolean} props.multiline - Render as textarea
 * @param {number} props.rows - Number of rows for textarea
 */
const Input = memo(({
  // Basic props
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  
  // Enhanced props (triggers enhanced mode)
  validation = false,
  validator,
  leftIcon,
  rightIcon,
  multiline = false,
  rows = 3,
  showValidation = true,
  validationDelay = 500,
  
  ...extraProps
}) => {
  // Enhanced mode state
  const [validationState, setValidationState] = useState(null); // null, 'valid', 'invalid'
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Memoize enhanced mode detection for performance
  const isEnhancedMode = useMemo(() => {
    return validation || validator || leftIcon || rightIcon || showValidation;
  }, [validation, validator, leftIcon, rightIcon, showValidation]);
  
  // Memoize styles based on mode
  const styles = useMemo(() => {
    return isEnhancedMode ? FORM_CONFIG.styles.enhanced : FORM_CONFIG.styles.base;
  }, [isEnhancedMode]);

  // Memoize validator function for performance
  const memoizedValidator = useMemo(() => validator, [validator]);

  // Real-time validation (enhanced mode only) - optimized
  useEffect(() => {
    if (!memoizedValidator || !showValidation || !hasBeenBlurred || !isEnhancedMode) return;
    
    const timer = setTimeout(() => {
      if (value || required) {
        const result = memoizedValidator(value);
        setValidationState(result.isValid ? 'valid' : 'invalid');
        setValidationMessage(result.message || '');
      } else {
        setValidationState(null);
        setValidationMessage('');
      }
    }, validationDelay);

    return () => clearTimeout(timer);
  }, [value, memoizedValidator, showValidation, hasBeenBlurred, required, validationDelay, isEnhancedMode]);

  // Memoize input classes calculation for performance
  const inputClasses = useMemo(() => {
    if (isEnhancedMode) {
      return cn(
        styles.input.base,
        {
          [styles.input.withLeftIcon]: leftIcon,
          [styles.input.withRightIcon]: rightIcon || (showValidation && validationState),
          [styles.input.disabled]: disabled,
          [styles.states.valid]: validationState === 'valid',
          [styles.states.invalid]: validationState === 'invalid' || error,
          [styles.states.focused]: isFocused,
          [styles.states.default]: !isFocused && !validationState && !error
        },
        className
      );
    } else {
      // Base mode - simpler classes
      return cn(
        styles.input,
        {
          'border-red-500 focus:ring-red-500': error,
          'border-slate-300 focus:ring-primary-500': !error
        },
        className
      );
    }
  }, [isEnhancedMode, styles, leftIcon, rightIcon, showValidation, validationState, disabled, error, isFocused, className]);

  // Extract callback props for stable references
  const { onFocus: propOnFocus, onBlur: propOnBlur, ...restExtraProps } = extraProps;

  // Memoized event handlers for performance
  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (propOnFocus) propOnFocus(e);
  }, [propOnFocus]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    setHasBeenBlurred(true);
    if (propOnBlur) propOnBlur(e);
  }, [propOnBlur]);


  // Render base mode (simpler structure)
  if (!isEnhancedMode) {
    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.requiredIndicator}>*</span>}
          </label>
        )}
        
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            rows={rows}
            className={inputClasses}
            {...restExtraProps}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={inputClasses}
            {...restExtraProps}
          />
        )}
        
        {error && <p className={styles.error}>{error}</p>}
        {helperText && !error && <p className={styles.helper}>{helperText}</p>}
      </div>
    );
  }

  // Render enhanced mode (full features)
  return (
    <div className={styles.container}>
      {label && (
        <motion.label 
          className={styles.label}
          {...COMPONENT_ANIMATIONS.form.field}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className={styles.inputWrapper}>
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
            className={inputClasses}
            {...restExtraProps}
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
            className={inputClasses}
            {...restExtraProps}
          />
        )}
        
        {/* Validation icon or custom right icon */}
        {showValidation && validationState && !rightIcon && (
          <motion.div 
            {...COMPONENT_ANIMATIONS.form.field}
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
          {...COMPONENT_ANIMATIONS.form.error}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <XIcon />
          {validationMessage}
        </motion.p>
      )}
      
      {!validationMessage && error && (
        <motion.p 
          {...COMPONENT_ANIMATIONS.form.error}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
      
      {/* Success message for valid state */}
      {validationState === 'valid' && hasBeenBlurred && (
        <motion.p 
          {...COMPONENT_ANIMATIONS.form.field}
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
});

export default Input;