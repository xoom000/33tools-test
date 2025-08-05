import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { ROUTES, ERROR_MESSAGES, BUTTON_ACTIONS } from '../constants/auth';
import { useModalManager } from './useModalManager';
import logger from '../utils/logger';

// COMPOSE, NEVER DUPLICATE - All login business logic extracted! ⚔️
const useLoginLogic = () => {
  const navigate = useNavigate();
  const { loginDriver } = useAuth();

  // EXTEND useModalManager - COMPOSE, NEVER DUPLICATE! ⚔️
  const { modals, openModal, closeModal } = useModalManager({
    showTokenModal: false,
    showAccountSetupModal: false,
    showDemoModal: false
  });
  
  // Login-specific state
  const [loginType, setLoginType] = useState(''); // 'customer' or 'driver'
  const [tokenData, setTokenData] = useState({
    token: '',
    validatedDriver: null
  });

  // PERFORMANCE - Memoized handlers to prevent re-renders! ⚡
  const handleDemoAccess = useCallback(async (formData) => {
    // Validate with your API instead of hardcoded check - COMPOSE! ⚔️
    await authService.validateDemoToken(formData.demoToken);
    
    navigate(ROUTES.DEMO);
    closeModal('DemoModal');
  }, [navigate]);

  const handleAccountSetupSubmit = useCallback(async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      throw new Error(ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
    }

    // Use extended authService - COMPOSE, NEVER DUPLICATE! ⚔️
    const data = await authService.createDriverAccount(
      tokenData.token,
      formData.username,
      formData.password
    );

    loginDriver(data.driver, data.token);
    logger.info('Driver account created and logged in', { 
      username: formData.username,
      route: data.driver.route_number 
    });
    closeModal('AccountSetupModal');
  }, [tokenData.token, loginDriver]);

  const handleTokenValidationSubmit = useCallback(async (formData) => {
    const data = await authService.validateSetupToken(formData.token);

    // Store both token and validated driver data
    setTokenData({
      token: formData.token,
      validatedDriver: data.driver
    });

    closeModal('TokenModal');
    openModal('AccountSetupModal');

    logger.info('Setup token validated', { 
      route: data.driver.route_number,
      driver: data.driver.name 
    });
  }, []);

  const handleCustomerLoginSubmit = useCallback(async (formData) => {
    const data = await authService.validateLogin(formData.customerNumber, formData.loginCode);

    logger.info('Customer logged in', { customer: data.customer_number });
    navigate(ROUTES.CUSTOMER_PORTAL(data.customer_number));
  }, [navigate]);

  const handleDriverLoginSubmit = useCallback(async (formData) => {
    const data = await authService.loginDriver(formData.username, formData.password);

    loginDriver(data.driver, data.token);
    logger.info('Driver logged in via unified auth', { 
      routeNumber: data.driver.route_number,
      role: data.driver.role 
    });
    setLoginType(''); // Close the modal
  }, [loginDriver]);

  const handleButtonAction = useCallback((buttonKey) => {
    switch (buttonKey) {
      case 'driver':
      case BUTTON_ACTIONS.DRIVER_LOGIN:
        setLoginType('driver');
        break;
      case 'guest':
        navigate(ROUTES.DEMO);
        break;
      case BUTTON_ACTIONS.SETUP_TOKEN:
        openModal('TokenModal');
        break;
      case BUTTON_ACTIONS.DEMO_ACCESS:  
        openModal('DemoModal');
        break;
      default:
        console.warn('Unknown button action:', buttonKey);
    }
  }, [navigate]);

  // Return everything the UI component needs - AdminDashboard pattern!
  return {
    // State
    loginType,
    modals,
    tokenData,
    
    // Handlers - all memoized for performance! ⚡
    handleDemoAccess,
    handleAccountSetupSubmit,
    handleTokenValidationSubmit,
    handleCustomerLoginSubmit,
    handleDriverLoginSubmit,
    handleButtonAction,
    
    // Modal management - like AdminDashboard
    openModal,
    closeModal,
    setLoginType
  };
};

export default useLoginLogic;