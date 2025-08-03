// COMPOSE, NEVER DUPLICATE - Pure Component Composition like AdminDashboard! ⚔️✨
import { PageContainer } from '../components/layout';
import { LoginContentRenderer, LoginModalRenderer } from '../components/features/auth';
import { useAuthRedirect, useLoginLogic } from '../hooks';

// COMPOSE, NEVER DUPLICATE - Pure Component Composition like AdminDashboard! ⚔️✨
const MainLogin = () => {
  // Custom hooks - COMPOSE, NOT DUPLICATE!
  useAuthRedirect(); // Handles redirect logic
  const loginLogic = useLoginLogic(); // All business logic in one hook!

  // Render main login
  return (
    <>
      <PageContainer>
        <LoginContentRenderer
          loginType={loginLogic.loginType}
          onCustomerLogin={loginLogic.handleCustomerLoginSubmit}
          onDriverLogin={loginLogic.handleDriverLoginSubmit}
          onButtonAction={loginLogic.handleButtonAction}
          onCloseDriverModal={() => loginLogic.setLoginType('')}
        />
      </PageContainer>

      <LoginModalRenderer
        modals={loginLogic.modals}
        tokenData={loginLogic.tokenData}
        closeModal={loginLogic.closeModal}
        onTokenValidation={loginLogic.handleTokenValidationSubmit}
        onAccountSetup={loginLogic.handleAccountSetupSubmit}
        onDemoAccess={loginLogic.handleDemoAccess}
      />
    </>
  );
};

export default MainLogin;