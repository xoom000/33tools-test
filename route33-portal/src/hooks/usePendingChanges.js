import { useState, useEffect, useCallback } from 'react';
import { databaseUpdateService } from '../services/databaseUpdateService';
import { useToast } from '../contexts/ToastContext';
import logger from '../utils/logger';

export const usePendingChanges = (routeNumber) => {
  const [pendingChanges, setPendingChanges] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchPendingChanges = useCallback(async () => {
    if (!routeNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await databaseUpdateService.getPendingChanges(routeNumber);
      setPendingChanges(data);
      setTotalPending(data.total_pending_changes || 0);
      
      logger.info('Pending changes fetched', { 
        routeNumber, 
        count: data.total_pending_changes 
      });
    } catch (err) {
      setError(err.message);
      logger.error('Failed to fetch pending changes', { 
        routeNumber, 
        error: err.message 
      });
    } finally {
      setLoading(false);
    }
  }, [routeNumber]);

  const validateChanges = useCallback(async (approvedIds, rejectedIds = []) => {
    if (!routeNumber || !approvedIds.length) return false;
    
    setLoading(true);
    try {
      const result = await databaseUpdateService.validateChanges(
        routeNumber, 
        approvedIds, 
        rejectedIds
      );
      
      addToast(
        `Successfully applied ${approvedIds.length} changes to database`, 
        'success'
      );
      
      // Refresh pending changes after validation
      await fetchPendingChanges();
      
      logger.info('Changes validated successfully', { 
        routeNumber, 
        approvedCount: approvedIds.length,
        rejectedCount: rejectedIds.length 
      });
      
      return result;
    } catch (err) {
      addToast('Failed to validate changes: ' + err.message, 'error');
      logger.error('Change validation failed', { 
        routeNumber, 
        error: err.message 
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [routeNumber, addToast, fetchPendingChanges]);

  // Auto-fetch on mount and route change
  useEffect(() => {
    fetchPendingChanges();
  }, [fetchPendingChanges]);

  // Poll for changes every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPendingChanges, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingChanges]);

  return {
    pendingChanges,
    totalPending,
    loading,
    error,
    fetchPendingChanges,
    validateChanges,
    hasPendingChanges: totalPending > 0
  };
};