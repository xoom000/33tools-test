import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerPortal } from '../hooks/useCustomerPortal';
import { CustomerHeader, DashboardLayout } from '../components/layout';
import { NextServiceCard, ItemsGrid, CustomerPortalLoadingState, CustomerPortalErrorState } from '../components/features/customer-portal';

const CustomerPortal = () => {
  const { customerNumber } = useParams();
  const { currentCustomer } = useAuth();
  
  // Custom hook handles all portal functionality - COMPOSE, NOT DUPLICATE!
  const {
    regularItems,
    loading,
    error,
    handleLogout,
    handleSubmitOrder
  } = useCustomerPortal(customerNumber);

  if (loading) {
    return <CustomerPortalLoadingState />;
  }

  if (error) {
    return <CustomerPortalErrorState error={error} />;
  }

  return (
    <DashboardLayout
      header={
        <CustomerHeader 
          customerName={currentCustomer?.account_name}
          customerNumber={customerNumber}
          onLogout={handleLogout}
        />
      }
    >
      <NextServiceCard 
        onButtonClick={() => console.log('Add Extra Items clicked')}
      />
      
      <ItemsGrid 
        items={regularItems}
        onSubmitOrder={handleSubmitOrder}
        loading={loading}
      />
    </DashboardLayout>
  );
};

export default CustomerPortal;