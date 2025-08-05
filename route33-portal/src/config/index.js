/**
 * COMPOSE, NEVER DUPLICATE - Unified Configuration System
 * Consolidated from 13 separate config files into 3 main exports
 * Based on React best practices for maintainable configuration management
 */

// ============================================================================
// MAIN CONFIGURATION EXPORTS (New Consolidated System)
// ============================================================================

export * from './ui';
export * from './animations';
export * from './theme';

// ============================================================================
// LEGACY CONFIGURATION EXPORTS (Backward Compatibility)
// ============================================================================
// These maintain compatibility while we migrate to the new system
// TODO: Remove these after migration is complete

// Button configurations (now in ui.js)
export * from './buttonConfigs';

// Form configurations (now in ui.js)
export * from './formConfigs';

// Animation configurations (now in animations.js)
// export * from './animationConfigs'; // Disabled to avoid conflicting star exports

// Theme configurations (now in theme.js)
export * from './layoutConfigs';
export * from './styleConfigs';
export * from './tabConfigs';

// Component configurations (now in ui.js)
export * from './modalConfigs';
export * from './cardConfigs';
export * from './tableConfigs';
export * from './notificationConfigs';
export * from './componentConfigs';