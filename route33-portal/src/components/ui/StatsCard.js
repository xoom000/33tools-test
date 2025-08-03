import React from 'react';
import { AnimatedContainer } from '../animations';
import { TYPOGRAPHY } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Reusable stats card component! ⚔️
const StatsCard = ({ 
  title,
  value,
  icon,
  color = 'blue',
  className = ''
}) => {
  const colorVariants = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <AnimatedContainer 
      variant="scaleIn" 
      className={`text-center p-4 ${colorVariants[color]} rounded-lg ${className}`}
    >
      {icon && (
        <div className="text-2xl mb-2">{icon}</div>
      )}
      <div className={`${TYPOGRAPHY.sizes['2xl']} ${TYPOGRAPHY.weights.bold} ${color === 'yellow' ? 'text-yellow-600' : color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : 'text-slate-600'}`}>
        {value}
      </div>
      <div className={`${TYPOGRAPHY.sizes.sm} text-slate-600`}>
        {title}
      </div>
    </AnimatedContainer>
  );
};

export default StatsCard;