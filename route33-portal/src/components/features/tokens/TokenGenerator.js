import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../../ui';
import TokenTypeSelector from './TokenTypeSelector';
import CustomerTokenForm from './CustomerTokenForm';
import DriverTokenForm from './DriverTokenForm';
import DemoTokenForm from './DemoTokenForm';
import TokenResult from './TokenResult';
import { useTokenGeneration } from '../../../hooks/useTokenGeneration';
import { useRoutes } from '../../../hooks/useRoutes';

const TokenGenerator = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  // Custom hooks for API logic
  const { isLoading, error, generatedToken, generateToken, clearError, clearToken } = useTokenGeneration();
  const { routes } = useRoutes(selectedType === 'driver');

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setShowGenerator(true);
    clearError();
    clearToken();
  };

  const handleBack = () => {
    setShowGenerator(false);
    setSelectedType('');
    clearError();
    clearToken();
  };

  const handleGenerate = async (type, formData) => {
    try {
      await generateToken(type, formData, routes);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const closeModal = () => {
    setShowGenerator(false);
    setSelectedType('');
    clearToken();
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Token Generator"
      size="large"
    >
      <AnimatePresence mode="wait">
        {!showGenerator ? (
          <TokenTypeSelector onTypeSelect={handleTypeSelection} />
        ) : generatedToken ? (
          <TokenResult
            generatedToken={generatedToken}
            onGenerateAnother={handleBack}
            onClose={closeModal}
          />
        ) : (
          <>
            {selectedType === 'customer' && (
              <CustomerTokenForm
                onGenerate={handleGenerate}
                onBack={handleBack}
                isLoading={isLoading}
                error={error}
              />
            )}
            {selectedType === 'driver' && (
              <DriverTokenForm
                routes={routes}
                onGenerate={handleGenerate}
                onBack={handleBack}
                isLoading={isLoading}
                error={error}
              />
            )}
            {selectedType === 'demo' && (
              <DemoTokenForm
                onGenerate={handleGenerate}
                onBack={handleBack}
                isLoading={isLoading}
                error={error}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default TokenGenerator;