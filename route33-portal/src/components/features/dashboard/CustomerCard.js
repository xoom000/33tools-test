import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';

const CustomerCard = ({ 
  customer, 
  onGenerateToken, 
  onEditCustomer, 
  onAddItem 
}) => {
  const handleOrderClick = () => {
    const deeplinkUrl = `https://apps.powerapps.com/play/e/default-0a0c1988-6cb0-41f4-9c44-79347d692230/a/56f35750-b1fc-48cc-ace0-14046fb4eaa0?tenantId=0a0c1988-6cb0-41f4-9c44-79347d692230&customerNumber=${customer.customer_number}`;
    window.open(deeplinkUrl, '_blank');
  };

  return (
    <motion.div
      key={customer.customer_number}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-50 rounded-xl p-4 sm:p-5 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300"
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-slate-600 font-bold text-sm">
              {customer.account_name?.charAt(0) || '#'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-800 text-sm leading-tight">{customer.account_name}</h4>
            <p className="text-slate-600 text-xs truncate">
              #{customer.customer_number}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed">{customer.address}</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
              {customer.service_frequency}
            </span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
              {customer.service_days}
            </span>
            {customer.login_code && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                Token: {customer.login_code}
              </span>
            )}
          </div>
        </div>
        
        {/* Mobile-first button layout - horizontal row that wraps gracefully */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => onGenerateToken(customer.customer_number)}
            className="flex-1 sm:flex-none text-xs"
          >
            Token
          </Button>
          <Button 
            variant="secondary" 
            size="xs"
            onClick={() => onEditCustomer(customer)}
            className="flex-1 sm:flex-none text-xs"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => onAddItem(customer)}
            className="flex-1 sm:flex-none text-xs"
          >
            Items
          </Button>
          {customer.order_button === 1 && (
            <Button 
              variant="secondary" 
              size="xs"
              onClick={handleOrderClick}
              className="flex-1 sm:flex-none text-xs"
            >
              Order
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;