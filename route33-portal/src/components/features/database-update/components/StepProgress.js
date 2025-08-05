import React from 'react';
import { Badge } from '../../../ui';
import { cn } from '../../../../utils/classNames';

const StepProgress = ({ currentStep, steps = ['upload', 'staging', 'validation', 'complete'] }) => {
  const stepLabels = {
    upload: 'Upload',
    staging: 'Stage',
    validation: 'Validate', 
    complete: 'Complete'
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = steps.indexOf(currentStep) > index;
          
          const getVariant = () => {
            if (isActive) return 'primary';
            if (isCompleted) return 'success';
            return 'default';
          };
          
          return (
          <React.Fragment key={step}>
            <Badge
              variant={getVariant()}
              size="lg"
              shape="pill"
              className="w-8 h-8 font-semibold"
            >
              {isCompleted ? '✓' : index + 1}
            </Badge>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-12 h-1',
                {
                  'bg-slate-600': steps.indexOf(currentStep) > index,
                  'bg-slate-200': steps.indexOf(currentStep) <= index
                }
              )} />
            )}
          </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;