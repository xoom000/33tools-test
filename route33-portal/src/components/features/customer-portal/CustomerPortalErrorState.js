import { StateRenderer } from '../../ui';

// COMPOSE, NEVER DUPLICATE - Now using StateRenderer! ⚔️
const CustomerPortalErrorState = ({ error }) => {
  return (
    <StateRenderer
      state="error"
      variant="portal"
      layout="dashboard"
      error={error}
      errorTitle="Oops!"
      onRetry={() => window.location.reload()}
      contentClassName="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4"
    />
  );
};

export default CustomerPortalErrorState;