import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { DashboardHeader, TabNavigation, TabContentRenderer } from '../components/features/dashboard';
import { ModalRenderer } from '../components/features/modals';
import { DatabaseUpdateModal } from '../components/features/database-update';
import RouteOptimizationUpload from '../components/features/route-optimization/RouteOptimizationUpload';
import { useAuth } from '../contexts/AuthContext';
import { useLoadList } from '../hooks/useLoadList';
import { useModalManager } from '../hooks/useModalManager';
import { useDriverAuth } from '../hooks/useDriverAuth';
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
  const [showDatabaseUpdate, setShowDatabaseUpdate] = useState(false);
  const [showRouteOptimization, setShowRouteOptimization] = useState(false);

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
  
  // Component handler functions
  const handlePrint = () => {
    generatePrintView(loadList, customQuantities, selectedDay, currentRoute, currentUser, toast, logger);
  };

  const handleSaveCustomer = async (customerData) => {
    await saveCustomer(customerData);
    await loadCustomers(); // Refresh list
  };

  const handleSaveItem = async (itemData) => {
    await saveItem(itemData);
  };


  // Dashboard guards - early returns for loading/auth states
  if (!shouldRender) {
    return renderContent;
  }

  // Render main dashboard
  return (
    <>
      <DashboardLayout
        header={
          <DashboardHeader 
            currentRoute={currentRoute}
            currentUser={currentUser}
            customerCount={customers.length}
            onShowTokenGenerator={() => openModal('tokenGenerator')}
            onLogout={() => logout('/')}
          />
        }
        navigation={
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
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
            onShowAddItemSearch: () => setShowAddItemSearch(true),
            onPrint: handlePrint,
            onRefresh: loadLoadList,
            onSetEditingQuantity: setEditingQuantity
          }}
          customersProps={{
            customers,
            selectedDay,
            availableServiceDays,
            onSetSelectedDay: setSelectedDay,
            onShowConfigureOrdering: () => openModal('configureOrdering'),
            onShowAddCustomer: () => openModal('addCustomer'),
            onGenerateToken: generateLoginToken,
            onEditCustomer: (customer) => {
              setSelectedCustomer(customer);
              openModal('editCustomer');
            },
            onAddItem: (customer) => {
              setSelectedCustomer(customer);
              openModal('addItem');
            }
          }}
          adminProps={{
            onShowSyncModal: () => openModal('syncModal'),
            onShowDatabaseUpdate: () => setShowDatabaseUpdate(true),
            onShowRouteOptimization: () => setShowRouteOptimization(true)
          }}
        />
      </DashboardLayout>

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

      {/* Database Update Modal */}
      <DatabaseUpdateModal
        isOpen={showDatabaseUpdate}
        onClose={() => setShowDatabaseUpdate(false)}
      />

      {/* RouteOptimization Upload Modal */}
      <RouteOptimizationUpload
        isOpen={showRouteOptimization}
        onClose={() => setShowRouteOptimization(false)}
        onSuccess={(data) => {
          console.log('RouteOptimization comparison completed:', data);
          // Could add toast notification here
        }}
      />
    </>
  );
};

export default AdminDashboard;