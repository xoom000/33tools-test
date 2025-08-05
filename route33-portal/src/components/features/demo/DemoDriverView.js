import React from 'react';
import { motion } from 'framer-motion';
import OrderCardList from './OrderCardList';
import CustomerManagementGrid from './CustomerManagementGrid';
import { ANIMATIONS } from '../../../theme';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Demo Driver Dashboard View! ⚔️
const DemoDriverView = ({
  orders = [],
  customers = [],
  onApproveOrder,
  onEditCustomer,
  onGenerateToken,
  className = ""
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Order Requests Section */}
      <motion.div {...ANIMATIONS.slideUp}>
        <OrderCardList
          orders={orders}
          onApproveOrder={onApproveOrder}
        />
      </motion.div>

      {/* Customer Management Section */}
      <motion.div 
        {...ANIMATIONS.slideUp}
        transition={{ delay: 0.2 }}
      >
        <CustomerManagementGrid
          customers={customers}
          onEditCustomer={onEditCustomer}
          onGenerateToken={onGenerateToken}
        />
      </motion.div>
    </div>
  );
};

export default DemoDriverView;