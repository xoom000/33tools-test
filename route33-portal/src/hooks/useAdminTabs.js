import { TAB_NAVIGATION_CONFIGS } from '../config/tabConfigs';

// COMPOSE, NEVER DUPLICATE - Admin Tabs with Configuration! ⚔️
export const useAdminTabs = (currentRoute) => {
  const navigation = TAB_NAVIGATION_CONFIGS.dashboard;
  
  // Get tabs with admin access based on route
  const tabs = navigation.withAdmin(currentRoute);
  const baseTabs = navigation.base;
  const hasAdminAccess = currentRoute === 33;

  return {
    tabs,
    baseTabs,
    hasAdminAccess
  };
};