import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';
import { ALERT_CONFIGS, NOTIFICATION_TYPES, NOTIFICATION_ICONS } from '../../config/notificationConfigs';
import { COMPONENT_ANIMATIONS } from '../../config/animations';

// COMPOSE, NEVER DUPLICATE - Alert component with configuration! ⚔️
const Alert = ({
  type = NOTIFICATION_TYPES.INFO,
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  icon = true,
  animate = false
}) => {
  const config = ALERT_CONFIGS;
  const alertClasses = cn(config.base, config.variants[type], className);
  const iconColorClass = config.iconColors[type];

  // Render alert icon
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconConfig = NOTIFICATION_ICONS[type];
    
    return (
      <div className={`flex-shrink-0 ${iconColorClass}`}>
        <span className="text-lg">{iconConfig.emoji}</span>
      </div>
    );
  };

  // Render dismiss button
  const renderDismissButton = () => {
    if (!dismissible || !onDismiss) return null;
    
    return (
      <button
        onClick={onDismiss}
        className={cn('ml-auto pl-3 hover:opacity-70 transition-opacity', iconColorClass)}
      >
        <span className="sr-only">Dismiss</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    );
  };

  // Render action button
  const renderAction = () => {
    if (!action) return null;
    
    return (
      <button
        onClick={action.handler}
        className={cn(
          'mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded',
          {
            'text-green-700 bg-green-100 hover:bg-green-200': type === NOTIFICATION_TYPES.SUCCESS,
            'text-red-700 bg-red-100 hover:bg-red-200': type === NOTIFICATION_TYPES.ERROR,
            'text-yellow-700 bg-yellow-100 hover:bg-yellow-200': type === NOTIFICATION_TYPES.WARNING,
            'text-blue-700 bg-blue-100 hover:bg-blue-200': type === NOTIFICATION_TYPES.INFO
          }
        )}
      >
        {action.label}
      </button>
    );
  };

  const alertContent = (
    <div className={alertClasses}>
      <div className="flex">
        {renderIcon()}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          {message && (
            <div className="text-sm">
              {message}
            </div>
          )}
          {children}
          {renderAction()}
        </div>
        {renderDismissButton()}
      </div>
    </div>
  );

  // Wrap in motion div if animation is requested
  if (animate) {
    return (
      <motion.div
        {...COMPONENT_ANIMATIONS.toast.slideInTop}
      >
        {alertContent}
      </motion.div>
    );
  }

  return alertContent;
};

export default Alert;