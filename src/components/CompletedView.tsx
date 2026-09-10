import React from 'react';
import { useApp } from '../context/AppContext';
import { CommentIcon } from './Icons';

export const CompletedView: React.FC = () => {
  const { activeStudent, deviceMode, stats, goToNextPendingStudent, setCurrentView } = useApp();

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No completed review.</div>;
  }

  const isMobileMode = deviceMode === 'mobile_frame';
  const headingText = isMobileMode ? 'Great work!' : 'Review Completed';
  const statusLabel = activeStudent.status === 'approved' ? 'Approved' : 'Changes Required';
  const statusClass = activeStudent.status === 'approved' ? 'status-approved' : 'status-changes_required';

  return (
    <div className="completed-view-container">
      <div className="completed-card">
        {/* Celebration Burst Graphic */}
        <div className="celebration-burst-wrap">
          <div className="celebration-check-circle">
            <span style={{ fontSize: '38px' }}>✓</span>
          </div>

          <div className="celebration-rays">
            <span className="celebration-sparkle sparkle-1"></span>
            <span className="celebration-sparkle sparkle-2"></span>
            <span className="celebration-sparkle sparkle-3"></span>
            <span className="celebration-sparkle sparkle-4"></span>
            <span className="celebration-sparkle sparkle-5"></span>
            <span className="celebration-sparkle sparkle-6"></span>
          </div>
        </div>

        <h1 className="completed-title">{headingText}</h1>

        <div className="completed-student-row">
          <img src={activeStudent.avatar} alt={activeStudent.name} />
          <span className="completed-student-name">{activeStudent.name}</span>
          <span className={`status-badge ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        {/* Summary Stats Card */}
        <div className="completed-stats-row">
          <div className="completed-stat-item">
            <span className="stat-title" style={{ color: '#F59E0B', fontSize: '15px' }}>
              {'★'.repeat(activeStudent.rating)}{'☆'.repeat(5 - activeStudent.rating)}
            </span>
            <span>Rating Given</span>
          </div>

          <div className="completed-stat-item">
            <span className="stat-title">
              <CommentIcon size={14} /> Feedback
            </span>
            <span>Sent</span>
          </div>

          <div className="completed-stat-item">
            <span className="stat-title">
              📅 {activeStudent.completedDate || '08 Sep 2026'}
            </span>
            <span>Completed</span>
          </div>
        </div>

        <div className="remaining-count-notice">
          <strong>{stats.pending}</strong> resumes remaining
        </div>

        <div className="completed-actions-group">
          {stats.pending > 0 ? (
            <button className="btn btn-primary" onClick={goToNextPendingStudent}>
              Next Resume →
            </button>
          ) : (
            <div style={{ fontSize: '13px', color: '#10B981', fontWeight: '700', marginBottom: '8px' }}>
              🎉 All assigned resumes have been reviewed!
            </div>
          )}

          <button className="btn btn-outline" onClick={() => setCurrentView('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
