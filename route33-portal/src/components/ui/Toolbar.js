import React from 'react';
import { cn } from '../../utils/classNames';
import ButtonGroup from './ButtonGroup';
import { TOOLBAR_LAYOUTS, BUTTON_GROUPS } from '../../config/buttonConfigs';
import { FLEX_LAYOUTS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Toolbar with predefined button patterns! ⚔️
const Toolbar = ({
  // Predefined patterns
  pattern,  // 'tabActions', 'modalFooter', 'customerCard', 'adminDashboard'
  
  // Custom configuration
  left = [],
  right = [],
  center = [],
  buttons = [],
  
  // Layout options
  layout = 'horizontal',
  className = '',
  
  // Event handlers
  onAction,
  
  // States
  loading = {},
  disabled = {}
}) => {
  // Use predefined button group if pattern is specified
  if (pattern && BUTTON_GROUPS[pattern]) {
    const config = BUTTON_GROUPS[pattern];
    
    return (
      <div className={cn(config.layout.container, className)}>
        {config.left && (
          <ButtonGroup
            buttons={config.left.map(btn => ({
              ...btn,
              loading: loading[btn.key],
              disabled: disabled[btn.key],
              onClick: () => onAction?.(btn.key || btn.label.toLowerCase())
            }))}
            layout="horizontal"
          />
        )}
        
        {config.buttons && (
          <ButtonGroup
            buttons={config.buttons.map(btn => ({
              ...btn,
              loading: loading[btn.key],
              disabled: disabled[btn.key],
              onClick: () => onAction?.(btn.key || btn.label.toLowerCase())
            }))}
            layout="horizontal"
          />
        )}
        
        {config.right && (
          <ButtonGroup
            buttons={config.right.map(btn => ({
              ...btn,
              loading: loading[btn.key],
              disabled: disabled[btn.key],
              onClick: () => onAction?.(btn.key || btn.label.toLowerCase())
            }))}
            layout="horizontal"
          />
        )}
      </div>
    );
  }
  
  // Custom layout with left, right, center groups
  if (left.length > 0 || right.length > 0 || center.length > 0) {
    const layoutConfig = TOOLBAR_LAYOUTS.split;
    
    return (
      <div className={cn(layoutConfig.container, className)}>
        {left.length > 0 && (
          <div className={layoutConfig.left}>
            <ButtonGroup
              buttons={left.map(btn => ({
                ...btn,
                loading: loading[btn.key],
                disabled: disabled[btn.key],
                onClick: () => onAction?.(btn.key || btn.action)
              }))}
              layout="horizontal"
            />
          </div>
        )}
        
        {center.length > 0 && (
          <div className={FLEX_LAYOUTS.buttonGroup.horizontal}>
            <ButtonGroup
              buttons={center.map(btn => ({
                ...btn,
                loading: loading[btn.key],
                disabled: disabled[btn.key],
                onClick: () => onAction?.(btn.key || btn.action)
              }))}
              layout="horizontal"
            />
          </div>
        )}
        
        {right.length > 0 && (
          <div className={layoutConfig.right}>
            <ButtonGroup
              buttons={right.map(btn => ({
                ...btn,
                loading: loading[btn.key],
                disabled: disabled[btn.key],
                onClick: () => onAction?.(btn.key || btn.action)
              }))}
              layout="horizontal"
            />
          </div>
        )}
      </div>
    );
  }
  
  // Simple button list
  return (
    <ButtonGroup
      buttons={buttons.map(btn => ({
        ...btn,
        loading: loading[btn.key],
        disabled: disabled[btn.key],
        onClick: () => onAction?.(btn.key || btn.action)
      }))}
      layout={layout}
      className={className}
      onAction={onAction}
    />
  );
};

export default Toolbar;