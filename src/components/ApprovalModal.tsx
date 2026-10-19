import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircleIcon, CloseIcon, StarIcon } from './Icons';
import { Check } from 'lucide-react';

export const ApprovalModal: React.FC = () => {
  const { activeStudent, closeModal, approveResume, setRating } = useApp();

  const [selectedRating, setSelectedRating] = useState<number>(() => {
    return (activeStudent?.rating && activeStudent.rating > 0) ? activeStudent.rating : 0;
  });
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');

  if (!activeStudent) return null;

  const volunteerSubtopics = activeStudent.volunteerSubtopics || [];
  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
    setRating(rating);
    setValidationError('');
  };

  const handleApprove = () => {
    if (!selectedRating || selectedRating === 0) {
      setValidationError('Please select a rating (1–5 stars) before approving.');
      return;
    }
    setRating(selectedRating);
    approveResume();
  };

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
            <div className="summary-row" style={{ alignItems: 'center' }}>
              <span className="summary-label">Rating</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <div 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || selectedRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleSelectRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="clean-star-btn"
                        style={{
                          padding: '4px 3px',
                          cursor: 'pointer',
                          background: 'transparent',
                          border: 'none',
                          color: isFilled ? '#F59E0B' : '#CBD5E1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          touchAction: 'manipulation'
                        }}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <StarIcon size={22} filled={isFilled} />
                      </button>
                    );
                  })}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: selectedRating > 0 ? '#D97706' : '#94A3B8' }}>
                  {selectedRating > 0 ? `${selectedRating} of 5 Stars` : 'Tap to rate'}
                </span>
                {validationError && (
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
                    {validationError}
                  </span>
                )}
              </div>
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
            <button className="btn btn-primary" onClick={handleApprove} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
