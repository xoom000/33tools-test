import React, { useState } from 'react';
import { Button } from '../ui';
import { 
  startPerformanceSession, 
  endPerformanceSession, 
  exportPerformanceData 
} from '../../utils/performanceMeasurement';

/**
 * COMPOSE, NEVER DUPLICATE - Performance Testing Control Panel
 * Provides UI controls for starting/stopping performance measurements
 * Based on React best practices for performance monitoring
 */

const PerformanceTester = ({ className = '' }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const handleStartSession = () => {
    const name = sessionName.trim() || `Test_${new Date().toLocaleTimeString()}`;
    startPerformanceSession(name);
    setIsSessionActive(true);
    console.log(`🚀 Started performance session: ${name}`);
  };

  const handleEndSession = () => {
    const session = endPerformanceSession();
    setIsSessionActive(false);
    console.log(`📊 Ended performance session. Check console for detailed report.`);
    return session;
  };

  const handleExportData = () => {
    const data = exportPerformanceData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('📁 Performance data exported');
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-3">⚡ Performance Profiler</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Session Name (optional)
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g., Dashboard_Load_Test"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isSessionActive}
          />
        </div>

        <div className="flex gap-2">
          {!isSessionActive ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartSession}
            >
              🚀 Start Session
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={handleEndSession}
            >
              ⏹️ End Session
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
          >
            📁 Export Data
          </Button>
        </div>

        {isSessionActive && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 text-sm font-medium">
                Performance session active - interacting with components to measure optimizations
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p>• Start a session before testing component interactions</p>
          <p>• Check browser console for real-time optimization measurements</p>
          <p>• End session to see complete performance report</p>
          <p>• Export data for detailed analysis</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTester;