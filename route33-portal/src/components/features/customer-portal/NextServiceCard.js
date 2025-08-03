import { Button } from '../../ui';
import { VARIANTS } from '../../../theme';
import { AnimatedContainer } from '../../animations';

const NextServiceCard = ({ 
  title = "Next Service",
  deliveryDay = "Friday Delivery",
  message = "Your regular items will be delivered as scheduled. Need anything extra?",
  buttonText = "Add Extra Items",
  onButtonClick,
  className = ""
}) => {
  return (
    <AnimatedContainer
      variant="slideUp"
      className={`${VARIANTS.card.base} p-6 mb-8 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          {deliveryDay}
        </span>
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
};

export default NextServiceCard;