import React from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import Button from './Button';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { FLEX_LAYOUTS, SPACING_PATTERNS } from '../../config/layoutConfigs';
import { VARIANTS } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Universal Tab Container! ⚔️
// Eliminates 60%+ duplication across 6 tab components
const TabContainer = ({
  // Content
  title,
  subtitle,
  count,
  children,
  
  // Actions
  actions = [],           // [{ label, variant, onClick, icon }]
  
  // States
  emptyState,            // { icon, title, description, actions }
  isLoading = false,
  isEmpty = false,
  
  // Animation & Styling
  variant = 'slideRight', // Animation variant for AnimatedContainer
  className = '',
  contentClassName = ''
}) => {
  // Render action buttons
  const renderActions = () => {
    if (actions.length === 0) return null;
    
    return (
      <div className={cn(FLEX_LAYOUTS.buttonGroup.horizontal, 'flex-wrap')}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'secondary'}
            size="small"
            onClick={action.onClick}
            disabled={action.disabled}
            className={action.className}
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  // Render header section
  const renderHeader = () => {
    if (!title && actions.length === 0) return null;
    
    return (
      <div className={cn(FLEX_LAYOUTS.header.between, 'mb-4')}>
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-slate-800">
              {title}
              {count !== undefined && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({count})
                </span>
              )}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
        {renderActions()}
      </div>
    );
  };

  // Render main content
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton variant="list" lines={3} />;
    }
    
    if (isEmpty && emptyState) {
      return (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          actions={emptyState.actions}
        />
      );
    }
    
    return children;
  };

  return (
    <AnimatedContainer 
      variant={variant} 
      className={cn(VARIANTS?.card?.base || 'bg-white rounded-2xl shadow-sm border border-slate-100', className)}
    >
      <div className={cn(SPACING_PATTERNS.padding.card, contentClassName)}>
        {renderHeader()}
        {renderContent()}
      </div>
    </AnimatedContainer>
  );
};

export default TabContainer;