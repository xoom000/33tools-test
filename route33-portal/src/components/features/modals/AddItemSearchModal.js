import React from 'react';
import { motion } from 'framer-motion';
import { Modal, LoadingSkeleton } from '../../ui';
import { ICONS } from '../../../utils/constants';

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
  if (!isOpen) return null;

  const filteredItems = availableItems.filter(item => 
    searchTerm === '' || 
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_number?.toString().includes(searchTerm)
  );

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Item to Load List"
      size="medium"
    >
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search items by name or number..."
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-slate-600"
              >
                {(() => {
                  const resultCount = filteredItems.length;
                  const displayCount = Math.min(resultCount, 20);
                  
                  if (resultCount === 0) {
                    return `No items found for "${searchTerm}"`;
                  } else if (resultCount <= 20) {
                    return `Found ${resultCount} item${resultCount !== 1 ? 's' : ''}`;
                  } else {
                    return `Showing ${displayCount} of ${resultCount} items`;
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
                  .slice(0, 20) // Limit to 20 results
                  .map((item, index) => (
                    <motion.div 
                      key={item.item_number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            In List
                          </span>
                        )}
                        <div className="text-primary-600 font-medium">
                          {loadList.find(li => li.item_number === item.item_number) ? '+1' : 'Add'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                
                {/* Enhanced empty state */}
                {searchTerm && !isSearching && filteredItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-slate-400 text-4xl mb-3">{ICONS.SEARCH}</div>
                    <div className="text-slate-600 font-medium mb-1">
                      No items found
                    </div>
                    <div className="text-slate-500 text-sm">
                      Try searching with different keywords
                    </div>
                    <button
                      onClick={() => handleSearchChange('')}
                      className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </motion.div>
                )}
                
                {/* Default state when no search term */}
                {!searchTerm && !isSearching && (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-slate-400 text-4xl mb-3">{ICONS.PACKAGE}</div>
                    <div className="font-medium mb-1">Search for items</div>
                    <div className="text-sm">Type item name or number to find products</div>
                  </div>
                )}
              </>
            )}
          </div>
    </Modal>
  );
};

export default AddItemSearchModal;