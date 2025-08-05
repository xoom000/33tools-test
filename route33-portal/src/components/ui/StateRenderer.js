import React from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import { DashboardLayout } from '../layout';
import LoadingSkeleton from './LoadingSkeleton';
import Button from './Button';
import { STYLE_PRESETS } from '../../config/styleConfigs';

// COMPOSE, NEVER DUPLICATE - Ultimate State Management System! ⚔️
// Eliminates ALL loading/error/empty state duplication
const StateRenderer = ({
  state,                    // 'loading' | 'error' | 'success' | 'empty'
  variant = 'default',      // 'portal' | 'workspace' | 'modal' | 'inline'
  
  // Layout Control
  layout = 'centered',      // 'dashboard' | 'centered' | 'modal' | 'inline'
  header,                   // Header component for dashboard layouts
  
  // Loading State
  loadingVariant = 'default', // Passed to LoadingSkeleton
  loadingLines = 5,
  loadingMessage,           // Optional loading message
  
  // Error State
  error,                    // Error message string
  errorIcon = '⚠️',         // Error icon (emoji or component)
  errorTitle = 'Something went wrong', // Error title
  onRetry,                  // Retry function
  retryText = 'Try Again',  // Retry button text
  
  // Empty State
  emptyIcon = '📭',         // Empty state icon
  emptyTitle = 'No data found', // Empty state title
  emptyMessage = 'There\'s nothing here yet.', // Empty state message
  emptyAction,              // Custom empty state action component
  
  // Success Content
  children,                 // Success state content
  
  // Styling
  className = '',
  contentClassName = ''
}) => {
  // Loading State Renderer
  const renderLoading = () => {
    const content = (
      <div className={cn(contentClassName)}>
        <LoadingSkeleton 
          variant={loadingVariant}
          lines={loadingLines}
        />
        {loadingMessage && (
          <div className="text-center mt-4 text-slate-600">
            {loadingMessage}
          </div>
        )}
      </div>
    );

    return layout === 'dashboard' ? (
      <DashboardLayout header={header}>
        {content}
      </DashboardLayout>
    ) : content;
  };

  // Error State Renderer
  const renderError = () => {
    const content = (
      <AnimatedContainer variant="fadeIn" className={cn(STYLE_PRESETS.errorState.container, contentClassName)}>
        <div className={STYLE_PRESETS.errorState.icon}>{errorIcon}</div>
        <div className={STYLE_PRESETS.errorState.title}>{errorTitle}</div>
        <p className={STYLE_PRESETS.errorState.message}>
          {error || 'An unexpected error occurred. Please try again.'}
        </p>
        {onRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="shadow-lg"
          >
            {retryText}
          </Button>
        )}
      </AnimatedContainer>
    );

    return layout === 'dashboard' ? (
      <DashboardLayout header={header}>
        {content}
      </DashboardLayout>
    ) : content;
  };

  // Empty State Renderer
  const renderEmpty = () => {
    const content = (
      <AnimatedContainer variant="fadeIn" className={cn(STYLE_PRESETS.emptyState.container, contentClassName)}>
        <div className={STYLE_PRESETS.emptyState.icon}>{emptyIcon}</div>
        <h3 className={STYLE_PRESETS.emptyState.title}>{emptyTitle}</h3>
        <p className={cn(STYLE_PRESETS.emptyState.message, 'mb-6 max-w-md mx-auto')}>{emptyMessage}</p>
        {emptyAction}
      </AnimatedContainer>
    );

    return layout === 'dashboard' ? (
      <DashboardLayout header={header}>
        {content}
      </DashboardLayout>
    ) : content;
  };

  // Success State Renderer
  const renderSuccess = () => {
    return layout === 'dashboard' ? (
      <DashboardLayout header={header}>
        {children}
      </DashboardLayout>
    ) : children;
  };

  // Main State Router
  const renderState = () => {
    switch (state) {
      case 'loading':
        return renderLoading();
      case 'error':
        return renderError();
      case 'empty':
        return renderEmpty();
      case 'success':
      default:
        return renderSuccess();
    }
  };

  // Container with Layout
  const containerClasses = layout === 'inline' ? 
    className : 
    cn(className);

  return (
    <div className={containerClasses}>
      {renderState()}
    </div>
  );
};

export default StateRenderer;