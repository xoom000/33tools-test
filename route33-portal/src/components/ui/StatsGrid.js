import React from 'react';
import { AnimatedContainer } from '../animations';
import StatsCard from './StatsCard';

// COMPOSE, NEVER DUPLICATE - Reusable stats grid component! ⚔️
const StatsGrid = ({ 
  stats = [],
  columns = 4,
  className = ''
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <AnimatedContainer 
      variant="slideUp" 
      className={`grid ${gridCols[columns]} gap-4 ${className}`}
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
};

export default StatsGrid;