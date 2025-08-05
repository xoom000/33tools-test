import React from 'react';
import { AnimatedContainer } from '../../animations';
import { Button, ProgressBar } from '../../ui';
import { TYPOGRAPHY } from '../../../theme';
import { DEMO_STEPS } from '../../../constants/demo';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Tutorial Flow Renderer! ⚔️
const TutorialRenderer = ({
  currentStep,
  currentStepData,
  tutorialProgress,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  className = ""
}) => {
  return (
    <div className={className}>
      {/* Progress Bar */}
      <ProgressBar
        current={currentStep + 1}
        total={DEMO_STEPS.length}
        label="Tutorial Progress"
      />

      {/* Tutorial Content */}
      <AnimatedContainer
        key={currentStep}
        variant="slideRight"
        className="text-center mb-8"
      >
        <h1 className={cn(TYPOGRAPHY.sizes['2xl'], TYPOGRAPHY.weights.bold, 'text-slate-800 mb-4')}>
          {currentStepData.title}
        </h1>
        <p className={cn('text-slate-600 leading-relaxed mb-6', TYPOGRAPHY.sizes.lg)}>
          {currentStepData.content}
        </p>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className={cn(TYPOGRAPHY.sizes.sm, TYPOGRAPHY.weights.medium, 'text-slate-700')}>
            {currentStepData.highlight}
          </p>
        </div>
      </AnimatedContainer>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="px-6"
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          className="px-6"
        >
          {isLastStep ? 'Enter Demo' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default TutorialRenderer;