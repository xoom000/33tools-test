import React from 'react';
import { AnimatedHeader } from '../../animations';
import { Button, DevTransferButton } from '../../ui';

const DashboardHeader = ({ 
  currentRoute, 
  currentUser, 
  customerCount,
  onShowTokenGenerator,
  onLogout 
}) => {
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