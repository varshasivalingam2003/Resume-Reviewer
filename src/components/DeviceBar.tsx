import React from 'react';
import { useApp } from '../context/AppContext';
import { MonitorIcon, SmartphoneIcon } from './Icons';

export const DeviceBar: React.FC = () => {
  const { 
    deviceMode, 
    setDeviceMode, 
    resetDemo, 
    isAuthenticated,
    activeRole, 
    setActiveRole,
    students,
    selectedStudentForViewId,
    isStudentLoggedIn,
    logoutStudent,
    loginVolunteer,
    logout,
    volunteerAssignmentMode,
    setVolunteerAssignmentMode
  } = useApp();

  return (
    <div className="device-toggle-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Role & Page Switcher */}
        <div className="toggle-group" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
          <button 
            className={`device-toggle-btn ${!isAuthenticated && activeRole === 'volunteer' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('volunteer');
              logout();
            }}
            title="Landing / Login Page with Animation"
          >
            🏠 Landing Page
          </button>
          <button 
            className={`device-toggle-btn ${isAuthenticated && activeRole === 'volunteer' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('volunteer');
              loginVolunteer();
            }}
            title="Volunteer Reviewer Portal Dashboard"
          >
            🧑‍🏫 Volunteer Portal
          </button>
          <button 
            className={`device-toggle-btn ${activeRole === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('student');
            }}
            title="Student Portal: Requires student OTP verification"
          >
            🎓 Student Portal
          </button>
        </div>

        {isAuthenticated && activeRole === 'volunteer' && (
          <div className="toggle-group" style={{ background: 'rgba(255, 255, 255, 0.12)' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', padding: '0 4px 0 6px', fontWeight: '600' }}>
              Tagged:
            </span>
            <button 
              className={`device-toggle-btn ${volunteerAssignmentMode === 'single' ? 'active' : ''}`}
              onClick={() => setVolunteerAssignmentMode('single')}
              title="Single User Mode: Only 1 student tagged"
            >
              👤 1 Student
            </button>
            <button 
              className={`device-toggle-btn ${volunteerAssignmentMode === 'group' ? 'active' : ''}`}
              onClick={() => setVolunteerAssignmentMode('group')}
              title="Group User Mode: Multiple students tagged (Cohort of 3)"
            >
              👥 Group (3)
            </button>
          </div>
        )}

        {activeRole === 'student' && (
          isStudentLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '11px', 
                color: '#86EFAC', 
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(34, 197, 94, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                🔓 Verified: {students.find(s => s.id === selectedStudentForViewId)?.name}
              </span>
              <button
                onClick={logoutStudent}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  color: '#FCA5A5',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
                title="Lock student portal and ask for OTP again"
              >
                🔒 Lock OTP
              </button>
            </div>
          ) : (
            <span style={{
              fontSize: '11px',
              color: '#FEF08A',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(234, 179, 8, 0.2)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              🔒 OTP Verification Required
            </span>
          )
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Viewport Frame Toggle */}
        <div className="toggle-group">
          <button 
            className={`device-toggle-btn ${deviceMode === 'responsive' ? 'active' : ''}`}
            onClick={() => setDeviceMode('responsive')}
          >
            <MonitorIcon size={14} /> Desktop
          </button>
          <button 
            className={`device-toggle-btn ${deviceMode === 'mobile_frame' ? 'active' : ''}`}
            onClick={() => setDeviceMode('mobile_frame')}
          >
            <SmartphoneIcon size={14} /> Mobile Frame
          </button>
        </div>

        <button 
          className="quick-reset-btn" 
          onClick={() => {
            if (window.confirm('Reset application state to initial demo data?')) {
              resetDemo();
            }
          }}
          title="Reset all state to initial demo data"
        >
          ↺ Reset Demo
        </button>
      </div>
    </div>
  );
};
