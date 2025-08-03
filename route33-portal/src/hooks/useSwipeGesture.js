import { useState, useCallback } from 'react';

// COMPOSE, NEVER DUPLICATE - Generic swipe gesture management! ⚔️
const useSwipeGesture = (threshold = 50) => {
  const [swipeState, setSwipeState] = useState({});
  const [swipeOffset, setSwipeOffset] = useState({});
  const [animatingItems, setAnimatingItems] = useState(new Set());

  const handleSwipeStart = useCallback((itemId, touch) => {
    setSwipeState(prev => ({
      ...prev,
      [itemId]: {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        isSwiping: false
      }
    }));
  }, []);

  const handleSwipeMove = useCallback((itemId, touch) => {
    setSwipeState(prev => {
      const state = prev[itemId];
      if (!state) return prev;

      const deltaX = touch.clientX - state.startX;
      const deltaY = Math.abs(touch.clientY - state.startY);

      // Only trigger swipe if horizontal movement > vertical movement
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        // Update real-time visual feedback
        setSwipeOffset(prevOffset => ({
          ...prevOffset,
          [itemId]: deltaX
        }));

        return {
          ...prev,
          [itemId]: {
            ...state,
            currentX: touch.clientX,
            isSwiping: true
          }
        };
      }

      return prev;
    });
  }, []);

  const handleSwipeEnd = useCallback((itemId, onSwipeLeft, onSwipeRight) => {
    setSwipeState(prev => {
      const state = prev[itemId];
      if (!state || !state.isSwiping) return prev;

      const deltaX = state.currentX - state.startX;

      if (Math.abs(deltaX) > threshold) {
        // Add to animating items
        setAnimatingItems(prevAnimating => new Set(prevAnimating).add(itemId));

        // Trigger appropriate callback
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight(itemId);
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft(itemId);
        }

        // Clean up after animation
        setTimeout(() => {
          setAnimatingItems(prevAnimating => {
            const newAnimating = new Set(prevAnimating);
            newAnimating.delete(itemId);
            return newAnimating;
          });
        }, 300);
      }

      // Reset swipe state
      const newState = { ...prev };
      delete newState[itemId];

      // Reset visual offset
      setSwipeOffset(prevOffset => {
        const newOffset = { ...prevOffset };
        delete newOffset[itemId];
        return newOffset;
      });

      return newState;
    });
  }, [threshold]);

  const resetSwipe = useCallback((itemId) => {
    setSwipeState(prev => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
    
    setSwipeOffset(prev => {
      const newOffset = { ...prev };
      delete newOffset[itemId];
      return newOffset;
    });
  }, []);

  return {
    swipeState,
    swipeOffset,
    animatingItems,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd,
    resetSwipe
  };
};

export default useSwipeGesture;