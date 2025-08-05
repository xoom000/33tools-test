import React from 'react';
import { motion } from 'framer-motion';
import { Button, Badge } from '../../ui';
import { TabContainer } from '../../ui';
import { TAB_CONFIGS } from '../../../config/tabConfigs';
import { COMPONENT_ANIMATIONS, ANIMATION_EASINGS } from '../../../config/animationConfigs';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Orders Tab with Configuration! ⚔️
const OrdersTab = ({ 
  orderRequests = [],
  expandedItems,
  loadedItems,
  swipeState,
  swipeOffset,
  animatingItems,
  onRefresh,
  onToggleExpanded,
  onMarkAsLoaded,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  onDeleteOrder
}) => {
  const config = TAB_CONFIGS.orders;
  
  const handleSwipeStart = (e, orderId) => {
    e.preventDefault();
    const touch = e.touches[0];
    onSwipeStart(orderId, touch.clientX);
  };

  const handleSwipeMove = (e, orderId) => {
    if (swipeState[orderId]?.isActive) {
      e.preventDefault();
      const touch = e.touches[0];
      onSwipeMove(orderId, touch.clientX);
    }
  };

  const handleSwipeEnd = (orderId) => {
    onSwipeEnd(orderId);
  };

  return (
    <TabContainer
      variant={config.animation}
      title={config.header.title}
      count={orderRequests.length}
      isEmpty={orderRequests.length === 0}
      emptyState={config.emptyState}
      actions={[
        {
          label: 'Refresh',
          variant: 'secondary',
          size: 'xs',
          onClick: onRefresh
        }
      ]}
    >
      {orderRequests.length > 0 && (
        <div className="space-y-4">
              {orderRequests.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  {...COMPONENT_ANIMATIONS.list.item}
                  animate={{ 
                    opacity: animatingItems.has(order.id) ? 0 : 1, 
                    y: 0,
                    scale: animatingItems.has(order.id) ? 0.95 : 1
                  }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="relative overflow-hidden"
                >
                  {/* Swipe Actions Background */}
                  <div className="absolute inset-0 flex items-center justify-end pr-4 bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-xl">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-medium">Mark as Loaded</span>
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Action Background */}
                  <div className="absolute inset-0 flex items-center justify-start pl-4 bg-gradient-to-r from-red-500 to-red-400 rounded-xl">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        ×
                      </div>
                      <span className="text-sm font-medium">Delete</span>
                    </div>
                  </div>

                  {/* Order Card */}
                  <motion.div
                    animate={{
                      x: swipeOffset[order.id] || 0,
                    }}
                    transition={ANIMATION_EASINGS.spring}
                    onTouchStart={(e) => handleSwipeStart(e, order.id)}
                    onTouchMove={(e) => handleSwipeMove(e, order.id)}
                    onTouchEnd={() => handleSwipeEnd(order.id)}
                    className={cn(
                      'bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all hover:border-slate-300 hover:shadow-md',
                      {
                        'opacity-60 bg-slate-50 border-slate-200': loadedItems.has(order.id)
                      }
                    )}
                    onClick={() => onToggleExpanded(order.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            size="lg"
                            variant="info"
                            shape="square"
                            className="w-8 h-8 font-bold flex-shrink-0"
                          >
                            {order.customer_name?.charAt(0) || '#'}
                          </Badge>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm">
                              {order.customer_name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {loadedItems.has(order.id) && (
                          <Badge
                            preset="status.active"
                            icon={<span>✓</span>}
                            className="mb-2"
                          >
                            Marked as Loaded
                          </Badge>
                        )}

                        {/* Order Items Preview */}
                        <div className="space-y-1">
                          {order.items?.slice(0, expandedItems.has(order.id) ? undefined : 3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 truncate flex-1 mr-2">
                                {item.item_name}
                              </span>
                              <span className="text-slate-800 font-medium flex-shrink-0">
                                {item.quantity}
                              </span>
                            </div>
                          ))}
                          
                          {order.items?.length > 3 && !expandedItems.has(order.id) && (
                            <div className="text-sm text-slate-500 italic">
                              +{order.items.length - 3} more items...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          {!loadedItems.has(order.id) && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsLoaded(order.id);
                              }}
                              className="text-xs px-2 py-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            >
                              Mark Loaded
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-800">
                            {order.items?.length || 0} items
                          </div>
                          <div className="text-xs text-slate-500">
                            {order.total_cost ? `$${parseFloat(order.total_cost).toFixed(2)}` : 'No cost'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
    </TabContainer>
  );
};

export default OrdersTab;