import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { DashboardHeader, TabNavigation, TabContentRenderer } from '../components/features/dashboard';
import { ModalRenderer } from '../components/features/modals';
import { StagingWorkflowModal, DriverValidationModal } from '../components/features/modals';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLoadList } from '../hooks/useLoadList';
import { useModalManager } from '../hooks/useModalManager';
import { useDriverAuth } from '../hooks/useDriverAuth';
import PerformanceProfiler from '../components/profiler/PerformanceProfiler';
import { useAdminData } from '../hooks/useAdminData';
import { useServiceDays } from '../hooks/useServiceDays';
import { useToastCleanup } from '../hooks/useToastCleanup';
import { useCustomerManagement } from '../hooks/useCustomerManagement';
import { useOrdersTab } from '../hooks/useOrdersTab';
import { useAdminTabs } from '../hooks/useAdminTabs';
import { useDashboardGuards } from '../hooks/useDashboardGuards';
import logger from '../utils/logger';

import { generatePrintView } from '../utils/adminDashboardHelpers';
import { highlightSearchTerm } from '../utils/searchUtils';

const AdminDashboard = () => {
  const { currentUser, logout, isLoggedIn, userType } = useAuth();
  
  // Get route number from URL (defaults to 33 for backward compatibility)  
  const { routeNumber } = useParams();
  const currentRoute = routeNumber ? parseInt(routeNumber) : (currentUser?.route_number || 33);

  // Custom hooks - COMPOSE, NOT DUPLICATE!
  useDriverAuth(currentRoute); // Handles authentication and route access
  const { customers, orderRequests, loading, loadCustomers, loadOrderRequests, setCustomers, setOrderRequests } = useAdminData(currentRoute);
  const { selectedDay, availableServiceDays, setSelectedDay } = useServiceDays(customers);
  const { modals, openModal, closeModal } = useModalManager();
  const { toast } = useToastCleanup(); // Handles toast cleanup and keyboard shortcuts
  const fullToastContext = useToast(); // Get full context with removeToast method
  const { generateLoginToken, saveCustomer, saveItem } = useCustomerManagement(customers, setCustomers);
  
  // Dashboard-specific hooks
  const { tabs } = useAdminTabs(currentRoute);
  const { shouldRender, renderContent } = useDashboardGuards(loading, isLoggedIn, userType);
  
  // Orders tab hook - handles all orders functionality
  const {
    expandedItems: ordersExpandedItems,
    loadedItems: ordersLoadedItems,
    swipeState: ordersSwipeState,
    swipeOffset: ordersSwipeOffset,
    animatingItems: ordersAnimatingItems,
    toggleExpanded,
    markAsLoaded,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd,
    deleteOrder
  } = useOrdersTab(orderRequests, setOrderRequests, toast);

  // Remaining local state
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showStagingWorkflow, setShowStagingWorkflow] = useState(false);
  const [showDriverValidation, setShowDriverValidation] = useState(false);

  // Load List custom hook - handles all Load List functionality
  const {
    loadList,
    availableItems,
    customQuantities,
    expandedItems,
    loadedItems,
    swipeState,
    swipeOffset,
    animatingItems,
    editingQuantity,
    showAddItemSearch,
    searchTerm,
    isSearching,
    loadLoadList,
    addItemToLoadList,
    updateItemQuantity: updateLoadListItemQuantity,
    handleDayChange,
    toggleItemExpanded: toggleLoadListItemExpanded,
    handleSwipeStart: handleLoadListSwipeStart,
    handleSwipeMove: handleLoadListSwipeMove,
    handleSwipeEnd: handleLoadListSwipeEnd,
    handleSearchTermChange,
    handleCloseAddItemSearch,
    setEditingQuantity,
    setShowAddItemSearch
  } = useLoadList(customers, selectedDay, toast);
  
  // Component handler functions (memoized for performance)
  const handlePrint = useCallback(() => {
    generatePrintView(loadList, customQuantities, selectedDay, currentRoute, currentUser, fullToastContext, logger);
  }, [loadList, customQuantities, selectedDay, currentRoute, currentUser, fullToastContext]);

  const handleSaveCustomer = useCallback(async (customerData) => {
    await saveCustomer(customerData);
    await loadCustomers(); // Refresh list
  }, [saveCustomer, loadCustomers]);

  const handleSaveItem = useCallback(async (itemData) => {
    await saveItem(itemData);
  }, [saveItem]);

  // Memoized event handlers for memoized components
  const handleShowConfigureOrdering = useCallback(() => openModal('configureOrdering'), [openModal]);
  const handleShowAddCustomer = useCallback(() => openModal('addCustomer'), [openModal]);
  const handleEditCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    openModal('editCustomer');
  }, [openModal]);
  const handleAddItem = useCallback((customer) => {
    setSelectedCustomer(customer);
    openModal('addItem');
  }, [openModal]);
  const handleShowStagingWorkflow = useCallback(() => setShowStagingWorkflow(true), []);
  const handleShowDriverValidation = useCallback(() => setShowDriverValidation(true), []);
  const handleShowAddItemSearch = useCallback(() => setShowAddItemSearch(true), [setShowAddItemSearch]);
  const handleShowTokenGenerator = useCallback(() => openModal('tokenGenerator'), [openModal]);
  const handleLogout = useCallback(() => logout('/'), [logout]);


  // Dashboard guards - early returns for loading/auth states
  if (!shouldRender) {
    return renderContent;
  }

  // Render main dashboard
  return (
    <>
      <PerformanceProfiler id="AdminDashboard">
        <DashboardLayout
          header={
            <PerformanceProfiler id="DashboardHeader">
              <DashboardHeader 
                currentRoute={currentRoute}
                currentUser={currentUser}
                customerCount={customers.length}
                onShowTokenGenerator={handleShowTokenGenerator}
                onShowDriverValidation={handleShowDriverValidation}
                onLogout={handleLogout}
              />
            </PerformanceProfiler>
          }
          navigation={
            <PerformanceProfiler id="TabNavigation">
              <TabNavigation 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </PerformanceProfiler>
          }
        >
          <PerformanceProfiler id="TabContentRenderer">
            <TabContentRenderer
          activeTab={activeTab}
          tabs={tabs}
          currentRoute={currentRoute}
          ordersProps={{
            orderRequests,
            expandedItems: ordersExpandedItems,
            loadedItems: ordersLoadedItems,
            swipeState: ordersSwipeState,
            swipeOffset: ordersSwipeOffset,
            animatingItems: ordersAnimatingItems,
            onRefresh: loadOrderRequests,
            onToggleExpanded: toggleExpanded,
            onMarkAsLoaded: markAsLoaded,
            onSwipeStart: handleSwipeStart,
            onSwipeMove: handleSwipeMove,
            onSwipeEnd: handleSwipeEnd,
            onDeleteOrder: deleteOrder
          }}
          loadListProps={{
            loadList,
            selectedDay,
            availableServiceDays,
            expandedItems,
            loadedItems,
            swipeState,
            swipeOffset,
            animatingItems,
            customQuantities,
            editingQuantity,
            onDayChange: handleDayChange,
            onUpdateQuantity: updateLoadListItemQuantity,
            onToggleExpanded: toggleLoadListItemExpanded,
            onSwipeStart: handleLoadListSwipeStart,
            onSwipeMove: handleLoadListSwipeMove,
            onSwipeEnd: handleLoadListSwipeEnd,
            onShowAddItemSearch: handleShowAddItemSearch,
            onPrint: handlePrint,
            onRefresh: loadLoadList,
            onSetEditingQuantity: setEditingQuantity
          }}
          customersProps={{
            customers,
            selectedDay,
            availableServiceDays,
            onSetSelectedDay: setSelectedDay,
            onShowConfigureOrdering: handleShowConfigureOrdering,
            onShowAddCustomer: handleShowAddCustomer,
            onGenerateToken: generateLoginToken,
            onEditCustomer: handleEditCustomer,
            onAddItem: handleAddItem
          }}
          adminProps={{
            onShowStagingWorkflow: handleShowStagingWorkflow
          }}
            />
          </PerformanceProfiler>
        </DashboardLayout>
      </PerformanceProfiler>

      <PerformanceProfiler id="ModalRenderer">
        <ModalRenderer
          modals={modals}
          closeModal={closeModal}
          currentRoute={currentRoute}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          toast={toast}
          customerModalProps={{
            onSave: handleSaveCustomer
          }}
          itemModalProps={{
            onSave: handleSaveItem
          }}
          tokenGeneratorProps={{}}
          syncModalProps={{}}
          configureOrderingProps={{
          customers,
          availableServiceDays,
          onCustomersUpdated: loadCustomers
        }}
        addItemSearchProps={{
          isOpen: showAddItemSearch,
          onClose: handleCloseAddItemSearch,
          searchTerm,
          onSearchTermChange: handleSearchTermChange,
          isSearching,
          availableItems,
          loadList,
          customQuantities,
          onAddItem: addItemToLoadList,
          onUpdateQuantity: updateLoadListItemQuantity,
          highlightSearchTerm
        }}
      />
      </PerformanceProfiler>

      {/* Staging Workflow Modal */}
      <PerformanceProfiler id="StagingWorkflowModal">
        <StagingWorkflowModal
          isOpen={showStagingWorkflow}
          onClose={() => setShowStagingWorkflow(false)}
          routeNumber={currentRoute}
        />
      </PerformanceProfiler>

      {/* Driver Validation Modal */}
      <PerformanceProfiler id="DriverValidationModal">
        <DriverValidationModal
          isOpen={showDriverValidation}
          onClose={() => setShowDriverValidation(false)}
          routeNumber={currentRoute}
        />
      </PerformanceProfiler>

    </>
  );
};

export default AdminDashboard;