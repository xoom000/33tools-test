import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../constants/ui';
import { COMPONENT_ANIMATIONS, MICRO_ANIMATIONS } from '../../config/animations';

// COMPOSE, NEVER DUPLICATE - Button component with configuration! ⚔️
const Button = ({ 
  children, 
  variant = BUTTON_VARIANTS.PRIMARY, 
  size = BUTTON_SIZES.MD,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  tooltip,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // SOPHISTICATED MONOCHROME BUTTON SYSTEM
    [BUTTON_VARIANTS.PRIMARY]: 'bg-primary-800 text-white hover:bg-primary-900 focus:ring-primary-600 disabled:bg-primary-200 disabled:text-primary-400',
    [BUTTON_VARIANTS.SECONDARY]: 'bg-primary-100 text-primary-800 hover:bg-primary-200 focus:ring-primary-300 border border-primary-200 disabled:bg-primary-50 disabled:text-primary-300',
    [BUTTON_VARIANTS.OUTLINE]: 'border border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-300 disabled:border-primary-200 disabled:text-primary-400',
    [BUTTON_VARIANTS.DANGER]: 'bg-accent-danger-500 text-white hover:bg-accent-danger-600 focus:ring-accent-danger-300 disabled:bg-accent-danger-200',
    [BUTTON_VARIANTS.GHOST]: 'bg-transparent text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus:ring-primary-300 disabled:text-primary-300'
  };

  const sizes = {
    [BUTTON_SIZES.XS]: 'px-2 py-1 text-xs',
    [BUTTON_SIZES.SM]: 'px-3 py-1.5 text-sm',
    [BUTTON_SIZES.MD]: 'px-4 py-2 text-sm', 
    [BUTTON_SIZES.LG]: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      title={tooltip}
      className={cn(
        baseClasses,
        variants[variant] || variants[BUTTON_VARIANTS.PRIMARY],
        sizes[size] || sizes[BUTTON_SIZES.MD],
        {
          'cursor-not-allowed opacity-50': isDisabled,
          'cursor-pointer': !isDisabled
        },
        className
      )}
      {...COMPONENT_ANIMATIONS.button.hover}
      {...COMPONENT_ANIMATIONS.button.tap}
      {...props}
    >
      {loading && (
        <motion.span 
          className="mr-2"
          {...MICRO_ANIMATIONS.loading.spin}
        >
          ⏳
        </motion.span>
      )}
      {!loading && icon && <span className="mr-1">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;