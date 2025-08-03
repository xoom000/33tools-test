import React from 'react';
import { Button } from '../../ui';
import { VARIANTS, LAYOUT, TYPOGRAPHY } from '../../../theme';

// COMPOSE, NEVER DUPLICATE - Customer Portal Header! ⚔️
const CustomerPortalHeader = ({
  customer = { name: 'F M Valero' },
  onSignOut,
  className = ""
}) => {
  return (
    <div className={`${VARIANTS.card.base} ${LAYOUT.padding.card} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.semibold} text-slate-800`}>
            {customer.name}
          </h2>
          <p className={`${TYPOGRAPHY.sizes.sm} text-slate-500`}>
            Route 33 Service
          </p>
        </div>
        <Button variant="ghost" size="small" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`${TYPOGRAPHY.sizes.sm} ${TYPOGRAPHY.weights.medium} text-slate-700`}>
            Next Service
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full ${TYPOGRAPHY.sizes.xs} ${TYPOGRAPHY.weights.medium} bg-emerald-100 text-emerald-700`}>
            Friday Delivery
          </span>
        </div>
        <p className={`${TYPOGRAPHY.sizes.sm} text-slate-600`}>
          Your regular items will be delivered as scheduled.
        </p>
      </div>
    </div>
  );
};

export default CustomerPortalHeader;