import React, { memo } from 'react';
import { Button, Badge } from '../../ui';
import { VARIANTS } from '../../../theme';
import { AnimatedContainer } from '../../animations';
import { cn } from '../../../utils/classNames';

const NextServiceCard = memo(function NextServiceCard({ 
  title = "Next Service",
  deliveryDay = "Friday Delivery",
  message = "Your regular items will be delivered as scheduled. Need anything extra?",
  buttonText = "Add Extra Items",
  onButtonClick,
  className = ""
}) {
  return (
    <AnimatedContainer
      variant="slideUp"
      className={cn(VARIANTS.card.base, 'p-6 mb-8', className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <Badge variant="success" size="sm" shape="pill">
          {deliveryDay}
        </Badge>
      </div>
      <p className="text-slate-600 mb-4">
        {message}
      </p>
      <Button 
        variant="primary" 
        size="medium"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </AnimatedContainer>
  );
});

export default NextServiceCard;