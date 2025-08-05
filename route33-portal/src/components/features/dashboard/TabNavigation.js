import React from 'react';
import { AnimatedContainer } from '../../animations';
import { TAB_STYLES } from '../../../config/tabConfigs';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Tab Navigation with Configuration! ⚔️
const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <AnimatedContainer
      variant="slideUp"
      className={TAB_STYLES.navigation.container}
    >
      <div className={TAB_STYLES.navigation.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              TAB_STYLES.navigation.tab.base,
              {
                [TAB_STYLES.navigation.tab.active]: activeTab === tab.id,
                [TAB_STYLES.navigation.tab.inactive]: activeTab !== tab.id
              }
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </AnimatedContainer>
  );
};

export default TabNavigation;