import { useState } from 'react';
import useSwipeGesture from './useSwipeGesture';
import logger from '../utils/logger';

export const useOrdersTab = (orderRequests, setOrderRequests, toast) => {
  // EXTEND useSwipeGesture - COMPOSE, NEVER DUPLICATE! ⚔️
  const {
    swipeState,
    swipeOffset,
    animatingItems,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd
  } = useSwipeGesture(100); // Higher threshold for orders

  // Orders tab state - optimized with initializer functions
  const [expandedItems, setExpandedItems] = useState(() => new Set());
  const [loadedItems, setLoadedItems] = useState(() => new Set());

  const toggleExpanded = (orderId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedItems(newExpanded);
  };

  const markAsLoaded = (orderId) => {
    const newLoaded = new Set(loadedItems);
    newLoaded.add(orderId);
    setLoadedItems(newLoaded);
    toast.success('Order marked as loaded!');
  };

  // Orders swipe wrapper - EXTENDS useSwipeGesture for order-specific actions! ⚔️
  const handleOrderSwipeEnd = (orderId) => {
    const onSwipeLeft = () => deleteOrder(orderId);   // Delete order
    const onSwipeRight = () => markAsLoaded(orderId); // Mark as loaded
    handleSwipeEnd(orderId, onSwipeLeft, onSwipeRight);
  };

  const deleteOrder = async (orderId) => {
    try {
      // Add delete API call here when backend is ready
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      // Remove from local state
      setOrderRequests(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      logger.error('Failed to delete order', { orderId, error: error.message });
      toast.error('Failed to delete order');
    }
    // Note: Animation now handled by useSwipeGesture hook
  };

  return {
    // State
    expandedItems,
    loadedItems,
    swipeState,
    swipeOffset,
    animatingItems,
    
    // Actions
    toggleExpanded,
    markAsLoaded,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd: handleOrderSwipeEnd,
    deleteOrder
  };
};