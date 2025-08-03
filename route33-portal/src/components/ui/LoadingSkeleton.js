import React from 'react';
import { motion } from 'framer-motion';

// COMPOSE, NOT DUPLICATE - Single skeleton for ALL loading states!
const LoadingSkeleton = ({ 
  lines = 3, 
  className = '', 
  showAvatar = false,
  showTitle = true,
  variant = 'default' // default, card, list, dashboard, header, serviceCard, fullDashboard, portalHeader
}) => {
  
  const getSkeletonVariant = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`animate-pulse space-y-4 p-4 ${className}`}>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-slate-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: lines }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-3 bg-slate-200 rounded" 
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className={`animate-pulse space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="rounded-lg bg-slate-200 h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        );
        
      case 'dashboard':
        return (
          <div className={`animate-pulse space-y-6 ${className}`}>
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-32"></div>
                </div>
              ))}
            </div>
            
            {/* Main content skeleton */}
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-5 bg-slate-200 rounded w-32"></div>
                <div className="h-8 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: lines }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-lg">
                    <div className="rounded-lg bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'header':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        );
        
      case 'portalHeader':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-48"></div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        );
        
      case 'serviceCard':
        return (
          <div className={`animate-pulse bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 ${className}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-6 bg-emerald-100 rounded-full w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
            <div className="mt-4">
              <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
            </div>
          </div>
        );
        
      case 'fullDashboard':
        return (
          <div className={`min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}>
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
              <div className="px-4 py-4 lg:px-6 lg:py-4">
                <LoadingSkeleton variant="header" />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              {/* Tab Navigation */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-white rounded-lg w-24 animate-pulse"></div>
                ))}
              </div>
              
              {/* Dashboard Content */}
              <LoadingSkeleton variant="dashboard" lines={lines} />
            </div>
          </div>
        );
        
      default:
        return (
          <div className={`animate-pulse space-y-3 ${className}`}>
            {showAvatar && (
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                </div>
              </div>
            )}
            {showTitle && <div className="h-5 bg-slate-200 rounded w-1/3"></div>}
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className="h-4 bg-slate-200 rounded" 
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {getSkeletonVariant()}
    </motion.div>
  );
};

export default LoadingSkeleton;