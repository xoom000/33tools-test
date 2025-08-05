import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { motion } from 'framer-motion';
import Button from './Button';
import { LIST_STYLES } from '../../config/tableConfigs';
import { CSS_ANIMATIONS, COMPONENT_ANIMATIONS } from '../../config/animations';

// COMPOSE, NEVER DUPLICATE - Universal List Component! ⚔️
const List = memo(function List({
  // Data
  items = [],
  config,
  
  // States
  isLoading = false,
  isEmpty = false,
  emptyState,
  
  // Interactions
  onItemClick,
  onItemAction,
  
  // Layout
  className = '',
  
  // Search and controls
  searchValue = '',
  onSearchChange,
  showSearch = false,
  
  // Actions
  actions = []
}) {
  const styles = LIST_STYLES;
  
  // Render list header with title, count, and actions
  const renderHeader = () => {
    if (!config.title && actions.length === 0) return null;
    
    return (
      <div className={styles.header.container}>
        <div>
          {config.title && (
            <h2 className={styles.header.title}>
              {config.title} ({items.length})
            </h2>
          )}
          {config.subtitle && (
            <p className={styles.header.count}>{config.subtitle}</p>
          )}
        </div>
        {actions.length > 0 && (
          <div className={styles.header.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                {...action}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render search and filter controls
  const renderControls = () => {
    if (!showSearch) return null;
    
    return (
      <div className={styles.controls.container}>
        <div className={styles.controls.search.container}>
          <div className={styles.controls.search.icon}>
            🔍
          </div>
          <input
            type="text"
            placeholder={config.search?.placeholder || 'Search...'}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={styles.controls.search.input}
          />
        </div>
      </div>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    if (!isEmpty || !emptyState) return null;
    
    return (
      <div className={styles.emptyState.container}>
        {emptyState.icon && (
          <div className={styles.emptyState.icon.container}>
            <span className={styles.emptyState.icon.text}>
              {emptyState.icon}
            </span>
          </div>
        )}
        {emptyState.title && (
          <h3 className={styles.emptyState.title}>
            {emptyState.title}
          </h3>
        )}
        {emptyState.description && (
          <p className={styles.emptyState.description}>
            {emptyState.description}
          </p>
        )}
        {emptyState.actions && (
          <div className={styles.emptyState.actions}>
            {emptyState.actions.map((action, index) => (
              <Button
                key={index}
                {...action}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render individual list item based on configuration
  const renderItem = (item, index) => {
    const itemConfig = config.layout || {};
    
    return (
      <motion.div
        key={item.id || index}
        {...COMPONENT_ANIMATIONS.list.item}
        transition={{
          ...COMPONENT_ANIMATIONS.list.item.transition,
          delay: index * (config.animation?.stagger || 0.05)
        }}
        className={itemConfig.item || 'p-4 border border-slate-200 rounded-lg'}
        onClick={() => onItemClick?.(item, index)}
      >
        {config.itemType === 'card' && renderCardItem(item)}
        {config.itemType === 'expandable' && renderExpandableItem(item)}
        {config.itemType === 'simple' && renderSimpleItem(item)}
      </motion.div>
    );
  };
  
  // Render card-style item
  const renderCardItem = (item) => {
    const content = config.content || {};
    
    return (
      <div className={config.layout?.header || 'flex items-start justify-between'}>
        <div className="flex-1">
          {content.title && (
            <h3 className={content.title.className}>
              {item[content.title.field]}
            </h3>
          )}
          {content.subtitle && (
            <p className={content.subtitle.className}>
              {content.subtitle.template ? 
                interpolateTemplate(content.subtitle.template, item) :
                item[content.subtitle.field]
              }
            </p>
          )}
          {content.description && (
            <p className={content.description.className}>
              {item[content.description.field]}
            </p>
          )}
        </div>
        
        {/* Actions and status */}
        <div className="flex items-center gap-2">
          {renderItemStatus(item)}
          {renderItemActions(item)}
        </div>
      </div>
    );
  };
  
  // Render simple list item
  const renderSimpleItem = (item) => {
    const content = config.content || {};
    
    return (
      <div className="flex items-center justify-between">
        <div>
          {content.title && (
            <span className={content.title.className}>
              {item[content.title.field]}
            </span>
          )}
        </div>
        {renderItemActions(item)}
      </div>
    );
  };
  
  // Render expandable item (placeholder for now)
  const renderExpandableItem = (item) => {
    return renderCardItem(item);
  };
  
  // Render item status badges
  const renderItemStatus = (item) => {
    if (!config.status) return null;
    
    const status = item[config.status.field];
    const badgeClass = config.status.badges?.[status];
    
    if (!badgeClass) return null;
    
    return (
      <span className={cn(config.status.className, badgeClass)}>
        {status}
      </span>
    );
  };
  
  // Render item actions
  const renderItemActions = (item) => {
    if (!config.actions) return null;
    
    return Object.entries(config.actions).map(([actionKey, actionConfig]) => {
      // Check if action should be shown for this item
      if (actionConfig.condition && !evaluateCondition(actionConfig.condition, item)) {
        return null;
      }
      
      return (
        <Button
          key={actionKey}
          {...actionConfig}
          size={actionConfig.size}
          variant={actionConfig.variant}
          onClick={() => onItemAction?.(actionKey, item)}
        >
          {actionConfig.label}
        </Button>
      );
    }).filter(Boolean);
  };
  
  // Helper function to interpolate template strings
  const interpolateTemplate = (template, item) => {
    return template.replace(/\{(\w+)\}/g, (match, key) => item[key] || match);
  };
  
  // Helper function to evaluate simple conditions
  const evaluateCondition = (condition, item) => {
    // Safe condition evaluation without Function constructor
    if (!condition || typeof condition !== 'string') return false;
    
    try {
      // Support basic property access patterns like "status === 'active'"
      if (condition.includes('===')) {
        const [property, value] = condition.split('===').map(s => s.trim());
        const cleanValue = value.replace(/['"]/g, ''); // Remove quotes
        const itemValue = property.split('.').reduce((obj, key) => obj?.[key], item);
        return itemValue === cleanValue;
      }
      
      // Support basic property existence checks like "isActive"
      if (!condition.includes(' ')) {
        return Boolean(condition.split('.').reduce((obj, key) => obj?.[key], item));
      }
      
      return false;
    } catch {
      return false;
    }
  };
  
  return (
    <div className={className}>
      {renderHeader()}
      {renderControls()}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className={cn('h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full', CSS_ANIMATIONS.classes.spin)}></div>
        </div>
      ) : isEmpty ? renderEmptyState() : (
        <div className={config.layout?.container || 'space-y-4'}>
          {items.map(renderItem)}
        </div>
      )}
    </div>
  );
});

export default List;