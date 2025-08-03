import React from 'react';
import { AnimatedHeader } from '../../animations';
import { ButtonGroup } from '../../ui';
import { TYPOGRAPHY } from '../../../theme';
import { DEMO_VIEWS } from '../../../constants/demo';

// COMPOSE, NEVER DUPLICATE - Demo Header extends DashboardHeader pattern! ⚔️
const DemoHeader = ({
  demoView,
  onViewChange,
  className = ""
}) => {
  return (
    <AnimatedHeader className={className}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${TYPOGRAPHY.sizes.xl} ${TYPOGRAPHY.weights.semibold} text-slate-800`}>
            {demoView === DEMO_VIEWS.DRIVER ? 'Route 33 Dashboard' : 'Customer Portal'}
          </h1>
          <p className={`${TYPOGRAPHY.sizes.sm} text-slate-500`}>Demo Environment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 px-3 py-1 rounded-full">
            <span className={`${TYPOGRAPHY.sizes.xs} ${TYPOGRAPHY.weights.medium} text-slate-600`}>
              DEMO MODE
            </span>
          </div>
          
          <ButtonGroup
            orientation="horizontal"
            size="small"
            buttons={[
              {
                key: 'driver',
                text: 'Driver View',
                variant: demoView === DEMO_VIEWS.DRIVER ? 'primary' : 'ghost',
                onClick: () => onViewChange(DEMO_VIEWS.DRIVER)
              },
              {
                key: 'customer', 
                text: 'Customer View',
                variant: demoView === DEMO_VIEWS.CUSTOMER ? 'primary' : 'ghost',
                onClick: () => onViewChange(DEMO_VIEWS.CUSTOMER)
              }
            ]}
          />
        </div>
      </div>
    </AnimatedHeader>
  );
};

export default DemoHeader;