import { DashboardSkeleton } from '../components/layout';

export const useDashboardGuards = (loading, isLoggedIn, userType) => {
  // Check loading state
  if (loading) {
    return {
      shouldRender: false,
      renderContent: <DashboardSkeleton />,
      status: 'loading'
    };
  }

  // Check authentication and user type
  if (!isLoggedIn || userType !== 'driver') {
    return {
      shouldRender: false,
      renderContent: null,
      status: 'unauthorized'
    };
  }

  // All checks passed
  return {
    shouldRender: true,
    renderContent: null,
    status: 'authorized'
  };
};