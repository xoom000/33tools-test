import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAsyncOperation } from './useAsyncOperation';
import { MORNING_STATS_CONFIG } from '../utils/constants';

// COMPOSE, NEVER DUPLICATE - Morning workspace business logic! ⚔️
export const useMorningWorkspace = () => {
  const { user } = useAuth();
  const [loadList, setLoadList] = React.useState([]);
  const [uniformOrders, setUniformOrders] = React.useState([]);
  const [customerNotes, setCustomerNotes] = React.useState([]);
  
  // EXTEND useAsyncOperation - COMPOSE, NEVER DUPLICATE! ⚔️
  const { loading, error, execute } = useAsyncOperation({
    initialLoading: true,
    logContext: 'MorningWorkspace'
  });

  const generateMorningPrep = React.useCallback(async () => {
    if (!user?.route_id) return;
    
    return execute({
      operation: async () => {
        // Get today's load requirements
        const loadResponse = await fetch(`/api/morning-prep/load-list/${user.route_id}`);
        if (!loadResponse.ok) throw new Error('Failed to load load list');
        const loadData = await loadResponse.json();
        setLoadList(loadData);

        // Get pending uniform orders
        const uniformResponse = await fetch(`/api/morning-prep/uniform-orders/${user.route_id}`);
        if (!uniformResponse.ok) throw new Error('Failed to load uniform orders');
        const uniformData = await uniformResponse.json();
        setUniformOrders(uniformData);

        // Get important customer notes
        const notesResponse = await fetch(`/api/morning-prep/customer-notes/${user.route_id}`);
        if (!notesResponse.ok) throw new Error('Failed to load customer notes');
        const notesData = await notesResponse.json();
        setCustomerNotes(notesData);

        return { loadData, uniformData, notesData };
      },
      errorMessage: 'Failed to load morning prep data. Please try again.',
      logSuccess: {
        message: 'Morning prep data loaded successfully',
        data: { route: user.route_id }
      },
      logError: {
        message: 'Failed to load morning prep data',
        data: { route: user.route_id }
      }
    });
  }, [user?.route_id, execute]);

  // Auto-load on mount
  React.useEffect(() => {
    if (user?.route_id) {
      generateMorningPrep();
    }
  }, [user?.route_id, generateMorningPrep]);

  // Transform data for ItemsGrid components
  const transformedLoadList = React.useMemo(() => 
    loadList.map(item => ({
      ...item,
      item_name: item.name,
      description: `Qty: ${item.quantity} | Size: ${item.size}`,
      item_type: item.customer ? `For: ${item.customer}` : 'General'
    })), [loadList]
  );

  const transformedUniformOrders = React.useMemo(() => 
    uniformOrders.map(order => ({
      id: order.id,
      item_name: order.customer_name,
      description: order.items.map(item => `${item.quantity}x ${item.item_name} - ${item.size}`).join(', '),
      item_type: `Ordered: ${new Date(order.order_date).toLocaleDateString()}`,
      quantity: order.items.length
    })), [uniformOrders]
  );

  const transformedCustomerNotes = React.useMemo(() => 
    customerNotes.map(note => ({
      id: note.id,
      item_name: note.customer_name,
      description: note.note,
      item_type: `Priority: ${note.priority}`,
      quantity: 1
    })), [customerNotes]
  );

  // Calculate stats using config
  const stats = React.useMemo(() => {
    const data = { loadList, uniformOrders, customerNotes, user };
    return MORNING_STATS_CONFIG.map(config => ({
      ...config,
      value: config.calculateValue(data)
    }));
  }, [loadList, uniformOrders, customerNotes, user]);

  // Item completion handler
  const markItemCompleted = React.useCallback((itemId, type) => {
    if (type === 'load') {
      setLoadList(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: true } : item
      ));
    }
  }, []);

  return {
    // State
    loading,
    error,
    user,
    
    // Transformed data for components
    transformedLoadList,
    transformedUniformOrders,
    transformedCustomerNotes,
    stats,
    
    // Actions
    generateMorningPrep,
    markItemCompleted
  };
};