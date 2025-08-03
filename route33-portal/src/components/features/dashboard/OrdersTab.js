import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../animations';
import { Button } from '../../ui';

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
    <AnimatedContainer
      variant="slideRight"
      className="space-y-6"
    >
      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Order Requests ({orderRequests.length})
          </h2>
          <Button 
            variant="secondary" 
            size="xs"
            onClick={onRefresh}
            
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Order Requests List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6">
          {orderRequests.length > 0 ? (
            <div className="space-y-4">
              {orderRequests.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: animatingItems.has(order.id) ? 0 : 1, 
                    y: 0,
                    scale: animatingItems.has(order.id) ? 0.95 : 1
                  }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.2 }}
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
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    onTouchStart={(e) => handleSwipeStart(e, order.id)}
                    onTouchMove={(e) => handleSwipeMove(e, order.id)}
                    onTouchEnd={() => handleSwipeEnd(order.id)}
                    className={`bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all hover:border-slate-300 hover:shadow-md ${
                      loadedItems.has(order.id) 
                        ? 'opacity-60 bg-slate-50 border-slate-200' 
                        : 'border-slate-200'
                    }`}
                    onClick={() => onToggleExpanded(order.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">
                              {order.customer_name?.charAt(0) || '#'}
                            </span>
                          </div>
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
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm text-emerald-600 font-medium">
                              Marked as Loaded
                            </span>
                          </div>
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
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-slate-600 mb-2">No Order Requests</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                When customers place orders through PowerApps, they'll appear here for processing.
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={onRefresh}
                className="mt-4"
              >
                Refresh Orders
              </Button>
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default OrdersTab;