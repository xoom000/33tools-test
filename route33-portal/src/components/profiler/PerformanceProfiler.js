import React, { Profiler } from 'react';
import { recordPerformance } from '../../utils/performanceMeasurement';

/**
 * COMPOSE, NEVER DUPLICATE - React DevTools Profiler wrapper
 * Measures performance of optimized components
 * Based on React best practices for performance monitoring
 */

const PerformanceProfiler = ({ id, children, onRender }) => {
  // Default profiler callback that logs performance data
  const handleRender = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
    const performanceData = {
      id,
      phase, // "mount" or "update"
      actualDuration, // Time spent rendering this update
      baseDuration, // Estimated time to render the entire subtree without memoization
      startTime, // When React began rendering this update
      commitTime, // When React committed this update
      interactions, // Set of interactions that were being traced when this update was scheduled
      optimizationGain: baseDuration - actualDuration // Performance improvement from memoization
    };

    // Record in measurement system
    recordPerformance(performanceData);

    // Log performance data for analysis (only if significant gain)
    if (performanceData.optimizationGain > 0.1) { // Only log if > 0.1ms gain
      console.log(`⚡ Optimization [${id}]:`, {
        phase: performanceData.phase,
        actualTime: `${performanceData.actualDuration.toFixed(2)}ms`,
        baseTime: `${performanceData.baseDuration.toFixed(2)}ms`,
        optimizationGain: `${performanceData.optimizationGain.toFixed(2)}ms`,
        gainPercentage: `${((performanceData.optimizationGain / performanceData.baseDuration) * 100).toFixed(1)}%`
      });
    }

    // Call custom onRender if provided
    if (onRender) {
      onRender(performanceData);
    }
  };

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};

export default PerformanceProfiler;