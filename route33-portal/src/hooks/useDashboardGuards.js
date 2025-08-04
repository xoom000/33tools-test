import { DashboardSkeleton } from '../components/layout';

export const useDashboardGuards = (loading, isLoggedIn, userType) => {
  console.log('🔥 DASHBOARD GUARDS CHECK:', { loading, isLoggedIn, userType });
  
  // Check loading state
  if (loading) {
    console.log('❌ DASHBOARD BLOCKED - Still loading');
    return {
      shouldRender: false,
      renderContent: <DashboardSkeleton />,
      status: 'loading'
    };
  }

  // Check authentication and user type (DISABLED - matching production)
  // if (!isLoggedIn || userType !== 'driver') {
  //   return {
  //     shouldRender: false,
  //     renderContent: null,
  //     status: 'unauthorized'
  //   };
  // }

  // All checks passed
  console.log('✅ DASHBOARD AUTHORIZED - Rendering dashboard');
  return {
    shouldRender: true,
    renderContent: null,
    status: 'authorized'
  };
};