import { LoadingSkeleton } from '../../ui';
import { DashboardLayout } from '../../layout';

// COMPOSE, NOT DUPLICATE - Use enhanced LoadingSkeleton!
const CustomerPortalLoadingState = () => {
  const HeaderSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <LoadingSkeleton variant="portalHeader" />
      </div>
    </div>
  );

  return (
    <DashboardLayout header={<HeaderSkeleton />}>
      <div className="space-y-8">
        <LoadingSkeleton variant="serviceCard" />
        <LoadingSkeleton 
          variant="card" 
          lines={4}
          showAvatar={true}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerPortalLoadingState;