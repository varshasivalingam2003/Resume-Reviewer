import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircleIcon, CloseIcon, StarRating } from './Icons';
import { Check } from 'lucide-react';

export const ApprovalModal: React.FC = () => {
  const { activeStudent, closeModal, approveResume } = useApp();

  if (!activeStudent) return null;

  const volunteerSubtopics = activeStudent.volunteerSubtopics || [];
  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={closeModal} title="Close">
          <CloseIcon size={18} />
        </button>

        <div className="modal-content-body">
          <div className="modal-status-badge-icon success">
            <CheckCircleIcon size={34} />
          </div>

          <h3 className="modal-title">Approve {activeStudent.name}'s Resume?</h3>

          <div className="modal-student-chip">
            <img src={activeStudent.avatar} alt={activeStudent.name} />
            <span>{activeStudent.name}</span>
          </div>

          <div className="approval-summary-card">
            <div className="summary-row">
              <span className="summary-label">Rating</span>
              <span className="summary-value">
                <StarRating rating={activeStudent.rating} size={16} />
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Feedback</span>
              <span className="summary-value" style={{ color: '#10B981' }}>
                {activeStudent.generalFeedback ? 'Added' : 'Standard'}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Subtopics Reviewed</span>
              <span className="summary-value">
                {reviewedCount} / {totalSubtopics}
              </span>
            </div>
          </div>

          <div className="modal-actions-row">
            <button className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={approveResume} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
