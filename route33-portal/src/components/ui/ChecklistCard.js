import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import { CARD_CONFIGS } from '../../config/cardConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable checklist component! ⚔️
const ChecklistCard = memo(function ChecklistCard({ 
  title,
  items = [],
  icon,
  className = '',
  onItemCheck
}) {
  return (
    <AnimatedContainer 
      variant={CARD_CONFIGS.checklist.animation} 
      className={cn(CARD_CONFIGS.checklist.container, className)}
    >
      <h2 className={CARD_CONFIGS.checklist.header.typography}>
        {icon && <span className={CARD_CONFIGS.checklist.header.iconSpacing}>{icon}</span>}
        {title}
      </h2>
      
      <div className={CARD_CONFIGS.checklist.list.container}>
        {items.map((item, index) => (
          <label 
            key={index} 
            className={CARD_CONFIGS.checklist.list.item.container}
          >
            <input 
              type="checkbox" 
              className={CARD_CONFIGS.checklist.list.item.checkbox} 
              onChange={(e) => onItemCheck?.(item, e.target.checked, index)}
            />
            <span className={CARD_CONFIGS.checklist.list.item.label}>
              {typeof item === 'string' ? item : item.label || item}
            </span>
          </label>
        ))}
      </div>
    </AnimatedContainer>
  );
});

export default ChecklistCard;