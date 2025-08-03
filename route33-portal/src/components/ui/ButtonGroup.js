import React from 'react';
import { Button } from '.';

// COMPOSE, NEVER DUPLICATE - Button group with consistent styling! ⚔️
const ButtonGroup = ({ 
  buttons = [], 
  orientation = 'vertical',
  size = 'medium',
  className = ''
}) => {
  const containerClass = orientation === 'vertical' 
    ? 'space-y-2' 
    : 'flex gap-2';

  return (
    <div className={`${containerClass} ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={button.key || index}
          variant={button.variant || 'primary'}
          size={size}
          className={`w-full ${button.className || ''}`}
          onClick={button.onClick}
          disabled={button.disabled}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;