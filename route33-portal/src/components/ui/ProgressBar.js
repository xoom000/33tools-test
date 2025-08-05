import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { TYPOGRAPHY } from '../../theme';
import { FLEX_LAYOUTS, SPACING_PATTERNS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable Progress Bar! ⚔️
const ProgressBar = memo(function ProgressBar({ 
  current, 
  total, 
  label = "Progress",
  showSteps = true,
  className = "" 
}) {
  const progress = (current / total) * 100;

  return (
    <div className={cn(SPACING_PATTERNS.margin.section, className)}>
      <div className={cn(FLEX_LAYOUTS.header.between, 'mb-2')}>
        <span className={cn(TYPOGRAPHY.sizes.sm, TYPOGRAPHY.weights.medium, 'text-slate-600')}>
          {label}
        </span>
        {showSteps && (
          <span className={cn(TYPOGRAPHY.sizes.sm, 'text-slate-500')}>
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
});

export default ProgressBar;