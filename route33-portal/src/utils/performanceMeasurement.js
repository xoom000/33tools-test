/**
 * COMPOSE, NEVER DUPLICATE - Performance Measurement Utilities
 * Collects and analyzes React performance data from profilers
 * Based on React DevTools Profiler best practices
 */

class PerformanceMeasurement {
  constructor() {
    this.measurements = new Map();
    this.sessions = [];
    this.currentSession = null;
  }

  // Start a new measurement session
  startSession(sessionName = `Session_${Date.now()}`) {
    this.currentSession = {
      name: sessionName,
      startTime: performance.now(),
      measurements: new Map(),
      totalOptimizationGain: 0,
      renderCount: 0
    };
    
    console.log(`🚀 Performance Session Started: ${sessionName}`);
    return this.currentSession;
  }

  // Record profiler data
  recordMeasurement(data) {
    if (!this.currentSession) {
      this.startSession('Default Session');
    }

    const { id, phase, actualDuration, baseDuration, optimizationGain } = data;
    
    if (!this.currentSession.measurements.has(id)) {
      this.currentSession.measurements.set(id, {
        id,
        mountTime: phase === 'mount' ? actualDuration : null,
        updateTimes: [],
        totalRenders: 0,
        totalOptimizationGain: 0
      });
    }

    const measurement = this.currentSession.measurements.get(id);
    measurement.totalRenders++;
    measurement.totalOptimizationGain += optimizationGain;

    if (phase === 'update') {
      measurement.updateTimes.push(actualDuration);
    }

    this.currentSession.totalOptimizationGain += optimizationGain;
    this.currentSession.renderCount++;
  }

  // End current session and generate report
  endSession() {
    if (!this.currentSession) return null;

    const sessionDuration = performance.now() - this.currentSession.startTime;
    this.currentSession.endTime = performance.now();
    this.currentSession.duration = sessionDuration;

    // Calculate statistics
    const stats = this.calculateSessionStats(this.currentSession);
    this.sessions.push({ ...this.currentSession, stats });

    console.log(`📊 Performance Session Complete: ${this.currentSession.name}`);
    this.logSessionReport(this.currentSession, stats);

    const completedSession = this.currentSession;
    this.currentSession = null;
    return completedSession;
  }

  // Calculate session statistics
  calculateSessionStats(session) {
    const measurements = Array.from(session.measurements.values());
    
    const stats = {
      totalComponents: measurements.length,
      totalRenders: session.renderCount,
      totalOptimizationGain: session.totalOptimizationGain,
      avgOptimizationGain: session.totalOptimizationGain / session.renderCount,
      componentStats: measurements.map(m => ({
        id: m.id,
        totalRenders: m.totalRenders,
        avgUpdateTime: m.updateTimes.length > 0 
          ? m.updateTimes.reduce((a, b) => a + b, 0) / m.updateTimes.length 
          : 0,
        mountTime: m.mountTime,
        totalOptimizationGain: m.totalOptimizationGain,
        avgOptimizationGain: m.totalOptimizationGain / m.totalRenders
      })),
      topOptimizations: measurements
        .map(m => ({ id: m.id, gain: m.totalOptimizationGain }))
        .sort((a, b) => b.gain - a.gain)
        .slice(0, 5)
    };

    return stats;
  }

  // Log performance report to console
  logSessionReport(session, stats) {
    console.group(`📈 Performance Report: ${session.name}`);
    console.log(`⏱️  Session Duration: ${session.duration.toFixed(2)}ms`);
    console.log(`🔢 Total Components: ${stats.totalComponents}`);
    console.log(`🔄 Total Renders: ${stats.totalRenders}`);
    console.log(`⚡ Total Optimization Gain: ${stats.totalOptimizationGain.toFixed(2)}ms`);
    console.log(`📊 Average Optimization per Render: ${stats.avgOptimizationGain.toFixed(2)}ms`);
    
    console.group('🏆 Top Performance Gains:');
    stats.topOptimizations.forEach((opt, index) => {
      console.log(`${index + 1}. ${opt.id}: ${opt.gain.toFixed(2)}ms saved`);
    });
    console.groupEnd();

    console.group('📋 Component Details:');
    stats.componentStats.forEach(comp => {
      console.log(`${comp.id}:`, {
        renders: comp.totalRenders,
        avgUpdateTime: `${comp.avgUpdateTime.toFixed(2)}ms`,
        mountTime: comp.mountTime ? `${comp.mountTime.toFixed(2)}ms` : 'N/A',
        totalGain: `${comp.totalOptimizationGain.toFixed(2)}ms`,
        avgGain: `${comp.avgOptimizationGain.toFixed(2)}ms`
      });
    });
    console.groupEnd();
    console.groupEnd();
  }

  // Get all session data
  getAllSessions() {
    return this.sessions;
  }

  // Export data for external analysis
  exportData() {
    return {
      sessions: this.sessions,
      generatedAt: new Date().toISOString(),
      totalSessions: this.sessions.length
    };
  }
}

// Create singleton instance
const performanceMeasurement = new PerformanceMeasurement();

export default performanceMeasurement;

// Helper functions for easy usage
export const startPerformanceSession = (name) => performanceMeasurement.startSession(name);
export const endPerformanceSession = () => performanceMeasurement.endSession();
export const recordPerformance = (data) => performanceMeasurement.recordMeasurement(data);
export const exportPerformanceData = () => performanceMeasurement.exportData();