import React from 'react';
import { Button } from '../../ui';
import { VARIANTS, LAYOUT, TYPOGRAPHY } from '../../../theme';

// COMPOSE, NEVER DUPLICATE - Customer Management Grid! ⚔️
const CustomerManagementGrid = ({
  customers = [],
  onEditCustomer,
  onGenerateToken,
  className = ""
}) => {
  return (
    <div className={`${VARIANTS.card.base} ${className}`}>
      <div className={LAYOUT.padding.card}>
        <h2 className={`${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.semibold} text-slate-800 mb-6`}>
          Customer Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((customer, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={`${TYPOGRAPHY.weights.semibold} text-slate-800`}>
                    {customer.name}
                  </h4>
                  <p className={`${TYPOGRAPHY.sizes.xs} text-slate-600`}>
                    #{customer.number}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className={`${TYPOGRAPHY.sizes.xs} text-slate-600`}>
                  {customer.items.length} regular items configured
                </p>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="small" 
                    className={`${TYPOGRAPHY.sizes.xs} px-2 py-1`}
                    onClick={() => onGenerateToken && onGenerateToken(customer)}
                  >
                    Token
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small" 
                    className={`${TYPOGRAPHY.sizes.xs} px-2 py-1`}
                    onClick={() => onEditCustomer && onEditCustomer(customer)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small" 
                    className={`${TYPOGRAPHY.sizes.xs} px-2 py-1`}
                  >
                    Items
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementGrid;