import React from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon, LogoutIcon } from './Icons';
import { GraduationCap } from 'lucide-react';
import { ResumeComparisonView } from './ResumeComparisonView';

export const StudentFeedbackView: React.FC = () => {
  const { 
    students, 
    selectedStudentForViewId, 
    setSelectedStudentForViewId,
    setActiveRole,
    logoutStudent
  } = useApp();

  return (
    <div className="student-view-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Student Portal Top Navigation Bar */}
      <nav className="student-top-navbar" style={{ flexShrink: 0 }}>
        <div className="student-top-brand">
          <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
            <PortalLogoIcon size={18} />
          </div>
          <div>
            <span className="brand-title" style={{ fontSize: '15px' }}>Resume Comparison & Review Portal</span>
            <span className="student-portal-tag">STUDENT PORTAL</span>
          </div>
        </div>

        <div className="student-nav-actions">
          {/* Quick student switcher for easy testing */}
          <div className="student-nav-switcher">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>Account:</span>
            <select 
              className="student-account-select"
              value={selectedStudentForViewId}
              onChange={(e) => setSelectedStudentForViewId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (OTP: {s.otp || '101010'})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveRole('volunteer')}
            title="Switch to volunteer review mode"
            style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <GraduationCap size={13} />
            <span>Volunteer Mode</span>
          </button>

          <button 
            className="student-logout-btn"
            onClick={logoutStudent}
            title="Log out and return to Student OTP verification"
          >
            <LogoutIcon size={15} />
            <span>Lock / Change OTP</span>
          </button>
        </div>
      </nav>

      {/* Main Full-Page Side-by-Side Resume Comparison View */}
      <ResumeComparisonView isVolunteerView={false} />
    </div>
  );
};
