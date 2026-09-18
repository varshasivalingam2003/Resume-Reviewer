import React, { useState, useEffect, useRef } from 'react';
import { Student, ResumeSection } from '../data/studentsData';
import { StarIcon } from './Icons';
import { 
  X, 
  Edit3, 
  Check, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Lightbulb, 
  AlertCircle, 
  Award
} from 'lucide-react';

export interface InlineReviewBoxProps {
  sectionKey: string;
  sectionTitle: string;
  onClose: () => void;
  activeStudent: Student;
  resumeSections: ResumeSection[];
  onSaveSubtopic: (subtopic: {
    sectionKey: string;
    title: string;
    command: string;
    category: 'suggestion' | 'must_fix' | 'praise' | 'question';
    suggestedRewrite?: { before: string; after: string };
    audioNote?: { recorded: boolean; duration: string; timestamp: string; transcript?: string };
  }) => void;
  onSaveOverall: (data: {
    generalFeedback: string;
    rating: number;
    rubricScores: {
      atsFormat: number;
      metricsImpact: number;
      techDepth: number;
      grammarClarity: number;
    };
    audioNote?: { recorded: boolean; duration: string; timestamp: string; transcript?: string };
    improveTags: string[];
  }) => void;
}

export const InlineReviewBox: React.FC<InlineReviewBoxProps> = ({
  sectionKey,
  sectionTitle,
  onClose,
  activeStudent,
  resumeSections,
  onSaveSubtopic,
  onSaveOverall
}) => {
  const isOverall = sectionKey === 'overall';

  // Note state
  const [noteText, setNoteText] = useState<string>('');
  const [category, setCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  // Scoring state (shown prominently in overall mode or expandable in section mode)
  const [showScoring, setShowScoring] = useState(isOverall);
  const [starRating, setStarRating] = useState<number>(activeStudent.rating || 4);
  const [rubricScores, setRubricScores] = useState({
    atsFormat: activeStudent.rubricScores?.atsFormat || 4,
    metricsImpact: activeStudent.rubricScores?.metricsImpact || 4,
    techDepth: activeStudent.rubricScores?.techDepth || 4,
    grammarClarity: activeStudent.rubricScores?.grammarClarity || 4
  });
  const [improveTags, setImproveTags] = useState<string[]>(activeStudent.improveTags || []);

  // Voice recording & Live in-box speech transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<{ recorded: boolean; duration: string; timestamp: string; transcript?: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Web Speech API reference
  const speechRecognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const boxContainerRef = useRef<HTMLDivElement>(null);

  // Load existing data for this section
  useEffect(() => {
    if (isOverall) {
      setNoteText(activeStudent.generalFeedback || '');
      setStarRating(activeStudent.rating || 4);
      setImproveTags(activeStudent.improveTags || []);
      setRecordedAudio(activeStudent.audioNote?.recorded ? activeStudent.audioNote : null);
      setShowScoring(true);
    } else {
      const existingSub = (activeStudent.volunteerSubtopics || []).find(
        s => s.sectionKey === sectionKey || s.id === sectionKey || (s.title && s.title.toLowerCase().includes(sectionTitle.toLowerCase()))
      );
      if (existingSub) {
        setNoteText(existingSub.command || '');
        setCategory(existingSub.category || 'suggestion');
        setRecordedAudio(existingSub.audioNote?.recorded ? existingSub.audioNote : null);
      } else {
        setNoteText('');
        setCategory('suggestion');
        setRecordedAudio(null);
      }
      setShowScoring(false);
    }

    // Smooth scroll into view when opened so reviewer sees the box immediately
    if (boxContainerRef.current) {
      boxContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [sectionKey, sectionTitle, activeStudent, isOverall]);

  // Voice recording & Live Speech-to-Text Transcription in Box
  const handleStartRecording = () => {
    setIsRecording(true);
    setIsTranscribing(true);
    setVoiceSeconds(0);
    setSpeechTranscript('');

    timerIntervalRef.current = setInterval(() => {
      setVoiceSeconds(prev => prev + 1);
    }, 1000);

    // Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          const cleaned = currentTranscript.trim();
          setSpeechTranscript(cleaned);
          // Transcribe directly in the note box in real-time!
          setNoteText(prev => {
            const base = prev.replace(/\s*\[Voice Note\]:.*$/s, '').trim();
            return base ? `${base}\n\n[Voice Note]: ${cleaned}` : `[Voice Note]: ${cleaned}`;
          });
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition warning:', err);
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      } catch (err) {
        console.warn('Web Speech API not accessible, using in-box transcription fallback.', err);
      }
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }

    const durationSeconds = Math.max(voiceSeconds, 4);
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    let finalTranscript = speechTranscript.trim();

    // If noteText is empty or very short, auto-transcribe simulated speech tailored to the active section
    if (!finalTranscript && (!noteText.trim() || noteText.trim().length < 15)) {
      const targetTitle = isOverall ? 'the overall resume' : (sectionTitle || 'this section');
      
      finalTranscript = category === 'must_fix'
        ? `In ${targetTitle}, quantify your accomplishments with measurable metrics and ensure standard formatting.`
        : category === 'praise'
        ? `Strong demonstration of skills in ${targetTitle}. Clear and well-structured.`
        : `Consider adding specific tool names and active action verbs to strengthen ${targetTitle}.`;

      setNoteText(prev => prev.trim() ? `${prev.trim()} ${finalTranscript}` : finalTranscript);
    } else if (finalTranscript) {
      setNoteText(prev => prev.trim() ? `${prev.trim()} ${finalTranscript}` : finalTranscript);
    }

    const newAudio = {
      recorded: true,
      duration: formattedDuration,
      timestamp: 'Just now',
      transcript: finalTranscript || (noteText.trim() ? noteText.trim() : undefined)
    };
    setRecordedAudio(newAudio);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const improveTagOptions = [
    'ATS Formatting',
    'Action Verbs',
    'Metric Numbers',
    'Skills Depth',
    'Grammar & Proofread'
  ];

  const handleToggleTag = (tag: string) => {
    setImproveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Commit changes to AppContext
  const handleSave = () => {
    // Save overall feedback/scoring
    onSaveOverall({
      generalFeedback: isOverall ? noteText : activeStudent.generalFeedback,
      rating: starRating,
      rubricScores,
      audioNote: isOverall && recordedAudio?.recorded ? recordedAudio : activeStudent.audioNote,
      improveTags
    });

    // Save specific section note
    if (!isOverall) {
      onSaveSubtopic({
        sectionKey,
        title: sectionTitle,
        command: noteText,
        category,
        audioNote: recordedAudio?.recorded ? recordedAudio : undefined
      });
    }

    onClose();
  };

  return (
    <div 
      ref={boxContainerRef}
      className="clean-inline-card"
      onClick={e => e.stopPropagation()}
    >
      {/* 1. Sleek Compact Header: Title + Single Close Icon */}
      <div className="clean-inline-header">
        <div className="clean-inline-title-wrap">
          <div className="clean-inline-icon">
            <Edit3 size={14} />
          </div>
          <div>
            <div className="clean-inline-title">
              Review: <span>{sectionTitle}</span>
            </div>
            <div className="clean-inline-subtitle">
              {isOverall ? 'Rate candidate and add overall summary' : 'Leave guidance or voice feedback for this section'}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="clean-inline-close-btn"
          onClick={onClose}
          title="Cancel and close review"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="clean-inline-body">
        {/* 2. Category Selector: Clean, Colorful Pills (Hidden in purely overall mode if not needed) */}
        {!isOverall && (
          <div className="clean-category-row">
            <span className="clean-field-label">Type:</span>
            <div className="clean-pills-group">
              <button
                type="button"
                className={`clean-cat-pill pill-suggestion ${category === 'suggestion' ? 'selected' : ''}`}
                onClick={() => setCategory('suggestion')}
              >
                <Lightbulb size={12} />
                <span>Suggestion</span>
              </button>
              <button
                type="button"
                className={`clean-cat-pill pill-mustfix ${category === 'must_fix' ? 'selected' : ''}`}
                onClick={() => setCategory('must_fix')}
              >
                <AlertCircle size={12} />
                <span>Must Fix</span>
              </button>
              <button
                type="button"
                className={`clean-cat-pill pill-praise ${category === 'praise' ? 'selected' : ''}`}
                onClick={() => setCategory('praise')}
              >
                <Award size={12} />
                <span>Praise</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Text Area with Integrated Voice Recording Toolbar */}
        <div className="clean-input-box">
          <textarea
            className="clean-textarea"
            rows={3}
            placeholder={
              isOverall
                ? "Write overall mentor advice, or click the mic to record voice..."
                : `Add your comments for ${sectionTitle}, or click the mic to record voice...`
            }
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          {/* Integrated Action Strip inside the input box */}
          <div className="clean-textarea-toolbar">
            {/* Voice Dictate Button */}
            {!isRecording ? (
              <button
                type="button"
                className="clean-voice-btn"
                onClick={handleStartRecording}
                title="Click to dictate speech directly into this note"
              >
                <Mic size={13} />
                <span>{recordedAudio ? 'Re-record Voice' : 'Voice Dictate'}</span>
                {recordedAudio?.recorded && (
                  <span className="clean-voice-duration">({recordedAudio.duration})</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="clean-voice-btn recording"
                onClick={handleStopRecording}
                title="Stop recording and insert transcript"
              >
                <Square size={11} fill="currentColor" />
                <span>Stop ({formatTime(voiceSeconds)})</span>
                <span className="clean-pulse-dot" />
              </button>
            )}

            {/* Audio Preview if already recorded */}
            {recordedAudio?.recorded && !isRecording && (
              <button
                type="button"
                className="clean-preview-btn"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              >
                {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlayingAudio ? 'Pause' : 'Play Note'}</span>
              </button>
            )}

            {/* Live transcribing indicator */}
            {isTranscribing && (
              <span className="clean-transcribe-hint">
                Listening & transcribing...
              </span>
            )}
          </div>
        </div>

        {/* Optional Candidate Rating Toggle */}
        <div className="clean-expandable-row">
          <button
            type="button"
            className="clean-link-btn"
            onClick={() => setShowScoring(!showScoring)}
          >
            <StarIcon size={13} filled={showScoring} />
            <span>{showScoring ? 'Hide Rating' : '+ Rate Candidate'}</span>
          </button>
        </div>

        {/* Candidate Rating Card */}
        {showScoring && (
          <div className="clean-scoring-card">
            {/* Star Rating */}
            <div className="clean-rating-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>
                  Candidate Overall Rating:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="clean-star-btn"
                      title={`Rate ${star} Stars`}
                    >
                      <StarIcon size={20} filled={star <= starRating} />
                    </button>
                  ))}
                </div>
              </div>
              <span className="clean-rating-val">{starRating} of 5 Stars</span>
            </div>

            {/* Improvement Tags */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
                Areas to Improve:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {improveTagOptions.map(tag => {
                  const isSelected = improveTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`clean-tag-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      <span>{tag}</span>
                      {isSelected && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Clean, Uncluttered Footer: Cancel + Save Feedback */}
      <div className="clean-inline-footer">
        <button
          type="button"
          className="clean-cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="clean-save-btn"
          onClick={handleSave}
        >
          <Check size={14} />
          <span>Save Feedback</span>
        </button>
      </div>
    </div>
  );
};
