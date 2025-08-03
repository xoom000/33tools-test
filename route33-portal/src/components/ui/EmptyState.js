import React from 'react';
import { AnimatedContainer } from '../animations';
import Button from './Button';
import { TYPOGRAPHY } from '../../theme';

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
      container: 'py-12',
      iconContainer: 'w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4',
      icon: 'text-slate-400 text-4xl',
      title: `${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.medium} text-slate-600 mb-2`,
      message: `${TYPOGRAPHY.sizes.sm} text-slate-500 max-w-sm mx-auto`,
      actionContainer: 'mt-6'
    },
    centered: {
      container: 'text-center py-16',
      iconContainer: 'w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6',
      icon: 'text-slate-400 text-5xl',
      title: `${TYPOGRAPHY.sizes.xl} ${TYPOGRAPHY.weights.semibold} text-slate-700 mb-3`,
      message: `${TYPOGRAPHY.sizes.base} text-slate-500 max-w-md mx-auto`,
      actionContainer: 'mt-8'
    },
    compact: {
      container: 'text-center py-8',
      iconContainer: 'w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3',
      icon: 'text-slate-400 text-2xl',
      title: `${TYPOGRAPHY.sizes.base} ${TYPOGRAPHY.weights.medium} text-slate-600 mb-1`,
      message: `${TYPOGRAPHY.sizes.sm} text-slate-500`,
      actionContainer: 'mt-4'
    }
  };

  const styles = variants[variant];

  return (
    <AnimatedContainer variant="fadeIn" className={`${styles.container} ${className}`}>
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