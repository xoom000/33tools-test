import { StateRenderer } from '../../ui';
import { DashboardHeader } from '../dashboard';

// COMPOSE, NEVER DUPLICATE - Now using StateRenderer! ⚔️
const MorningWorkspaceErrorState = ({ 
  error, 
  currentRoute, 
  currentUser, 
  onLogout, 
  onRetry 
}) => {
  const header = (
    <DashboardHeader
      currentRoute={currentRoute}
      currentUser={currentUser}
      customerCount={0}
      onShowTokenGenerator={() => {}}
      onLogout={onLogout}
    />
  );

  return (
    <StateRenderer
      state="error"
      variant="workspace"
      layout="dashboard"
      header={header}
      error={error}
      errorTitle="Failed to Load"
      onRetry={onRetry}
    />
  );
};

export default MorningWorkspaceErrorState;