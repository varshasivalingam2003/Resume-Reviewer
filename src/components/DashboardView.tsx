import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DashboardIcon, 
  UsersIcon, ClockIcon, CheckCircleIcon, SearchIcon 
} from './Icons';
import { User, Users, GraduationCap, FileText, Hand, Download } from 'lucide-react';
import { Student } from '../data/studentsData';
import { getResumeViewUrl, getResumeDownloadUrl } from '../services/zohoApi';

interface StudentCardProps {
  student: Student;
  onReview: () => void;
  onViewAsStudent: () => void;
}

export const DashboardView: React.FC = () => {
  const { 
    volunteer, 
    taggedStudents,
    volunteerAssignmentMode,
    setVolunteerAssignmentMode,
    searchQuery, 
    setSearchQuery, 
    filterStatus, 
    setFilterStatus, 
    openStudentReview,
    logout,
    stats,
    setActiveRole,
    setSelectedStudentForViewId 
  } = useApp();

  // Determine if single or group user mode
  const hasNoStudents = taggedStudents.length === 0;
  const isSingleStudent = taggedStudents.length === 1;
  const singleStudent = taggedStudents[0] || null;

  const filteredStudents = taggedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (student.studentId && student.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_review': return 'In Review';
      case 'changes_required': return 'Changes Required';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Dashboard Main View */}
      <main className="dashboard-main">
        {/* Top Greeting Header & Mode Switcher */}
        <div className="dashboard-header-banner">
          <div>
            <h1 className="greeting-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Hi, {volunteer.name}</span>
              <span style={{ display: 'inline-flex', animation: 'wave 1.5s infinite', transformOrigin: '70% 70%' }}>
                <Hand size={24} color="#F59E0B" />
              </span>
            </h1>
            <p className="greeting-subtitle">
              {hasNoStudents
                ? 'No students assigned to your volunteer account'
                : isSingleStudent 
                  ? 'You have 1 student directly assigned for 1:1 resume review'
                  : `You have ${taggedStudents.length} students assigned in your review cohort`}
            </p>
          </div>

          {/* Quick Switcher for Volunteer Tagged Assignment */}
          {!hasNoStudents && (
            <div className="dashboard-mode-switcher" title="Toggle between single student and group student assignment">
              <button 
                type="button"
                className={`mode-switch-btn ${volunteerAssignmentMode === 'single' ? 'active' : ''}`}
                onClick={() => setVolunteerAssignmentMode('single')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={14} />
                <span>Single Student (1)</span>
              </button>
              <button 
                type="button"
                className={`mode-switch-btn ${volunteerAssignmentMode === 'group' ? 'active' : ''}`}
                onClick={() => setVolunteerAssignmentMode('group')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Users size={14} />
                <span>All Students ({taggedStudents.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State: No students assigned */}
        {hasNoStudents ? (
          <div className="white-card" style={{ padding: '60px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No students assigned
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 20px' }}>
              There are currently no students linked to your volunteer record in Zoho Creator. Once students are assigned via V_OTP_Lookup, they will appear here automatically.
            </p>
            <button 
              className="btn btn-outline"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        ) : isSingleStudent && singleStudent ? (
          /* ==================================================================
             PAGE 1: SINGLE STUDENT TAGGED DASHBOARD (Clean & Simple)
             ================================================================== */
          <div className="single-student-clean-wrapper">
            <div className="single-student-card">
              {/* Profile Top Row */}
              <div className="student-card-top">
                <div className="student-profile-left">
                  <img src={singleStudent.avatar} alt={singleStudent.name} className="student-profile-avatar" />
                  <div className="student-profile-headings">
                    <div className="student-name-status-row">
                      <h2 className="student-profile-name">{singleStudent.name}</h2>
                      <span className={`status-badge status-${singleStudent.status}`}>
                        {getStatusText(singleStudent.status)}
                      </span>
                    </div>
                    <p className="student-profile-degree">{singleStudent.degree}</p>
                    <p className="student-profile-college">{singleStudent.institution}</p>
                  </div>
                </div>

                <div className="student-profile-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      setSelectedStudentForViewId(singleStudent.id);
                      setActiveRole('student');
                    }}
                    title="See what the student sees"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <GraduationCap size={15} />
                    <span>View as Student</span>
                  </button>

                  <button 
                    className="btn btn-primary"
                    onClick={() => openStudentReview(singleStudent.id)}
                  >
                    {singleStudent.status === 'in_review' ? 'Continue Review' : singleStudent.status === 'approved' ? 'View Resume' : 'Review Resume'}
                  </button>
                </div>
              </div>

              {/* Clean Student Details Grid (All 8 Required Fields) */}
              <div className="student-details-grid">
                <div className="student-detail-field">
                  <span className="field-label">Student Name</span>
                  <span className="field-value">{singleStudent.name}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Student ID</span>
                  <span className="field-value">{singleStudent.studentId || singleStudent.id || '—'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">S OTP</span>
                  <span className="field-value" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {singleStudent.sOtp || singleStudent.otp || '—'}
                  </span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Location</span>
                  <span className="field-value">{singleStudent.location || '—'}</span>
                </div>
                <div className="student-detail-field">
                  <span className="field-label">Graduation Year</span>
                  <span className="field-value">{singleStudent.graduationYear || '—'}</span>
                </div>
                <div className="student-detail-field">
                  <span className="field-label">Assigned Date</span>
                  <span className="field-value">{singleStudent.assignedDate || '—'}</span>
                </div>
                  <div className="student-detail-field">
                    <span className="field-label">Resume Document</span>
                    <span className="field-value" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={15} color="#2563EB" />
                      <span>{singleStudent.name.replace(/\s+/g, '_')}_Resume.pdf</span>
                    </span>
                  </div>

                <div className="student-detail-field">
                  <span className="field-label">Email Address</span>
                  <span className="field-value">{singleStudent.email || '—'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Phone Number</span>
                  <span className="field-value">{singleStudent.phone || '—'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">WhatsApp</span>
                  <span className="field-value">{singleStudent.whatsapp || singleStudent.phone || '—'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Gender</span>
                  <span className="field-value">{singleStudent.gender || 'Not specified'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Resume Upload Status</span>
                  {singleStudent.resumeAttachment ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span className="status-badge status-approved" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        Uploaded
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '11.5px', padding: '4px 10px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => window.open(getResumeViewUrl(singleStudent.resumeAttachment || '', singleStudent.name), '_blank', 'noopener,noreferrer')}
                      >
                        <FileText size={12} />
                        <span>View Resume</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '11.5px', padding: '4px 10px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => window.open(getResumeDownloadUrl(singleStudent.resumeAttachment || '', singleStudent.name), '_blank')}
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>
                        Resume Not Uploaded
                      </span>
                    </div>
                  )}
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Graduation Year</span>
                  <span className="field-value">{singleStudent.graduationYear || '—'}</span>
                </div>

                <div className="student-detail-field">
                  <span className="field-label">Location</span>
                  <span className="field-value">{singleStudent.location || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================
             PAGE 2: GROUP USER / COHORT DASHBOARD (Clean & Simple)
             ================================================================== */
          <div className="group-students-view-container">
            {/* Metric Cards Row */}
            <div className="metric-cards-grid">
              <div className="metric-card">
                <div className="metric-icon-bubble blue">
                  <UsersIcon size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{stats.assigned}</span>
                  <span className="metric-label">Assigned in Cohort</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-bubble orange">
                  <ClockIcon size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{stats.pending}</span>
                  <span className="metric-label">Pending Action</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-bubble green">
                  <CheckCircleIcon size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{stats.completed}</span>
                  <span className="metric-label">Completed</span>
                </div>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="dashboard-controls-row">
              <div className="search-input-box">
                <div className="search-icon"><SearchIcon size={18} /></div>
                <input 
                  type="text" 
                  className="search-field" 
                  placeholder="Search students by name, degree, ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-box">
                <select 
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Filter All ({taggedStudents.length})</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="changes_required">Changes Required</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>

            {/* Students List in Cohort */}
            <div className="student-cards-list">
              {filteredStudents.length === 0 ? (
                <div className="white-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No students found matching your search and filter in this cohort.
                </div>
              ) : (
                filteredStudents.map(student => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    onReview={() => openStudentReview(student.id)}
                    onViewAsStudent={() => {
                      setSelectedStudentForViewId(student.id);
                      setActiveRole('student');
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button className="mobile-nav-item active">
          <DashboardIcon size={18} />
          <span>Home</span>
        </button>
        <button className="mobile-nav-item" onClick={() => setVolunteerAssignmentMode(isSingleStudent ? 'group' : 'single')}>
          <UsersIcon size={18} />
          <span>{isSingleStudent ? 'Switch to Group' : 'Switch to Single'}</span>
        </button>
        <button 
          className="mobile-nav-item"
          onClick={() => {
            if (window.confirm('Log out from volunteer account?')) logout();
          }}
        >
          <img src={volunteer.avatar} style={{ width: '18px', height: '18px', borderRadius: '50%' }} alt="Profile" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

const StudentCard: React.FC<StudentCardProps> = ({ student, onReview, onViewAsStudent }) => {
  const statusBadgeClass = `status-${student.status}`;
  let statusText = 'Pending';
  let buttonText = 'Review';
  let buttonClass = 'btn-primary';

  switch (student.status) {
    case 'pending':
      statusText = 'Pending';
      buttonText = 'Review';
      buttonClass = 'btn-primary';
      break;
    case 'in_review':
      statusText = 'In Review';
      buttonText = 'Continue';
      buttonClass = 'btn-primary';
      break;
    case 'changes_required':
      statusText = 'Changes Required';
      buttonText = 'Review';
      buttonClass = 'btn-primary';
      break;
    case 'approved':
      statusText = 'Approved';
      buttonText = 'View';
      buttonClass = 'btn-secondary';
      break;
    default:
      break;
  }

  const reviewedSubtopicsCount = student.volunteerSubtopics?.filter(s => s.isReviewed)?.length || 0;
  const totalSubtopicsCount = student.volunteerSubtopics?.length || 0;

  return (
    <div className="student-card-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
      {/* Top Main Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div className="student-info-col">
          <img src={student.avatar} alt={student.name} className="student-avatar" />
          <div className="student-name-meta">
            <span className="student-name">{student.name}</span>
            <span className="student-degree">{student.degree} • {student.institution}</span>
          </div>
        </div>

        <div className="student-actions-col">
          {totalSubtopicsCount > 0 && (
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>
              {reviewedSubtopicsCount}/{totalSubtopicsCount} reviewed
            </span>
          )}
          <span className={`status-badge ${statusBadgeClass}`}>
            {statusText}
          </span>
          <button 
            className="btn btn-outline btn-sm"
            style={{ fontSize: '12px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            onClick={onViewAsStudent}
            title="See what this student sees"
          >
            <GraduationCap size={13} />
            <span>Student View</span>
          </button>
          <button 
            className={`btn ${buttonClass} student-action-btn`}
            onClick={onReview}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Structured Details Grid (All Required Fields) */}
      <div className="student-details-grid" style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
        <div className="student-detail-field">
          <span className="field-label">Student Name</span>
          <span className="field-value">{student.name}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Student ID</span>
          <span className="field-value">{student.studentId || student.id || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">S OTP</span>
          <span className="field-value" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
            {student.sOtp || student.otp || '—'}
          </span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Location</span>
          <span className="field-value">{student.location || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Graduation Year</span>
          <span className="field-value">{student.graduationYear || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Assigned Date</span>
          <span className="field-value">{student.assignedDate || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Email</span>
          <span className="field-value">{student.email || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Phone</span>
          <span className="field-value">{student.phone || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">WhatsApp</span>
          <span className="field-value">{student.whatsapp || student.phone || '—'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Gender</span>
          <span className="field-value">{student.gender || 'Not specified'}</span>
        </div>

        <div className="student-detail-field">
          <span className="field-label">Resume Upload Status</span>
          {student.resumeAttachment ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span className="status-badge status-approved" style={{ fontSize: '11px', padding: '2px 8px' }}>
                Uploaded
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '3px 8px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => window.open(getResumeViewUrl(student.resumeAttachment || '', student.name), '_blank', 'noopener,noreferrer')}
              >
                <FileText size={12} />
                <span>View Resume</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '3px 8px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => window.open(getResumeDownloadUrl(student.resumeAttachment || '', student.name), '_blank')}
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>
                Resume Not Uploaded
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
