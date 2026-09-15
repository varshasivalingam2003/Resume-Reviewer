import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  CommentIcon, CheckIcon 
} from './Icons';

interface PresetComment {
  id: string;
  category: 'all' | 'impact' | 'verbs' | 'ats' | 'projects' | 'skills' | 'contact';
  severity: 'suggestion' | 'must_fix' | 'praise' | 'question';
  title: string;
  text: string;
}

const PRESET_COMMENT_BANK: PresetComment[] = [
  {
    id: 'p-1',
    category: 'impact',
    severity: 'must_fix',
    title: 'Quantify Metrics (XYZ Formula)',
    text: 'Use Google’s XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]. Replace vague statements with measurable metrics (e.g., % improvement, users served, latency reduction).'
  },
  {
    id: 'p-2',
    category: 'verbs',
    severity: 'suggestion',
    title: 'Lead with Strong Action Verbs',
    text: 'Begin each bullet with high-impact action verbs (e.g., "Spearheaded", "Architected", "Engineered", "Optimized") instead of passive terms like "Assisted with" or "Worked on".'
  },
  {
    id: 'p-3',
    category: 'ats',
    severity: 'must_fix',
    title: 'ATS Multi-Column Table Safety',
    text: 'Avoid multi-column tables, graphics, and non-standard layout blocks to ensure Applicant Tracking Systems (ATS) scan and rank your experience accurately.'
  },
  {
    id: 'p-4',
    category: 'ats',
    severity: 'suggestion',
    title: 'Concise Bullet Points (Max 2 Lines)',
    text: 'Keep bullet points between 1 to 2 lines maximum. Recruiters spend only 6-7 seconds scanning a resume; concise lines maximize retention.'
  },
  {
    id: 'p-5',
    category: 'projects',
    severity: 'must_fix',
    title: 'Include Live Deployed Link & GitHub',
    text: 'Add accessible URLs for live deployed applications (Vercel/Netlify) and public GitHub code repositories to validate practical implementation.'
  },
  {
    id: 'p-6',
    category: 'projects',
    severity: 'suggestion',
    title: 'Clarify Individual Contribution',
    text: 'For collaborative or hackathon projects, explicitly highlight your personal architecture role and technologies used rather than only team activities.'
  },
  {
    id: 'p-7',
    category: 'skills',
    severity: 'suggestion',
    title: 'Group Skills into Categories',
    text: 'Categorize technical skills logically: Languages (TypeScript, Java), Frameworks (React, Node.js), Developer Tools (Docker, Git), and Databases (PostgreSQL).'
  },
  {
    id: 'p-8',
    category: 'skills',
    severity: 'praise',
    title: 'Modern Technical Stack Alignment',
    text: 'Great job listing modern, in-demand technologies that directly align with full-stack software development roles.'
  },
  {
    id: 'p-9',
    category: 'contact',
    severity: 'must_fix',
    title: 'Add Clean Clickable LinkedIn & GitHub URLs',
    text: 'Ensure your customized LinkedIn URL (e.g., linkedin.com/in/yourname) and GitHub link are clickable hyperlinks at the top of your resume.'
  },
  {
    id: 'p-10',
    category: 'impact',
    severity: 'suggestion',
    title: 'Highlight Scale & Performance Benchmarks',
    text: 'Mention concrete benchmarks: throughput handled (e.g., 500 requests/sec), database query latency reduction, or percentage test coverage.'
  },
  {
    id: 'p-11',
    category: 'verbs',
    severity: 'must_fix',
    title: 'Eliminate "Responsible for" Phrases',
    text: 'Never start lines with "Responsible for" or "Tasked with". Instead write what you built or delivered (e.g., "Designed and deployed...").'
  },
  {
    id: 'p-12',
    category: 'projects',
    severity: 'suggestion',
    title: 'Explain Architecture & Design Trade-offs',
    text: 'Mention why you chose specific libraries or architectures (e.g., "Leveraged Redis caching to prevent redundant SQL queries").'
  },
  {
    id: 'p-13',
    category: 'ats',
    severity: 'suggestion',
    title: 'Use Standard Section Headings',
    text: 'Stick to conventional headers: "Education", "Work Experience", "Projects", "Technical Skills", and "Certifications" for maximum ATS compatibility.'
  },
  {
    id: 'p-14',
    category: 'skills',
    severity: 'suggestion',
    title: 'Prioritize Core Stack Over Infrequent Tools',
    text: 'List your strongest technologies first. Differentiate between languages you code in daily versus tools you have only touched once.'
  },
  {
    id: 'p-15',
    category: 'contact',
    severity: 'suggestion',
    title: 'Remove Full Street Address for Privacy',
    text: 'Include only City, State/Province and Country (e.g., "Bangalore, India") rather than complete door number or postal street address.'
  },
  {
    id: 'p-16',
    category: 'impact',
    severity: 'suggestion',
    title: 'Use STAR Technique for Experience',
    text: 'Structure experience bullets: Situation, Task, Action, and Result (STAR). Emphasize the final business impact achieved.'
  }
];

interface ResumeDocumentPaperProps {
  student: Student;
  pageNum: number;
  activeSection: string;
  volunteerSubtopics: VolunteerSubtopic[];
  onSelectSection: (key: string) => void;
  onQuickHighlight: (key: string, title: string) => void;
}

export const ResumeWorkspaceView: React.FC = () => {
  const { 
    activeStudent,
    setCurrentView,
    activeResumePage,
    setResumePage,
    zoomLevel,
    setZoom,
    activeHighlightSection,
    setActiveHighlightSection,
    mobileTab,
    setMobileTab,
    addVolunteerSubtopic,
    removeVolunteerSubtopic,
    toggleSubtopicHighlight,
    updateSubtopicCommand,
    updateSubtopicCategory,
    updateSubtopicRewrite,
    updateSubtopicAudioNote,
    saveAudioNote,
    saveRubricScores,
    toggleSubtopicReviewed,
    quickHighlightFromCanvas,
    updateGeneralFeedback,
    setRating,
    toggleImproveTag,
    openModal,
    setActiveRole,
    setSelectedStudentForViewId
  } = useApp();

  // Multi-Method Commenting Tool State (5 Suggestions)
  const [activeCommentTool, setActiveCommentTool] = useState<'sections' | 'preset_bank' | 'rewrite_diff' | 'voice_memo' | 'rubric'>('sections');
  
  // Method 1: Subtopic Definition
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [newCommandText, setNewCommandText] = useState('');
  const [newCategory, setNewCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  const [isDefiningSubtopic, setIsDefiningSubtopic] = useState(false);

  // Method 2: Preset Bank Filter
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<'all' | 'impact' | 'ats' | 'projects' | 'skills' | 'contact'>('all');

  // Method 3: Rewrite Suggestion Tool
  const [rewriteTargetSection, setRewriteTargetSection] = useState('objective');
  const [rewriteOriginal, setRewriteOriginal] = useState('Enthusiastic computer science student seeking an entry level developer job to gain experience and help the company grow.');
  const [rewriteProposed, setRewriteProposed] = useState('Results-driven Software Engineering candidate with hands-on React & Node.js full-stack project experience, seeking to build high-performance web applications.');
  const [rewriteSavedAlert, setRewriteSavedAlert] = useState(false);

  // Method 4: Voice Feedback Recorder Simulation (Overall + Subtopics)
  const [voiceTarget, setVoiceTarget] = useState<string>('overall');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [maxVoiceSeconds, setMaxVoiceSeconds] = useState<number>(300); // Default 5 mins (up to 10 mins)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingSubtopicAudioId, setPlayingSubtopicAudioId] = useState<string | null>(null);

  const formatVoiceTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: any;
    if (isVoiceRecording) {
      timer = setInterval(() => {
        setVoiceSeconds(prev => {
          if (prev >= maxVoiceSeconds) {
            setIsVoiceRecording(false);
            const duration = formatVoiceTime(maxVoiceSeconds);
            const timestamp = 'Just now';
            if (voiceTarget === 'overall') {
              saveAudioNote({ recorded: true, duration, timestamp });
            } else {
              updateSubtopicAudioNote(voiceTarget, { recorded: true, duration, timestamp });
            }
            return maxVoiceSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVoiceRecording, voiceTarget, maxVoiceSeconds]);

  // Method 5: Evaluation Rubric Scorecard
  const [rubricScores, setRubricScoresLocal] = useState({
    atsFormat: activeStudent?.rubricScores?.atsFormat || 4,
    metricsImpact: activeStudent?.rubricScores?.metricsImpact || 3,
    techDepth: activeStudent?.rubricScores?.techDepth || 4,
    grammarClarity: activeStudent?.rubricScores?.grammarClarity || 5
  });

  const handleRubricScoreChange = (key: 'atsFormat' | 'metricsImpact' | 'techDepth' | 'grammarClarity', value: number) => {
    const updated = { ...rubricScores, [key]: value };
    setRubricScoresLocal(updated);
    saveRubricScores(updated);
  };

  const calculateRubricOverall = () => {
    const avg = (rubricScores.atsFormat + rubricScores.metricsImpact + rubricScores.techDepth + rubricScores.grammarClarity) / 4;
    return Math.round((avg / 5) * 100);
  };

  const getActiveToolLabel = () => {
    switch (activeCommentTool) {
      case 'sections': return '✍️ Section Notes';
      case 'preset_bank': return '⚡ Comment Bank';
      case 'rewrite_diff': return '🔄 Rewrite (Diff)';
      case 'voice_memo': return '🎙️ Voice Memo';
      case 'rubric': return '📊 Rubric Scorecard';
    }
  };

  const handleInsertRubricSummary = () => {
    const summary = `\n\n📊 MENTOR EVALUATION RUBRIC (Score: ${calculateRubricOverall()}%):\n• ATS & Layout: ${rubricScores.atsFormat}/5\n• Impact & Metrics: ${rubricScores.metricsImpact}/5\n• Technical Stack Depth: ${rubricScores.techDepth}/5\n• Clarity & Action Verbs: ${rubricScores.grammarClarity}/5`;
    updateGeneralFeedback((activeStudent?.generalFeedback || '') + summary);
    alert('Rubric scorecard appended to Overall Feedback!');
  };

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to initial student data
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;
  const progressPercent = totalSubtopics > 0 ? Math.round((reviewedCount / totalSubtopics) * 100) : 0;

  const resumeSections = (activeStudent.resumeSections && activeStudent.resumeSections.length > 0)
    ? activeStudent.resumeSections
    : (initialStudentData.resumeSections || []);
  const improveTagOptions = [
    'Grammar', 'Formatting', 'Skills', 'Objective', 'Projects', 'Education'
  ];

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim()) return;

    addVolunteerSubtopic(newSubtopicTitle, selectedSectionKey || 'custom', newCommandText, newCategory);
    setNewSubtopicTitle('');
    setSelectedSectionKey('');
    setNewCommandText('');
    setNewCategory('suggestion');
    setIsDefiningSubtopic(false);
  };

  const handleQuickSelectSection = (section: ResumeSection) => {
    setNewSubtopicTitle(section.title);
    setSelectedSectionKey(section.key);
    setIsDefiningSubtopic(true);
  };

  const scrollToDocSection = (sectionKey: string) => {
    setActiveHighlightSection(sectionKey);
    const targetDocEl = document.getElementById(`section-doc-${sectionKey}`);
    if (targetDocEl) {
      targetDocEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleApplyPresetToSubtopic = (preset: PresetComment, subtopicId?: string) => {
    if (subtopicId) {
      const targetSub = volunteerSubtopics.find(s => s.id === subtopicId);
      const existing = targetSub?.command || '';
      updateSubtopicCommand(subtopicId, existing ? `${existing}\n\n• ${preset.text}` : preset.text);
      updateSubtopicCategory(subtopicId, preset.severity);
      alert(`Applied "${preset.title}" to subtopic!`);
    } else {
      // Create new subtopic from preset
      addVolunteerSubtopic(preset.title, 'custom', preset.text, preset.severity);
      setActiveCommentTool('sections');
      alert(`Created new subtopic "${preset.title}" from preset!`);
    }
  };

  const handleApplyPresetToGeneral = (preset: PresetComment) => {
    const existing = activeStudent.generalFeedback || '';
    updateGeneralFeedback(existing ? `${existing}\n\n• ${preset.text}` : preset.text);
    alert(`Added "${preset.title}" to Overall Feedback!`);
  };

  const handleSaveRewriteSuggestion = () => {
    // Find matching subtopic or create new rewrite subtopic
    const targetSub = volunteerSubtopics.find(s => s.sectionKey === rewriteTargetSection) || volunteerSubtopics[0];
    if (targetSub) {
      updateSubtopicRewrite(targetSub.id, { before: rewriteOriginal, after: rewriteProposed });
      updateSubtopicCommand(targetSub.id, `${targetSub.command || ''}\n\n[Suggested Rewrite]: "${rewriteProposed}"`);
    } else {
      addVolunteerSubtopic(`Suggested Rewrite: ${rewriteTargetSection.toUpperCase()}`, rewriteTargetSection, `[Suggested Rewrite]: "${rewriteProposed}"`);
    }
    setRewriteSavedAlert(true);
    setTimeout(() => setRewriteSavedAlert(false), 3000);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_review': return 'In Review';
      case 'changes_required': return 'Changes Required';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  const filteredPresets = presetCategoryFilter === 'all' 
    ? PRESET_COMMENT_BANK 
    : PRESET_COMMENT_BANK.filter(p => p.category === presetCategoryFilter);

  return (
    <div className="workspace-container">
      {/* Top Action Bar */}
      <header className="workspace-top-bar">
        <div className="workspace-left-meta">
          <button 
            className="workspace-back-btn" 
            onClick={() => setCurrentView('dashboard')}
          >
            <ArrowLeftIcon size={16} /> Back
          </button>
          
          <div className="workspace-student-title-box">
            <span className="workspace-student-name">{activeStudent.name}</span>
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>
        </div>

        <div className="workspace-top-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentForViewId(activeStudent.id);
              setActiveRole('student');
            }}
            title="Preview how student sees the listed mistakes and feedback"
          >
            🎓 View as Student
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => alert('All comments, presets, audio memo, and rubric saved successfully!')}
          >
            Save
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openModal('approve')}
          >
            Submit Review
          </button>
        </div>
      </header>

      {/* Mobile Workspace Tab Switcher */}
      <div className="mobile-workspace-tabs-bar">
        <div className="mobile-tabs-pill-container">
          <button 
            className={`mobile-tab-btn ${mobileTab === 'resume' ? 'active' : ''}`}
            onClick={() => setMobileTab('resume')}
          >
            📄 Resume
          </button>
          <button 
            className={`mobile-tab-btn ${mobileTab === 'review' ? 'active' : ''}`}
            onClick={() => setMobileTab('review')}
          >
            ✍️ Review & Comments ({volunteerSubtopics.length})
          </button>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="workspace-dual-pane" data-mobile-tab={mobileTab}>
        {/* Left Pane: Resume Document Viewer */}
        <section className="resume-viewer-pane">
          {/* Toolbar */}
          <div className="resume-toolbar">
            <div className="resume-file-info">
              <span className="pdf-icon-badge"><PdfIcon size={18} /></span>
              <span>{activeStudent.name.replace(/\s+/g, '_')}_Resume.pdf</span>
            </div>

            <div className="resume-view-controls">
              {/* Page Navigator */}
              <div className="page-navigator">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                >
                  &lt;
                </button>
                <span>{activeResumePage} / {activeStudent.totalPages || 2}</span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= (activeStudent.totalPages || 2)}
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel - 10)}>-</button>
                <span style={{ fontSize: '12px', minWidth: '36px', textAlign: 'center' }}>{zoomLevel}%</span>
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel + 10)}>+</button>
              </div>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => alert(`Downloading ${activeStudent.name}_Resume.pdf...`)}
                title="Download Resume"
              >
                <DownloadIcon size={16} />
              </button>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => setZoom(100)}
                title="Reset Zoom"
              >
                <MaximizeIcon size={16} />
              </button>
            </div>
          </div>

          {/* Document Canvas */}
          <div className="resume-scroll-canvas">
            <div 
              className="resume-paper" 
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <ResumeDocumentPaper 
                student={activeStudent} 
                pageNum={activeResumePage}
                activeSection={activeHighlightSection}
                volunteerSubtopics={volunteerSubtopics}
                onSelectSection={scrollToDocSection}
                onQuickHighlight={quickHighlightFromCanvas}
              />
            </div>
          </div>
        </section>

        {/* Right Pane: Review & Feedback Panel */}
        <aside className="review-feedback-pane">
          {/* Student Header */}
          <div className="review-student-header">
            <div className="review-student-info">
              <img src={activeStudent.avatar} alt={activeStudent.name} className="review-student-avatar" />
              <div>
                <h2 className="review-student-name">{activeStudent.name}</h2>
                <span className="review-student-sub">{activeStudent.degree}</span>
              </div>
            </div>
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>

          {/* Progress Header */}
          <div className="review-progress-section">
            <div className="review-progress-header">
              <span className="review-progress-title">Volunteer Review Progress</span>
              <span className="review-progress-count">
                {reviewedCount} / {totalSubtopics} subtopics reviewed
              </span>
            </div>
            <div className="review-progress-bar">
              <div className="review-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Volunteer Commenting Options Switcher Panel */}
          <div className="comment-feedback-tools-panel">
            <div className="comment-tools-top-bar">
              <div className="comment-tools-title-group">
                <span className="comment-tools-badge-icon">💬</span>
                <div>
                  <div className="comment-tools-main-title">Feedback Options for Volunteers</div>
                  <div className="comment-tools-sub-title">5 commenting feedback methods to evaluate this resume</div>
                </div>
              </div>
              <span className="comment-tools-current-mode-pill">
                Active: <strong>{getActiveToolLabel()}</strong>
              </span>
            </div>

            {/* 5 Distinct Navigation Tabs */}
            <div className="commenting-tools-tabs" role="tablist" aria-label="Volunteer Feedback Options">
              <button 
                type="button"
                className={`comment-tool-tab ${activeCommentTool === 'sections' ? 'active' : ''}`}
                onClick={() => setActiveCommentTool('sections')}
                title="Section commands with severity tags & highlights"
              >
                <span className="tab-icon">✍️</span>
                <span className="tab-label">Section Notes</span>
                <span className="tab-count-pill">{volunteerSubtopics.length}</span>
              </button>

              <button 
                type="button"
                className={`comment-tool-tab ${activeCommentTool === 'preset_bank' ? 'active' : ''}`}
                onClick={() => setActiveCommentTool('preset_bank')}
                title="16 Pre-written battle-tested mentor suggestions across categories"
              >
                <span className="tab-icon">⚡</span>
                <span className="tab-label">Comment Bank</span>
                <span className="tab-count-pill">16</span>
              </button>

              <button 
                type="button"
                className={`comment-tool-tab ${activeCommentTool === 'rewrite_diff' ? 'active' : ''}`}
                onClick={() => setActiveCommentTool('rewrite_diff')}
                title="Suggest specific Before/After text replacements"
              >
                <span className="tab-icon">🔄</span>
                <span className="tab-label">Rewrite (Diff)</span>
              </button>

              <button 
                type="button"
                className={`comment-tool-tab ${activeCommentTool === 'voice_memo' ? 'active' : ''}`}
                onClick={() => setActiveCommentTool('voice_memo')}
                title="Record audio coaching for overall resume or specific sections"
              >
                <span className="tab-icon">🎙️</span>
                <span className="tab-label">Voice Memo</span>
                {((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length) > 0 && (
                  <span className="tab-saved-dot">
                    {(activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length} ✓
                  </span>
                )}
              </button>

              <button 
                type="button"
                className={`comment-tool-tab ${activeCommentTool === 'rubric' ? 'active' : ''}`}
                onClick={() => setActiveCommentTool('rubric')}
                title="Scorecard evaluation across 4 dimensions"
              >
                <span className="tab-icon">📊</span>
                <span className="tab-label">Rubric</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              METHOD 1: SECTION NOTES & SUBTOPIC COMMANDS (WITH SEVERITY TAGS)
             ========================================================================= */}
          {activeCommentTool === 'sections' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="review-section-label" style={{ fontSize: '13px', margin: 0 }}>
                  Section Commands & Highlights
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => setIsDefiningSubtopic(!isDefiningSubtopic)}
                >
                  {isDefiningSubtopic ? 'Cancel' : '+ Define New Section'}
                </button>
              </div>

              {/* Define Subtopic Form */}
              {isDefiningSubtopic && (
                <form onSubmit={handleAddSubtopic} className="define-subtopic-box">
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
                    Define Subtopic & Assign Comment Type:
                  </div>

                  {/* Feedback Severity Category Selector */}
                  <div className="category-pill-group">
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', marginRight: '4px' }}>Type:</span>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'suggestion' ? 'active cat-suggestion' : ''}`}
                      onClick={() => setNewCategory('suggestion')}
                    >
                      💡 Suggestion
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'must_fix' ? 'active cat-must_fix' : ''}`}
                      onClick={() => setNewCategory('must_fix')}
                    >
                      ⚠️ Must Fix
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'praise' ? 'active cat-praise' : ''}`}
                      onClick={() => setNewCategory('praise')}
                    >
                      🌟 Praise
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'question' ? 'active cat-question' : ''}`}
                      onClick={() => setNewCategory('question')}
                    >
                      ❓ Question
                    </button>
                  </div>

                  {/* Quick Suggestion Chips from student's actual resume */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', width: '100%' }}>
                      Click to select from {activeStudent.name}'s resume:
                    </span>
                    {resumeSections.map(sec => (
                      <button 
                        type="button" 
                        key={sec.key}
                        className="suggested-section-chip"
                        onClick={() => handleQuickSelectSection(sec)}
                      >
                        + {sec.title}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text"
                    className="search-field"
                    style={{ height: '36px', marginBottom: '8px', fontSize: '13px' }}
                    placeholder="Subtopic title (e.g. Projective Skills, Extra-Curricular)..."
                    value={newSubtopicTitle}
                    onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    autoFocus
                  />

                  <textarea 
                    className="feedback-textarea"
                    style={{ minHeight: '52px', marginBottom: '8px', fontSize: '12px', padding: '8px' }}
                    placeholder="Write detailed comment or command for student..."
                    value={newCommandText}
                    onChange={(e) => setNewCommandText(e.target.value)}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setIsDefiningSubtopic(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Add & Highlight Subtopic
                    </button>
                  </div>
                </form>
              )}

              {/* Subtopics List */}
              <div className="section-checklist">
                {volunteerSubtopics.length === 0 ? (
                  <div className="no-subtopics-placeholder">
                    <p>No subtopics defined yet by volunteer.</p>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                      Click <strong>"+ Define New Section"</strong> or switch to <strong>"⚡ Comment Bank"</strong> to drop instant feedback presets!
                    </p>
                  </div>
                ) : (
                  volunteerSubtopics.map(sub => {
                    const isActive = activeHighlightSection === sub.sectionKey;
                    const cat = sub.category || 'suggestion';
                    return (
                      <div key={sub.id} className="volunteer-subtopic-card">
                        {/* Header Row */}
                        <div 
                          className={`subtopic-card-header ${isActive ? 'active' : ''}`}
                          onClick={() => scrollToDocSection(sub.sectionKey)}
                        >
                          <div className="subtopic-card-title-wrap">
                            <div 
                              className={`section-check-circle ${sub.isReviewed ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubtopicReviewed(sub.id);
                              }}
                              title={sub.isReviewed ? "Mark as Incomplete" : "Mark as Reviewed"}
                            >
                              {sub.isReviewed && '✓'}
                            </div>
                            <span className="subtopic-card-title">{sub.title}</span>
                            <span className={`subtopic-badge badge-${cat}`}>
                              {cat === 'must_fix' ? '⚠️ Must Fix' : cat === 'praise' ? '🌟 Praise' : cat === 'question' ? '❓ Question' : '💡 Suggestion'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Volunteer Highlighting Toggle */}
                            <button 
                              type="button"
                              className={`subtopic-highlight-toggle ${sub.isHighlighted ? 'highlighted' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubtopicHighlight(sub.id);
                              }}
                              title="Toggle soft yellow highlight on the resume document"
                            >
                              💡 {sub.isHighlighted ? 'Highlighted' : 'Highlight'}
                            </button>

                            <button 
                              type="button"
                              className="subtopic-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Remove subtopic "${sub.title}"?`)) {
                                  removeVolunteerSubtopic(sub.id);
                                }
                              }}
                              title="Delete subtopic"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Volunteer Command Editor */}
                        <div className="subtopic-command-box">
                          {/* Quick Category Switcher */}
                          <div className="category-pill-group">
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Severity:</span>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'suggestion' ? 'active cat-suggestion' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'suggestion')}
                            >
                              💡 Suggestion
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'must_fix' ? 'active cat-must_fix' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'must_fix')}
                            >
                              ⚠️ Must Fix
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'praise' ? 'active cat-praise' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'praise')}
                            >
                              🌟 Praise
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'question' ? 'active cat-question' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'question')}
                            >
                              ❓ Question
                            </button>
                          </div>

                          <textarea 
                            className="subtopic-command-input"
                            placeholder="Write specific command/feedback for student..."
                            value={sub.command}
                            onChange={(e) => updateSubtopicCommand(sub.id, e.target.value)}
                          />

                          {/* Suggested Rewrite Diff Preview if present */}
                          {sub.suggestedRewrite && (
                            <div className="diff-box-group" style={{ margin: '4px 0' }}>
                              <div className="diff-box before" style={{ padding: '6px 8px', fontSize: '11px' }}>
                                <span className="diff-label">Original:</span>
                                <s>{sub.suggestedRewrite.before}</s>
                              </div>
                              <div className="diff-box after" style={{ padding: '6px 8px', fontSize: '11px' }}>
                                <span className="diff-label">Suggested Replacement:</span>
                                <strong>{sub.suggestedRewrite.after}</strong>
                              </div>
                            </div>
                          )}

                          {/* Quick Command Suggestion Tags */}
                          <div className="command-suggestions-row">
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Quick insertions:</span>
                            <button 
                              type="button" 
                              className="cmd-pill"
                              onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Quantify results with measurable metrics.")}
                            >
                              + Quantify metrics
                            </button>
                            <button 
                              type="button" 
                              className="cmd-pill"
                              onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Include live project link or GitHub repo.")}
                            >
                              + Add live link
                            </button>
                            <button 
                              type="button" 
                              className="cmd-pill"
                              onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Highlight leadership and initiative.")}
                            >
                              + Leadership
                            </button>
                          </div>

                          {/* Subtopic Voice Feedback Note Row */}
                          <div className="subtopic-voice-row">
                            {sub.audioNote?.recorded ? (
                              <div className="subtopic-voice-pill">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '13px' }}>🎙️</span>
                                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534' }}>
                                    Voice Note ({sub.audioNote.duration})
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#64748B' }}>
                                    {sub.audioNote.timestamp}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn"
                                    onClick={() => {
                                      setPlayingSubtopicAudioId(playingSubtopicAudioId === sub.id ? null : sub.id);
                                    }}
                                  >
                                    {playingSubtopicAudioId === sub.id ? '⏸ Pause' : '▶ Play'}
                                  </button>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn record-again"
                                    onClick={() => {
                                      setVoiceTarget(sub.id);
                                      setActiveCommentTool('voice_memo');
                                    }}
                                    title="Re-record voice note for this subtopic"
                                  >
                                    🔄 Re-record
                                  </button>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn delete"
                                    onClick={() => {
                                      updateSubtopicAudioNote(sub.id, { recorded: false, duration: '0:00', timestamp: '' });
                                    }}
                                    title="Remove voice note"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                type="button" 
                                className="btn-attach-subtopic-voice"
                                onClick={() => {
                                  setVoiceTarget(sub.id);
                                  setActiveCommentTool('voice_memo');
                                }}
                              >
                                🎙️ + Record Voice Note for "{sub.title}"
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              METHOD 2: PRESET FEEDBACK BANK (1-CLICK QUICK COMMENTS)
             ========================================================================= */}
          {activeCommentTool === 'preset_bank' && (
            <div className="preset-bank-container">
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                Select battle-tested mentor phrases to insert directly into commands or overall review:
              </div>

              {/* Category Filter Pills */}
              <div className="preset-filter-row">
                {(['all', 'impact', 'ats', 'projects', 'skills', 'contact'] as const).map(cat => (
                  <button 
                    key={cat}
                    type="button" 
                    className={`preset-filter-chip ${presetCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setPresetCategoryFilter(cat)}
                  >
                    {cat === 'all' ? 'All Presets' : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Preset Cards Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredPresets.map(preset => (
                  <div key={preset.id} className="preset-card">
                    <div className="preset-card-header">
                      <span className="preset-card-title">{preset.title}</span>
                      <span className={`subtopic-badge badge-${preset.severity}`}>
                        {preset.severity === 'must_fix' ? '⚠️ Must Fix' : preset.severity === 'praise' ? '🌟 Praise' : '💡 Suggestion'}
                      </span>
                    </div>
                    <p className="preset-card-body">{preset.text}</p>
                    <div className="preset-actions-row">
                      {volunteerSubtopics.length > 0 && (
                        <button 
                          type="button" 
                          className="preset-btn-insert"
                          onClick={() => handleApplyPresetToSubtopic(preset, volunteerSubtopics[0].id)}
                          title="Append to active subtopic"
                        >
                          + Add to Subtopic
                        </button>
                      )}
                      <button 
                        type="button" 
                        className="preset-btn-insert"
                        onClick={() => handleApplyPresetToGeneral(preset)}
                        title="Add to Overall Feedback"
                      >
                        + Add to Overall Feedback
                      </button>
                      <button 
                        type="button" 
                        className="preset-btn-insert"
                        style={{ background: '#F1F5F9', borderColor: '#CBD5E1', color: '#334155' }}
                        onClick={() => handleApplyPresetToSubtopic(preset)}
                        title="Create a new highlighted subtopic"
                      >
                        + New Section
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* =========================================================================
              METHOD 3: REWRITE SUGGESTION TOOL (BEFORE / AFTER DIFF)
             ========================================================================= */}
          {activeCommentTool === 'rewrite_diff' && (
            <div className="rewrite-tool-card">
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                Suggest Exact Sentence Rewrite (Diff Proposal)
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                Show the student an exact before & after transformation of their bullet point or summary:
              </p>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Target Section:
                </label>
                <select 
                  className="search-field"
                  style={{ height: '34px', fontSize: '12px', width: '100%', marginBottom: '8px' }}
                  value={rewriteTargetSection}
                  onChange={(e) => setRewriteTargetSection(e.target.value)}
                >
                  {resumeSections.map(s => (
                    <option key={s.key} value={s.key}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#991B1B', display: 'block', marginBottom: '4px' }}>
                  Original Student Text (Before):
                </label>
                <textarea 
                  className="feedback-textarea"
                  style={{ minHeight: '52px', fontSize: '12px', padding: '8px', marginBottom: '8px' }}
                  value={rewriteOriginal}
                  onChange={(e) => setRewriteOriginal(e.target.value)}
                  placeholder="Paste student's current weak sentence..."
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>
                  Mentor Suggested Rewrite (After):
                </label>
                <textarea 
                  className="feedback-textarea"
                  style={{ minHeight: '52px', fontSize: '12px', padding: '8px', border: '1.5px solid #86EFAC', marginBottom: '10px' }}
                  value={rewriteProposed}
                  onChange={(e) => setRewriteProposed(e.target.value)}
                  placeholder="Write the polished, action-oriented version with metrics..."
                />
              </div>

              {/* Side-by-Side Diff Preview */}
              <div className="diff-box-group">
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#334155' }}>Live Student Diff Preview:</span>
                <div className="diff-box before">
                  <span className="diff-label">❌ Before (Weak / Passive):</span>
                  <div style={{ fontSize: '12px', textDecoration: 'line-through', color: '#7F1D1D' }}>
                    {rewriteOriginal}
                  </div>
                </div>
                <div className="diff-box after">
                  <span className="diff-label">✅ After (Actionable & High-Impact):</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#14532D' }}>
                    {rewriteProposed}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveRewriteSuggestion}
                style={{ marginTop: '6px' }}
              >
                + Attach Rewrite Suggestion to Review
              </button>

              {rewriteSavedAlert && (
                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                  ✓ Rewrite suggestion saved and attached to student checklist!
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              METHOD 4: VOICE / AUDIO COACHING NOTE (OVERALL & SUBTOPIC TARGETS)
             ========================================================================= */}
          {activeCommentTool === 'voice_memo' && (
            <div className="voice-memo-panel">
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                🎙️ Audio Voice Coaching Notes
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', margin: '0 auto 12px auto' }}>
                Record voice notes either for <strong>specific resume subtopics</strong> or as an <strong>overall review coaching memo</strong>.
              </p>

              {/* Target Selector Card */}
              <div className="voice-target-selector-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#854D0E', textTransform: 'uppercase' }}>
                    🎯 Record Voice Note For:
                  </span>
                  {(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '9999px' }}>
                      ✓ Audio Attached ({(voiceTarget === 'overall' ? activeStudent.audioNote?.duration : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.duration)})
                    </span>
                  )}
                </div>

                <select 
                  className="search-field"
                  style={{ width: '100%', height: '38px', fontSize: '13px', fontWeight: '700', background: '#FFFFFF' }}
                  value={voiceTarget}
                  onChange={(e) => {
                    setVoiceTarget(e.target.value);
                    setIsVoiceRecording(false);
                    setIsPlayingAudio(false);
                    setVoiceSeconds(0);
                  }}
                >
                  <option value="overall">📢 Overall Review Memo (General Feedback)</option>
                  <optgroup label="📌 Specific Subtopic Sections">
                    {volunteerSubtopics.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title} {sub.audioNote?.recorded ? `(Attached: ${sub.audioNote.duration})` : '(No audio yet)'}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                  {voiceTarget === 'overall' 
                    ? "Recording will attach to candidate's overall review card."
                    : `Recording will attach directly to the "${volunteerSubtopics.find(s => s.id === voiceTarget)?.title || 'Selected'}" checklist card.`}
                </div>
              </div>

              {/* Recording Time Limit Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '4px 0 10px 0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>⏱️ Duration Limit:</span>
                {[60, 180, 300, 600].map(limit => (
                  <button
                    key={limit}
                    type="button"
                    className={`limit-pill-btn ${maxVoiceSeconds === limit ? 'active' : ''}`}
                    onClick={() => {
                      if (!isVoiceRecording) setMaxVoiceSeconds(limit);
                    }}
                    disabled={isVoiceRecording}
                    title={`Set maximum recording duration to ${limit / 60} min`}
                  >
                    {limit / 60} min{limit > 60 ? 's' : ''}
                  </button>
                ))}
              </div>

              <div className="voice-recording-stage">
                <div 
                  className={`voice-mic-circle ${isVoiceRecording ? 'recording' : ''}`}
                  onClick={() => {
                    if (isVoiceRecording) {
                      setIsVoiceRecording(false);
                      const duration = formatVoiceTime(Math.max(voiceSeconds, 3));
                      const timestamp = 'Just now';
                      const audioData = { recorded: true, duration, timestamp };
                      if (voiceTarget === 'overall') {
                        saveAudioNote(audioData);
                      } else {
                        updateSubtopicAudioNote(voiceTarget, audioData);
                      }
                    } else {
                      setIsVoiceRecording(true);
                      setVoiceSeconds(0);
                      setIsPlayingAudio(false);
                    }
                  }}
                  title={isVoiceRecording ? "Click to Stop Recording" : "Click to Record Voice Feedback"}
                >
                  {isVoiceRecording ? '⏹' : '🎤'}
                </div>

                <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'monospace', color: isVoiceRecording ? '#DC2626' : '#0F172A' }}>
                  {formatVoiceTime(voiceSeconds)} / {formatVoiceTime(maxVoiceSeconds)}
                </div>

                {/* Animated Equalizer Waveform */}
                <div className="waveform-display">
                  {[12, 24, 18, 28, 14, 22, 30, 16, 26, 20, 14, 28, 18, 24].map((h, i) => (
                    <div 
                      key={i} 
                      className={`wave-bar ${isVoiceRecording || isPlayingAudio ? 'active' : ''}`}
                      style={{ 
                        height: isVoiceRecording || isPlayingAudio ? undefined : `${h}px`,
                        animationDelay: `${i * 0.08}s` 
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                {!isVoiceRecording && !(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setIsVoiceRecording(true);
                      setVoiceSeconds(0);
                      setIsPlayingAudio(false);
                    }}
                  >
                    ● Start Recording (Up to {maxVoiceSeconds / 60} mins)
                  </button>
                )}

                {isVoiceRecording && (
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setIsVoiceRecording(false);
                      const duration = formatVoiceTime(Math.max(voiceSeconds, 3));
                      const timestamp = 'Just now';
                      const audioData = { recorded: true, duration, timestamp };
                      if (voiceTarget === 'overall') {
                        saveAudioNote(audioData);
                      } else {
                        updateSubtopicAudioNote(voiceTarget, audioData);
                      }
                    }}
                  >
                    ⏹ Done Recording
                  </button>
                )}

                {(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    >
                      {isPlayingAudio ? '⏸ Pause' : `▶ Play (${(voiceTarget === 'overall' ? activeStudent.audioNote?.duration : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.duration) || '0:30'})`}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setIsPlayingAudio(false);
                        setVoiceSeconds(0);
                        if (voiceTarget === 'overall') {
                          saveAudioNote({ recorded: false, duration: '0:00', timestamp: '' });
                        } else {
                          updateSubtopicAudioNote(voiceTarget, { recorded: false, duration: '0:00', timestamp: '' });
                        }
                      }}
                    >
                      ↺ Remove & Re-Record
                    </button>
                  </>
                )}
              </div>

              {/* All Recorded Voice Notes Directory */}
              <div className="all-recorded-voice-notes-box">
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Recorded Audio Feedback ({((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length)}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeStudent.audioNote?.recorded && (
                    <div className={`voice-list-item ${voiceTarget === 'overall' ? 'active-target' : ''}`}>
                      <div>
                        <strong style={{ fontSize: '12px' }}>📢 Overall Review Coaching Memo</strong>
                        <span style={{ fontSize: '11px', color: '#166534', marginLeft: '6px', fontWeight: '700' }}>
                          ({activeStudent.audioNote.duration})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => setVoiceTarget('overall')}
                      >
                        {voiceTarget === 'overall' ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  )}

                  {volunteerSubtopics.filter(s => s.audioNote?.recorded).map(s => (
                    <div key={s.id} className={`voice-list-item ${voiceTarget === s.id ? 'active-target' : ''}`}>
                      <div>
                        <strong style={{ fontSize: '12px' }}>📌 {s.title}</strong>
                        <span style={{ fontSize: '11px', color: '#166534', marginLeft: '6px', fontWeight: '700' }}>
                          ({s.audioNote?.duration})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => setVoiceTarget(s.id)}
                      >
                        {voiceTarget === s.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  ))}

                  {((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length) === 0 && (
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
                      No voice feedback notes recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              METHOD 5: EVALUATION RUBRIC SCORECARD
             ========================================================================= */}
          {activeCommentTool === 'rubric' && (
            <div className="rubric-panel">
              <div className="rubric-header-score">
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#854D0E', textTransform: 'uppercase' }}>
                    Calculated Readiness
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#713F12' }}>
                    {calculateRubricOverall()}% Ready
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#854D0E' }}>
                  Standard Rubric (4 Pillars)
                </div>
              </div>

              {/* Criterion 1 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>1. ATS & Layout Safety:</span>
                  <span style={{ color: '#EAB308' }}>{rubricScores.atsFormat} / 5</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.atsFormat === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('atsFormat', val)}
                    >
                      {val === 1 ? 'Poor' : val === 3 ? 'Good' : val === 5 ? 'Flawless' : `${val}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 2 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>2. Impact & Measurable Metrics:</span>
                  <span style={{ color: '#EAB308' }}>{rubricScores.metricsImpact} / 5</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.metricsImpact === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('metricsImpact', val)}
                    >
                      {val === 1 ? 'None' : val === 3 ? 'Average' : val === 5 ? 'High Impact' : `${val}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 3 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>3. Technical Projects Depth:</span>
                  <span style={{ color: '#EAB308' }}>{rubricScores.techDepth} / 5</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.techDepth === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('techDepth', val)}
                    >
                      {val === 1 ? 'Basic' : val === 3 ? 'Solid' : val === 5 ? 'Production' : `${val}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 4 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>4. Clarity & Strong Action Verbs:</span>
                  <span style={{ color: '#EAB308' }}>{rubricScores.grammarClarity} / 5</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.grammarClarity === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('grammarClarity', val)}
                    >
                      {val === 1 ? 'Passive' : val === 3 ? 'Clear' : val === 5 ? 'Stellar' : `${val}★`}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleInsertRubricSummary}
                style={{ marginTop: '4px' }}
              >
                📝 Append Rubric Scorecard into Overall Feedback
              </button>
            </div>
          )}

          {/* Star Rating Section */}
          <div className="review-rating-box">
            <span className="review-section-label">Overall Star Rating</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(starNum => (
                <span 
                  key={starNum}
                  className={`star-icon ${starNum <= activeStudent.rating ? 'filled' : ''}`}
                  onClick={() => setRating(starNum)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Improve Chips */}
          <div className="improve-tags-box">
            <span className="review-section-label">Quick Improvement Tags</span>
            <div className="improve-chips-wrap">
              {improveTagOptions.map(tag => {
                const isSelected = (activeStudent.improveTags || []).includes(tag);
                return (
                  <button 
                    key={tag}
                    className={`improve-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleImproveTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* General Feedback Textarea */}
          <div className="review-feedback-box">
            <span className="review-section-label">Overall Volunteer Review Feedback</span>
            <textarea 
              className="feedback-textarea"
              placeholder="Write comprehensive summary feedback for the candidate..."
              value={activeStudent.generalFeedback || ''}
              onChange={(e) => updateGeneralFeedback(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="review-action-buttons">
            <button 
              className="btn btn-danger-outline"
              onClick={() => openModal('changes')}
            >
              ⚠️ Needs Changes
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => openModal('approve')}
            >
              ✓ Approve Resume
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ResumeDocumentPaper: React.FC<ResumeDocumentPaperProps> = ({ 
  student, 
  pageNum, 
  activeSection, 
  volunteerSubtopics, 
  onSelectSection, 
  onQuickHighlight 
}) => {
  const initialStudentData = initialStudents.find(s => s.id === student.id) || initialStudents[0];
  const allSections = (student.resumeSections && student.resumeSections.length > 0)
    ? student.resumeSections
    : (initialStudentData.resumeSections || []);

  // Pagination: if 2 pages and on page 2, show subsequent sections; on page 1 show first 4 sections
  const sections = (student.totalPages === 2 && pageNum === 2)
    ? allSections.slice(3)
    : (student.totalPages === 2 ? allSections.slice(0, 4) : allSections);

  // Helper to find volunteer-defined subtopic and its highlight/command
  const getSubtopicForSection = (key: string, title?: string) => {
    return volunteerSubtopics.find(s => 
      s.sectionKey === key || 
      (s.title && title && s.title.toLowerCase().includes(title.toLowerCase())) ||
      (s.title && key && s.title.toLowerCase().includes(key.toLowerCase()))
    );
  };

  return (
    <>
      {/* Student Resume Candidate Header */}
      <header className="resume-header" id="section-doc-header">
        <h1 className="resume-name">{student.name.toUpperCase()}</h1>
        <div className="resume-target-title">{student.degree} Candidate</div>
        
        <div className="resume-contact-bar">
          <span className="resume-contact-item">✉ {student.email}</span>
          <span>•</span>
          <span className="resume-contact-item">☎ {student.phone}</span>
          <span>•</span>
          <span className="resume-contact-item">📍 {student.location}</span>
          {student.github && (
            <>
              <span>•</span>
              <span className="resume-contact-item">🐙 {student.github}</span>
            </>
          )}
        </div>
      </header>

      {/* Dynamic Personalized Resume Sections */}
      {sections.map(sec => {
        const subtopic = getSubtopicForSection(sec.key, sec.title);
        const isVolunteerHighlighted = !!(subtopic && subtopic.isHighlighted);
        const cat = subtopic?.category || 'suggestion';

        return (
          <section 
            key={sec.key}
            className={`resume-section ${isVolunteerHighlighted ? 'has-volunteer-highlight' : ''}`}
            id={`section-doc-${sec.key}`}
          >
            {/* Section Header with Volunteer Highlight Status */}
            <div className="resume-section-title">
              <span>{sec.title}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  type="button"
                  className={`canvas-section-action-btn ${isVolunteerHighlighted ? 'active' : ''}`}
                  onClick={() => onQuickHighlight(sec.key, sec.title)}
                  title="Click to toggle highlight on this section"
                >
                  {isVolunteerHighlighted ? '💡 Highlighted' : '+ Highlight'}
                </button>
                <button 
                  type="button"
                  className="canvas-section-action-btn"
                  onClick={() => onSelectSection(sec.key)}
                  title="Open comments for this section"
                >
                  💬 Comment
                </button>
              </div>
            </div>

            {/* Render Content Based on Section Type */}
            {sec.type === 'text' && (
              <p>{sec.content}</p>
            )}

            {sec.type === 'education' && (
              (sec.items as any[])?.map((edu, idx) => (
                <div key={idx} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="entry-title">{edu.degree}</span>
                    <span className="entry-date">{edu.period}</span>
                  </div>
                  <div className="resume-entry-header">
                    <span className="entry-org">{edu.institution}</span>
                    <span className="entry-score">{edu.score}</span>
                  </div>
                </div>
              ))
            )}

            {sec.type === 'chips' && (
              <div className="resume-skills-chips">
                {(sec.items as string[])?.map((skill, idx) => (
                  <span key={idx} className="skill-chip">{skill}</span>
                ))}
              </div>
            )}

            {sec.type === 'projects' && (
              (sec.items as any[])?.map((project, idx) => (
                <div key={idx} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="entry-title">{project.title}</span>
                    <span className="entry-date">{project.period}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: '600' }}>
                    Tech: {project.tech}
                  </div>
                  <p style={{ fontSize: '12px' }}>{project.description}</p>
                </div>
              ))
            )}

            {sec.type === 'list' && (
              <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
                {(sec.items as string[])?.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            )}

            {/* Volunteer Highlight Zone & Severity Callout */}
            {isVolunteerHighlighted && subtopic && (
              <div 
                className="resume-highlight-zone is-active"
                onClick={() => onSelectSection(sec.key)}
                title="Volunteer Highlighted Subtopic - Click to edit comment"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div className="highlight-comment-bubble">
                    <CommentIcon size={12} /> Volunteer Directive
                  </div>
                  <span className={`subtopic-badge badge-${cat}`} style={{ fontSize: '9.5px' }}>
                    {cat === 'must_fix' ? '⚠️ Must Fix' : cat === 'praise' ? '🌟 Praise' : cat === 'question' ? '❓ Question' : '💡 Suggestion'}
                  </span>
                </div>

                <div className="highlight-comment-pin">
                  🟡 Subtopic: {subtopic.title}
                </div>

                <div className="highlight-comment-text">
                  {subtopic.command || "No command entered yet. Type feedback command in the right review panel."}
                </div>

                {/* Suggested Rewrite Diff Card directly on Resume Canvas */}
                {subtopic.suggestedRewrite && (
                  <div className="diff-box-group" style={{ marginTop: '8px' }}>
                    <div className="diff-box before" style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <span className="diff-label" style={{ fontSize: '9px' }}>Original:</span>
                      <s>{subtopic.suggestedRewrite.before}</s>
                    </div>
                    <div className="diff-box after" style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <span className="diff-label" style={{ fontSize: '9px' }}>Suggested Replacement:</span>
                      <strong>{subtopic.suggestedRewrite.after}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
};
