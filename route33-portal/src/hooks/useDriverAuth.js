import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logger from '../utils/logger';

export const useDriverAuth = (currentRoute) => {
  const navigate = useNavigate();
  const { currentUser, userType, isLoggedIn, isDriver, isAdmin } = useAuth();

  const checkDriverAccess = () => {
    // Must be logged in as a driver
    if (!isLoggedIn || userType !== 'driver') {
      logger.warn('Dashboard access denied - not a logged in driver', { 
        isLoggedIn, 
        userType 
      });
      navigate('/');
      return;
    }

    // Check route access permissions
    if (!isDriver(currentRoute)) {
      // Driver can only access their own route (unless admin)
      if (!isAdmin() && currentRoute !== currentUser.route_number) {
        logger.warn('Route access denied', { 
          requestedRoute: currentRoute, 
          driverRoute: currentUser.route_number,
          isAdmin: isAdmin()
        });
        navigate(`/dashboard/${currentUser.route_number}`);
        return;
      }
    }

    logger.info('Driver dashboard access granted', { 
      driver: currentUser.name,
      route: currentRoute,
      isAdmin: isAdmin()
    });
  };

  // Check driver authentication and route access on mount
  useEffect(() => {
    checkDriverAccess();
  }, [isLoggedIn, currentUser, currentRoute, userType, navigate, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    checkDriverAccess,
    isAuthenticated: isLoggedIn && userType === 'driver',
    hasRouteAccess: isDriver(currentRoute) || (isAdmin() && currentRoute === currentUser?.route_number)
  };
};