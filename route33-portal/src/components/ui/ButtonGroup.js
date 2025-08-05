import React from 'react';
import { cn } from '../../utils/classNames';
import Button from './Button';
import { TOOLBAR_LAYOUTS, ACTION_GROUPS } from '../../config/buttonConfigs';
import { BUTTON_SIZES } from '../../constants/ui';

// COMPOSE, NEVER DUPLICATE - Button group with configuration! ⚔️
const ButtonGroup = ({ 
  buttons = [], 
  layout = 'horizontal',
  size = BUTTON_SIZES.MD,
  className = '',
  actionGroup,
  onAction
}) => {
  // Use predefined action group if provided
  const buttonsToRender = actionGroup 
    ? Object.entries(ACTION_GROUPS[actionGroup] || {}).map(([key, config]) => ({
        ...config,
        key,
        onClick: () => onAction?.(key)
      }))
    : buttons;

  // Get layout configuration
  const layoutConfig = TOOLBAR_LAYOUTS[layout] || TOOLBAR_LAYOUTS.horizontal;

  return (
    <div className={cn(layoutConfig.container, className)}>
      {buttonsToRender.map((button, index) => (
        <Button
          key={button.key || index}
          variant={button.variant}
          size={button.size || size}
          className={button.className || ''}
          onClick={button.onClick}
          disabled={button.disabled}
          loading={button.loading}
          icon={button.icon}
          tooltip={button.tooltip}
          type={button.type}
        >
          {button.label || button.text || button.children}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;