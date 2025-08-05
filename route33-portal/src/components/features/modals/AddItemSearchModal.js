import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Modal, LoadingSkeleton } from '../../ui';
import { MODAL_CONFIGS } from '../../../config/modalConfigs';
import { COMPONENT_ANIMATIONS, ANIMATION_UTILS } from '../../../config/animationConfigs';
import { cn } from '../../../utils/classNames';
import PerformanceProfiler from '../../profiler/PerformanceProfiler';

const AddItemSearchModal = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchTermChange,
  isSearching,
  availableItems,
  loadList,
  customQuantities,
  onAddItem,
  onUpdateQuantity,
  highlightSearchTerm
}) => {
  // Memoize expensive filtering operation for performance
  const filteredItems = useMemo(() => {
    if (searchTerm === '') return availableItems;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return availableItems.filter(item => 
      item.item_name?.toLowerCase().includes(lowerSearchTerm) ||
      item.description?.toLowerCase().includes(lowerSearchTerm) ||
      item.item_number?.toString().includes(searchTerm)
    );
  }, [availableItems, searchTerm]);

  const handleSearchChange = (value) => {
    onSearchTermChange(value);
  };

  const handleItemClick = (item) => {
    const existingItem = loadList.find(li => li.item_number === item.item_number);
    if (existingItem) {
      // Just increase quantity
      onUpdateQuantity(item.item_number, (customQuantities[item.item_number] || existingItem.total_quantity) + 1);
    } else {
      // Add new item
      onAddItem(item, 1);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <PerformanceProfiler id="AddItemSearchModal">
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_CONFIGS.addItemSearch}
      title={MODAL_CONFIGS.addItemSearch.title}
    >
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text"
                placeholder={MODAL_CONFIGS.addItemSearch.search.placeholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                ) : searchTerm ? (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Search results summary */}
            {searchTerm && !isSearching && (
              <motion.div
                {...COMPONENT_ANIMATIONS.form.field}
                className="mt-2 text-sm text-slate-600"
              >
                {(() => {
                  const resultCount = filteredItems.length;
                  const maxResults = MODAL_CONFIGS.addItemSearch.search.maxResults;
                  const displayCount = Math.min(resultCount, maxResults);
                  const summary = MODAL_CONFIGS.addItemSearch.states.resultSummary;
                  
                  if (resultCount === 0) {
                    return summary.none(searchTerm);
                  } else if (resultCount === 1) {
                    return summary.single(resultCount);
                  } else if (resultCount <= maxResults) {
                    return summary.multiple(resultCount);
                  } else {
                    return summary.limited(displayCount, resultCount);
                  }
                })()}
              </motion.div>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {isSearching ? (
              // EXTEND LoadingSkeleton - COMPOSE, NEVER DUPLICATE! ⚔️
              <LoadingSkeleton variant="list" lines={3} />
            ) : (
              <>
                {filteredItems
                  .slice(0, MODAL_CONFIGS.addItemSearch.search.maxResults) // Configurable result limit
                  .map((item, index) => (
                    <motion.div 
                      key={item.item_number}
                      {...COMPONENT_ANIMATIONS.list.item}
                      transition={{
                        ...COMPONENT_ANIMATIONS.list.item.transition,
                        delay: ANIMATION_UTILS.createStaggerDelay(index)
                      }}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">
                          {searchTerm ? (
                            // Highlight search term in results
                            highlightSearchTerm(
                              item.description || item.item_name || `Item ${item.item_number}`,
                              searchTerm
                            )
                          ) : (
                            item.description || item.item_name || `Item ${item.item_number}`
                          )}
                        </div>
                        <div className="text-sm text-slate-500">#{item.item_number}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadList.find(li => li.item_number === item.item_number) && (
                          <span className={cn('text-xs px-2 py-1 rounded-full', MODAL_CONFIGS.addItemSearch.itemStates.inList.classes)}>
                            {MODAL_CONFIGS.addItemSearch.itemStates.inList.text}
                          </span>
                        )}
                        <div className="text-primary-600 font-medium">
                          {loadList.find(li => li.item_number === item.item_number) 
                            ? MODAL_CONFIGS.addItemSearch.itemStates.addMore.text 
                            : MODAL_CONFIGS.addItemSearch.itemStates.add.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                
                {/* Enhanced empty state */}
                {searchTerm && !isSearching && filteredItems.length === 0 && (
                  <motion.div
                    {...COMPONENT_ANIMATIONS.card.entrance}
                    className="text-center py-8"
                  >
                    <div className="text-slate-400 text-4xl mb-3">{MODAL_CONFIGS.addItemSearch.states.noResults.icon}</div>
                    <div className="text-slate-600 font-medium mb-1">
                      {MODAL_CONFIGS.addItemSearch.states.noResults.title}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {MODAL_CONFIGS.addItemSearch.states.noResults.message}
                    </div>
                    <button
                      onClick={() => handleSearchChange('')}
                      className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {MODAL_CONFIGS.addItemSearch.states.noResults.action.text}
                    </button>
                  </motion.div>
                )}
                
                {/* Default state when no search term */}
                {!searchTerm && !isSearching && (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-slate-400 text-4xl mb-3">{MODAL_CONFIGS.addItemSearch.states.empty.icon}</div>
                    <div className="font-medium mb-1">{MODAL_CONFIGS.addItemSearch.states.empty.title}</div>
                    <div className="text-sm">{MODAL_CONFIGS.addItemSearch.states.empty.message}</div>
                  </div>
                )}
              </>
            )}
          </div>
      </Modal>
    </PerformanceProfiler>
  );
};

export default AddItemSearchModal;