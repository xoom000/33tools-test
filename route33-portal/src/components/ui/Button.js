import React from 'react';

// COMPOSE, NEVER DUPLICATE - Button component! ⚔️
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // SOPHISTICATED MONOCHROME BUTTON SYSTEM
    primary: 'bg-primary-800 text-white hover:bg-primary-900 focus:ring-primary-600 disabled:bg-primary-200 disabled:text-primary-400',
    secondary: 'bg-primary-100 text-primary-800 hover:bg-primary-200 focus:ring-primary-300 border border-primary-200 disabled:bg-primary-50 disabled:text-primary-300',
    outline: 'border border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-300 disabled:border-primary-200 disabled:text-primary-400',
    danger: 'bg-accent-danger-500 text-white hover:bg-accent-danger-600 focus:ring-accent-danger-300 disabled:bg-accent-danger-200',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus:ring-primary-300 disabled:text-primary-300'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm', 
    large: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.medium}
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {loading && <span className="mr-2">...</span>}
      {children}
    </button>
  );
};

export default Button;