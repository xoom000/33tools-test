import React from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import Button from './Button';
import { TYPOGRAPHY } from '../../theme';
import { SPACING_PATTERNS, FLEX_LAYOUTS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable empty state component! ⚔️
const EmptyState = ({
  icon,
  title,
  message,
  actionText,
  onAction,
  variant = 'default', // default, centered, compact
  className = ''
}) => {
  const variants = {
    default: {
      container: cn(SPACING_PATTERNS.padding.loose, 'py-12'),
      iconContainer: cn('w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4', FLEX_LAYOUTS.content.center),
      icon: 'text-slate-400 text-4xl',
      title: cn(TYPOGRAPHY.sizes.lg, TYPOGRAPHY.weights.medium, 'text-slate-600 mb-2'),
      message: cn(TYPOGRAPHY.sizes.sm, 'text-slate-500 max-w-sm mx-auto'),
      actionContainer: 'mt-6'
    },
    centered: {
      container: cn('text-center py-16', SPACING_PATTERNS.padding.loose),
      iconContainer: cn('w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6', FLEX_LAYOUTS.content.center),
      icon: 'text-slate-400 text-5xl',
      title: cn(TYPOGRAPHY.sizes.xl, TYPOGRAPHY.weights.semibold, 'text-slate-700 mb-3'),
      message: cn(TYPOGRAPHY.sizes.base, 'text-slate-500 max-w-md mx-auto'),
      actionContainer: 'mt-8'
    },
    compact: {
      container: 'text-center py-8',
      iconContainer: 'w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3',
      icon: 'text-slate-400 text-2xl',
      title: cn(TYPOGRAPHY.sizes.base, TYPOGRAPHY.weights.medium, 'text-slate-600 mb-1'),
      message: cn(TYPOGRAPHY.sizes.sm, 'text-slate-500'),
      actionContainer: 'mt-4'
    }
  };

  const styles = variants[variant];

  return (
    <AnimatedContainer variant="fadeIn" className={cn(styles.container, className)}>
      <div className="text-center">
        {icon && (
          <div className={styles.iconContainer}>
            <span className={styles.icon}>{icon}</span>
          </div>
        )}
        
        {title && (
          <h3 className={styles.title}>
            {title}
          </h3>
        )}
        
        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}
        
        {actionText && onAction && (
          <div className={styles.actionContainer}>
            <Button
              variant="primary"
              size="medium"
              onClick={onAction}
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default EmptyState;