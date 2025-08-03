import React from 'react';
import { motion } from 'framer-motion';
import DemoDriverView from './DemoDriverView';
import DemoCustomerView from './DemoCustomerView';
import { DEMO_VIEWS } from '../../../constants/demo';
import { ANIMATIONS } from '../../../theme';

// COMPOSE, NEVER DUPLICATE - Demo Content Renderer like TabContentRenderer! ⚔️
const DemoContentRenderer = ({ 
  demoView,
  // Driver view props
  driverProps,
  // Customer view props
  customerProps
}) => {
  
  // Render specific demo content
  const renderDemoContent = () => {
    switch (demoView) {
      case DEMO_VIEWS.DRIVER:
        return <DemoDriverView {...driverProps} />;
        
      case DEMO_VIEWS.CUSTOMER:
        return <DemoCustomerView {...customerProps} />;
        
      default:
        return <DemoDriverView {...driverProps} />;
    }
  };

  return (
    <motion.div
      key={demoView}
      {...ANIMATIONS.fadeIn}
      className="space-y-6"
    >
      {renderDemoContent()}
    </motion.div>
  );
};

export default DemoContentRenderer;