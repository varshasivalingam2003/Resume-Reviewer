import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WarningTriangleIcon, CloseIcon } from './Icons';

export const ChangesModal: React.FC = () => {
  const { activeStudent, closeModal, requestChanges, toggleImproveTag } = useApp();
  const [note, setNote] = useState<string>(activeStudent?.generalFeedback || '');

  if (!activeStudent) return null;

  const improveTagOptions: string[] = [
    'Grammar', 'Formatting', 'Skills', 'Projects', 'Objective', 'Education'
  ];

  const handleSend = () => {
    requestChanges(activeStudent.improveTags || [], note);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={closeModal} title="Close">
          <CloseIcon size={18} />
        </button>

        <div className="modal-content-body">
          <div className="modal-status-badge-icon warning">
            <WarningTriangleIcon size={34} />
          </div>

          <h3 className="modal-title">Request Resume Changes</h3>

          <div className="modal-student-chip">
            <img src={activeStudent.avatar} alt={activeStudent.name} />
            <span>{activeStudent.name}</span>
          </div>

          <div className="changes-section-wrapper">
            <label className="changes-label">Select areas to improve</label>
            <div className="changes-chips-grid">
              {improveTagOptions.map(tag => {
                const isSelected = (activeStudent.improveTags || []).includes(tag);
                return (
                  <button 
                    key={tag}
                    className={`changes-chip-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleImproveTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <label className="changes-label">Feedback</label>
            <textarea 
              className="changes-note-textarea" 
              placeholder="Add a short note explaining requested improvements..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSend}>
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
