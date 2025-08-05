import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { STYLE_PRESETS } from '../../config/styleConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable Quantity +/- Control! ⚔️
const QuantityControl = memo(function QuantityControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 999,
  size = 'medium',
  className = "" 
}) {
  // Use centralized style configurations
  const buttonStyle = STYLE_PRESETS.quantityControl.button[size];
  const displayStyle = STYLE_PRESETS.quantityControl.display[size];

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn(STYLE_PRESETS.quantityControl.container, className)}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={buttonStyle}
      >
        -
      </button>
      <span className={displayStyle}>
        {value}
      </span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={buttonStyle}
      >
        +
      </button>
    </div>
  );
});

export default QuantityControl;