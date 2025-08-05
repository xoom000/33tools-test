import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { CARD_CONFIGS, CARD_ACTIONS, CARD_BADGES } from '../../../config/cardConfigs';

const CustomerCard = memo(function CustomerCard({ 
  customer, 
  onGenerateToken, 
  onEditCustomer, 
  onAddItem 
}) {
  const handleOrderClick = () => {
    const deeplinkUrl = `https://apps.powerapps.com/play/e/default-0a0c1988-6cb0-41f4-9c44-79347d692230/a/56f35750-b1fc-48cc-ace0-14046fb4eaa0?tenantId=0a0c1988-6cb0-41f4-9c44-79347d692230&customerNumber=${customer.customer_number}`;
    window.open(deeplinkUrl, '_blank');
  };

  return (
    <motion.div
      key={customer.customer_number}
      {...CARD_CONFIGS.customer.animation}
      className={CARD_CONFIGS.customer.container}
    >
      <div className={CARD_CONFIGS.customer.layout.spacing}>
        <div className="flex items-start gap-3">
          <div className={CARD_CONFIGS.customer.avatar.container}>
            <span className={CARD_CONFIGS.customer.avatar.text}>
              {customer.account_name?.charAt(0) || '#'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={CARD_CONFIGS.customer.header.title}>{customer.account_name}</h4>
            <p className={CARD_CONFIGS.customer.header.subtitle}>
              #{customer.customer_number}
            </p>
          </div>
        </div>
        
        <div className={CARD_CONFIGS.customer.layout.contentSpacing}>
          <p className={CARD_CONFIGS.customer.content.text}>{customer.address}</p>
          <div className={CARD_CONFIGS.customer.content.badgeContainer}>
            <span className={CARD_BADGES.serviceFrequency.className}>
              {customer.service_frequency}
            </span>
            <span className={CARD_BADGES.serviceDays.className}>
              {customer.service_days}
            </span>
            {customer.login_code && (
              <span className={CARD_BADGES.loginToken.className}>
                {CARD_BADGES.loginToken.prefix}{customer.login_code}
              </span>
            )}
          </div>
        </div>
        
        {/* Mobile-first button layout - horizontal row that wraps gracefully */}
        <div className={CARD_CONFIGS.customer.actions.container}>
          <Button 
            {...CARD_ACTIONS.customer.generateToken}
            onClick={() => onGenerateToken(customer.customer_number)}
          >
            {CARD_ACTIONS.customer.generateToken.label}
          </Button>
          <Button 
            {...CARD_ACTIONS.customer.edit}
            onClick={() => onEditCustomer(customer)}
          >
            {CARD_ACTIONS.customer.edit.label}
          </Button>
          <Button 
            {...CARD_ACTIONS.customer.addItems}
            onClick={() => onAddItem(customer)}
          >
            {CARD_ACTIONS.customer.addItems.label}
          </Button>
          {customer.order_button === 1 && (
            <Button 
              {...CARD_ACTIONS.customer.order}
              onClick={handleOrderClick}
            >
              {CARD_ACTIONS.customer.order.label}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default CustomerCard;