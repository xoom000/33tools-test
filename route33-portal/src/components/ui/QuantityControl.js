import React from 'react';

// COMPOSE, NEVER DUPLICATE - Reusable Quantity +/- Control! ⚔️
const QuantityControl = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 999,
  size = 'medium',
  className = "" 
}) => {
  const sizes = {
    small: {
      button: 'w-6 h-6 text-xs',
      display: 'text-sm px-2 py-1 min-w-[2rem]'
    },
    medium: {
      button: 'w-7 h-7 text-sm',
      display: 'text-lg px-3 py-1 min-w-[3rem]'
    },
    large: {
      button: 'w-8 h-8 text-base',
      display: 'text-xl px-4 py-2 min-w-[4rem]'
    }
  };

  const currentSize = sizes[size];

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
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${currentSize.button} rounded-full bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 font-bold flex items-center justify-center transition-colors`}
      >
        -
      </button>
      <span className={`${currentSize.display} font-semibold text-slate-800 text-center bg-white rounded-lg border border-slate-200`}>
        {value}
      </span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${currentSize.button} rounded-full bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 font-bold flex items-center justify-center transition-colors`}
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;