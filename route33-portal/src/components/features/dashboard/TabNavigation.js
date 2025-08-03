import React from 'react';
import { VARIANTS } from '../../../theme';
import { AnimatedContainer } from '../../animations';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <AnimatedContainer
      variant="slideUp"
      className={`${VARIANTS.card.base} p-1 mb-4`}
    >
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide lg:justify-center xl:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-sm lg:text-base font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? VARIANTS.button.primary.replace('shadow-lg hover:shadow-xl', 'shadow-lg')
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </AnimatedContainer>
  );
};

export default TabNavigation;