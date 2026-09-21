import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceBar } from './components/DeviceBar';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ResumeWorkspaceView } from './components/ResumeWorkspaceView';
import { CompletedView } from './components/CompletedView';
import { ApprovalModal } from './components/ApprovalModal';
import { ChangesModal } from './components/ChangesModal';
import { StudentFeedbackView } from './components/StudentFeedbackView';
import { StudentLoginView } from './components/StudentLoginView';

import { AppStyles } from './styles/AppStyles';

const AppContent: React.FC = () => {
  const { currentView, deviceMode, isAuthenticated, activeModal, activeRole, isStudentLoggedIn } = useApp();
  const isMobileFrame = deviceMode === 'mobile_frame';

  return (
    <>
      {/* Global & Modular Styles Injected via TSX */}
      <AppStyles />

      {/* Top Device Bar */}
      <DeviceBar />

      {/* Main Container */}
      <div className={`app-container ${isMobileFrame ? 'mobile-frame-mode' : ''}`}>
        {isMobileFrame && (
          <div className="mobile-notch">
            <div className="mobile-notch-pill"></div>
          </div>
        )}

        {isAuthenticated && activeRole === 'volunteer' && currentView !== 'workspace' && <Navbar />}

        <div className="app-main-content">
          {activeRole === 'student' ? (
            !isStudentLoggedIn ? (
              <StudentLoginView />
            ) : (
              <StudentFeedbackView />
            )
          ) : !isAuthenticated ? (
            <LoginView />
          ) : currentView === 'workspace' ? (
            <ResumeWorkspaceView />
          ) : currentView === 'completed' ? (
            <CompletedView />
          ) : (
            <DashboardView />
          )}
        </div>

        {/* Modal Overlays */}
        {activeModal === 'approve' && <ApprovalModal />}
        {activeModal === 'changes' && <ChangesModal />}
      </div>
    </>
  );
};

export default function App(): React.ReactElement {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
