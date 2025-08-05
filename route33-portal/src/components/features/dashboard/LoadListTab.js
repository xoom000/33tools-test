import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../animations';
import { Button, QuantityControl } from '../../ui';
import { getDayDisplayName } from '../../../utils/adminDashboardHelpers';
import { ICONS } from '../../../utils/constants';
import { ANIMATION_EASINGS, ANIMATION_DURATIONS } from '../../../config/animationConfigs';
import { cn } from '../../../utils/classNames';
import PerformanceProfiler from '../../profiler/PerformanceProfiler';

const LoadListTab = ({
  loadList = [],
  selectedDay,
  availableServiceDays = [],
  expandedItems,
  loadedItems,
  swipeState,
  swipeOffset,
  animatingItems,
  customQuantities,
  editingQuantity,
  onDayChange,
  onUpdateQuantity,
  onToggleExpanded,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  onShowAddItemSearch,
  onPrint,
  onRefresh,
  onSetEditingQuantity
}) => {
  // Memoize expensive calculations
  const totalQuantity = useMemo(() => {
    return loadList.reduce((sum, item) => sum + item.total_quantity, 0);
  }, [loadList]);
  
  const sortedLoadList = useMemo(() => {
    return [...loadList].sort((a, b) => {
      const aLoaded = loadedItems.has(a.item_number);
      const bLoaded = loadedItems.has(b.item_number);
      if (aLoaded === bLoaded) return 0;
      return aLoaded ? 1 : -1; // Loaded items go to bottom
    });
  }, [loadList, loadedItems]);
  
  return (
    <PerformanceProfiler id="LoadListTab">
      <AnimatedContainer
        variant="slideRight"
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">Load List</h2>
            <p className="text-slate-600 mt-1">Items to load for selected service day</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-slate-700">
              Prep for day:
            </label>
            <select
              value={selectedDay || ''}
              onChange={(e) => onDayChange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {availableServiceDays.map(day => (
                <option key={day} value={day}>
                  {getDayDisplayName(day)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Load List Action Buttons */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Button 
              variant="secondary" 
              size="xs"
              onClick={onShowAddItemSearch}
                          >
              Add Item
            </Button>
            <Button 
              variant="secondary" 
              size="xs"
              onClick={onPrint}
              disabled={loadList.length === 0}
                          >
              Print List
            </Button>
            <Button 
              variant="secondary" 
              size="xs"
              onClick={onRefresh}
                          >
              Refresh
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loadList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-sm font-medium">{ICONS.PACKAGE}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No items to load</h3>
              <p className="text-slate-500">No rental items found for tomorrow's customers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-slate-600 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    Total items: <strong>{loadList.length}</strong> | 
                    Total quantity: <strong>{totalQuantity}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      {ICONS.SUCCESS} Loaded: {loadedItems.size}
                    </span>
                    <span className="text-slate-500">
                      Remaining: {loadList.length - loadedItems.size}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Sort loaded items to bottom (memoized) */}
              {sortedLoadList.map((item, index) => {
                const isExpanded = expandedItems.has(item.item_number);
                const isLoaded = loadedItems.has(item.item_number);
                const isAnimating = animatingItems.has(item.item_number);
                
                return (
                  <motion.div 
                    key={item.item_number}
                    initial={false}
                    animate={{
                      scale: isAnimating ? 0.9 : 1,
                      x: isAnimating ? (isLoaded ? 800 : -800) : (swipeOffset[item.item_number] || 0),
                      opacity: isAnimating ? 0 : 1,
                      rotate: isAnimating ? (isLoaded ? 15 : -15) : 0
                    }}
                    transition={{ 
                      duration: isAnimating ? ANIMATION_DURATIONS.slow : ANIMATION_DURATIONS.fast, 
                      ease: isAnimating ? ANIMATION_EASINGS.easeInOut : ANIMATION_EASINGS.easeOut
                    }}
                    style={{
                      backgroundColor: swipeOffset[item.item_number] > 50 ? '#dcfce7' : 
                                     swipeOffset[item.item_number] < -50 ? '#fee2e2' : undefined
                    }}
                    className={cn(
                      'rounded-lg border overflow-hidden transition-all duration-200 relative',
                      {
                        'bg-gray-100 border-gray-200 opacity-60': isLoaded,
                        'bg-slate-50 border-slate-200 hover:border-slate-300': !isLoaded
                      }
                    )}
                  >
                    {/* Compact header with swipe functionality */}
                    <div 
                      className="p-4 select-none relative"
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        onSwipeStart(item.item_number, touch);
                      }}
                      onTouchMove={(e) => {
                        const touch = e.touches[0];
                        onSwipeMove(item.item_number, touch);
                      }}
                      onTouchEnd={() => onSwipeEnd(item.item_number)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            'font-semibold truncate',
                            {
                              'text-gray-500 line-through': isLoaded,
                              'text-slate-800': !isLoaded
                            }
                          )}>
                            {isLoaded && `${ICONS.SUCCESS} `}{item.item_name}
                          </h4>
                          <p className="text-sm text-slate-600">Item #{item.item_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2">
                            {/* EXTEND QuantityControl - COMPOSE, NEVER DUPLICATE! ⚔️ */}
                            <QuantityControl
                              value={customQuantities[item.item_number] || item.total_quantity}
                              onChange={(newQuantity) => onUpdateQuantity(item.item_number, newQuantity)}
                              min={0}
                              max={999}
                              size="medium"
                              className={cn({ 'opacity-60': isLoaded })}
                            />
                            <div className="text-xs text-slate-500">
                              quantity
                            </div>
                          </div>
                          <div 
                            className="text-slate-700 text-lg font-bold cursor-pointer hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-md transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleExpanded(item.item_number);
                            }}
                            title="Tap to expand customer details"
                          >
                            {isExpanded ? '^' : 'v'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Swipe hint icons - appear during swipe gesture */}
                      {Math.abs(swipeOffset[item.item_number] || 0) > 20 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            'absolute inset-y-0 flex items-center pointer-events-none',
                            {
                              'left-4': swipeOffset[item.item_number] > 0,
                              'right-4': swipeOffset[item.item_number] <= 0
                            }
                          )}
                        >
                          <div className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-white font-semibold shadow-lg',
                            {
                              'bg-green-500 shadow-green-500/30': swipeOffset[item.item_number] > 0,
                              'bg-red-500 shadow-red-500/30': swipeOffset[item.item_number] <= 0
                            }
                          )}>
                            {swipeOffset[item.item_number] > 0 ? (
                              <>
                                <span className="text-lg">{ICONS.SUCCESS}</span>
                                <span className="text-sm">Load</span>
                              </>
                            ) : (
                              <>
                                <span className="text-lg">{ICONS.ERROR}</span>
                                <span className="text-sm">Unload</span>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Expandable customer details */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-white p-4">
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-slate-700">Customers needing this item:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.customers.map((customer, customerIndex) => (
                              <div 
                                key={customerIndex}
                                className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200"
                              >
                                <span className="text-sm font-medium text-slate-800 truncate">
                                  {customer.name}
                                </span>
                                <span className="text-sm font-bold text-primary-600 ml-2">
                                  {customer.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                            {item.customers.length} customers • Total: {item.total_quantity} items
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </AnimatedContainer>
    </PerformanceProfiler>
  );
};

export default LoadListTab;