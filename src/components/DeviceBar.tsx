import React from 'react';
import { useApp } from '../context/AppContext';
import { MonitorIcon, SmartphoneIcon } from './Icons';
import { 
  Home, 
  GraduationCap, 
  UserCheck, 
  User, 
  Users, 
  Unlock, 
  Lock, 
  RotateCcw 
} from 'lucide-react';

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
      <div className="device-bar-left-group">
        {/* Role & Page Switcher */}
        <div className="toggle-group" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
          <button 
            className={`device-toggle-btn ${!isAuthenticated && activeRole === 'volunteer' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('volunteer');
              logout();
            }}
            title="Landing / Login Page with Animation"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Home size={13} />
            <span>Landing Page</span>
          </button>
          <button 
            className={`device-toggle-btn ${isAuthenticated && activeRole === 'volunteer' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('volunteer');
              loginVolunteer();
            }}
            title="Volunteer Reviewer Portal Dashboard"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <GraduationCap size={13} />
            <span>Volunteer Portal</span>
          </button>
          <button 
            className={`device-toggle-btn ${activeRole === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveRole('student');
            }}
            title="Student Portal: Requires student OTP verification"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <UserCheck size={13} />
            <span>Student Portal</span>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <User size={13} />
              <span>1 Student</span>
            </button>
            <button 
              className={`device-toggle-btn ${volunteerAssignmentMode === 'group' ? 'active' : ''}`}
              onClick={() => setVolunteerAssignmentMode('group')}
              title="Group User Mode: Multiple students tagged (Cohort of 3)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Users size={13} />
              <span>Group (3)</span>
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
                gap: '5px',
                background: 'rgba(34, 197, 94, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                <Unlock size={12} />
                <span>Verified: {students.find(s => s.id === selectedStudentForViewId)?.name}</span>
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
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Lock student portal and ask for OTP again"
              >
                <Lock size={11} />
                <span>Lock OTP</span>
              </button>
            </div>
          ) : (
            <span style={{
              fontSize: '11px',
              color: '#FEF08A',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(234, 179, 8, 0.2)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              <Lock size={11} />
              <span>OTP Verification Required</span>
            </span>
          )
        )}
      </div>

      <div className="device-bar-right-group">
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
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <RotateCcw size={12} />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
