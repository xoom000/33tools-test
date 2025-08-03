import { useState, useCallback } from 'react';
import { DEMO_STEPS, DEFAULT_QUANTITIES, DEMO_VIEWS } from '../constants/demo';

// COMPOSE, NEVER DUPLICATE - All demo business logic extracted! ⚔️
const useDemoLogic = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [demoView, setDemoView] = useState(DEMO_VIEWS.DRIVER);
  const [quantities, setQuantities] = useState(DEFAULT_QUANTITIES);

  // PERFORMANCE - Memoized handlers! ⚡
  const nextStep = useCallback(() => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDemo(true);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const updateQuantity = useCallback((index, newValue) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.max(0, newValue)
    }));
  }, []);

  const switchDemoView = useCallback((view) => {
    setDemoView(view);
  }, []);

  // Computed values
  const tutorialProgress = ((currentStep + 1) / DEMO_STEPS.length) * 100;
  const currentStepData = DEMO_STEPS[currentStep];
  const isLastStep = currentStep === DEMO_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Return everything the UI component needs
  return {
    // State
    currentStep,
    showDemo,
    demoView,
    quantities,
    
    // Computed values
    tutorialProgress,
    currentStepData,
    isLastStep,
    isFirstStep,
    
    // Handlers - all memoized for performance! ⚡
    nextStep,
    prevStep,
    updateQuantity,
    switchDemoView,
    
    // State setters (if needed)
    setCurrentStep,
    setShowDemo,
    setDemoView,
    setQuantities
  };
};

export default useDemoLogic;