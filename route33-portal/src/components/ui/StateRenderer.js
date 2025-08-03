import React from 'react';
import { AnimatedContainer } from '../animations';
import { DashboardLayout } from '../layout';
import LoadingSkeleton from './LoadingSkeleton';
import Button from './Button';

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
      <div className={`${contentClassName}`}>
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
      <AnimatedContainer variant="fadeIn" className={`text-center py-12 ${contentClassName}`}>
        <div className="text-red-600 text-6xl mb-4">{errorIcon}</div>
        <div className="text-red-600 text-xl mb-4">{errorTitle}</div>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
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
      <AnimatedContainer variant="fadeIn" className={`text-center py-12 ${contentClassName}`}>
        <div className="text-slate-400 text-6xl mb-4">{emptyIcon}</div>
        <h3 className="text-slate-700 text-xl font-semibold mb-2">{emptyTitle}</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">{emptyMessage}</p>
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
    `${className}`;

  return (
    <div className={containerClasses}>
      {renderState()}
    </div>
  );
};

export default StateRenderer;