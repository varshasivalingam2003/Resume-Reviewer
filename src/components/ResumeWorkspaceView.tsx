import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  CommentIcon, CheckIcon, StarIcon, StarRating, GithubIcon
} from './Icons';
import { getResumeDownloadUrl, getResumeViewUrl } from '../services/zohoApi';
import { 
  Home,
  Save, 
  Check, 
  Edit3, 
  RefreshCw, 
  Mic, 
  X, 
  Play, 
  Pause, 
  AlertTriangle, 
  Lock,
  Download,
  ChevronDown
} from 'lucide-react';
import { 
  extractPrivacyMasksAndSections, 
  getRelevantCategories, 
  PrivacyMask, 
  DetectedPdfSection 
} from '../utils/privacyMasking';

// PDF Pin Annotation
interface AnnotationPin {
  id: string;
  subtopicId?: string;
  page: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label: string;
  category: 'suggestion' | 'must_fix' | 'praise' | 'question';
  comment: string;
}

export const ResumeWorkspaceView: React.FC = () => {
  const { 
    activeStudent,
    students,
    openStudentReview,
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
    saveAudioNote,
    quickHighlightFromCanvas,
    updateGeneralFeedback,
    updateCategoryFeedback,
    setRating,
    toggleImproveTag,
    openModal,
    activeRole,
    setActiveRole,
    setSelectedStudentForViewId,
    setIsStudentLoggedIn
  } = useApp();

  // PDF Loading & Rendering States
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(activeStudent?.totalPages || 1);
  const [privacyMasks, setPrivacyMasks] = useState<PrivacyMask[]>([]);
  const [detectedSections, setDetectedSections] = useState<DetectedPdfSection[]>([]);
  const [isScannedPdfFallback, setIsScannedPdfFallback] = useState(false);
  const [inlinePopoverSection, setInlinePopoverSection] = useState<DetectedPdfSection | null>(null);
  const [hoveredSectionKey, setHoveredSectionKey] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;

  // Canvas & PDF Task Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  // Pin & Annotation States (PDF Review Model)
  const [activePin, setActivePin] = useState<{ page: number; x: number; y: number } | null>(null);
  
  // Method 1: Subtopic Definition State
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [selectedSectionKey, setSelectedSectionKey] = useState('objective');
  const [newCommandText, setNewCommandText] = useState('');
  const [newCategory, setNewCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  const [isDefiningSubtopic, setIsDefiningSubtopic] = useState(false);

  // Voice Input Speech-to-Text State for Add Note Popup
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const noteBaseTextRef = useRef<string>('');
  const committedSpeechRef = useRef<string>('');
  const lastHandledIndexRef = useRef<number>(0);

  const toggleVoiceInput = () => {
    if (isVoiceListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.onresult = null;
          speechRecognitionRef.current.onerror = null;
          speechRecognitionRef.current.onend = null;
          speechRecognitionRef.current.stop();
        } catch (_) {}
        speechRecognitionRef.current = null;
      }
      setIsVoiceListening(false);
      return;
    }

    // Stop and clean up any previous instance before creating a new one
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.abort();
      } catch (_) {}
      speechRecognitionRef.current = null;
    }

    const SpeechRecognitionClass = 
      typeof window !== 'undefined' 
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
        : null;

    if (!SpeechRecognitionClass) {
      alert('Speech recognition is not supported in this browser. Please type your note.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Capture currently typed note before speech starts
      noteBaseTextRef.current = (newCommandText || '').trim();
      committedSpeechRef.current = '';
      lastHandledIndexRef.current = 0;

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = lastHandledIndexRef.current; i < event.results.length; i++) {
          const res = event.results[i];
          const chunk = (res[0]?.transcript || '').trim();
          if (res.isFinal) {
            if (chunk) {
              committedSpeechRef.current = committedSpeechRef.current
                ? `${committedSpeechRef.current} ${chunk}`
                : chunk;
            }
            lastHandledIndexRef.current = i + 1;
          } else {
            interim = interim ? `${interim} ${chunk}` : chunk;
          }
        }

        const base = noteBaseTextRef.current;
        const committed = committedSpeechRef.current;
        const finalDisplay = base
          ? (committed ? `${base} ${committed}` : base)
          : committed;
        const currentDisplay = interim
          ? (finalDisplay ? `${finalDisplay} ${interim}` : interim)
          : finalDisplay;

        setNewCommandText(currentDisplay);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e.error);
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
        // Ensure final committed text is persisted to state
        const base = noteBaseTextRef.current;
        const committed = committedSpeechRef.current;
        const finalDisplay = base
          ? (committed ? `${base} ${committed}` : base)
          : committed;
        if (finalDisplay) {
          setNewCommandText(finalDisplay);
        }
        speechRecognitionRef.current = null;
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsVoiceListening(false);
      speechRecognitionRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.onresult = null;
          speechRecognitionRef.current.onerror = null;
          speechRecognitionRef.current.onend = null;
          speechRecognitionRef.current.abort();
        } catch (_) {}
        speechRecognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isDefiningSubtopic && isVoiceListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.onresult = null;
          speechRecognitionRef.current.onerror = null;
          speechRecognitionRef.current.onend = null;
          speechRecognitionRef.current.stop();
        } catch (_) {}
        speechRecognitionRef.current = null;
      }
      setIsVoiceListening(false);
    }
  }, [isDefiningSubtopic, isVoiceListening]);

  // Voice Feedback Recorder & Transcription
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<string | null>(null);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [maxVoiceSeconds, setMaxVoiceSeconds] = useState<number>(300); // 5 mins

  const [feedbackSpokenLang, setFeedbackSpokenLang] = useState<string>('ta-IN');
  const [isTranslatingVoice, setIsTranslatingVoice] = useState(false);
  const [translatingTarget, setTranslatingTarget] = useState<string | null>(null);
  const [isWorkspaceAudioPlaying, setIsWorkspaceAudioPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const feedbackRecognitionRef = useRef<any>(null);
  const feedbackTranscriptRef = useRef<string>('');
  const feedbackBaseTextRef = useRef<string>('');
  const feedbackTargetRef = useRef<string>('general');
  const workspaceAudioRef = useRef<HTMLAudioElement | null>(null);

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
            handleToggleVoice(feedbackTargetRef.current || 'general');
            return maxVoiceSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVoiceRecording, maxVoiceSeconds]);

  useEffect(() => {
    return () => {
      if (workspaceAudioRef.current) {
        workspaceAudioRef.current.pause();
        workspaceAudioRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (feedbackRecognitionRef.current) {
        try { feedbackRecognitionRef.current.stop(); } catch (_) {}
        feedbackRecognitionRef.current = null;
      }
    };
  }, []);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to student subtopics and sections
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;
  const progressPercent = totalSubtopics > 0 ? Math.round((reviewedCount / totalSubtopics) * 100) : 0;

  // Student progress counter & index
  const currentStudentIndex = Math.max(0, (students || []).findIndex(s => s.id === activeStudent.id));
  const totalStudents = Math.max(1, (students || []).length);

  // Simplified Review Flow States
  const [decision, setDecision] = useState<'looks_good' | 'needs_changes' | null>(() => {
    if (activeStudent.status === 'approved') return 'looks_good';
    if (activeStudent.status === 'changes_required' || (activeStudent.improveTags && activeStudent.improveTags.length > 0)) return 'needs_changes';
    return null;
  });

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [isImprovementSectionOpen, setIsImprovementSectionOpen] = useState<boolean>(true);

  useEffect(() => {
    setIsImprovementSectionOpen(true);
  }, [activeStudent?.id]);

  useEffect(() => {
    if (activeStudent.status === 'approved') {
      setDecision('looks_good');
    } else if (activeStudent.status === 'changes_required' || (activeStudent.improveTags && activeStudent.improveTags.length > 0)) {
      setDecision('needs_changes');
    } else {
      setDecision(null);
    }
  }, [activeStudent.id, activeStudent.status]);

  const simplifiedImproveTags = useMemo(() => {
    return getRelevantCategories(activeStudent, detectedSections);
  }, [activeStudent?.id, activeStudent?.improveTags, activeStudent?.categoryFeedback, detectedSections, activeStudent?.resumeSections]);

  const quickFeedbackChips = [
    'Add more details',
    'Use clearer wording',
    'Add measurable results',
    'Mention tools used',
    'Explain your contribution',
    'Keep formatting consistent'
  ];

  const isImproveTagActive = (tag: string) => {
    const tags = activeStudent.improveTags || [];
    if (tags.includes(tag)) return true;
    if (tag === 'Career Objective' && tags.includes('Objective')) return true;
    if (tag === 'Objective' && tags.includes('Career Objective')) return true;
    return false;
  };

  const handleToggleImproveTag = (tag: string) => {
    toggleImproveTag(tag);
    const sectionKeyMap: Record<string, string> = {
      'Career Objective': 'objective',
      'Objective': 'objective',
      'Education': 'education',
      'Skills': 'skills',
      'Projects': 'projects',
      'Experience': 'experience'
    };
    if (sectionKeyMap[tag]) {
      setActiveHighlightSection(sectionKeyMap[tag]);
    }
  };

  const handleAppendQuickFeedback = (snippet: string) => {
    const current = activeStudent.generalFeedback || '';
    if (!current.trim()) {
      updateGeneralFeedback(snippet);
    } else if (!current.includes(snippet)) {
      updateGeneralFeedback(`${current}\n• ${snippet}`);
    }
  };

  const translateToEnglish = async (text: string, sourceLang: string): Promise<string> => {
    const trimmed = text.trim();
    if (!trimmed) return '';

    // If source language is English, preserve English without unnecessary rewriting
    if (sourceLang.startsWith('en') && /^[\x00-\x7F\s.,!?'"()-]+$/.test(trimmed)) {
      return trimmed;
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0].map((item: any) => item[0] || '').join('').trim();
          if (translated) return translated;
        }
      }
    } catch (err) {
      console.warn('Translation request warning:', err);
    }

    // Never save an invented or placeholder translation: return accurate transcript
    return trimmed;
  };

  const handleToggleVoice = async (target: string = 'general') => {
    if (isVoiceRecording) {
      const currentTarget = feedbackTargetRef.current || 'general';
      // STOP RECORDING
      setIsVoiceRecording(false);
      setRecordingTarget(null);
      const totalSecs = Math.max(voiceSeconds, 1);
      const duration = formatVoiceTime(totalSecs);

      // Stop SpeechRecognition
      if (feedbackRecognitionRef.current) {
        try {
          feedbackRecognitionRef.current.stop();
        } catch (_) {}
      }

      // Stop MediaRecorder and persist real recorded audio as base64 Data URL
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
          const blob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current?.mimeType || 'audio/webm'
          });
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioDataUrl = reader.result as string;
            saveAudioNote({
              recorded: true,
              duration,
              timestamp: 'Just now',
              audioUrl: audioDataUrl
            });
            try {
              localStorage.setItem(`student_audio_note_${activeStudent.id}`, JSON.stringify({
                recorded: true,
                duration,
                timestamp: 'Just now',
                audioUrl: audioDataUrl
              }));
            } catch (_) {}
          };
          reader.readAsDataURL(blob);
        };
        try {
          mediaRecorderRef.current.stop();
        } catch (_) {}
      } else if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }

      // Translate speech transcript to English and insert into the targeted category or general note textarea
      const rawSpoken = feedbackTranscriptRef.current.trim();
      if (rawSpoken) {
        setIsTranslatingVoice(true);
        setTranslatingTarget(currentTarget);
        translateToEnglish(rawSpoken, feedbackSpokenLang).then(englishText => {
          setIsTranslatingVoice(false);
          setTranslatingTarget(null);
          const textToInsert = englishText || rawSpoken;
          if (textToInsert) {
            const base = (feedbackBaseTextRef.current || '').trim();
            const updated = base ? `${base}\n\n${textToInsert}` : textToInsert;
            if (currentTarget === 'general') {
              updateGeneralFeedback(updated);
            } else {
              updateCategoryFeedback(currentTarget, updated);
            }
          }
        }).catch(() => {
          setIsTranslatingVoice(false);
          setTranslatingTarget(null);
          const base = (feedbackBaseTextRef.current || '').trim();
          const updated = base ? `${base}\n\n${rawSpoken}` : rawSpoken;
          if (currentTarget === 'general') {
            updateGeneralFeedback(updated);
          } else {
            updateCategoryFeedback(currentTarget, updated);
          }
        });
      }
      return;
    }

    // START RECORDING
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      alert('Microphone recording is not supported in this browser.');
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Microphone permission denied or not available:', err);
      alert('Microphone access is required to record voice feedback. Please check permissions.');
      return;
    }

    // Initialize MediaRecorder for real microphone audio recording
    try {
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
          else mimeType = '';
        }
      }
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start(250);
    } catch (err) {
      console.warn('MediaRecorder initialization warning:', err);
    }

    // Initialize SpeechRecognition for speech transcription & translation
    feedbackTargetRef.current = target;
    feedbackTranscriptRef.current = '';
    feedbackBaseTextRef.current = target === 'general'
      ? (activeStudent.generalFeedback || '')
      : (activeStudent.categoryFeedback?.[target] || '');

    const SpeechRecognitionClass = 
      typeof window !== 'undefined'
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
        : null;

    if (SpeechRecognitionClass) {
      try {
        const rec = new SpeechRecognitionClass();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = feedbackSpokenLang;
        rec.onresult = (e: any) => {
          let full = '';
          for (let i = 0; i < e.results.length; i++) {
            full += e.results[i][0]?.transcript || '';
          }
          feedbackTranscriptRef.current = full.trim();
        };
        rec.onerror = (e: any) => console.warn('SpeechRecognition feedback warning:', e);
        rec.start();
        feedbackRecognitionRef.current = rec;
      } catch (err) {
        console.warn('Speech recognition warning:', err);
      }
    }

    setVoiceSeconds(0);
    setIsVoiceRecording(true);
    setRecordingTarget(target);
  };

  const handleToggleWorkspaceAudioPlayback = () => {
    let audioUrl = activeStudent.audioNote?.audioUrl;
    if (!audioUrl && activeStudent?.id) {
      try {
        const cached = localStorage.getItem(`student_audio_note_${activeStudent.id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          audioUrl = parsed?.audioUrl;
        }
      } catch (_) {}
    }

    if (!audioUrl) {
      alert(`Voice note duration: ${activeStudent.audioNote?.duration || 'Saved'}. No recorded audio stream available.`);
      return;
    }

    if (isWorkspaceAudioPlaying && workspaceAudioRef.current) {
      workspaceAudioRef.current.pause();
      setIsWorkspaceAudioPlaying(false);
      return;
    }

    if (workspaceAudioRef.current) {
      workspaceAudioRef.current.pause();
      workspaceAudioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    workspaceAudioRef.current = audio;
    audio.onended = () => {
      setIsWorkspaceAudioPlaying(false);
      workspaceAudioRef.current = null;
    };
    audio.onerror = () => {
      setIsWorkspaceAudioPlaying(false);
      workspaceAudioRef.current = null;
      alert('Unable to play recording in this browser.');
    };
    audio.play().then(() => {
      setIsWorkspaceAudioPlaying(true);
    }).catch(err => {
      console.warn('Playback error:', err);
      setIsWorkspaceAudioPlaying(false);
      workspaceAudioRef.current = null;
    });
  };

  const standardSections: { key: string; title: string }[] = [
    { key: 'objective', title: 'Career Objective' },
    { key: 'education', title: 'Education & Academics' },
    { key: 'skills', title: 'Technical Skills' },
    { key: 'projects', title: 'Projects & Work' },
    { key: 'experience', title: 'Experience & Internships' },
    { key: 'certifications', title: 'Certifications & Awards' },
    { key: `page_${activeResumePage}`, title: `Current Page (${activeResumePage})` }
  ];

  const improveTagOptions = [
    'Grammar', 'Formatting', 'Skills', 'Objective', 'Projects', 'Education'
  ];

  // Resolve Real Uploaded Resume PDF URL from backend proxy
  const resumePdfUrl = activeStudent.resumeAttachment 
    ? (activeStudent.resumeAttachment.startsWith('/') && !activeStudent.resumeAttachment.startsWith('/api')
        ? activeStudent.resumeAttachment
        : getResumeViewUrl(activeStudent.resumeAttachment, activeStudent.name))
    : '';

  // ---------------------------------------------------------------------------
  // PDF.JS DOCUMENT & CANVAS RENDERING WITH REAL-TIME PRIVACY MASKING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    if (!activeStudent.resumeAttachment) {
      setPdfLoading(false);
      setPdfError(false);
      return;
    }

    setPdfLoading(true);
    setPdfError(false);
    setPrivacyMasks([]);

    const loadPdfDoc = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) {
          throw new Error('PDF viewer library is still initializing.');
        }

        // Load PDF through existing secure backend proxy
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

        // Base scale calculated for clear readability on Desktop and Mobile
        const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;
        const baseScale = isMobileDevice ? 0.85 : 1.35;
        const currentScale = baseScale * (zoomLevel / 100);
        const viewport = page.getViewport({ scale: currentScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel previous rendering task if running
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

        // -----------------------------------------------------------------------
        // PDF TEXT EXTRACTION, SECTION DETECTION & PRIVACY MASKING
        // -----------------------------------------------------------------------
        const extraction = await extractPrivacyMasksAndSections(page, viewport, activeStudent, safePageNum);
        if (isCancelled) return;

        setDetectedSections(extraction.detectedSections);
        setPrivacyMasks(extraction.privacyMasks);
        setIsScannedPdfFallback(extraction.isScannedPdf);
        setPdfLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('[Resume PDF Viewer] Error loading PDF:', err);
          setPdfLoading(false);
          setPdfError(true);
        }
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
  }, [activeStudent.id, activeStudent.resumeAttachment, activeResumePage, zoomLevel, reloadNonce]);

  // Click on PDF Canvas to Drop Pin Annotation (PDF Review Model)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const clampedX = Math.max(2, Math.min(96, x));
    const clampedY = Math.max(2, Math.min(96, y));

    setActivePin({ page: activeResumePage, x: clampedX, y: clampedY });
    setIsDefiningSubtopic(true);
    setNewSubtopicTitle(`Page ${activeResumePage} Note`);
    setSelectedSectionKey(`page_${activeResumePage}`);
  };

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim()) return;

    let finalCommand = newCommandText.trim();
    if (activePin) {
      finalCommand = `${finalCommand ? finalCommand + '\n' : ''}[Annotation Pin: Page ${activePin.page} at (${activePin.x}%, ${activePin.y}%)]`;
    }

    addVolunteerSubtopic(newSubtopicTitle, selectedSectionKey || 'custom', finalCommand, newCategory);
    setNewSubtopicTitle('');
    setSelectedSectionKey('objective');
    setNewCommandText('');
    setNewCategory('suggestion');
    setIsDefiningSubtopic(false);
    setActivePin(null);
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

  // ---------------------------------------------------------------------------
  // SIMPLIFIED VOLUNTEER REVIEW FLOW (SHARED DESKTOP & MOBILE)
  // ---------------------------------------------------------------------------
  const renderSimplifiedReviewContent = (isMobile = false) => (
    <div className="simplified-review-container">
      {/* 1. Header with Student Name, Student X of Y, Progress (Desktop only; Mobile uses sheet header) */}
      {!isMobile ? (
        <div className="simplified-review-header">
          <div className="simplified-title-row">
            <h3 className="simplified-review-title">
              Review {activeStudent.name}'s Resume
            </h3>
            <span className="simplified-student-counter">
              Student {currentStudentIndex + 1} of {totalStudents}
            </span>
          </div>

          <div className="simplified-progress-meta">
            <span>Review Progress</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              {reviewedCount} / {totalSubtopics} reviewed
            </span>
          </div>
          <div className="review-progress-bar">
            <div className="review-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '4px' }}>
          <div className="simplified-progress-meta" style={{ marginBottom: '6px' }}>
            <span>Review Progress</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              {reviewedCount} / {totalSubtopics} reviewed
            </span>
          </div>
          <div className="review-progress-bar">
            <div className="review-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      {/* 2. "How is this resume?" Decision Options */}
      <div className="review-question-card">
        <label className="review-question-label">How is this resume?</label>
        <div className="review-decision-grid">
          <button
            type="button"
            className={`review-decision-btn btn-looks-good ${decision === 'looks_good' ? 'active' : ''}`}
            onClick={() => {
              setDecision('looks_good');
              if (isMobile) setIsMobileSheetOpen(true);
            }}
          >
            <Check size={18} />
            <span>✓ Looks Good</span>
          </button>

          <button
            type="button"
            className={`review-decision-btn btn-needs-changes ${decision === 'needs_changes' ? 'active' : ''}`}
            onClick={() => {
              setDecision('needs_changes');
              if (isMobile) setIsMobileSheetOpen(true);
            }}
          >
            <Edit3 size={16} />
            <span>✎ Needs Changes</span>
          </button>
        </div>
      </div>

      {/* 3. If Looks Good Selected */}
      {decision === 'looks_good' && (
        <>
          <div className="looks-good-banner">
            <div className="looks-good-banner-icon">
              <Check size={18} />
            </div>
            <div className="looks-good-banner-text">
              Resume meets guidelines! Ready to confirm and approve candidate.
            </div>
          </div>

          {/* Additional Note (Optional) */}
          <div className="additional-note-card">
            <div className="additional-note-top">
              <label className="additional-note-label">Additional Note (Optional)</label>
              <button
                type="button"
                className={`speak-feedback-btn ${recordingTarget === 'general' ? 'recording' : ''}`}
                onClick={() => handleToggleVoice('general')}
                title={recordingTarget === 'general' ? "Click to stop recording and translate" : "Record audio feedback note & translate to English"}
              >
                <Mic size={12} />
                <span>
                  {recordingTarget === 'general' 
                    ? `Stop (${formatVoiceTime(voiceSeconds)})` 
                    : translatingTarget === 'general' 
                    ? 'Translating...' 
                    : '🎤 Speak Feedback'}
                </span>
              </button>
            </div>
            <textarea
              className="additional-note-textarea"
              placeholder="Optional commendation or words of encouragement for student..."
              value={activeStudent.generalFeedback || ''}
              onChange={(e) => updateGeneralFeedback(e.target.value)}
              rows={3}
            />
            {activeStudent.audioNote?.recorded && (
              <div className="voice-memo-saved-pill">
                <span>🎙️ Voice memo saved ({activeStudent.audioNote.duration})</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', fontSize: '11px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleToggleWorkspaceAudioPlayback}
                >
                  {isWorkspaceAudioPlaying ? <><Pause size={10} /> Pause</> : <><Play size={10} /> Play</>}
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA for Looks Good */}
          <div className="review-primary-actions">
            <button
              type="button"
              className="primary-review-cta btn-approve"
              onClick={() => {
                if (isMobile) setIsMobileSheetOpen(false);
                openModal('approve');
              }}
            >
              <Check size={18} />
              <span>Approve Resume</span>
            </button>
            <button
              type="button"
              className="secondary-draft-cta"
              onClick={() => alert('Review draft saved successfully!')}
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>
          </div>
        </>
      )}

      {/* 4. If Needs Changes Selected */}
      {decision === 'needs_changes' && (
        <>
          {/* What needs improvement? */}
          <div className="improvement-selection-card">
            <div 
              className="improvement-label-row"
              onClick={() => setIsImprovementSectionOpen(prev => !prev)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              aria-expanded={isImprovementSectionOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsImprovementSectionOpen(prev => !prev);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="improvement-label">What needs improvement?</span>
                <ChevronDown 
                  size={15} 
                  style={{ 
                    transform: isImprovementSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.2s ease', 
                    color: '#64748B' 
                  }} 
                />
              </div>
              <span className="improvement-count-hint">
                {(activeStudent.improveTags || []).length} selected
              </span>
            </div>

            {isImprovementSectionOpen && (
              <>
                <div className="improvement-chips-flex">
                  {simplifiedImproveTags.map(tag => {
                    const isSelected = isImproveTagActive(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`improvement-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => handleToggleImproveTag(tag)}
                      >
                        {isSelected ? `✓ ${tag}` : tag}
                      </button>
                    );
                  })}
                </div>

                {/* Category-Specific Feedback Textareas */}
                {(activeStudent.improveTags || []).length > 0 && (
                  <div className="category-feedback-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {(activeStudent.improveTags || []).map(tag => {
                      const currentText = activeStudent.categoryFeedback?.[tag] || '';
                      const isThisCategoryRecording = recordingTarget === tag;
                      const isThisCategoryTranslating = translatingTarget === tag;
                      return (
                        <div key={tag} className="category-feedback-card" style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '8px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#EAB308' }} />
                              {tag} Feedback
                            </label>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>
                                {currentText.trim() ? `${currentText.length} chars` : 'Specific advice'}
                              </span>
                              <button
                                type="button"
                                className={`speak-feedback-btn ${isThisCategoryRecording ? 'recording' : ''}`}
                                onClick={() => handleToggleVoice(tag)}
                                title={isThisCategoryRecording ? "Click to stop recording and translate" : `Record audio feedback for ${tag} & translate to English`}
                                style={{ padding: '3px 8px', fontSize: '11px' }}
                              >
                                <Mic size={11} />
                                <span>
                                  {isThisCategoryRecording 
                                    ? `Stop (${formatVoiceTime(voiceSeconds)})` 
                                    : isThisCategoryTranslating 
                                    ? 'Translating...' 
                                    : '🎤 Speak Feedback'}
                                </span>
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="additional-note-textarea category-feedback-textarea"
                            placeholder={`Enter specific feedback or suggestions for ${tag}...`}
                            value={currentText}
                            onChange={(e) => updateCategoryFeedback(tag, e.target.value)}
                            rows={2}
                            style={{ minHeight: '60px', width: '100%', boxSizing: 'border-box' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Feedback Suggestions */}
          <div className="quick-feedback-card">
            <div className="quick-feedback-header">
              <span className="quick-feedback-title">⚡ Quick Feedback</span>
              <span className="quick-feedback-tip">Tap to add into note</span>
            </div>
            <div className="quick-feedback-chips-wrap">
              {quickFeedbackChips.map(snippet => (
                <button
                  key={snippet}
                  type="button"
                  className="quick-feedback-chip"
                  onClick={() => handleAppendQuickFeedback(snippet)}
                >
                  + {snippet}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Note (Optional) & Voice */}
          <div className="additional-note-card">
            <div className="additional-note-top">
              <label className="additional-note-label">Additional Note (Optional)</label>
              <button
                type="button"
                className={`speak-feedback-btn ${recordingTarget === 'general' ? 'recording' : ''}`}
                onClick={() => handleToggleVoice('general')}
                title={recordingTarget === 'general' ? "Click to stop recording and translate" : "Record audio feedback note & translate to English"}
              >
                <Mic size={12} />
                <span>
                  {recordingTarget === 'general' 
                    ? `Stop (${formatVoiceTime(voiceSeconds)})` 
                    : translatingTarget === 'general' 
                    ? 'Translating...' 
                    : '🎤 Speak Feedback'}
                </span>
              </button>
            </div>
            <textarea
              className="additional-note-textarea"
              placeholder="Add specific actionable advice or note for the candidate..."
              value={activeStudent.generalFeedback || ''}
              onChange={(e) => updateGeneralFeedback(e.target.value)}
              rows={3}
            />
            {activeStudent.audioNote?.recorded && (
              <div className="voice-memo-saved-pill">
                <span>🎙️ Voice memo saved ({activeStudent.audioNote.duration})</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', fontSize: '11px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleToggleWorkspaceAudioPlayback}
                >
                  {isWorkspaceAudioPlaying ? <><Pause size={10} /> Pause</> : <><Play size={10} /> Play</>}
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA for Needs Changes */}
          <div className="review-primary-actions">
            <button
              type="button"
              className="primary-review-cta btn-changes"
              onClick={() => {
                if (isMobile) setIsMobileSheetOpen(false);
                openModal('changes');
              }}
            >
              <AlertTriangle size={18} />
              <span>Needs Changes ({(activeStudent.improveTags || []).length})</span>
            </button>
            <button
              type="button"
              className="secondary-draft-cta"
              onClick={() => alert('Review draft saved successfully!')}
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>
          </div>
        </>
      )}

      {/* 5. Initial State (No decision yet) */}
      {decision === null && (
        <div style={{ 
          padding: '16px 18px', 
          background: '#FEF9C3', 
          borderRadius: '10px', 
          border: '1.5px solid #FACC15', 
          textAlign: 'center' 
        }}>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#713F12', fontWeight: 700, lineHeight: 1.5 }}>
            Please select <strong>Looks Good</strong> or <strong>Needs Changes</strong> above to continue reviewing this resume.
          </p>
        </div>
      )}


    </div>
  );

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

          <button 
            className="workspace-home-btn" 
            onClick={() => setCurrentView('dashboard')}
            title="Return to Volunteer Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Home size={14} />
            <span>Home</span>
          </button>
          
          <div className="workspace-student-title-box">
            {students && students.length > 1 ? (
              <select 
                className="workspace-student-select"
                value={activeStudent.id}
                onChange={(e) => openStudentReview(e.target.value)}
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
                title="Switch candidate"
              >
                {students.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="workspace-student-name">{activeStudent.name}</span>
            )}
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>
        </div>

        <div className="workspace-top-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => alert('Review comments, audit notes, audio memo, and rubric saved successfully!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>
        </div>
      </header>

      {/* Dual Pane Layout (Left: Real Uploaded Resume PDF, Right: Review Tools Panel) */}
      <div className="workspace-dual-pane" data-mobile-tab={mobileTab}>
        {/* Left Pane: Real Uploaded PDF Resume Viewer with Privacy Redaction */}
        <section className="resume-viewer-pane" style={{ flex: 1.25, display: 'flex', flexDirection: 'column', background: '#0F172A' }}>
          {/* Document Header Toolbar */}
          <div className="resume-toolbar" style={{ background: '#1E293B', color: '#F8FAFC', borderBottom: '1px solid #334155' }}>
            <div className="resume-file-info" style={{ color: '#F8FAFC' }}>
              <span className="pdf-icon-badge" style={{ color: '#EF4444' }}><PdfIcon size={18} /></span>
              <span className="resume-filename" style={{ color: '#F8FAFC' }}>
                {activeStudent.name.replace(/\s+/g, '_')}_Resume.pdf
              </span>
              {activeRole === 'volunteer' && (
                <span className="privacy-protected-pill" style={{ 
                  fontSize: '11px', 
                  background: isScannedPdfFallback ? '#B45309' : '#047857', 
                  color: isScannedPdfFallback ? '#FEF3C7' : '#ECFDF5', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  marginLeft: '6px'
                }}>
                  {isScannedPdfFallback ? (
                    <>
                      <AlertTriangle size={10} /> Scanned PDF (Limited Masking)
                    </>
                  ) : (
                    <>
                      <Lock size={10} /> Privacy Protected
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="resume-view-controls">
              {/* Page Navigator */}
              <div className="page-navigator" style={{ color: '#F8FAFC' }}>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                  aria-label="Previous Page"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  &lt;
                </button>
                <span className="page-indicator-text" style={{ color: '#F8FAFC' }}>
                  {activeResumePage} / {pdfTotalPages}
                </span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= pdfTotalPages}
                  aria-label="Next Page"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button 
                  className="zoom-btn" 
                  onClick={() => setZoom(Math.max(60, zoomLevel - 10))} 
                  aria-label="Zoom Out"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  -
                </button>
                <span className="zoom-indicator-text" style={{ color: '#F8FAFC' }}>{zoomLevel}%</span>
                <button 
                  className="zoom-btn" 
                  onClick={() => setZoom(Math.min(160, zoomLevel + 10))} 
                  aria-label="Zoom In"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  +
                </button>
              </div>

              <div className="toolbar-divider" style={{ background: '#475569' }} />

              {/* Download Original Resume */}
              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (activeRole === 'volunteer') {
                    alert('Direct unmasked download is restricted during volunteer review to protect candidate privacy.');
                    return;
                  }
                  if (activeStudent.resumeAttachment) {
                    window.open(getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name), '_blank');
                  } else {
                    alert(`Resume file not attached for ${activeStudent.name}.`);
                  }
                }}
                title={activeRole === 'volunteer' ? 'Direct download restricted (Privacy Protected)' : 'Download Original Resume PDF'}
                style={{ color: '#CBD5E1' }}
              >
                <DownloadIcon size={16} />
              </button>

              {/* Open in New Tab */}
              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (activeRole === 'volunteer') {
                    alert('Direct unmasked alternate view is restricted during volunteer review to protect candidate privacy.');
                    return;
                  }
                  if (resumePdfUrl) {
                    window.open(resumePdfUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                title={activeRole === 'volunteer' ? 'Alternate view restricted (Privacy Protected)' : 'Open Resume in New Tab'}
                style={{ color: '#CBD5E1' }}
              >
                <MaximizeIcon size={16} />
              </button>
            </div>
          </div>

          {/* Real PDF Scroll Canvas */}
          <div 
            className="resume-scroll-canvas" 
            style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              overflow: 'auto', 
              padding: '24px', 
              position: 'relative',
              background: '#0F172A'
            }}
          >
            {!activeStudent.resumeAttachment ? (
              <div style={{
                margin: 'auto',
                padding: '40px',
                background: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #334155',
                textAlign: 'center',
                color: '#94A3B8',
                maxWidth: '380px'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📄</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>Resume Not Uploaded</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                  No resume file was uploaded in Zoho Creator for {activeStudent.name}.
                </p>
              </div>
            ) : pdfError ? (
              <div style={{
                margin: 'auto',
                padding: '40px',
                background: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #EF4444',
                textAlign: 'center',
                color: '#94A3B8',
                maxWidth: '400px'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>⚠️</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F87171', marginBottom: '6px' }}>Failed to Load Resume PDF</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
                  Could not load the resume preview from the backend proxy. Please retry or open the original file.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setPdfError(false); setPdfLoading(true); setReloadNonce(n => n + 1); }}
                  >
                    <RefreshCw size={13} style={{ marginRight: '5px' }} /> Retry
                  </button>
                  <a 
                    href={getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#F8FAFC', borderColor: '#475569' }}
                  >
                    <Download size={13} style={{ marginRight: '5px' }} /> Download
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {pdfLoading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 20,
                    borderRadius: '4px',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      border: '3px solid #334155',
                      borderTopColor: '#38BDF8',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                      Loading {activeStudent.name}'s uploaded resume PDF...
                    </span>
                  </div>
                )}

                {/* PDF Paper Container with Privacy Masking Overlay & Interactive Canvas */}
                <div
                  ref={canvasContainerRef}
                  className="pdf-page-container"
                  onClick={handleCanvasClick}
                  title="Click anywhere on the resume to drop an annotation pin"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    cursor: 'crosshair',
                    userSelect: 'none',
                    lineHeight: 0
                  }}
                >
                  <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px', maxWidth: '100%', height: 'auto' }} />



                  {/* Privacy Redaction Layer: White Frosted Blur, No Black Boxes, No Text */}
                  {activeRole === 'volunteer' && privacyMasks.map(mask => (
                    <div
                      key={mask.id}
                      className="privacy-mask-frosted"
                      title="Personal contact detail is protected in volunteer review."
                      style={{
                        position: 'absolute',
                        left: `${mask.leftPercent}%`,
                        top: `${mask.topPercent}%`,
                        width: `${mask.widthPercent}%`,
                        height: `${mask.heightPercent}%`,
                        background: 'rgba(255, 255, 255, 0.88)',
                        backdropFilter: 'blur(9px)',
                        WebkitBackdropFilter: 'blur(9px)',
                        borderRadius: mask.type === 'photo' ? '8px' : '4px',
                        border: '1px solid rgba(226, 232, 240, 0.7)',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}
                    />
                  ))}

                  {/* Inline Review Action: [✎ Add Note] directly on the PDF Viewer revealed on section hover */}
                  {detectedSections.map(sec => {
                    const isHovered = hoveredSectionKey === sec.key;
                    const sectionNotes = volunteerSubtopics.filter(sub => 
                      sub.sectionKey === sec.key || sub.title.toLowerCase().includes(sec.title.toLowerCase())
                    );

                    return (
                      <div
                        key={sec.id}
                        className="pdf-section-hover-zone"
                        onMouseEnter={() => setHoveredSectionKey(sec.key)}
                        onMouseLeave={() => setHoveredSectionKey(null)}
                        style={{
                          position: 'absolute',
                          left: `${Math.max(0, sec.pixelLeft - 6)}px`,
                          top: `${Math.max(0, sec.pixelTop - 4)}px`,
                          width: `${Math.max(sec.pixelWidth + 140, 240)}px`,
                          height: `${Math.max(sec.pixelHeight + 8, 28)}px`,
                          pointerEvents: 'auto',
                          zIndex: 14
                        }}
                      >
                        {isHovered && (
                          <div
                            className="pdf-inline-section-action"
                            style={{
                              position: 'absolute',
                              left: `${sec.pixelRight - sec.pixelLeft + 12}px`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              zIndex: 16,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="btn-pdf-add-note"
                              onClick={() => {
                                setSelectedSectionKey(sec.key);
                                setNewSubtopicTitle(sec.title);
                                setActivePin({ page: activeResumePage, x: sec.pdfX, y: sec.pdfY });
                                setInlinePopoverSection(sec);
                                setIsDefiningSubtopic(true);
                              }}
                              title={`Add review note directly to ${sec.title}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#FFFFFF',
                                color: '#0F172A',
                                border: '1.5px solid #CBD5E1',
                                borderRadius: '6px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.12)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span style={{ color: '#D97706' }}>✎</span>
                              <span>Add Note</span>
                            </button>

                            {sectionNotes.length > 0 && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  background: '#FEF3C7',
                                  color: '#B45309',
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  border: '1px solid #FDE68A'
                                }}
                              >
                                {sectionNotes.length} note{sectionNotes.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Active Dropped Pin Marker */}
                  {activePin && activePin.page === activeResumePage && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${activePin.x}%`,
                        top: `${activePin.y}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 15,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        background: '#F59E0B',
                        color: '#0F172A',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        📍 New Note
                      </div>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '6px solid #F59E0B'
                      }} />
                    </div>
                  )}

                  {/* Inline Popover / Comment Box directly on PDF viewer */}
                  {isDefiningSubtopic && (
                    <div
                      className="pdf-inline-popover-overlay"
                      style={{
                        position: isMobileDevice ? 'fixed' : 'absolute',
                        inset: isMobileDevice ? 0 : undefined,
                        background: isMobileDevice ? 'rgba(15, 23, 42, 0.55)' : undefined,
                        left: isMobileDevice ? 0 : `${Math.min(Math.max(12, (inlinePopoverSection?.pixelLeft || 30)), (canvasRef.current?.width || 600) - 340)}px`,
                        top: isMobileDevice ? undefined : `${(inlinePopoverSection?.pixelTop || 100) + 32}px`,
                        bottom: isMobileDevice ? 0 : undefined,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: isMobileDevice ? 'flex-end' : 'flex-start',
                        justifyContent: isMobileDevice ? 'center' : 'flex-start'
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget && isMobileDevice) {
                          setIsDefiningSubtopic(false);
                          setInlinePopoverSection(null);
                          setActivePin(null);
                        }
                      }}
                    >
                      <div
                        className="pdf-inline-popover-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: isMobileDevice ? '100%' : '330px',
                          maxWidth: isMobileDevice ? '100%' : '350px',
                          background: '#FFFFFF',
                          borderRadius: isMobileDevice ? '16px 16px 0 0' : '10px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                          border: '1px solid #E2E8F0',
                          padding: '14px 16px',
                          animation: 'fadeIn 0.2s ease-out'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                              {newSubtopicTitle || 'Section Note'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                              (Page {activeResumePage})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#94A3B8' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Category Pills: Suggestion, Must Fix, Praise, Question */}
                        <div className="category-pill-group" style={{ marginBottom: '10px' }}>
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

                        {/* Voice Input & Label Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Feedback Note:</span>
                          <button
                            type="button"
                            onClick={toggleVoiceInput}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '5px',
                              border: isVoiceListening ? '1px solid #EF4444' : '1px solid #CBD5E1',
                              background: isVoiceListening ? '#FEF2F2' : '#F8FAFC',
                              color: isVoiceListening ? '#DC2626' : '#334155',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            title={isVoiceListening ? "Listening... click to stop" : "Voice input: click and speak"}
                          >
                            <Mic size={12} color={isVoiceListening ? '#DC2626' : '#64748B'} />
                            <span>{isVoiceListening ? 'Listening...' : 'Voice Input'}</span>
                          </button>
                        </div>

                        {/* Comment text area */}
                        <textarea
                          className="feedback-textarea"
                          style={{
                            width: '100%',
                            minHeight: '75px',
                            fontSize: '12.5px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            marginBottom: '10px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Write note/feedback for this section..."
                          value={newCommandText}
                          onChange={(e) => setNewCommandText(e.target.value)}
                          autoFocus
                        />

                        {/* Action buttons: Cancel and Save */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              if (!newCommandText.trim() && !newSubtopicTitle.trim()) return;
                              const title = newSubtopicTitle.trim() || 'Section Note';
                              let finalCommand = newCommandText.trim();
                              if (activePin) {
                                finalCommand = `${finalCommand ? finalCommand + '\n' : ''}[Annotation Pin: Page ${activePin.page} at (${activePin.x}%, ${activePin.y}%)]`;
                              }
                              addVolunteerSubtopic(title, selectedSectionKey || 'custom', finalCommand, newCategory);
                              setNewCommandText('');
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render saved subtopic notes on the active PDF page */}
                  {volunteerSubtopics.map(sub => {
                    const pinMatch = sub.command?.match(/\[Annotation Pin:\s*Page\s*(\d+)\s*at\s*\((\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)\]/);
                    let pinPage = pinMatch ? parseInt(pinMatch[1], 10) : null;
                    let pinX = pinMatch ? parseFloat(pinMatch[2]) : null;
                    let pinY = pinMatch ? parseFloat(pinMatch[3]) : null;

                    if (!pinMatch) {
                      const sec = detectedSections.find(s => s.key === sub.sectionKey || sub.title.toLowerCase().includes(s.title.toLowerCase()));
                      if (sec && sec.page === activeResumePage) {
                        pinPage = activeResumePage;
                        pinX = sec.pdfX;
                        pinY = sec.pdfY;
                      }
                    }

                    if (pinPage !== activeResumePage || pinX === null || pinY === null) return null;

                    const cat = sub.category || 'suggestion';
                    const isLightbulb = !sub.category || sub.category === 'suggestion';
                    if (isLightbulb) return null;

                    const catColor = cat === 'must_fix' ? '#DC2626' : cat === 'praise' ? '#16A34A' : cat === 'question' ? '#2563EB' : '#D97706';
                    const catBg = cat === 'must_fix' ? '#FEF2F2' : cat === 'praise' ? '#F0FDF4' : cat === 'question' ? '#EFF6FF' : '#FFFBEB';

                    return (
                      <div
                        key={`pdf-sub-${sub.id}`}
                        className="pdf-saved-note-badge"
                        style={{
                          position: 'absolute',
                          left: `${pinX}%`,
                          top: `${pinY}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 15,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: catBg,
                          border: `1.5px solid ${catColor}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`[${sub.title}] (${cat.toUpperCase()}):\n\n${sub.command || 'No comment'}`);
                        }}
                        title={`${sub.title}: ${sub.command || ''} (Click to view)`}
                      >
                        <span>{cat === 'must_fix' ? '⚠️' : cat === 'praise' ? '🌟' : cat === 'question' ? '❓' : '💡'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Simplified Review & Feedback Panel (Desktop) */}
        <aside className="review-feedback-pane" style={{ flex: 1, minWidth: '380px', maxWidth: '480px', borderLeft: '1px solid var(--border-color)', alignSelf: 'flex-start', height: 'auto', maxHeight: '100%' }}>
          {renderSimplifiedReviewContent(false)}
        </aside>
      </div>

      {/* Mobile Sticky Bottom Review Action Bar */}
      <div className="mobile-sticky-review-bar">
        <button
          type="button"
          className={`mobile-sticky-btn looks-good ${decision === 'looks_good' ? 'active' : ''}`}
          onClick={() => {
            setDecision('looks_good');
            setIsMobileSheetOpen(true);
          }}
        >
          <Check size={16} />
          <span>✓ Looks Good</span>
        </button>
        <button
          type="button"
          className={`mobile-sticky-btn needs-changes ${decision === 'needs_changes' ? 'active' : ''}`}
          onClick={() => {
            setDecision('needs_changes');
            setIsMobileSheetOpen(true);
          }}
        >
          <Edit3 size={15} />
          <span>✎ Needs Changes {(activeStudent.improveTags || []).length ? `(${(activeStudent.improveTags || []).length})` : ''}</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileSheetOpen && (
        <div className="mobile-sheet-overlay" onClick={() => setIsMobileSheetOpen(false)}>
          <div className="mobile-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-drag-handle" onClick={() => setIsMobileSheetOpen(false)}>
              <div className="mobile-sheet-drag-bar" />
            </div>
            <div className="mobile-sheet-header">
              <div>
                <h3 className="mobile-sheet-title">Review {activeStudent.name}'s Resume</h3>
                <span className="mobile-sheet-sub">Student {currentStudentIndex + 1} of {totalStudents}</span>
              </div>
              <button
                type="button"
                className="mobile-sheet-close-btn"
                onClick={() => setIsMobileSheetOpen(false)}
                title="Close review panel and view resume"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mobile-sheet-content">
              {renderSimplifiedReviewContent(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
