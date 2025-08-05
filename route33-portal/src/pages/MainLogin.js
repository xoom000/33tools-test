import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui';
import { FormInput } from '../components/forms';
import { Modal } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logger from '../utils/logger';

const MainLogin = () => {
  const navigate = useNavigate();
  const { loginCustomer, loginDriver, isLoggedIn, userType, currentUser } = useAuth();
  
  // Main state
  const [loginType, setLoginType] = useState(''); // 'customer' or 'driver'
  
  // Customer login state
  const [customerForm, setCustomerForm] = useState({
    customerNumber: '',
    loginCode: ''
  });
  
  // Driver login state  
  const [driverForm, setDriverForm] = useState({
    username: '',
    password: ''
  });
  
  // Token setup state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [tokenData, setTokenData] = useState({
    token: '',
    validatedDriver: null
  });
  const [demoToken, setDemoToken] = useState('');
  const [setupData, setSetupData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      if (userType === 'driver') {
        navigate(`/dashboard/${currentUser.route_number}`);
      } else if (userType === 'customer') {
        navigate(`/portal/${currentUser.customer_number}`);
      }
    }
  }, [isLoggedIn, userType, currentUser, navigate]);

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/customers/${customerForm.customerNumber}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginCode: customerForm.loginCode })
      });

      const data = await response.json();

      if (response.ok) {
        // Customer login successful, redirect to portal
        logger.info('Customer logged in', { customer: data.customer_number });
        navigate(`/portal/${data.customer_number}`);
      } else {
        setError(data.error || 'Invalid customer number or login code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      logger.error('Customer login error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/drivers/login-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: driverForm.username,
          password: driverForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Use unified authentication system
        loginDriver(data.driver, data.token);
        
        logger.info('Driver logged in via unified auth', { 
          routeNumber: data.driver.route_number,
          role: data.driver.role 
        });

        // Navigation will be handled by useEffect redirect
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      logger.error('Driver login error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenValidation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/drivers/validate-setup-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenData.token })
      });

      const data = await response.json();

      if (response.ok) {
        setTokenData(prev => ({
          ...prev,
          validatedDriver: data.driver
        }));

        setSetupData({
          username: '',
          password: '',
          confirmPassword: ''
        });

        setShowTokenModal(false);
        setShowAccountSetupModal(true);

        logger.info('Setup token validated', { 
          route: data.driver.route_number,
          driver: data.driver.name 
        });
      } else {
        setError(data.error || 'Invalid setup token');
      }
    } catch (error) {
      setError('Network error. Please try again.');  
      logger.error('Token validation error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSetup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (setupData.password !== setupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/drivers/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenData.token,
          username: setupData.username,
          password: setupData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Use unified authentication system
        loginDriver(data.driver, data.token);

        logger.info('Driver account created and logged in', { 
          username: setupData.username,
          route: data.driver.route_number 
        });

        // Navigation will be handled by useEffect redirect
      } else {
        setError(data.error || 'Account creation failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      logger.error('Account creation error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Form reset when modals close
  const resetError = () => setError('');

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setTokenData({ token: '', validatedDriver: null });
    setError('');
  };

  const closeAccountSetupModal = () => {
    setShowAccountSetupModal(false);
    setSetupData({ username: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-6 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
            33 Tools
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Route system access
          </p>
        </div>

        {/* Single Login Form */}
        <form onSubmit={handleCustomerLogin} className="space-y-4">
          <FormInput
            label="Account Number"
            value={customerForm.customerNumber}
            onChange={(e) => setCustomerForm(prev => ({ ...prev, customerNumber: e.target.value }))}
            placeholder="Enter account number"
            required
          />
          
          <FormInput
            label="Customer Token"
            value={customerForm.loginCode}
            onChange={(e) => setCustomerForm(prev => ({ ...prev, loginCode: e.target.value }))}
            placeholder="Enter customer token"
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={isLoading || !customerForm.customerNumber || !customerForm.loginCode}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              'Access Portal'
            )}
          </Button>
        </form>

        {/* Driver Login Option */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">Driver access?</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="small"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setLoginType('driver')}
              >
                Driver Dashboard
              </Button>
              <Button
                variant="ghost"
                size="small"
                className="w-full text-slate-500 hover:text-slate-700"
                onClick={() => setShowTokenModal(true)}
              >
                I have a setup token
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="w-full text-slate-600 hover:text-slate-800"
                onClick={() => setShowDemoModal(true)}
              >
                Demo Access
              </Button>
            </div>
          </div>
        </div>

        {/* Driver Login Modal */}
        <Modal
          isOpen={loginType === 'driver'}
          onClose={() => {
            setLoginType('');
            setError('');
            setDriverForm({ username: '', password: '' });
          }}
          title="Driver Dashboard Access"
          size="medium"
        >
          <form onSubmit={handleDriverLogin} className="space-y-4">
            <FormInput
              label="Username"
              type="text"
              value={driverForm.username}
              onChange={(e) => setDriverForm(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              required
            />
            
            <FormInput
              label="Password"
              type="password"
              value={driverForm.password}
              onChange={(e) => setDriverForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setLoginType('');
                  setError('');
                  setDriverForm({ username: '', password: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !driverForm.username || !driverForm.password}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Token Entry Modal */}
        <Modal
          isOpen={showTokenModal}
          onClose={closeTokenModal}
          title="Enter Setup Token"
          size="medium"
        >
          <form onSubmit={handleTokenValidation} className="space-y-4">
            <FormInput
              label="Setup Token"
              value={tokenData.token}
              onChange={(e) => setTokenData(prev => ({ ...prev, token: e.target.value }))}
              placeholder="Enter your driver setup token"
              required
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={closeTokenModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !tokenData.token}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Validating...
                  </div>
                ) : (
                  'Validate Token'
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Account Setup Modal */}
        <Modal
          isOpen={showAccountSetupModal}
          onClose={closeAccountSetupModal}
          title={`Welcome ${tokenData.validatedDriver?.name}!`}
          size="medium"
          showCloseButton={false}
        >
          <div className="mb-4">
            <p className="text-slate-600 text-sm">
              Set up your login credentials for Route {tokenData.validatedDriver?.route_number}
            </p>
          </div>

          <form onSubmit={handleAccountSetup} className="space-y-4">
            <FormInput
              label="Username"
              value={setupData.username}
              onChange={(e) => setSetupData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Choose your username"
              required
            />
            
            <FormInput
              label="Password"
              type="password"
              value={setupData.password}
              onChange={(e) => setSetupData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Create a secure password"
              required
            />
            
            <FormInput
              label="Confirm Password"
              type="password"
              value={setupData.confirmPassword}
              onChange={(e) => setSetupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
              disabled={isLoading || !setupData.username || !setupData.password || !setupData.confirmPassword}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create My Account'
              )}
            </Button>
          </form>
        </Modal>

        {/* Demo Access Modal */}
        <Modal
          isOpen={showDemoModal}
          onClose={() => {
            setShowDemoModal(false);
            setDemoToken('');
            setError('');
          }}
          title="Demo Access"
          size="medium"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm text-slate-600">Enter your demo token to access the system demonstration.</p>
            </div>
            
            <FormInput
              label="Demo Token"
              type="text"
              value={demoToken}
              onChange={(e) => setDemoToken(e.target.value.toUpperCase())}
              placeholder="Enter token"
              required
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <Button
              variant="primary"
              size="large"
              className="w-full"
              onClick={() => {
                if (demoToken === 'DEMO426B') {
                  navigate('/demo');
                  setShowDemoModal(false);
                } else {
                  setError('Invalid demo token. Please check and try again.');
                }
              }}
              disabled={!demoToken}
            >
              Access Demo
            </Button>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};

export default MainLogin;