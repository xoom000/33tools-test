import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoadingSkeleton } from './components/ui';

// Lazy load pages for code splitting - critical performance optimization
const MainLogin = React.lazy(() => import('./pages/MainLogin'));
const CustomerPortal = React.lazy(() => import('./pages/CustomerPortal'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const MorningWorkspace = React.lazy(() => import('./pages/MorningWorkspace'));
const DemoPage = React.lazy(() => import('./pages/DemoPage'));

// Route loading fallback component
const RouteLoadingFallback = ({ routeName }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="text-center py-8 mb-6">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mb-4"></div>
        <p className="text-slate-600">Loading {routeName}...</p>
      </div>
      <LoadingSkeleton variant="dashboard" lines={4} />
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<RouteLoadingFallback routeName="Application" />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<RouteLoadingFallback routeName="Login" />}>
                    <MainLogin />
                  </Suspense>
                } 
              />
              <Route 
                path="/portal/:customerNumber" 
                element={
                  <Suspense fallback={<RouteLoadingFallback routeName="Customer Portal" />}>
                    <CustomerPortal />
                  </Suspense>
                } 
              />
              <Route 
                path="/dashboard/:routeNumber" 
                element={
                  <Suspense fallback={<RouteLoadingFallback routeName="Dashboard" />}>
                    <AdminDashboard />
                  </Suspense>
                } 
              />
              <Route 
                path="/morning/:routeNumber" 
                element={
                  <Suspense fallback={<RouteLoadingFallback routeName="Morning Workspace" />}>
                    <MorningWorkspace />
                  </Suspense>
                } 
              />
              <Route 
                path="/demo" 
                element={
                  <Suspense fallback={<RouteLoadingFallback routeName="Demo" />}>
                    <DemoPage />
                  </Suspense>
                } 
              />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
