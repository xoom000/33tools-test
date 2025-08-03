import React from 'react';
import { AnimatedContainer } from '../animations';
import { VARIANTS, TYPOGRAPHY } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Reusable checklist component! ⚔️
const ChecklistCard = ({ 
  title,
  items = [],
  icon,
  className = '',
  onItemCheck
}) => {
  return (
    <AnimatedContainer 
      variant="slideUp" 
      className={`${VARIANTS.card.elevated} p-6 ${className}`}
    >
      <h2 className={`${TYPOGRAPHY.sizes.xl} ${TYPOGRAPHY.weights.semibold} mb-4 flex items-center`}>
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h2>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <label 
            key={index} 
            className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded transition-colors cursor-pointer"
          >
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
              onChange={(e) => onItemCheck?.(item, e.target.checked, index)}
            />
            <span className={`${TYPOGRAPHY.sizes.sm} text-slate-700`}>
              {typeof item === 'string' ? item : item.label || item}
            </span>
          </label>
        ))}
      </div>
    </AnimatedContainer>
  );
};

export default ChecklistCard;