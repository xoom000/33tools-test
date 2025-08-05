import React from 'react';
import { STATUS_INDICATORS, STATUS_BADGES } from '../../config/notificationConfigs';

// COMPOSE, NEVER DUPLICATE - Status Indicator with configuration! ⚔️
const StatusIndicator = ({
  type, // 'connection', 'sync', 'process'
  status, // 'online', 'offline', 'connecting', etc.
  size = 'sm',
  showLabel = true,
  showIcon = true,
  className = '',
  variant = 'badge' // 'badge', 'dot', 'inline'
}) => {
  const statusConfig = STATUS_INDICATORS[type]?.[status];
  
  if (!statusConfig) {
    console.warn(`Unknown status indicator: ${type}.${status}`);
    return null;
  }

  const badgeConfig = STATUS_BADGES;

  // Determine color variant based on status
  const getVariant = () => {
    if (status.includes('error') || status.includes('failed') || status === 'offline') {
      return 'error';
    }
    if (status.includes('success') || status.includes('completed') || status === 'online' || status === 'synced') {
      return 'success';
    }
    if (status.includes('warning') || status.includes('connecting') || status.includes('syncing')) {
      return 'warning';
    }
    if (status.includes('info') || status.includes('processing')) {
      return 'info';
    }
    return 'neutral';
  };

  // Render badge variant
  const renderBadge = () => {
    const variant = getVariant();
    const badgeClasses = `${badgeConfig.base} ${badgeConfig.variants[variant]} ${badgeConfig.sizes[size]} ${className}`;
    
    return (
      <span className={badgeClasses}>
        {showIcon && (
          <span className={`${statusConfig.animate || ''} ${showLabel ? 'mr-1' : ''}`}>
            {statusConfig.icon}
          </span>
        )}
        {showLabel && statusConfig.label}
      </span>
    );
  };

  // Render dot variant (small circular indicator)
  const renderDot = () => {
    const variant = getVariant();
    const dotSize = size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const dotColor = badgeConfig.variants[variant].split(' ')[0].replace('bg-', 'bg-');
    
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`${dotSize} ${dotColor} rounded-full ${statusConfig.animate || ''}`}></div>
        {showLabel && (
          <span className={`ml-2 text-sm ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        )}
      </div>
    );
  };

  // Render inline variant (icon + text)
  const renderInline = () => {
    return (
      <div className={`flex items-center ${className}`}>
        {showIcon && (
          <span className={`${statusConfig.color} ${statusConfig.animate || ''} ${showLabel ? 'mr-2' : ''}`}>
            {statusConfig.icon}
          </span>
        )}
        {showLabel && (
          <span className={`text-sm ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        )}
      </div>
    );
  };

  // Render based on variant
  switch (variant) {
    case 'dot':
      return renderDot();
    case 'inline':
      return renderInline();
    case 'badge':
    default:
      return renderBadge();
  }
};

export default StatusIndicator;