import React from 'react';
import { cn } from '../../utils/classNames';
import { BADGE_CONFIGS, STYLE_PRESETS } from '../../config/styleConfigs';

// COMPOSE, NEVER DUPLICATE - Ultimate Badge/Chip Component! ⚔️
// Eliminates ALL badge duplication with preset combinations
const Badge = ({
  children,
  variant = 'default',    // 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' | 'outline'
  size = 'sm',           // 'xs' | 'sm' | 'md' | 'lg'
  shape = 'pill',        // 'rounded' | 'pill' | 'square'
  preset,                // Use preset instead of individual props (e.g., 'status.active', 'priority.high', 'tag.medium')
  icon,                  // Optional icon component
  iconPosition = 'left', // 'left' | 'right'
  onClick,              // Makes badge clickable
  className = '',
  ...props
}) => {
  // If preset is provided, use it directly
  if (preset) {
    const presetPath = preset.split('.');
    let presetStyle = STYLE_PRESETS.badge;
    
    for (const segment of presetPath) {
      presetStyle = presetStyle?.[segment];
    }
    
    if (presetStyle && typeof presetStyle === 'string') {
      const Component = onClick ? 'button' : 'span';
      
      return (
        <Component
          className={cn(
            presetStyle,
            { 'cursor-pointer hover:opacity-80 transition-opacity': onClick },
            className
          )}
          onClick={onClick}
          {...props}
        >
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </Component>
      );
    }
  }
  
  // Build badge from individual props
  const sizeConfig = BADGE_CONFIGS.sizes[size];
  const variantConfig = BADGE_CONFIGS.variants[variant];
  const shapeClass = BADGE_CONFIGS.shapes[shape];
  
  if (!sizeConfig || !variantConfig) {
    console.warn(`Badge: Invalid size "${size}" or variant "${variant}"`);
    return null;
  }
  
  const badgeClasses = cn(
    'inline-flex items-center',
    sizeConfig.padding,
    sizeConfig.text,
    variantConfig.background,
    variantConfig.text,
    shapeClass,
    variantConfig.border && `border ${variantConfig.border}`,
    {
      'gap-1.5': icon,
      'cursor-pointer hover:opacity-80 transition-opacity': onClick
    },
    className
  );
  
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      className={badgeClasses}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={cn('flex-shrink-0', sizeConfig.icon)}>
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={cn('flex-shrink-0', sizeConfig.icon)}>
          {icon}
        </span>
      )}
    </Component>
  );
};

// Status Dot Component - Small connection indicators
export const StatusDot = ({ 
  status = 'offline', // 'online' | 'offline' | 'away' | 'busy'
  className = '',
  label,
  ...props 
}) => {
  const dotStyle = STYLE_PRESETS.statusDot[status];
  
  if (!dotStyle) {
    console.warn(`StatusDot: Invalid status "${status}"`);
    return null;
  }
  
  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      <div className={dotStyle} />
      {label && <span className="text-sm text-slate-600">{label}</span>}
    </div>
  );
};

// Count Badge Component - Notification counters
export const CountBadge = ({
  count,
  size = 'small', // 'small' | 'medium'
  max = 99,      // Maximum count to display (shows "99+" if exceeded)
  className = '',
  ...props
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  const presetStyle = STYLE_PRESETS.badge.count[size];
  
  if (!presetStyle) {
    console.warn(`CountBadge: Invalid size "${size}"`);
    return null;
  }
  
  // Don't render if count is 0
  if (count === 0) return null;
  
  return (
    <span className={cn(presetStyle, className)} {...props}>
      {displayCount}
    </span>
  );
};

export default Badge;