// COMPOSE, NEVER DUPLICATE - Pure Component Composition like AdminDashboard! ⚔️✨
import React from 'react';
import { DashboardLayout, PageContainer } from '../components/layout';
import { DemoContentRenderer, DemoHeader, TutorialRenderer } from '../components/features/demo';
import { useDemoLogic } from '../hooks';
import { DEMO_DATA } from '../constants/demo';

// COMPOSE, NEVER DUPLICATE - Pure Component Composition like AdminDashboard! ⚔️✨
const DemoPage = () => {
  // Custom hook - COMPOSE, NOT DUPLICATE!
  const demoLogic = useDemoLogic();

  // Early return for tutorial mode
  if (!demoLogic.showDemo) {
    return (
      <PageContainer variant="elevated" maxWidth="max-w-2xl" animation="scale">
        <TutorialRenderer {...demoLogic} />
      </PageContainer>
    );
  }

  // Render main demo dashboard
  return (
    <DashboardLayout
      header={
        <DemoHeader 
          demoView={demoLogic.demoView}
          onViewChange={demoLogic.switchDemoView}
        />
      }
    >
      <DemoContentRenderer
        demoView={demoLogic.demoView}
        driverProps={{
          orders: DEMO_DATA.orders,
          customers: DEMO_DATA.customers,
          onApproveOrder: (orderId) => console.log('Approve order:', orderId),
          onEditCustomer: (customer) => console.log('Edit customer:', customer),
          onGenerateToken: (customer) => console.log('Generate token:', customer)
        }}
        customerProps={{
          customer: { name: 'F M Valero' },
          items: DEMO_DATA.customers[0].items,
          quantities: demoLogic.quantities,
          onUpdateQuantity: demoLogic.updateQuantity,
          onSubmitOrder: () => console.log('Submit order')
        }}
      />
    </DashboardLayout>
  );
};

export default DemoPage;