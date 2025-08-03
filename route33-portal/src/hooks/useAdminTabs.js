import { DASHBOARD_TABS } from '../utils/constants';

export const useAdminTabs = (currentRoute) => {
  // Base tabs for all routes
  const baseTabs = DASHBOARD_TABS;

  // Add admin tab only for Route 33 (Nigel's route)
  const tabs = currentRoute === 33 
    ? [...baseTabs, { id: 'admin', label: 'System Admin' }]
    : baseTabs;

  return {
    tabs,
    baseTabs,
    hasAdminAccess: currentRoute === 33
  };
};