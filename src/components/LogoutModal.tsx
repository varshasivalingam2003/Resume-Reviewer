import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut } from 'lucide-react';
import { CloseIcon } from './Icons';

export const LogoutModal: React.FC = () => {
  const { closeModal, logout } = useApp();

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
        <button className="modal-close-icon" onClick={closeModal} title="Close" aria-label="Close">
          <CloseIcon size={18} />
        </button>

        <div className="modal-content-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            className="modal-status-badge-icon" 
            style={{ 
              background: '#FEE2E2', 
              color: '#DC2626', 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '16px' 
            }}
          >
            <LogOut size={26} />
          </div>

          <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Log Out?
          </h3>

          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Are you sure you want to log out?
          </p>

          <div className="modal-actions-row" style={{ display: 'flex', width: '100%', gap: '12px' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={closeModal} 
              style={{ flex: 1, height: '42px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => {
                closeModal();
                logout();
              }} 
              style={{ 
                flex: 1, 
                height: '42px', 
                fontWeight: 700, 
                background: '#DC2626', 
                color: '#FFFFFF', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
