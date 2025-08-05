import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { LIST_CONFIGS, LIST_STYLES } from '../../../config/tableConfigs';
import { ORDER_STATUS } from '../../../constants/demo';
import { COMPONENT_ANIMATIONS } from '../../../config/animationConfigs';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Order Cards List with Configuration! ⚔️
const OrderCardList = memo(function OrderCardList({
  orders = [],
  onApproveOrder,
  className = ""
}) {
  const config = LIST_CONFIGS.orderCards;
  const styles = LIST_STYLES;

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-slate-100 p-6', className)}>
      <div className={styles.header.container}>
        <h2 className={styles.header.title}>
          Order Requests ({orders.length})
        </h2>
        <span className="text-emerald-600 font-medium text-sm">
          Live Demo Data
        </span>
      </div>
      
      <div className={config.layout.container}>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            {...COMPONENT_ANIMATIONS.list.item}
            transition={{
              ...COMPONENT_ANIMATIONS.list.item.transition,
              delay: index * (config.animation?.stagger || 0.1)
            }}
            className={config.layout.item}
          >
            <div className={config.layout.header}>
              <div>
                <h3 className={config.content.title.className}>
                  {order[config.content.title.field]}
                </h3>
                <p className={config.content.subtitle.className}>
                  {order.items} items • {order.time}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={cn(
                  config.status.className,
                  config.status.badges[order.status] || config.status.badges.pending
                )}>
                  {order.status}
                </span>
                {order.status === ORDER_STATUS.PENDING && onApproveOrder && (
                  <Button 
                    {...config.actions.approve}
                    onClick={() => onApproveOrder(order.id)}
                  >
                    {config.actions.approve.label}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default OrderCardList;