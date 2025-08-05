import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import StatsCard from './StatsCard';
import { GRID_SYSTEMS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable stats grid component! ⚔️
const StatsGrid = memo(function StatsGrid({ 
  stats = [],
  columns = 4,
  className = ''
}) {
  // Use centralized grid system instead of hardcoded classes
  const getGridClass = () => {
    if (columns === 2) return cn(GRID_SYSTEMS.stats.container, 'grid-cols-2');
    if (columns === 3) return cn(GRID_SYSTEMS.stats.container, 'grid-cols-3');
    return cn(GRID_SYSTEMS.stats.container, GRID_SYSTEMS.stats.responsive);
  };

  return (
    <AnimatedContainer 
      variant="slideUp" 
      className={cn(getGridClass(), className)}
    >
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.key || index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </AnimatedContainer>
  );
});

export default StatsGrid;