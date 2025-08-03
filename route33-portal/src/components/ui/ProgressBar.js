import React from 'react';
import { TYPOGRAPHY } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Reusable Progress Bar! ⚔️
const ProgressBar = ({ 
  current, 
  total, 
  label = "Progress",
  showSteps = true,
  className = "" 
}) => {
  const progress = (current / total) * 100;

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`${TYPOGRAPHY.sizes.sm} ${TYPOGRAPHY.weights.medium} text-slate-600`}>
          {label}
        </span>
        {showSteps && (
          <span className={`${TYPOGRAPHY.sizes.sm} text-slate-500`}>
            {current} of {total}
          </span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-slate-800 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;