import React from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon } from './Icons';

export const Navbar: React.FC = () => {
  const { isAuthenticated, volunteer, setCurrentView, logout } = useApp();

  return (
    <header className="portal-navbar">
      <div 
        className="portal-brand" 
        onClick={() => {
          if (isAuthenticated) setCurrentView('dashboard');
        }}
      >
        <div className="brand-icon">
          <PortalLogoIcon size={22} />
        </div>
        <span className="brand-title">Resume Review Portal</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {isAuthenticated && (
          <div 
            className="volunteer-user-pill" 
            title={`${volunteer.role} (${volunteer.organization}) - Click to logout`}
            onClick={() => {
              if (window.confirm('Log out from volunteer session?')) {
                logout();
              }
            }}
          >
            <img src={volunteer.avatar} alt={volunteer.name} className="volunteer-avatar" />
            <span className="volunteer-name">{volunteer.name}</span>
            <span className="chevron-icon">▼</span>
          </div>
        )}
      </div>
    </header>
  );
};
