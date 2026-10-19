import React from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon } from './Icons';
import { LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, volunteer, setCurrentView, setActiveRole, openModal } = useApp();

  return (
    <header className="portal-navbar">
      <div 
        className="portal-brand" 
        onClick={() => {
          if (isAuthenticated) setCurrentView('dashboard');
        }}
      >
        <img 
          src="/images/team-everest-logo.png" 
          alt="Team Everest Logo" 
          className="portal-brand-logo" 
        />
        <div className="portal-brand-titles">
          <span className="portal-brand-name">Team Everest</span>
          <span className="portal-brand-portal">Resume Review Portal</span>
        </div>
      </div>

      <div className="portal-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isAuthenticated && (
          <>
            <div 
              className="volunteer-user-pill" 
              title={`${volunteer.role} (${volunteer.organization})`}
            >
              <img src={volunteer.avatar} alt={volunteer.name} className="volunteer-avatar" />
              <span className="volunteer-name">{volunteer.name}</span>
            </div>

            <button 
              className="portal-logout-btn"
              onClick={() => openModal('logout')}
              title="Log out from volunteer portal"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
