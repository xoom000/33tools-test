import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// COMPOSE, NEVER DUPLICATE - Universal Swipeable List Item! ⚔️
// Eliminates ALL swipe gesture duplication across tabs
const SwipeableListItem = ({
  // Core Props
  item,
  isExpanded = false,
  onToggleExpanded,
  
  // Swipe Actions
  leftSwipeAction,   // { icon, label, color, action, threshold = 100 }
  rightSwipeAction,  // { icon, label, color, action, threshold = 100 }
  
  // Content Renderers
  renderContent,     // (item) => JSX - Required content renderer
  renderExpanded,    // (item) => JSX - Optional expanded content
  
  // State Props
  isLoaded = false,
  isPending = false,
  
  // Styling
  className = '',
  contentClassName = ''
}) => {
  const [showLeftAction, setShowLeftAction] = useState(false);
  const [showRightAction, setShowRightAction] = useState(false);
  
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ef4444', '#ffffff', '#10b981']
  );

  // Handle swipe gestures
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Determine swipe direction and trigger action
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 && rightSwipeAction) {
        // Right swipe (usually positive action)
        rightSwipeAction.action(item);
      } else if (offset < 0 && leftSwipeAction) {
        // Left swipe (usually negative action)
        leftSwipeAction.action(item);
      }
    }
    
    // Reset position
    x.set(0);
    setShowLeftAction(false);
    setShowRightAction(false);
  };

  // Handle drag progress for visual feedback
  const handleDrag = (event, info) => {
    const offset = info.offset.x;
    const threshold = 50;
    
    if (offset > threshold && rightSwipeAction) {
      setShowRightAction(true);
      setShowLeftAction(false);
    } else if (offset < -threshold && leftSwipeAction) {
      setShowLeftAction(true);
      setShowRightAction(false);
    } else {
      setShowLeftAction(false);
      setShowRightAction(false);
    }
  };

  // Get status styling
  const getStatusStyling = () => {
    if (isLoaded) return 'border-green-200 bg-green-50';
    if (isPending) return 'border-yellow-200 bg-yellow-50';
    return 'border-slate-200 bg-white';
  };

  // Render swipe feedback overlay
  const renderSwipeOverlay = () => {
    if (!showLeftAction && !showRightAction) return null;
    
    const action = showLeftAction ? leftSwipeAction : rightSwipeAction;
    const isLeft = showLeftAction;
    
    return (
      <div 
        className={`absolute inset-0 flex items-center ${
          isLeft ? 'justify-end pr-4' : 'justify-start pl-4'
        } ${isLeft ? 'bg-red-500' : 'bg-green-500'} rounded-lg`}
      >
        <div className="text-white font-semibold flex items-center gap-2">
          <span className="text-xl">{action.icon}</span>
          <span>{action.label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Swipe Feedback Overlay */}
      {renderSwipeOverlay()}
      
      {/* Main Content */}
      <motion.div
        style={{ x, background }}
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={`
          relative z-10 border rounded-lg transition-colors duration-200
          ${getStatusStyling()} ${contentClassName}
        `}
      >
        {/* Item Content */}
        <div 
          className="p-4 cursor-pointer"
          onClick={onToggleExpanded}
        >
          {renderContent(item)}
        </div>
        
        {/* Expanded Content */}
        {isExpanded && renderExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 p-4 bg-slate-50"
          >
            {renderExpanded(item)}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SwipeableListItem;