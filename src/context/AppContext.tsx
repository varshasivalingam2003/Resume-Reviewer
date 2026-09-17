import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialStudents, volunteerProfile, Student, VolunteerProfile, VolunteerSubtopic, ResumeSection } from '../data/studentsData';

const STORAGE_KEY = 'resume_reviewer_react_state_v4';

export interface Stats {
  assigned: number;
  pending: number;
  completed: number;
  percentage: number;
}

export interface AppContextType {
  isAuthenticated: boolean;
  volunteer: VolunteerProfile;
  currentView: string;
  setCurrentView: (view: string) => void;
  students: Student[];
  activeStudentId: string;
  activeStudent: Student;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  deviceMode: string;
  setDeviceMode: (mode: string) => void;
  mobileTab: string;
  setMobileTab: (tab: string) => void;
  activeResumePage: number;
  setResumePage: (page: number) => void;
  zoomLevel: number;
  setZoom: (zoom: number) => void;
  activeHighlightSection: string;
  setActiveHighlightSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
  lastCompletedStudentId: string | null;
  stats: Stats;
  volunteerAssignmentMode: 'single' | 'group';
  setVolunteerAssignmentMode: (mode: 'single' | 'group') => void;
  taggedStudents: Student[];
  activeRole: 'volunteer' | 'student';
  setActiveRole: (role: 'volunteer' | 'student') => void;
  isStudentLoggedIn: boolean;
  setIsStudentLoggedIn: (loggedIn: boolean) => void;
  selectedStudentForViewId: string;
  setSelectedStudentForViewId: (id: string) => void;
  studentResolvedItems: Record<string, boolean>;
  toggleResolveItem: (subtopicId: string) => void;
  login: () => void;
  loginVolunteer: () => void;
  loginStudent: (studentId: string) => void;
  logoutStudent: () => void;
  loginStudentWithOtp: (otpCode: string, studentId?: string | null) => { success: boolean; student?: Student; message?: string };
  loginWithOtp: (otpCode: string, role?: string, specificStudentId?: string | null) => { success: boolean; role?: string; student?: Student; message?: string };
  logout: () => void;
  openStudentReview: (studentId: string) => void;
  toggleSectionReviewed: (sectionKey: string) => void;
  updateSectionComment: (sectionKey: string, text: string) => void;
  updateGeneralFeedback: (text: string) => void;
  setRating: (rating: number) => void;
  toggleImproveTag: (tag: string) => void;
  addVolunteerSubtopic: (title: string, sectionKey?: string, command?: string, category?: 'suggestion' | 'must_fix' | 'praise' | 'question') => void;
  removeVolunteerSubtopic: (subtopicId: string) => void;
  toggleSubtopicHighlight: (subtopicId: string) => void;
  updateSubtopicCommand: (subtopicId: string, command: string) => void;
  updateSubtopicCategory: (subtopicId: string, category: 'suggestion' | 'must_fix' | 'praise' | 'question') => void;
  updateSubtopicRewrite: (subtopicId: string, rewrite: { before: string; after: string }) => void;
  updateSubtopicAudioNote: (subtopicId: string, audioNote: { recorded: boolean; duration: string; timestamp: string }) => void;
  saveAudioNote: (audioNote: { recorded: boolean; duration: string; timestamp: string }) => void;
  saveRubricScores: (scores: Record<string, number>) => void;
  toggleSubtopicReviewed: (subtopicId: string) => void;
  quickHighlightFromCanvas: (sectionKey: string, sectionTitle: string) => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  approveResume: () => void;
  requestChanges: (selectedTags: string[], feedbackNote: string) => void;
  goToNextPendingStudent: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v3') || localStorage.getItem('resume_reviewer_react_state_v1');
      if (saved) return JSON.parse(saved).isAuthenticated || false;
    } catch (e) {}
    return false;
  });

  const [volunteer] = useState<VolunteerProfile>(volunteerProfile);

  const [currentView, setCurrentView] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v3') || localStorage.getItem('resume_reviewer_react_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentView && parsed.currentView !== 'login') {
          return parsed.currentView;
        }
      }
    } catch (e) {}
    return 'dashboard';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v3') || localStorage.getItem('resume_reviewer_react_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students && parsed.students.length) {
          // Merge with initialStudents to ensure full structured resumeSections always exist!
          return parsed.students.map((savedStudent: Student) => {
            const initial = initialStudents.find(s => s.id === savedStudent.id) || initialStudents[0];
            return {
              ...initial,
              ...savedStudent,
              resumeSections: (savedStudent.resumeSections && savedStudent.resumeSections.length > 0)
                ? savedStudent.resumeSections
                : initial.resumeSections,
              volunteerSubtopics: (savedStudent.volunteerSubtopics && savedStudent.volunteerSubtopics.length > 0)
                ? savedStudent.volunteerSubtopics
                : (initial.volunteerSubtopics || [])
            };
          });
        }
      }
    } catch (e) {}
    return initialStudents;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>('student-1');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<string>('responsive');
  const [mobileTab, setMobileTab] = useState<string>('resume');
  const [activeResumePage, setActiveResumePage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeHighlightSection, setActiveHighlightSection] = useState<string>('objective');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>('dashboard');
  const [lastCompletedStudentId, setLastCompletedStudentId] = useState<string | null>(null);

  const [activeRole, setActiveRole] = useState<'volunteer' | 'student'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeRole) return parsed.activeRole;
      }
    } catch (e) {}
    return 'volunteer';
  });

  const [selectedStudentForViewId, setSelectedStudentForViewId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedStudentForViewId) return parsed.selectedStudentForViewId;
      }
    } catch (e) {}
    return 'student-1';
  });

  const [studentResolvedItems, setStudentResolvedItems] = useState<Record<string, boolean>>({});
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(false);

  const [volunteerAssignmentMode, setVolunteerAssignmentMode] = useState<'single' | 'group'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('resume_reviewer_react_state_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.volunteerAssignmentMode) return parsed.volunteerAssignmentMode;
      }
    } catch (e) {}
    return 'single'; // Default to single tagged student as requested
  });

  // URL query parameter support for direct view switching
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const roleParam = params.get('role');
      const mobileTabParam = params.get('mobileTab');
      const deviceModeParam = params.get('deviceMode');
      if (viewParam) {
        setCurrentView(viewParam);
        if (viewParam === 'dashboard' || viewParam === 'workspace') {
          setIsAuthenticated(true);
        }
      }
      if (roleParam === 'student') {
        setActiveRole('student');
        setIsStudentLoggedIn(true);
      } else if (roleParam === 'volunteer') {
        setActiveRole('volunteer');
      }
      if (mobileTabParam) {
        setMobileTab(mobileTabParam);
      }
      if (deviceModeParam) {
        setDeviceMode(deviceModeParam);
      }
    } catch (e) {}
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isAuthenticated,
        currentView,
        activeStudentId,
        students,
        deviceMode,
        mobileTab,
        activeResumePage,
        zoomLevel,
        activeHighlightSection,
        searchQuery,
        filterStatus,
        activeSidebarTab,
        activeRole,
        selectedStudentForViewId,
        studentResolvedItems,
        volunteerAssignmentMode
      }));
    } catch (e) {
      console.error('Failed to sync to LocalStorage', e);
    }
  }, [
    isAuthenticated, currentView, activeStudentId, students,
    deviceMode, mobileTab, activeResumePage, zoomLevel,
    activeHighlightSection, searchQuery, filterStatus, activeSidebarTab,
    activeRole, selectedStudentForViewId, studentResolvedItems, volunteerAssignmentMode
  ]);

  // Current active student object with guaranteed resumeSections
  const currentTargetId = activeRole === 'student' ? selectedStudentForViewId : activeStudentId;
  const safeStudentsList = (Array.isArray(students) && students.length > 0) ? students : initialStudents;
  const activeStudentRaw = safeStudentsList.find(s => s?.id === currentTargetId) || safeStudentsList[0] || initialStudents[0];
  const initialForActive = initialStudents.find(s => s?.id === activeStudentRaw?.id) || initialStudents[0];
  const activeStudent: Student = {
    ...initialForActive,
    ...activeStudentRaw,
    resumeSections: (Array.isArray(activeStudentRaw?.resumeSections) && activeStudentRaw.resumeSections.length > 0)
      ? activeStudentRaw.resumeSections
      : initialForActive.resumeSections,
    volunteerSubtopics: (Array.isArray(activeStudentRaw?.volunteerSubtopics) && activeStudentRaw.volunteerSubtopics.length > 0)
      ? activeStudentRaw.volunteerSubtopics
      : (initialForActive.volunteerSubtopics || [])
  };

  const toggleResolveItem = (subtopicId: string) => {
    setStudentResolvedItems(prev => ({
      ...prev,
      [subtopicId]: !prev[subtopicId]
    }));
  };

  // Login & Authentication Actions
  const loginVolunteer = () => {
    setIsAuthenticated(true);
    setActiveRole('volunteer');
    setCurrentView('dashboard');
  };

  const loginStudent = (studentId: string) => {
    setIsStudentLoggedIn(true);
    setActiveRole('student');
    setSelectedStudentForViewId(studentId);
    setActiveStudentId(studentId);
  };

  const logoutStudent = () => {
    setIsStudentLoggedIn(false);
  };

  const loginStudentWithOtp = (otpCode: string, studentId: string | null = null) => {
    const clean = (otpCode || '').trim();
    let target: Student | undefined = undefined;

    // 1. Check if clean matches any student's registered OTP
    const matchedByOtp = students.find(s => s.otp === clean);
    if (matchedByOtp) {
      target = matchedByOtp;
    } else if (studentId) {
      const candidate = students.find(s => s.id === studentId);
      if (candidate && (candidate.otp === clean || clean === '101010')) {
        target = candidate;
      }
    }

    // 2. Global demo dummy OTP '101010' fallback
    if (!target && clean === '101010') {
      target = students.find(s => s.id === (studentId || 'student-1')) || students[0];
    }

    if (target) {
      loginStudent(target.id);
      return { success: true, student: target };
    }

    const currentStudent = students.find(s => s.id === studentId);
    const expectedOtp = currentStudent?.otp || '101010';
    return { 
      success: false, 
      message: `Incorrect OTP. Please enter the dummy OTP (${expectedOtp}) shown on screen.` 
    };
  };

  const loginWithOtp = (otpCode: string, role = 'volunteer', specificStudentId: string | null = null) => {
    const cleanOtp = (otpCode || '').trim();
    if (role === 'volunteer') {
      if (cleanOtp === '842019' || cleanOtp.length === 6) {
        loginVolunteer();
        return { success: true, role: 'volunteer' };
      }
      return { success: false, message: 'Invalid volunteer code. Use demo code 842019.' };
    }

    // Role is student
    return loginStudentWithOtp(cleanOtp, specificStudentId);
  };

  const login = () => {
    loginVolunteer();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsStudentLoggedIn(false);
    setCurrentView('login');
    setActiveModal(null);
  };

  const openStudentReview = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    if (target.status === 'pending') {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'in_review' } : s));
    }

    setActiveStudentId(studentId);
    setCurrentView('workspace');
    setActiveModal(null);
    setActiveResumePage(1);
    setZoomLevel(100);
    setActiveHighlightSection('objective');
    setMobileTab('resume');
  };

  const setResumePage = (page: number) => {
    const maxPage = activeStudent?.totalPages || 2;
    const clamped = Math.max(1, Math.min(page, maxPage));
    setActiveResumePage(clamped);
  };

  const setZoom = (zoom: number) => {
    const clamped = Math.max(70, Math.min(zoom, 150));
    setZoomLevel(clamped);
  };

  const toggleSectionReviewed = (sectionKey: string) => {
    if (!activeStudent) return;
    setActiveHighlightSection(sectionKey);
  };

  const updateSectionComment = (_sectionKey: string, _text: string) => {
    // Comment updated
  };

  const updateGeneralFeedback = (text: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => s.id === activeStudent.id ? { ...s, generalFeedback: text } : s));
  };

  const setRating = (rating: number) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => s.id === activeStudent.id ? { ...s, rating } : s));
  };

  const toggleImproveTag = (tag: string) => {
    if (!activeStudent) return;
    const currentTags = activeStudent.improveTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    setStudents(prev => prev.map(s => s.id === activeStudent.id ? { ...s, improveTags: newTags } : s));
  };

  // Dynamic Volunteer-Defined Subtopics & Highlighting Methods
  const addVolunteerSubtopic = (
    title: string, 
    sectionKey = 'custom', 
    command = '', 
    category: 'suggestion' | 'must_fix' | 'praise' | 'question' = 'suggestion'
  ) => {
    if (!activeStudent || !title.trim()) return;
    const newSubtopic: VolunteerSubtopic = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      sectionKey: sectionKey || 'custom',
      isHighlighted: true,
      command: command || '',
      isReviewed: false,
      category
    };

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        const existing = s.volunteerSubtopics || [];
        return { ...s, volunteerSubtopics: [...existing, newSubtopic] };
      }
      return s;
    }));
    setActiveHighlightSection(sectionKey || 'custom');
  };

  const removeVolunteerSubtopic = (subtopicId: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).filter(sub => sub.id !== subtopicId)
        };
      }
      return s;
    }));
  };

  const toggleSubtopicHighlight = (subtopicId: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, isHighlighted: !sub.isHighlighted } : sub
          )
        };
      }
      return s;
    }));
  };

  const updateSubtopicCommand = (subtopicId: string, command: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, command } : sub
          )
        };
      }
      return s;
    }));
  };

  const updateSubtopicCategory = (subtopicId: string, category: 'suggestion' | 'must_fix' | 'praise' | 'question') => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, category } : sub
          )
        };
      }
      return s;
    }));
  };

  const updateSubtopicRewrite = (subtopicId: string, rewrite: { before: string; after: string }) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, suggestedRewrite: rewrite } : sub
          )
        };
      }
      return s;
    }));
  };

  const updateSubtopicAudioNote = (subtopicId: string, audioNote: { recorded: boolean; duration: string; timestamp: string }) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, audioNote } : sub
          )
        };
      }
      return s;
    }));
  };

  const saveAudioNote = (audioNote: { recorded: boolean; duration: string; timestamp: string }) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return { ...s, audioNote };
      }
      return s;
    }));
  };

  const saveRubricScores = (scores: Record<string, number>) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return { ...s, rubricScores: scores };
      }
      return s;
    }));
  };

  const toggleSubtopicReviewed = (subtopicId: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          volunteerSubtopics: (s.volunteerSubtopics || []).map(sub => 
            sub.id === subtopicId ? { ...sub, isReviewed: !sub.isReviewed } : sub
          )
        };
      }
      return s;
    }));
  };

  const quickHighlightFromCanvas = (sectionKey: string, sectionTitle: string) => {
    if (!activeStudent) return;
    const existing = (activeStudent.volunteerSubtopics || []).find(sub => sub.sectionKey === sectionKey);
    if (existing) {
      // Toggle highlight and focus
      toggleSubtopicHighlight(existing.id);
      setActiveHighlightSection(sectionKey);
    } else {
      // Create new volunteer-defined subtopic for this section
      addVolunteerSubtopic(sectionTitle, sectionKey, '');
    }
  };

  const approveResume = () => {
    if (!activeStudent) return;
    // Mark all defined subtopics as reviewed
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        const markedSubtopics = (s.volunteerSubtopics || []).map(sub => ({ ...sub, isReviewed: true }));
        return {
          ...s,
          status: 'approved' as const,
          volunteerSubtopics: markedSubtopics,
          completedDate: '08 Sep 2026'
        };
      }
      return s;
    }));

    setActiveModal(null);
    setLastCompletedStudentId(activeStudent.id);
    setCurrentView('completed');
  };

  const requestChanges = (selectedTags: string[], feedbackNote: string) => {
    if (!activeStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          status: 'changes_required' as const,
          improveTags: selectedTags.length ? selectedTags : s.improveTags,
          generalFeedback: feedbackNote || s.generalFeedback,
          completedDate: '08 Sep 2026'
        };
      }
      return s;
    }));

    setActiveModal(null);
    setLastCompletedStudentId(activeStudent.id);
    setCurrentView('completed');
  };

  const goToNextPendingStudent = () => {
    const remaining = taggedStudents.find(s => s.status === 'pending' || s.status === 'in_review');
    if (remaining) {
      openStudentReview(remaining.id);
    } else {
      setCurrentView('dashboard');
    }
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setCurrentView('login');
    setActiveStudentId('student-1');
    setStudents(JSON.parse(JSON.stringify(initialStudents)));
    setActiveModal(null);
    setDeviceMode('responsive');
    setMobileTab('resume');
    setActiveResumePage(1);
    setZoomLevel(100);
    setActiveHighlightSection('objective');
    setSearchQuery('');
    setFilterStatus('all');
    setActiveSidebarTab('dashboard');
    setLastCompletedStudentId(null);
    setVolunteerAssignmentMode('single');
  };

  // Tagged students calculation based on assignment mode (Single: 1 student, Group: 3 students)
  const safeStudents = (Array.isArray(students) && students.length > 0) ? students : initialStudents;
  const taggedStudents = volunteerAssignmentMode === 'single'
    ? safeStudents.slice(0, 1)
    : safeStudents.slice(0, 3);

  const total = taggedStudents.length;
  const completed = taggedStudents.filter(s => s?.status === 'approved' || s?.status === 'changes_required').length;
  const pending = Math.max(0, total - completed);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats: Stats = {
    assigned: total,
    pending,
    completed,
    percentage
  };

  const value: AppContextType = {
    isAuthenticated,
    volunteer,
    currentView,
    setCurrentView,
    students,
    activeStudentId,
    activeStudent,
    activeModal,
    setActiveModal,
    deviceMode,
    setDeviceMode,
    mobileTab,
    setMobileTab,
    activeResumePage,
    setResumePage,
    zoomLevel,
    setZoom,
    activeHighlightSection,
    setActiveHighlightSection,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    activeSidebarTab,
    setActiveSidebarTab,
    lastCompletedStudentId,
    stats,
    volunteerAssignmentMode,
    setVolunteerAssignmentMode,
    taggedStudents,
    activeRole,
    setActiveRole,
    isStudentLoggedIn,
    setIsStudentLoggedIn,
    selectedStudentForViewId,
    setSelectedStudentForViewId,
    studentResolvedItems,
    toggleResolveItem,
    login,
    loginVolunteer,
    loginStudent,
    logoutStudent,
    loginStudentWithOtp,
    loginWithOtp,
    logout,
    openStudentReview,
    toggleSectionReviewed,
    updateSectionComment,
    updateGeneralFeedback,
    setRating,
    toggleImproveTag,
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
    openModal: (modalName: string) => setActiveModal(modalName),
    closeModal: () => setActiveModal(null),
    approveResume,
    requestChanges,
    goToNextPendingStudent,
    resetDemo
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
