import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getResumeDownloadUrl, getResumeViewUrl } from '../services/zohoApi';
import { 
  CheckCircleIcon, WarningTriangleIcon, ClockIcon, CommentIcon, 
  PortalLogoIcon, LogoutIcon, DownloadIcon,
  PdfIcon, MaximizeIcon, GithubIcon, StarRating
} from './Icons';
import { 
  Hand, 
  FileText, 
  Sparkles,
  Mail, 
  Phone, 
  MapPin,
  ClipboardList,
  Search,
  Check,
  Send,
  ArrowLeft,
  Mic,
  Play,
  Pause,
  BarChart3,
  AlertCircle,
  Award,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Home,
  X
} from 'lucide-react';

export const StudentFeedbackView: React.FC = () => {
  const { 
    activeStudent, 
    volunteer, 
    studentResolvedItems, 
    toggleResolveItem,
    completeStudentReview,
    logoutStudent,
    setCurrentView,
    setActiveRole
  } = useApp();

  const [activeResumeVersion, setActiveResumeVersion] = useState<'old' | 'new'>('old');
  const [zoomLevel, setZoom] = useState(100);
  const [activeResumePage, setResumePage] = useState(1);
  const [studentMobileTab, setStudentMobileTab] = useState<'mistakes' | 'resume'>('mistakes');
  const [activeSpotlightSection, setActiveSpotlightSection] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);

  // PDF Loading & Rendering States for Actual Uploaded Resume
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(activeStudent?.totalPages || 1);
  const [reloadNonce, setReloadNonce] = useState(0);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;

  interface DetectedSection {
    key: string;
    title: string;
    page: number;
    pixelLeft: number;
    pixelTop: number;
    pixelWidth: number;
    pixelHeight: number;
    pdfX: number;
    pdfY: number;
  }
  const [detectedSections, setDetectedSections] = useState<DetectedSection[]>([]);

  // Recalculate fit on window resize
  useEffect(() => {
    let timeoutId: any = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setReloadNonce(n => n + 1);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ensure initial fit calculation runs after layout has painted
  useEffect(() => {
    const timer = setTimeout(() => {
      setReloadNonce(n => n + 1);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleVersionChange = (version: 'old' | 'new') => {
    setActiveResumeVersion(version);
    setZoom(100); // Reset to 100% initial fit
  };

  const activePdfFile = (activeResumeVersion === 'new' && ((activeStudent as any)?.revisedResumeAttachment || (activeStudent as any)?.revisedResumeUrl))
    ? ((activeStudent as any)?.revisedResumeAttachment || (activeStudent as any)?.revisedResumeUrl)
    : activeStudent?.resumeAttachment;

  const resumePdfUrl = activePdfFile 
    ? (activePdfFile.startsWith('/') && !activePdfFile.startsWith('/api')
        ? activePdfFile
        : getResumeViewUrl(activePdfFile, activeStudent?.name))
    : '';

  useEffect(() => {
    let isCancelled = false;

    if (!activePdfFile) {
      setPdfLoading(false);
      setPdfError(false);
      return;
    }

    setPdfLoading(true);
    setPdfError(false);

    const loadPdfDoc = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) {
          throw new Error('PDF viewer library is still initializing.');
        }

        const loadingTask = pdfjs.getDocument({
          url: resumePdfUrl,
          withCredentials: false
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setPdfTotalPages(doc.numPages);

        const safePageNum = Math.max(1, Math.min(activeResumePage, doc.numPages));
        const page = await doc.getPage(safePageNum);
        if (isCancelled) return;

        // Calculate initial "fit to container/page" scale
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const container = viewerContainerRef.current;
        const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;

        let fittedScale = 1.0;
        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
          const paddingX = isMobileDevice ? 24 : 48;
          const paddingY = isMobileDevice ? 24 : 48;
          const extraHeaderHeight = activeResumeVersion === 'new' ? 70 : 0;

          const availableWidth = Math.max(280, container.clientWidth - paddingX);
          const availableHeight = Math.max(300, container.clientHeight - paddingY - extraHeaderHeight);

          const scaleX = availableWidth / unscaledViewport.width;
          const scaleY = availableHeight / unscaledViewport.height;

          if (isMobileDevice) {
            // Mobile: fit to mobile width, no horizontal overflow
            fittedScale = Math.min(scaleX, 1.0);
          } else {
            // Desktop: fit whole page cleanly into available viewer area
            fittedScale = Math.min(scaleX, scaleY);
          }
        } else {
          fittedScale = isMobileDevice ? 0.65 : 0.82;
        }

        const currentScale = fittedScale * (zoomLevel / 100);
        const viewport = page.getViewport({ scale: currentScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (_) {}
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (isCancelled) return;

        // Extract text items to detect section headings and positions
        try {
          const textContent = await page.getTextContent();
          const rawItems = (textContent.items || []) as any[];

          interface RawTextItem {
            str: string;
            tx: number;
            ty: number;
            width: number;
            height: number;
          }

          const items: RawTextItem[] = rawItems
            .filter(it => it.str && typeof it.str === 'string' && it.str.trim().length > 0)
            .map(it => {
              const transform = it.transform || [1, 0, 0, 1, 0, 0];
              return {
                str: it.str,
                tx: transform[4],
                ty: transform[5],
                width: it.width || 0,
                height: it.height || 10
              };
            });

          interface TextLine {
            ty: number;
            items: RawTextItem[];
            fullText: string;
            minTx: number;
            maxTx: number;
            height: number;
          }

          const lines: TextLine[] = [];
          const sortedItems = [...items].sort((a, b) => b.ty - a.ty);

          sortedItems.forEach(item => {
            const match = lines.find(line => Math.abs(line.ty - item.ty) < 3.5);
            if (match) {
              match.items.push(item);
            } else {
              lines.push({
                ty: item.ty,
                items: [item],
                fullText: '',
                minTx: item.tx,
                maxTx: item.tx + item.width,
                height: item.height
              });
            }
          });

          lines.forEach(line => {
            line.items.sort((a, b) => a.tx - b.tx);
            line.fullText = line.items.map(it => it.str).join(' ').trim();
            line.minTx = Math.min(...line.items.map(it => it.tx));
            line.maxTx = Math.max(...line.items.map(it => it.tx + it.width));
            line.height = Math.max(...line.items.map(it => it.height));
          });

          const sectionDefs: { regex: RegExp; key: string; title: string }[] = [
            { regex: /^(career\s+)?objective\b|^professional\s+summary\b|^summary\b|^about\s+me\b/i, key: 'objective', title: 'Career Objective' },
            { regex: /^technical\s+skills\b|^skills(\s+(&|and)\s+abilities)?\b|^core\s+competencies\b|^key\s+skills\b/i, key: 'skills', title: 'Technical Skills' },
            { regex: /^education(\s+(&|and)\s+academics)?\b|^academic\s+qualifications?\b|^academic\s+background\b/i, key: 'education', title: 'Education' },
            { regex: /^(academic\s+|key\s+|personal\s+)?projects\b/i, key: 'projects', title: 'Projects' },
            { regex: /^(work\s+)?experience\b|^internships?\b|^employment\s+history\b/i, key: 'experience', title: 'Experience' },
            { regex: /^certifications?\b|^certificates?\b|^achievements?\b|^awards(\s+(&|and)\s+honors)?\b/i, key: 'certifications', title: 'Certifications' },
            { regex: /^(extra[\s-]?)?curricular(\s+activities)?\b|^activities\b|^co[\s-]curricular\b/i, key: 'activities', title: 'Activities' },
            { regex: /^interests?(\s+(&|and)\s+hobbies)?\b|^hobbies\b/i, key: 'interests', title: 'Interests & Hobbies' },
            { regex: /^declaration\b/i, key: 'declaration', title: 'Declaration' }
          ];

          const pageSections: DetectedSection[] = [];
          const seenSectionKeys = new Set<string>();

          lines.forEach(line => {
            const text = line.fullText.trim();
            if (!text || text.length > 45) return;
            if (line.minTx > 400) return;

            for (const def of sectionDefs) {
              if (def.regex.test(text) && !seenSectionKeys.has(def.key)) {
                seenSectionKeys.add(def.key);

                const rect = viewport.convertToViewportRectangle([
                  line.minTx,
                  line.ty,
                  line.maxTx,
                  line.ty + line.height
                ]);

                const left = Math.min(rect[0], rect[2]);
                const top = Math.min(rect[1], rect[3]);
                const width = Math.abs(rect[2] - rect[0]);
                const height = Math.abs(rect[3] - rect[1]);

                const canvasW = viewport.width || 1;
                const canvasH = viewport.height || 1;
                const pdfX = Math.round((left / canvasW) * 100);
                const pdfY = Math.round((top / canvasH) * 100);

                pageSections.push({
                  key: def.key,
                  title: def.title,
                  page: safePageNum,
                  pixelLeft: Math.round(left),
                  pixelTop: Math.round(top),
                  pixelWidth: Math.round(width),
                  pixelHeight: Math.round(height),
                  pdfX,
                  pdfY
                });
                break;
              }
            }
          });

          setDetectedSections(pageSections);
        } catch (textErr) {
          console.warn('Could not extract text content for highlights:', textErr);
        }

        setPdfLoading(false);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('PDF rendering failed in StudentFeedbackView:', err);
        setPdfLoading(false);
        setPdfError(true);
      }
    };

    loadPdfDoc();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [activeStudent?.id, activePdfFile, activeResumePage, zoomLevel, reloadNonce, activeResumeVersion, studentMobileTab]);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student profile not found.</div>;
  }

  const volunteerSubtopics = (Array.isArray(activeStudent.volunteerSubtopics) && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : [];

  const resolvedCount = volunteerSubtopics.filter(s => studentResolvedItems[s.id]).length;
  const totalSubtopics = volunteerSubtopics.length;
  const isCompleted = activeStudent.status === 'approved';
  const allFeedbackFixed = totalSubtopics === 0 || resolvedCount >= totalSubtopics || isCompleted;

  const formatSubtopicTitle = (title?: string) => {
    if (!title) return 'Resume Note';
    if (/^Page\s*\d+\s*Note$/i.test(title.trim())) return 'Resume Note';
    return title;
  };

  const cleanFeedbackText = (text?: string) => {
    if (!text) return '';
    return text.replace(/\[Annotation Pin:[^\]]*\]/gi, '').trim();
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current = null;
      }
    };
  }, []);

  const handlePlayVoice = (id: string, audioNote?: any, fallbackText?: string) => {
    // If clicking the currently active track: toggle pause / resume
    if (playingAudioId === id) {
      if (!isAudioPaused) {
        // Pause playback
        if (currentAudioElementRef.current) {
          currentAudioElementRef.current.pause();
        }
        setIsAudioPaused(true);
      } else {
        // Resume playback
        if (currentAudioElementRef.current) {
          currentAudioElementRef.current.play().catch(e => {
            console.warn('Playback resume error:', e);
            setIsAudioPaused(false);
            setPlayingAudioId(null);
          });
        }
        setIsAudioPaused(false);
      }
      return;
    }

    // Stop any currently playing audio
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }

    // Identify real voice note source (persisted in student record or cached for student)
    let audioUrl = audioNote?.audioUrl || audioNote?.url || audioNote?.audioSrc || audioNote?.src || audioNote?.blobUrl;
    if (!audioUrl && activeStudent?.id) {
      try {
        const cached = localStorage.getItem(`student_audio_note_${activeStudent.id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          audioUrl = parsed?.audioUrl;
        }
      } catch (_) {}
    }

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        currentAudioElementRef.current = audio;

        audio.onended = () => {
          setPlayingAudioId(null);
          setIsAudioPaused(false);
          currentAudioElementRef.current = null;
        };
        audio.onerror = () => {
          console.warn('Audio playback error for:', audioUrl);
          setPlayingAudioId(null);
          setIsAudioPaused(false);
          currentAudioElementRef.current = null;
          alert('Could not play voice recording. The format may not be supported by your browser.');
        };

        // Play real microphone audio - only enter playing state after audio starts
        audio.play().then(() => {
          setPlayingAudioId(id);
          setIsAudioPaused(false);
        }).catch(err => {
          console.warn('Audio play failed:', err);
          setPlayingAudioId(null);
          setIsAudioPaused(false);
          currentAudioElementRef.current = null;
          alert('Audio playback could not be started.');
        });
      } catch (err) {
        console.warn('Failed to initialize Audio:', err);
        setPlayingAudioId(null);
        setIsAudioPaused(false);
      }
    } else {
      // Audio source missing: never substitute synthetic speech or browser text-to-speech
      console.warn('Voice note source missing for item:', id);
      setPlayingAudioId(null);
      setIsAudioPaused(false);
      alert('No voice recording is available for this feedback.');
    }
  };

  useEffect(() => {
    return () => {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToResumeSection = (sectionKey?: string) => {
    if (sectionKey) {
      setActiveSpotlightSection(sectionKey);
    }
    setStudentMobileTab('resume');
    if (activeResumeVersion === 'old') {
      setActiveResumeVersion('new');
    }
    if (sectionKey) {
      setTimeout(() => {
        const el = document.getElementById(`resume-annotation-${sectionKey}`) || 
                   document.getElementById(`resume-section-highlight-${sectionKey}`) || 
                   document.getElementById(`revision-note-${sectionKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  };

  const handleCompleteReview = () => {
    if (!allFeedbackFixed) return;
    completeStudentReview(activeStudent.id);
    setShowSubmitSuccessModal(true);
  };

  const rubricScores = activeStudent.rubricScores;
  const hasRubric = !!rubricScores;
  const rubricAvg = hasRubric
    ? Math.round(((rubricScores.atsFormat + rubricScores.metricsImpact + rubricScores.techDepth + rubricScores.grammarClarity) / 20) * 100)
    : null;

  return (
    <div className="student-view-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Student Portal Navigation Bar with Team Everest Branding */}
      <nav className="student-top-navbar" style={{ flexShrink: 0 }}>
        <div className="student-top-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/images/team-everest-logo.png" 
            alt="Team Everest Logo" 
            className="portal-brand-logo" 
          />
          <div className="portal-brand-titles">
            <span className="portal-brand-name">Team Everest</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="portal-brand-portal">Resume Review Portal</span>
              <span className="student-portal-tag">STUDENT PORTAL</span>
            </div>
          </div>
        </div>

        <div className="student-nav-actions">
          <button 
            className="student-home-btn"
            onClick={() => {
              setActiveRole('volunteer');
              setCurrentView('login');
            }}
            title="Return to main Landing / Login page"
          >
            <Home size={15} />
            <span>Home</span>
          </button>
          <button 
            className="student-logout-btn"
            onClick={logoutStudent}
            title="Log out from student portal"
          >
            <LogoutIcon size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      {/* Greeting & Meta Bar */}
      <header className="student-header-banner" style={{ padding: '12px 24px', flexShrink: 0 }}>
        <div className="student-info-meta">
          <img src={activeStudent.avatar} alt={activeStudent.name} className="student-view-avatar" style={{ width: '40px', height: '40px' }} />
          <div>
            <h1 className="student-greeting-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '18px', margin: 0 }}>
              <span>Hello, {activeStudent.name}</span>
              <Hand size={18} color="#F59E0B" />
            </h1>
            <span className="student-degree-sub" style={{ fontSize: '12px' }}>{activeStudent.degree} • {activeStudent.institution}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {activeStudent.status === 'approved' && (
            <span className="status-pill approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleIcon size={14} />
              <span>Completed</span>
            </span>
          )}

          {activeStudent.status === 'changes_required' && (
            <span className="status-pill changes_required" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <WarningTriangleIcon size={14} />
              <span>Changes Requested by {volunteer.name}</span>
            </span>
          )}

          {activeStudent.status === 'in_review' && (
            <span className="status-pill in_review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ClockIcon size={14} />
              <span>In Review by {volunteer.name}</span>
            </span>
          )}

          {activeStudent.status === 'pending' && (
            <span className="status-pill in_review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ClockIcon size={14} />
              <span>Pending Volunteer Review</span>
            </span>
          )}
        </div>
      </header>

      {/* Mobile Tab Toggle for Student View */}
      <div className="mobile-workspace-tabs-bar student-mobile-tabs-bar">
        <div className="mobile-tabs-pill-container">
          <button 
            type="button" 
            className={`mobile-tab-btn ${studentMobileTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => setStudentMobileTab('mistakes')}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ClipboardList size={14} />
            <span>Feedback & Fixes ({totalSubtopics})</span>
          </button>
          <button 
            type="button" 
            className={`mobile-tab-btn ${studentMobileTab === 'resume' ? 'active' : ''}`}
            onClick={() => setStudentMobileTab('resume')}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <FileText size={14} />
            <span>Annotated Resume</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Body Layout */}
      <div className="student-body-layout" data-student-tab={studentMobileTab} style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left Column: Volunteer Review & Mistakes Checklist */}
        <div className="student-feedback-left-col">
          {/* Volunteer Reviewer Card */}
          <div className="volunteer-reviewer-card">
            <div className="reviewer-card-header">
              <div className="reviewer-profile-wrap">
                <img src={volunteer.avatar} alt={volunteer.name} className="reviewer-avatar-img" />
                <div>
                  <div className="reviewer-name">Reviewed by {volunteer.name}</div>
                  <div className="reviewer-role">{volunteer.role} • {volunteer.organization}</div>
                </div>
              </div>

              {/* Rating Control with Adjacent View in Resume Button */}
              <div className="reviewer-rating-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div className="reviewer-rating-pill">
                  <span>Rating:</span>
                  <StarRating rating={activeStudent.rating || 4} size={14} />
                </div>
                <button 
                  type="button"
                  className="btn-spotlight-resume"
                  onClick={() => scrollToResumeSection()}
                  title="Open and view resume"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Search size={13} />
                  <span>View in Resume</span>
                </button>
              </div>
            </div>

            {/* Improve Areas Tags */}
            {activeStudent.improveTags && activeStudent.improveTags.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                  Areas to Improve:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {activeStudent.improveTags.map(tag => (
                    <span key={tag} className="improve-chip selected" style={{ fontSize: '11px', padding: '3px 10px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer General Note */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                Mentor's General Feedback:
              </span>
              <div className="volunteer-notes-quote">
                "{activeStudent.generalFeedback || 'Great foundation. Review the highlighted action items on your resume.'}"
              </div>
            </div>

            {/* Mentor Voice Audio Memo if present */}
            {activeStudent.audioNote?.recorded && (() => {
              const isOverallPlaying = playingAudioId === 'overall' && !isAudioPaused;
              const isOverallPaused = playingAudioId === 'overall' && isAudioPaused;
              return (
                <div className="student-voice-memo-card">
                  <div className="voice-memo-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>
                      <Mic size={14} color="#0F172A" />
                      <span>Mentor Voice Memo ({activeStudent.audioNote.duration})</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {activeStudent.audioNote.timestamp || 'Recorded during review'}
                    </span>
                  </div>
                  <div className="student-voice-player-row">
                    <button 
                      type="button" 
                      className={`btn-play-voice ${isOverallPlaying ? 'is-playing' : ''}`}
                      onClick={() => handlePlayVoice('overall', activeStudent.audioNote, activeStudent.generalFeedback)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      {isOverallPlaying ? (
                        <>
                          <Pause size={12} />
                          <span>Pause Feedback</span>
                        </>
                      ) : isOverallPaused ? (
                        <>
                          <Play size={12} />
                          <span>Resume Feedback</span>
                        </>
                      ) : (
                        <>
                          <Play size={12} />
                          <span>Play Voice Feedback</span>
                        </>
                      )}
                    </button>
                    <div className="voice-waveform-mini">
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                      <span className={`wave-bar ${isOverallPlaying ? 'anim' : ''}`} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                      {isOverallPlaying ? 'Playing...' : isOverallPaused ? `Paused (${activeStudent.audioNote.duration})` : activeStudent.audioNote.duration}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* 4-Criteria Evaluation Rubric Scorecard if present */}
            {hasRubric && rubricScores && (
              <div className="student-rubric-summary-box">
                <div className="rubric-summary-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>
                    <BarChart3 size={15} />
                    <span>Evaluation Rubric Scorecard</span>
                  </span>
                  <span className="rubric-overall-badge">
                    {rubricAvg}% Overall Quality
                  </span>
                </div>
                <div className="rubric-compact-grid">
                  <div className="rubric-compact-card">
                    <span className="criterion-name">ATS & Layout</span>
                    <span className="criterion-val">{rubricScores.atsFormat} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.atsFormat / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Metrics & Impact</span>
                    <span className="criterion-val">{rubricScores.metricsImpact} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.metricsImpact / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Technical Depth</span>
                    <span className="criterion-val">{rubricScores.techDepth} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.techDepth / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Clarity & Verbs</span>
                    <span className="criterion-val">{rubricScores.grammarClarity} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.grammarClarity / 5) * 100}%` }} /></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actionable Feedback & Improvements Section */}
          <div className="action-items-section-header">
            <h2 className="action-items-title">
              <CommentIcon size={18} /> Feedback & Improvements from Volunteer
            </h2>
            <span className="action-progress-pill">
              {resolvedCount} of {totalSubtopics} fixed
            </span>
          </div>

          {/* Feedback Cards List */}
          <div className="student-mistakes-list">
            {volunteerSubtopics.length === 0 ? (
              <div className="white-card" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                No feedback or improvement suggestions listed by the volunteer yet.
              </div>
            ) : (
              volunteerSubtopics.map(item => {
                const isResolved = !!studentResolvedItems[item.id];
                const isSpotlighted = activeSpotlightSection === item.sectionKey;
                const cat = item.category || 'suggestion';
                const isSubPlaying = playingAudioId === item.id && !isAudioPaused;
                const isSubPaused = playingAudioId === item.id && isAudioPaused;

                return (
                  <div 
                    key={item.id} 
                    id={`student-mistake-card-${item.id}`}
                    className={`student-mistake-card ${(isResolved || isCompleted) ? 'is-resolved' : ''}`}
                    style={isSpotlighted ? { borderColor: '#EAB308', boxShadow: '0 0 0 3px rgba(250, 204, 21, 0.4)' } : {}}
                  >
                    <div className="student-mistake-top-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="subtopic-card-title" style={{ fontSize: '14px' }}>
                          {formatSubtopicTitle(item.title)}
                        </span>
                        <span className={`subtopic-badge badge-${cat}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {cat === 'must_fix' ? <><AlertCircle size={11} /> Must Fix</> : cat === 'praise' ? <><Award size={11} /> Praise</> : cat === 'question' ? <><HelpCircle size={11} /> Question</> : <><Lightbulb size={11} /> Suggestion</>}
                        </span>
                      </div>

                      <button 
                        className="btn-spotlight-resume"
                        onClick={() => scrollToResumeSection(item.sectionKey)}
                        title="Scroll to see this section in your resume"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Search size={12} />
                        <span>View in Resume</span>
                      </button>
                    </div>

                    {/* Volunteer Command Box */}
                    <div className="volunteer-command-quote-box">
                      <span className="volunteer-command-label">Volunteer's Correction / Instruction:</span>
                      <p className="volunteer-command-body">
                        {cleanFeedbackText(item.command) || "Please review and enhance this section based on best resume formatting standards."}
                      </p>
                    </div>

                    {/* Before / After Rewrite Diff if provided by volunteer */}
                    {item.suggestedRewrite && (
                      <div className="diff-box-group" style={{ margin: '8px 0 12px 0' }}>
                        <div className="diff-box before" style={{ padding: '6px 10px', fontSize: '12px' }}>
                          <span className="diff-label">Original Text:</span>
                          <s>{item.suggestedRewrite.before}</s>
                        </div>
                        <div className="diff-box after" style={{ padding: '6px 10px', fontSize: '12px' }}>
                          <span className="diff-label">Suggested Replacement by Mentor:</span>
                          <strong>{item.suggestedRewrite.after}</strong>
                        </div>
                      </div>
                    )}

                    {/* Subtopic Audio Voice Feedback Player */}
                    {item.audioNote?.recorded && (
                      <div className="student-subtopic-voice-memo">
                        <div className="subtopic-voice-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '12px', color: '#166534' }}>
                            <Mic size={12} />
                            <span>Volunteer Voice Note on this section ({item.audioNote.duration})</span>
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            {item.audioNote.timestamp || 'Recorded by mentor'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            type="button"
                            className={`btn-play-voice ${isSubPlaying ? 'is-playing' : ''}`}
                            onClick={() => handlePlayVoice(item.id, item.audioNote, item.command)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {isSubPlaying ? (
                              <>
                                <Pause size={12} />
                                <span>Pause Note</span>
                              </>
                            ) : isSubPaused ? (
                              <>
                                <Play size={12} />
                                <span>Resume Note</span>
                              </>
                            ) : (
                              <>
                                <Play size={12} />
                                <span>Play Voice Note</span>
                              </>
                            )}
                          </button>
                          <div className="voice-waveform-mini">
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                            <span className={`wave-bar ${isSubPlaying ? 'anim' : ''}`} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                            {isSubPlaying ? 'Playing...' : isSubPaused ? `Paused (${item.audioNote.duration})` : item.audioNote.duration}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Student Action: Mark as Resolved */}
                    <div className="student-resolve-action-row">
                      <label 
                        className={`resolve-checkbox-label ${(isResolved || isCompleted) ? 'checked' : ''} ${isCompleted ? 'readonly' : ''}`}
                        style={isCompleted ? { cursor: 'default', opacity: 0.95 } : {}}
                      >
                        <input 
                          type="checkbox" 
                          checked={isResolved || isCompleted}
                          disabled={isCompleted}
                          onChange={isCompleted ? undefined : () => toggleResolveItem(item.id)}
                        />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isCompleted ? (
                            <>
                              <span>Fixed & Verified</span>
                              <Check size={13} color="#059669" />
                            </>
                          ) : isResolved ? (
                            <>
                              <span>Marked as Fixed</span>
                              <Check size={13} color="#059669" />
                            </>
                          ) : (
                            <span>I have made this change in my resume</span>
                          )}
                        </span>
                      </label>

                      {(isResolved || isCompleted) && (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>Resolved</span>
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Completion Action Card */}
          <div className="white-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '14px', border: isCompleted ? '1px solid #BBF7D0' : '1px solid #E2E8F0', background: isCompleted ? '#F0FDF4' : '#FFFFFF', marginTop: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: isCompleted ? '#166534' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isCompleted && <CheckCircleIcon size={16} />}
                <span>{isCompleted ? 'Review & Revisions Completed!' : 'Ready to submit revised resume?'}</span>
              </div>
              <div style={{ fontSize: '12px', color: isCompleted ? '#15803D' : 'var(--text-secondary)', marginTop: '2px' }}>
                {isCompleted
                  ? `All corrections have been submitted and verified. ${activeStudent.completedDate ? `Completed on ${activeStudent.completedDate}.` : ''}`
                  : 'Submit your checklist corrections for final volunteer approval.'}
              </div>
            </div>

            {isCompleted ? (
              <span className="status-pill approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontWeight: 700 }}>
                <CheckCircleIcon size={16} />
                <span>Completed</span>
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={handleCompleteReview}
                  disabled={!allFeedbackFixed}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    opacity: allFeedbackFixed ? 1 : 0.45,
                    cursor: allFeedbackFixed ? 'pointer' : 'not-allowed',
                    filter: allFeedbackFixed ? 'none' : 'grayscale(0.5)'
                  }}
                  title={allFeedbackFixed ? "Submit your revisions" : "Complete all feedback items before submitting"}
                >
                  <Send size={14} />
                  <span>Submit Revisions</span>
                </button>
                {!allFeedbackFixed && (
                  <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                    Complete all feedback items before submitting.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Student's Own Resume Document */}
        <div className="student-resume-right-col">
          {/* Document Header Bar with Version Switcher Toggle */}
          <div className="student-resume-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pdf-icon-badge"><PdfIcon size={16} /></span>
              <span style={{ fontWeight: '700', fontSize: '13px' }}>
                {activeStudent.name.replace(/\s+/g, '_')}_{activeResumeVersion === 'old' ? 'Original_v1' : 'Revised_v2'}_Resume.pdf
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Version Switcher */}
              <div className="resume-version-toggle-group">
                <button
                  type="button"
                  className={`version-toggle-btn ${activeResumeVersion === 'old' ? 'active-old' : ''}`}
                  onClick={() => handleVersionChange('old')}
                  title="Switch to view original uploaded resume (v1)"
                >
                  <FileText size={12} />
                  <span>Original (v1)</span>
                </button>
                <button
                  type="button"
                  className={`version-toggle-btn ${activeResumeVersion === 'new' ? 'active-new' : ''}`}
                  onClick={() => handleVersionChange('new')}
                  title="Switch to view revised & optimized resume (v2)"
                >
                  <Sparkles size={12} />
                  <span>Revised (v2)</span>
                </button>
              </div>

              {/* Page Navigator */}
              <div className="page-navigator">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                  aria-label="Previous Page"
                >
                  &lt;
                </button>
                <span className="page-indicator-text">{activeResumePage} / {pdfTotalPages || (activeStudent.totalPages || 1)}</span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= (pdfTotalPages || (activeStudent.totalPages || 1))}
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button className="zoom-btn" onClick={() => setZoom(Math.max(70, zoomLevel - 10))} aria-label="Zoom Out">-</button>
                <span className="zoom-indicator-text">{zoomLevel}%</span>
                <button className="zoom-btn" onClick={() => setZoom(Math.min(140, zoomLevel + 10))} aria-label="Zoom In">+</button>
              </div>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (activePdfFile) {
                    const downloadUrl = activePdfFile.startsWith('/') && !activePdfFile.startsWith('/api')
                      ? activePdfFile
                      : getResumeDownloadUrl(activePdfFile, activeStudent.name);
                    window.open(downloadUrl, '_blank');
                  }
                }}
                title={`Download ${activeResumeVersion === 'old' ? 'Original (v1)' : 'Revised (v2)'} Resume`}
              >
                <DownloadIcon size={15} />
              </button>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => setZoom(100)}
                title="Reset Zoom"
              >
                <MaximizeIcon size={15} />
              </button>

              <button 
                type="button" 
                className="mobile-back-to-feedback-btn mobile-resume-close-btn"
                onClick={() => setStudentMobileTab('mistakes')}
                title="Close resume view and return to feedback"
              >
                <X size={14} />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Document Canvas: Actual PDF Document with Volunteer Feedback Highlights in Revised View */}
          <div 
            ref={viewerContainerRef}
            className="resume-scroll-canvas student-resume-scroll-canvas" 
            style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              overflow: 'auto', 
              padding: '24px', 
              position: 'relative',
              background: '#F1F5F9'
            }}
          >
            {!activePdfFile ? (
              <div style={{
                margin: 'auto',
                padding: '48px 24px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                textAlign: 'center',
                color: '#64748B',
                maxWidth: '380px',
                width: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📄</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Resume Not Uploaded</h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  No resume file was uploaded for {activeStudent.name}.
                </p>
              </div>
            ) : pdfError ? (
              <div style={{
                margin: 'auto',
                padding: '40px 24px',
                background: '#1E293B',
                borderRadius: '12px',
                border: '1px solid #EF4444',
                textAlign: 'center',
                color: '#94A3B8',
                maxWidth: '400px',
                width: '100%'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>⚠️</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F87171', marginBottom: '6px' }}>Failed to Load Resume PDF</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
                  Could not load the resume preview. Please retry or download the file.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setPdfError(false); setPdfLoading(true); setReloadNonce(n => n + 1); }}
                  >
                    <RefreshCw size={13} style={{ marginRight: '5px' }} /> Retry
                  </button>
                  <a 
                    href={activePdfFile.startsWith('/') && !activePdfFile.startsWith('/api')
                      ? activePdfFile
                      : getResumeDownloadUrl(activePdfFile, activeStudent.name)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#F8FAFC', borderColor: '#475569' }}
                  >
                    <DownloadIcon size={13} style={{ marginRight: '5px' }} /> Download
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '16px', 
                width: '100%', 
                maxWidth: '850px',
                position: 'relative' 
              }}>
                {/* Revised Mode Indicator Banner */}
                {activeResumeVersion === 'new' && (
                  <div style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid #86EFAC',
                    borderLeft: '5px solid #22C55E',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#15803D'
                      }}>
                        <Sparkles size={17} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534' }}>
                          Revised Resume (v2) • Reviewer Feedback Applied
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          Displaying {activeStudent.name}'s uploaded resume with mentor revision notes & suggestions
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#DCFCE7',
                        color: '#15803D',
                        border: '1px solid #BBF7D0',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px'
                      }}>
                        {resolvedCount} of {totalSubtopics} items addressed
                      </span>
                    </div>
                  </div>
                )}

                {/* PDF Loading Spinner */}
                {pdfLoading && (
                  <div style={{
                    position: 'absolute',
                    top: activeResumeVersion === 'new' ? '70px' : 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 20,
                    borderRadius: '8px',
                    gap: '12px',
                    minHeight: '400px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      border: '3px solid #E2E8F0',
                      borderTopColor: '#0284C7',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>
                      Loading {activeStudent.name}'s uploaded resume PDF...
                    </span>
                  </div>
                )}

                {/* Actual PDF Page Canvas with Volunteer Feedback Highlights in Revised View */}
                <div
                  className="pdf-page-container"
                  style={{
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    userSelect: 'none'
                  }}
                >
                  <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px' }} />

                  {/* Highlights and Annotation Badges in Revised View (v2) */}
                  {activeResumeVersion === 'new' && volunteerSubtopics.map(sub => {
                    const pinMatch = sub.command?.match(/\[Annotation Pin:\s*Page\s*(\d+)\s*at\s*\((\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)\]/);
                    let pinPage = pinMatch ? parseInt(pinMatch[1], 10) : null;
                    let pinX = pinMatch ? parseFloat(pinMatch[2]) : null;
                    let pinY = pinMatch ? parseFloat(pinMatch[3]) : null;

                    const sec = detectedSections.find(s => 
                      s.key === sub.sectionKey || 
                      (sub.title && s.title.toLowerCase().includes(sub.title.toLowerCase())) ||
                      (sub.title && sub.title.toLowerCase().includes(s.key))
                    );

                    if (!pinMatch && sec && sec.page === activeResumePage) {
                      pinPage = activeResumePage;
                      pinX = sec.pdfX;
                      pinY = sec.pdfY;
                    }

                    if (pinPage !== activeResumePage && pinMatch) return null;
                    if (!pinMatch && !sec && activeResumePage !== 1) return null;

                    const isResolved = !!studentResolvedItems[sub.id];
                    const isSpotlighted = activeSpotlightSection === sub.sectionKey;
                    const cat = sub.category || 'suggestion';
                    const catColor = cat === 'must_fix' ? '#DC2626' : cat === 'praise' ? '#16A34A' : cat === 'question' ? '#2563EB' : '#D97706';
                    const catBg = cat === 'must_fix' ? '#FEF2F2' : cat === 'praise' ? '#F0FDF4' : cat === 'question' ? '#EFF6FF' : '#FFFBEB';

                    return (
                      <React.Fragment key={`sub-highlight-${sub.id}`}>
                        {/* Section Highlight Box (only when spotlighted or on desktop) */}
                        {sec && (!isMobileDevice || isSpotlighted) && (
                          <div
                            id={`resume-section-highlight-${sub.sectionKey}`}
                            style={{
                              position: 'absolute',
                              left: `${Math.max(4, sec.pixelLeft - 6)}px`,
                              top: `${Math.max(4, sec.pixelTop - 4)}px`,
                              width: `${Math.max(sec.pixelWidth + 80, 240)}px`,
                              height: `${Math.max(sec.pixelHeight + 8, 30)}px`,
                              border: isSpotlighted ? '2px solid #F59E0B' : '1.5px dashed rgba(234, 179, 8, 0.75)',
                              background: isSpotlighted ? 'rgba(254, 240, 138, 0.45)' : 'rgba(254, 240, 138, 0.22)',
                              borderRadius: '6px',
                              pointerEvents: 'none',
                              zIndex: 10,
                              transition: 'all 0.2s ease',
                              boxShadow: isSpotlighted ? '0 0 14px rgba(245, 158, 11, 0.4)' : 'none'
                            }}
                          />
                        )}

                        {/* Volunteer Feedback Pin / Marker Badge */}
                        <div
                          id={`resume-annotation-${sub.sectionKey}`}
                          className={`student-feedback-marker ${isSpotlighted ? 'is-spotlighted' : ''}`}
                          style={{
                            position: 'absolute',
                            left: pinX !== null ? `${pinX}%` : (sec ? `${sec.pdfX}%` : '10%'),
                            top: pinY !== null ? `${pinY}%` : (sec ? `${Math.max(2, sec.pdfY - 3)}%` : '12%'),
                            transform: isMobileDevice ? 'translate(-50%, -50%)' : 'translate(0, -50%)',
                            zIndex: 15,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isMobileDevice ? 'center' : 'flex-start',
                            gap: isMobileDevice ? 0 : '6px',
                            padding: isMobileDevice ? 0 : '3px 10px',
                            width: isMobileDevice ? '24px' : 'auto',
                            height: isMobileDevice ? '24px' : 'auto',
                            borderRadius: isMobileDevice ? '50%' : '14px',
                            background: isSpotlighted ? '#FEF3C7' : (isResolved ? '#F0FDF4' : catBg),
                            border: isSpotlighted ? '2px solid #F59E0B' : (isResolved ? '1.5px solid #22C55E' : `1.5px solid ${catColor}`),
                            boxShadow: isSpotlighted ? '0 4px 14px rgba(245, 158, 11, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isResolved ? '#15803D' : catColor,
                            cursor: 'pointer',
                            maxWidth: isMobileDevice ? '24px' : '260px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => {
                            setActiveSpotlightSection(sub.sectionKey);
                            const el = document.getElementById(`student-mistake-card-${sub.id}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          title={`${formatSubtopicTitle(sub.title)}: ${cleanFeedbackText(sub.command)} (Click to view)`}
                        >
                          <span>{isResolved ? '✓' : (cat === 'must_fix' ? '⚠️' : '💡')}</span>
                          {!isMobileDevice && (
                            <>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatSubtopicTitle(sub.title)}</span>
                              {isResolved && (
                                <span style={{ fontSize: '9.5px', background: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '8px' }}>
                                  Fixed
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Revisions Success Modal */}
      {showSubmitSuccessModal && (
        <div 
          className="submit-success-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            className="submit-success-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #FEF08A',
              padding: '36px 32px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              position: 'relative'
            }}
          >
            {/* Green Check Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
              marginBottom: '4px'
            }}>
              <Check size={36} color="#FFFFFF" strokeWidth={3} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Revisions Submitted!
            </h2>

            <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: 0, lineHeight: 1.5 }}>
              Thank you for completing your resume improvements.
            </p>

            <p style={{ fontSize: '14px', fontWeight: 700, color: '#166534', margin: 0, background: '#DCFCE7', padding: '8px 16px', borderRadius: '20px' }}>
              Keep learning and keep growing! 🌱
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', width: '100%' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowSubmitSuccessModal(false)}
                style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700, borderRadius: '10px' }}
              >
                Done
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowSubmitSuccessModal(false);
                  setActiveRole('volunteer');
                  setCurrentView('login');
                }}
                style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 600, borderRadius: '10px' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
