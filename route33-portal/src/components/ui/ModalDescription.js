import React from 'react';
import { cn } from '../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Modal description component! ⚔️
const ModalDescription = ({ 
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'mb-4 text-slate-600',
    large: 'mb-6 text-slate-600 text-lg',
    small: 'mb-3 text-slate-500 text-sm',
    emphasis: 'mb-4 text-slate-700 font-medium'
  };

  return (
    <div className={cn(variants[variant], className)}>
      <p className="leading-relaxed">
        {children}
      </p>
    </div>
  );
};

export default ModalDescription;