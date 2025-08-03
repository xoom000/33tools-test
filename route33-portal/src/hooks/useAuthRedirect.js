import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// COMPOSE, NEVER DUPLICATE - Reusable auth redirect logic! ⚔️
const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userType, currentUser } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      if (userType === 'driver') {
        navigate(`/dashboard/${currentUser.route_number}`);
      } else if (userType === 'customer') {
        navigate(`/portal/${currentUser.customer_number}`);
      }
    }
  }, [isLoggedIn, userType, currentUser, navigate]);

  // This hook doesn't return anything - it just handles redirects
};

export default useAuthRedirect;