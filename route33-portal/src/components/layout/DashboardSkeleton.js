import { LoadingSkeleton } from '../ui';

// COMPOSE, NOT DUPLICATE - Just use enhanced LoadingSkeleton!
const DashboardSkeleton = ({ lines = 5 }) => {
  return <LoadingSkeleton variant="fullDashboard" lines={lines} />;
};

export default DashboardSkeleton;