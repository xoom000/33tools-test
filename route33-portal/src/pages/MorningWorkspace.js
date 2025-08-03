import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { DashboardHeader } from '../components/features/dashboard';
import { MorningWorkspaceContentRenderer, MorningWorkspaceErrorState } from '../components/features/morning-workspace';
import { useAuth } from '../contexts/AuthContext';
import { useMorningWorkspace } from '../hooks/useMorningWorkspace';
import { useToastCleanup } from '../hooks/useToastCleanup';
import { useDashboardGuards } from '../hooks/useDashboardGuards';
import logger from '../utils/logger';

const MorningWorkspace = () => {
  const { currentUser, logout, isLoggedIn, userType } = useAuth();
  
  // Get route number from URL (defaults to current user's route)
  const { routeNumber } = useParams();
  const currentRoute = routeNumber ? parseInt(routeNumber) : (currentUser?.route_id || currentUser?.route_number || 33);

  // Custom hooks - COMPOSE, NOT DUPLICATE!
  const {
    loading,
    error,
    user,
    transformedLoadList,
    transformedUniformOrders,
    transformedCustomerNotes,
    stats,
    generateMorningPrep
  } = useMorningWorkspace();
  
  useToastCleanup(); // Handles toast cleanup and keyboard shortcuts
  const { shouldRender, renderContent } = useDashboardGuards(loading, isLoggedIn, userType);
  
  // Component handler functions
  const handleItemCheck = (item, checked, index) => {
    logger.info('Checklist item updated', { item, checked, index, route: currentRoute });
    // Could persist checklist state here
  };

  const handleMarkAllCompleted = (type) => {
    logger.info('Mark all completed', { type, route: currentRoute });
    // Implementation for marking all items as completed
  };

  // Dashboard guards - early returns for loading/auth states
  if (!shouldRender) {
    return renderContent;
  }

  if (error) {
    logger.error('Morning workspace error', { error, route: currentRoute });
    return (
      <MorningWorkspaceErrorState 
        error={error}
        currentRoute={currentRoute}
        currentUser={currentUser}
        onLogout={() => logout('/')}
        onRetry={generateMorningPrep}
      />
    );
  }

  // Render main morning workspace
  return (
    <DashboardLayout
      header={
        <DashboardHeader 
          currentRoute={currentRoute}
          currentUser={currentUser}
          customerCount={0}
          onShowTokenGenerator={() => {}}
          onLogout={() => logout('/')}
        />
      }
    >
      <MorningWorkspaceContentRenderer
        user={user}
        stats={stats}
        generateMorningPrep={generateMorningPrep}
        loadListProps={{
          items: transformedLoadList,
          title: "📦 Load List",
          emptyStateIcon: "📦",
          emptyStateMessage: "No items to load today",
          onSubmitOrder: () => handleMarkAllCompleted('load'),
          submitButtonText: "Mark All Loaded",
          submitPrompt: "Mark all items as loaded?",
          loading: false
        }}
        uniformOrdersProps={{
          items: transformedUniformOrders,
          title: "👔 Uniform Orders",
          emptyStateIcon: "👔",
          emptyStateMessage: "No uniform orders to deliver",
          onSubmitOrder: () => handleMarkAllCompleted('uniforms'),
          submitButtonText: "Mark All Delivered",
          submitPrompt: "Mark all uniform orders as delivered?",
          loading: false
        }}
        customerNotesProps={{
          items: transformedCustomerNotes,
          title: "📋 Customer Prep",
          emptyStateIcon: "📋",
          emptyStateMessage: "No special notes today",
          onSubmitOrder: () => handleMarkAllCompleted('notes'),
          submitButtonText: "Mark All Reviewed",
          submitPrompt: "Mark all customer notes as reviewed?",
          loading: false
        }}
        checklistProps={{
          onItemCheck: handleItemCheck
        }}
      />
    </DashboardLayout>
  );
};

export default MorningWorkspace;