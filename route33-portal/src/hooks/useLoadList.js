import { useState, useEffect } from 'react';
import useSwipeGesture from './useSwipeGesture';
import logger from '../utils/logger';

export const useLoadList = (customers, selectedDay, toast) => {
  // EXTEND useSwipeGesture - COMPOSE, NEVER DUPLICATE! ⚔️
  const {
    swipeState,
    swipeOffset,
    animatingItems,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd
  } = useSwipeGesture(50);

  const [loadList, setLoadList] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [customQuantities, setCustomQuantities] = useState({});
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [loadedItems, setLoadedItems] = useState(new Set());
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [showAddItemSearch, setShowAddItemSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Main load list generation function
  const loadLoadList = async () => {
    try {
      // Don't load if no day is selected yet
      if (!selectedDay) {
        setLoadList([]);
        return;
      }
      
      // Use the selected day directly - no auto-calculation
      const targetServiceDay = selectedDay;
      
      // Get customers for target day
      const targetCustomers = customers.filter(customer => 
        customer.service_days && customer.service_days.includes(targetServiceDay)
      );
      
      logger.info('Load List Debug', {
        selectedDay,
        targetServiceDay,
        customersFound: targetCustomers.length,
        sampleCustomers: targetCustomers.slice(0, 3).map(c => ({
          name: c.account_name,
          service_days: c.service_days
        }))
      });
      
      if (targetCustomers.length === 0) {
        setLoadList([]);
        return;
      }
      
      // Get rental items for these customers
      const customerNumbers = targetCustomers.map(c => c.customer_number);
      const itemsPromises = customerNumbers.map(async (customerNumber) => {
        try {
          const response = await fetch(`/api/customers/${customerNumber}/items`);
          if (response.ok) {
            const data = await response.json();
            return {
              customerNumber,
              customerName: targetCustomers.find(c => c.customer_number === customerNumber)?.account_name,
              items: data.items || []
            };
          }
        } catch (error) {
          logger.warn('Failed to load items for customer', { customerNumber, error: error.message });
        }
        return { customerNumber, customerName: 'Unknown', items: [] };
      });
      
      const customerItems = await Promise.all(itemsPromises);
      
      // Group items by type for efficient loading
      const itemGroups = {};
      customerItems.forEach(({ customerName, items }) => {
        items.forEach(item => {
          if (item.item_type === 'rental' && item.quantity > 0) {
            const key = `${item.item_number}`;
            if (!itemGroups[key]) {
              itemGroups[key] = {
                item_number: item.item_number,
                item_name: item.description || item.item_name || `Item ${item.item_number}`,
                total_quantity: 0,
                customers: []
              };
            }
            itemGroups[key].total_quantity += item.quantity;
            itemGroups[key].customers.push({
              name: customerName,
              quantity: item.quantity
            });
          }
        });
      });
      
      const loadListItems = Object.values(itemGroups);
      setLoadList(loadListItems);
      
      logger.info('Load list generated', { 
        targetDay: targetServiceDay,
        customerCount: targetCustomers.length,
        itemTypes: loadListItems.length
      });
      
    } catch (error) {
      logger.error('Failed to generate load list', { error: error.message });
      setLoadList([]);
    }
  };

  // Load available items for search
  const loadAvailableItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const data = await response.json();
        setAvailableItems(data.items || []);
      }
    } catch (error) {
      logger.error('Failed to load available items', { error: error.message });
    }
  };

  // Add item to load list
  const addItemToLoadList = (item, quantity = 1) => {
    const newItem = {
      item_number: item.item_number,
      item_name: item.description || item.item_name || `Item ${item.item_number}`,
      total_quantity: quantity,
      customers: [{ name: 'Manual Addition', quantity }],
      isManuallyAdded: true
    };
    
    setLoadList(prev => [...prev, newItem]);
    setCustomQuantities(prev => ({
      ...prev,
      [item.item_number]: quantity
    }));
    
    logger.info('Item added to load list', { 
      itemNumber: item.item_number, 
      quantity 
    });
  };

  // Update item quantity
  const updateItemQuantity = (itemNumber, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0
      setLoadList(prev => prev.filter(item => item.item_number !== itemNumber));
      setCustomQuantities(prev => {
        const updated = { ...prev };
        delete updated[itemNumber];
        return updated;
      });
    } else {
      // Update quantity
      setLoadList(prev => prev.map(item => 
        item.item_number === itemNumber
          ? { ...item, total_quantity: newQuantity }
          : item
      ));
      setCustomQuantities(prev => ({
        ...prev,
        [itemNumber]: newQuantity
      }));
    }
    
    setEditingQuantity(null);
    logger.info('Item quantity updated', { itemNumber, newQuantity });
  };

  // Day change handler with state clearing
  const handleDayChange = (newDay) => {
    // Immediately clear all state when day changes
    setExpandedItems(new Set());
    setLoadedItems(new Set());
    setCustomQuantities({});
    setEditingQuantity(null);
    // Note: swipe state now managed by useSwipeGesture hook
  };

  // Toggle item expanded state
  const toggleItemExpanded = (itemNumber) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemNumber)) {
      newExpanded.delete(itemNumber);
    } else {
      newExpanded.add(itemNumber);
    }
    setExpandedItems(newExpanded);
  };

  // Load list specific logic - COMPOSE with swipe gesture! ⚔️
  const animateItemLoad = (itemNumber, shouldLoad) => {
    // Update state after item slides completely off screen
    setTimeout(() => {
      const newLoaded = new Set(loadedItems);
      if (shouldLoad) {
        newLoaded.add(itemNumber);
      } else {
        newLoaded.delete(itemNumber);
      }
      setLoadedItems(newLoaded);
    }, 400);
  };

  // Swipe wrapper - EXTENDS useSwipeGesture for load list specific actions! ⚔️
  const handleLoadListSwipeEnd = (itemNumber) => {
    const onSwipeLeft = () => animateItemLoad(itemNumber, false);  // Unload
    const onSwipeRight = () => animateItemLoad(itemNumber, true);  // Load
    handleSwipeEnd(itemNumber, onSwipeLeft, onSwipeRight);
  };

  // Search functionality
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    // Debounce search to simulate loading
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleCloseAddItemSearch = () => {
    setShowAddItemSearch(false);
    setSearchTerm('');
  };

  // Load available items on mount
  useEffect(() => {
    loadAvailableItems();
  }, []);

  // Reload load list when customers or selected day changes
  useEffect(() => {
    if (customers.length > 0 && selectedDay) {
      loadLoadList();
    }
  }, [customers, selectedDay]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    loadList,
    availableItems,
    customQuantities,
    expandedItems,
    loadedItems,
    swipeState,
    swipeOffset,
    animatingItems,
    editingQuantity,
    showAddItemSearch,
    searchTerm,
    isSearching,
    
    // Actions
    loadLoadList,
    addItemToLoadList,
    updateItemQuantity,
    handleDayChange,
    toggleItemExpanded,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd: handleLoadListSwipeEnd,
    handleSearchTermChange,
    handleCloseAddItemSearch,
    setEditingQuantity,
    setShowAddItemSearch
  };
};