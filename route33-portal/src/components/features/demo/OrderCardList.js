import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { VARIANTS, LAYOUT, TYPOGRAPHY, ANIMATIONS } from '../../../theme';
import { ORDER_STATUS } from '../../../constants/demo';

// COMPOSE, NEVER DUPLICATE - Order Cards List Component! ⚔️
const OrderCardList = ({
  orders = [],
  onApproveOrder,
  className = ""
}) => {
  return (
    <div className={`${VARIANTS.card.base} ${className}`}>
      <div className={LAYOUT.padding.card}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.semibold} text-slate-800`}>
            Order Requests ({orders.length})
          </h2>
          <span className={`${TYPOGRAPHY.sizes.sm} text-emerald-600 ${TYPOGRAPHY.weights.medium}`}>
            Live Demo Data
          </span>
        </div>
        
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              {...ANIMATIONS.slideUp}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`${TYPOGRAPHY.weights.semibold} text-slate-800`}>
                    {order.customer}
                  </h3>
                  <p className={`${TYPOGRAPHY.sizes.sm} text-slate-600`}>
                    {order.items} items • {order.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`${TYPOGRAPHY.sizes.xs} px-2 py-1 rounded-full ${
                    order.status === ORDER_STATUS.PENDING 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.status}
                  </span>
                  {order.status === ORDER_STATUS.PENDING && onApproveOrder && (
                    <Button 
                      variant="primary" 
                      size="small" 
                      className={`${TYPOGRAPHY.sizes.xs} px-3 py-1`}
                      onClick={() => onApproveOrder(order.id)}
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCardList;