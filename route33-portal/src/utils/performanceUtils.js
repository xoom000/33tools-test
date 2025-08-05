/**
 * COMPOSE, NEVER DUPLICATE - Performance Measurement Utilities
 * Collects and analyzes React Profiler data for optimization insights
 * Based on React best practices for performance monitoring
 */

class PerformanceMeasurement {
  constructor() {
    this.measurements = new Map();
    this.isCollecting = false;
  }

  // Start collecting performance data
  startCollection() {
    this.isCollecting = true;
    this.measurements.clear();
    console.log('🚀 Performance collection started');
  }

  // Stop collecting and generate report
  stopCollection() {
    this.isCollecting = false;
    const report = this.generateReport();
    console.log('🚀 Performance collection stopped');
    return report;
  }

  // Record a performance measurement
  recordMeasurement(data) {
    if (!this.isCollecting) return;

    const { id, phase, actualDuration, baseDuration, optimizationGain } = data;
    
    if (!this.measurements.has(id)) {
      this.measurements.set(id, {
        id,
        mountTime: null,
        updateTimes: [],
        totalMountTime: 0,
        totalUpdateTime: 0,
        updateCount: 0,
        averageUpdateTime: 0,
        maxUpdateTime: 0,
        optimizationGains: [],
        totalOptimizationGain: 0
      });
    }

    const measurement = this.measurements.get(id);

    if (phase === 'mount') {
      measurement.mountTime = actualDuration;
      measurement.totalMountTime += actualDuration;
    } else if (phase === 'update') {
      measurement.updateTimes.push(actualDuration);
      measurement.totalUpdateTime += actualDuration;
      measurement.updateCount++;
      measurement.averageUpdateTime = measurement.totalUpdateTime / measurement.updateCount;
      measurement.maxUpdateTime = Math.max(measurement.maxUpdateTime, actualDuration);
    }

    if (optimizationGain > 0) {
      measurement.optimizationGains.push(optimizationGain);
      measurement.totalOptimizationGain += optimizationGain;
    }
  }

  // Generate performance report
  generateReport() {
    const components = Array.from(this.measurements.values());
    
    const report = {
      timestamp: new Date().toISOString(),
      totalComponents: components.length,
      totalOptimizationGain: components.reduce((sum, c) => sum + c.totalOptimizationGain, 0),
      components: components.map(c => ({
        id: c.id,
        mountTime: c.mountTime?.toFixed(2) || 'N/A',
        averageUpdateTime: c.averageUpdateTime?.toFixed(2) || 'N/A',
        maxUpdateTime: c.maxUpdateTime?.toFixed(2) || 'N/A',
        updateCount: c.updateCount,
        totalOptimizationGain: c.totalOptimizationGain?.toFixed(2) || '0.00',
        optimizationPercentage: c.optimizationGains.length > 0 
          ? ((c.totalOptimizationGain / c.optimizationGains.length) * 100 / 10).toFixed(1) + '%'
          : 'N/A'
      })).sort((a, b) => parseFloat(b.totalOptimizationGain) - parseFloat(a.totalOptimizationGain))
    };

    // Log summary
    console.table(report.components);
    console.log(`\n🚀 Performance Summary:
📊 Total Components Measured: ${report.totalComponents}
⚡ Total Optimization Gain: ${report.totalOptimizationGain.toFixed(2)}ms
🏆 Top Optimized Components:
${report.components.slice(0, 5).map((c, i) => 
  `  ${i + 1}. ${c.id}: ${c.totalOptimizationGain}ms saved`
).join('\n')}`);

    return report;
  }

  // Get current measurements
  getCurrentMeasurements() {
    return Array.from(this.measurements.values());
  }
}

// Global performance measurement instance
export const performanceMeasurer = new PerformanceMeasurement();

// Performance measurement hooks for React components
export const usePerformanceMeasurement = () => {
  const handleRender = (performanceData) => {
    performanceMeasurer.recordMeasurement(performanceData);
  };

  return { handleRender };
};

// Utility functions for performance analysis
export const analyzePerformance = {
  // Identify slow components (>16ms render time)
  getSlowComponents: (measurements) => {
    return measurements.filter(m => 
      (m.mountTime && m.mountTime > 16) || 
      (m.averageUpdateTime && m.averageUpdateTime > 16)
    );
  },

  // Get components with best optimization gains
  getBestOptimized: (measurements) => {
    return measurements
      .filter(m => m.totalOptimizationGain > 0)
      .sort((a, b) => b.totalOptimizationGain - a.totalOptimizationGain);
  },

  // Calculate performance score (0-100)
  calculatePerformanceScore: (measurements) => {
    const averageRenderTime = measurements.reduce((sum, m) => {
      return sum + (m.averageUpdateTime || m.mountTime || 0);
    }, 0) / measurements.length;

    const totalOptimization = measurements.reduce((sum, m) => sum + m.totalOptimizationGain, 0);
    
    // Score based on render times and optimization gains
    const baseScore = Math.max(0, 100 - (averageRenderTime * 2)); // Penalize slow renders
    const optimizationBonus = Math.min(20, totalOptimization / 5); // Bonus for optimizations
    
    return Math.min(100, baseScore + optimizationBonus);
  }
};

export default performanceMeasurer;