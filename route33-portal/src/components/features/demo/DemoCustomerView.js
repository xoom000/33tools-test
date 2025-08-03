import React from 'react';
import { motion } from 'framer-motion';
import { ItemsGrid } from '../../features/customer-portal';
import CustomerPortalHeader from './CustomerPortalHeader';
import { ANIMATIONS } from '../../../theme';

// COMPOSE, NEVER DUPLICATE - Demo Customer Portal View! ⚔️
const DemoCustomerView = ({
  customer = {},
  items = [],
  quantities = {},
  onUpdateQuantity,
  onSubmitOrder,
  className = ""
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Customer Header */}
      <motion.div {...ANIMATIONS.slideUp}>
        <CustomerPortalHeader customer={customer} />
      </motion.div>

      {/* Customer Items - EXTEND existing ItemsGrid! */}
      <motion.div 
        {...ANIMATIONS.slideUp}
        transition={{ delay: 0.1 }}
      >
        <ItemsGrid
          items={items.map((item, index) => ({
            id: index,
            description: item,
            quantity: quantities[index] || 0,
            item_type: 'supply',
            unit_of_measure: 'case'
          }))}
          title="Your Regular Items"
          onSubmitOrder={onSubmitOrder}
          submitButtonText="Send Order"
          submitPrompt="Ready to request these items for your next delivery?"
          // Pass quantity control props
          onUpdateQuantity={onUpdateQuantity}
          showQuantityControls={true}
        />
      </motion.div>
    </div>
  );
};

export default DemoCustomerView;