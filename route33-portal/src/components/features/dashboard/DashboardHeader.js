import React from 'react';
import { AnimatedHeader } from '../../animations';
import { Button, DevTransferButton, Badge } from '../../ui';
import { usePendingChanges } from '../../../hooks/usePendingChanges';

const DashboardHeader = ({ 
  currentRoute, 
  currentUser, 
  customerCount,
  onShowTokenGenerator,
  onShowDriverValidation,
  onLogout 
}) => {
  const { totalPending, hasPendingChanges } = usePendingChanges(currentRoute);
  return (
    <AnimatedHeader className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4 xl:px-8 xl:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800">
              Route {currentRoute}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentUser?.name} • {customerCount} customers
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasPendingChanges && (
              <Button 
                variant="primary" 
                size="xs"
                onClick={onShowDriverValidation}
                className="relative"
              >
                <span className="flex items-center gap-1">
                  🔔 Validate Changes
                  <Badge variant="solid" className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px]">
                    {totalPending}
                  </Badge>
                </span>
              </Button>
            )}
            {currentRoute === 33 && (
              <Button 
                variant="primary" 
                size="xs"
                onClick={onShowTokenGenerator}
                
              >
                Token
              </Button>
            )}
            <DevTransferButton />
            <Button 
              variant="secondary" 
              size="xs"
              
            >
              Report
            </Button>
            <Button 
              variant="ghost" 
              size="xs"
              onClick={onLogout}
              
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </AnimatedHeader>
  );
};

export default DashboardHeader;