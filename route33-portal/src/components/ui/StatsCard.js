import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import { CARD_CONFIGS } from '../../config/cardConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable stats card component! ⚔️
const StatsCard = memo(function StatsCard({ 
  title,
  value,
  icon,
  color = 'blue',
  className = ''
}) {
  const colorVariants = CARD_CONFIGS.stats.colorSchemes;

  return (
    <AnimatedContainer 
      variant={CARD_CONFIGS.stats.animation} 
      className={cn(CARD_CONFIGS.stats.container, colorVariants[color], className)}
    >
      {icon && (
        <div className={cn(CARD_CONFIGS.stats.icon.size, CARD_CONFIGS.stats.icon.spacing)}>{icon}</div>
      )}
      <div className={cn(CARD_CONFIGS.stats.value.typography, CARD_CONFIGS.stats.value.colorMapping[color])}>
        {value}
      </div>
      <div className={CARD_CONFIGS.stats.title.typography}>
        {title}
      </div>
    </AnimatedContainer>
  );
});

export default StatsCard;