import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { LAYOUT, ANIMATIONS, VARIANTS } from '../../theme';
import { cn } from '../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Ultimate Header System! ⚔️
// Eliminates 90% duplication across 5 header components
const UnifiedHeader = ({
  // Layout Control
  variant = 'sticky',           // 'sticky' | 'card' | 'simple'
  
  // Content Structure  
  title,                        // Main heading text
  subtitle,                     // Secondary text
  titleComponent,               // Custom title JSX (overrides title)
  
  // User/Customer Display
  user,                         // { name, type, id, ...}
  customer,                     // { name, number, ... }
  
  // Action Buttons
  primaryAction,               // { text, onClick, variant, condition }
  secondaryActions = [],       // [{ text, onClick, variant, condition }]
  logoutAction,               // { text, onClick } or boolean
  
  // Special Content
  leftContent,                // Custom JSX for left section
  rightContent,               // Custom JSX for right section  
  bottomContent,              // Additional content below header
  
  // Styling & Animation
  animated = true,
  className = '',
  
  // Responsive Control
  responsive = true
}) => {
  // Determine layout variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'sticky':
        return cn(LAYOUT.backgrounds.header, 'sticky top-0 z-10');
      case 'card':
        return cn(VARIANTS.card.base, 'mb-6');
      case 'simple':
        return 'text-center py-6';
      default:
        return variant; // Allow custom CSS classes
    }
  };

  // Build title content
  const renderTitle = () => {
    if (titleComponent) return titleComponent;
    
    if (user) {
      return (
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {user.name || `User #${user.id}`}
          </h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      );
    }
    
    if (customer) {
      return (
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {customer.name || `Customer #${customer.number}`}
          </h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      );
    }
    
    if (title) {
      return (
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      );
    }
    
    return null;
  };

  // Build action buttons
  const renderActions = () => {
    const actions = [];
    
    // Add primary action
    if (primaryAction && (!primaryAction.condition || primaryAction.condition)) {
      actions.push(
        <Button
          key="primary"
          variant={primaryAction.variant || 'primary'}
          size={primaryAction.size || 'small'}
          onClick={primaryAction.onClick}
          className={primaryAction.className}
        >
          {primaryAction.text}
        </Button>
      );
    }
    
    // Add secondary actions
    secondaryActions.forEach((action, index) => {
      if (!action.condition || action.condition) {
        actions.push(
          <Button
            key={`secondary-${index}`}
            variant={action.variant || 'secondary'}
            size={action.size || 'small'}
            onClick={action.onClick}
            className={action.className}
          >
            {action.text}
          </Button>
        );
      }
    });
    
    // Add logout action
    if (logoutAction) {
      const logoutProps = typeof logoutAction === 'object' 
        ? logoutAction 
        : { text: 'Sign Out', onClick: logoutAction };
        
      actions.push(
        <Button
          key="logout"
          variant={logoutProps.variant || 'ghost'}
          size={logoutProps.size || 'small'}
          onClick={logoutProps.onClick}
          className={logoutProps.className}
        >
          {logoutProps.text}
        </Button>
      );
    }
    
    return actions.length > 0 ? (
      <div className="flex items-center gap-2">
        {actions}
      </div>
    ) : null;
  };

  // Main layout based on variant
  const renderHeaderContent = () => {
    if (variant === 'simple') {
      return (
        <div className={className}>
          {renderTitle()}
        </div>
      );
    }
    
    // Two-column layout for sticky/card variants
    const containerClass = responsive ? 
      cn(LAYOUT.containers.base, 'mx-auto', LAYOUT.padding.page) :
      'px-4 py-3';
      
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex-1">
            {leftContent || renderTitle()}
          </div>
          
          {/* Right Section */}
          {(rightContent || renderActions()) && (
            <div className="flex-shrink-0 ml-4">
              {rightContent || renderActions()}
            </div>
          )}
        </div>
        
        {/* Bottom Content */}
        {bottomContent && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            {bottomContent}
          </div>
        )}
      </div>
    );
  };

  // Wrap with animation if enabled
  const HeaderElement = animated ? motion.div : 'div';
  const animationProps = animated ? ANIMATIONS.slideDown : {};

  return (
    <HeaderElement
      {...animationProps}
      className={cn(getVariantStyles(), className)}
    >
      {renderHeaderContent()}
    </HeaderElement>
  );
};

export default UnifiedHeader;