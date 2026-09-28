import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  Eye, 
  FileText, 
  ArrowUpDown 
} from 'lucide-react';
import { DashboardIcon, UsersIcon } from './Icons';

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

  const [sortBy, setSortBy] = useState<'default' | 'name' | 'status'>('default');

  const hasNoStudents = taggedStudents.length === 0;

  // Filter students based on search and status
  const filteredStudents = taggedStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.institution && student.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.studentId && student.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'all' || 
      student.status === filterStatus ||
      (filterStatus === 'pending' && (student.status === 'pending' || student.status === 'in_review' || student.status === 'changes_required'));
    
    return matchesSearch && matchesStatus;
  });

  // Client sort presentation
  const displayStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  // Avatar initial and palette mapping
  const getAvatarData = (name: string, index: number) => {
    const initial = name.trim().charAt(0).toUpperCase();
    const palette = [
      { bg: '#FEF9C3', color: '#0F172A' }, // Yellow (Manisha A)
      { bg: '#FEE2E2', color: '#B91C1C' }, // Peach (Rohith S)
      { bg: '#DCFCE7', color: '#15803D' }, // Green (Sneha K)
      { bg: '#EDE9FE', color: '#6D28D9' }, // Lavender (Arun P)
    ];
    const style = palette[index % palette.length];
    return { initial, bg: style.bg, color: style.color };
  };

  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        {/* ==================================================================
           Hero Area: VOLUNTEER PORTAL, Greeting, Subtitle & Graphic
           ================================================================== */}
        <section className="dashboard-hero-banner">
          <div className="hero-left-content">
            <div className="hero-portal-badge">VOLUNTEER PORTAL</div>
            <h1 className="hero-greeting-title">
              <span>Hi, {volunteer.name}</span>
              <span className="hero-wave-hand">👋</span>
            </h1>
            <p className="hero-greeting-subtitle">
              Review student resumes and help them build stronger career profiles.
            </p>
          </div>

          <div className="hero-right-container">
            <div className="hero-speech-bubble">
              Your feedback<br />creates real impact! 💛
            </div>
            <div className="hero-illustration-wrap">
              <img 
                src="/images/volunteer-hero.png" 
                alt="Volunteer Guidance" 
                className="hero-illustration-img" 
              />
            </div>
          </div>
        </section>

        {/* Empty State: No students assigned */}
        {hasNoStudents ? (
          <div className="empty-students-card">
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              No students assigned
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '460px', margin: '0 auto 20px' }}>
              There are currently no students linked to your volunteer record in Zoho Creator. Once students are assigned via V_OTP_Lookup, they will appear here automatically.
            </p>
            <button 
              className="btn btn-outline"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            {/* ==============================================================
               3 Clean Stat Cards (Assigned, Pending, Completed)
               ============================================================== */}
            <div className="stat-cards-row">
              {/* 1. Assigned in Cohort */}
              <div 
                className="stat-card" 
                onClick={() => setFilterStatus('all')}
                title="View all assigned students"
              >
                <div className="stat-card-left">
                  <div className="stat-icon-circle yellow">
                    <Users size={20} />
                  </div>
                  <div className="stat-text-col">
                    <span className="stat-number">{stats.assigned}</span>
                    <span className="stat-title">Assigned in Cohort</span>
                  </div>
                </div>
                <div className="stat-chevron">
                  <ChevronRight size={18} />
                </div>
              </div>

              {/* 2. Pending Review */}
              <div 
                className="stat-card" 
                onClick={() => setFilterStatus('pending')}
                title="Filter pending reviews"
              >
                <div className="stat-card-left">
                  <div className="stat-icon-circle amber">
                    <Clock size={20} />
                  </div>
                  <div className="stat-text-col">
                    <span className="stat-number">{stats.pending}</span>
                    <span className="stat-title">Pending Review</span>
                  </div>
                </div>
                <div className="stat-chevron">
                  <ChevronRight size={18} />
                </div>
              </div>

              {/* 3. Completed */}
              <div 
                className="stat-card" 
                onClick={() => setFilterStatus('approved')}
                title="Filter completed reviews"
              >
                <div className="stat-card-left">
                  <div className="stat-icon-circle green">
                    <CheckCircle size={20} />
                  </div>
                  <div className="stat-text-col">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-title">Completed</span>
                  </div>
                </div>
                <div className="stat-chevron">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>

            {/* ==============================================================
               Search / Filter Controls Row
               ============================================================== */}
            <div className="filter-controls-row">
              <div className="filter-search-box">
                <span className="filter-search-icon">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="filter-search-input" 
                  placeholder="Search students by name, degree, college..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-actions-group">
                {/* Student Mode / Count Control */}
                <div className="filter-select-wrapper">
                  <Users size={15} className="filter-select-icon" />
                  <select 
                    className="filter-pill-select"
                    value={volunteerAssignmentMode}
                    onChange={(e) => setVolunteerAssignmentMode(e.target.value as 'single' | 'group')}
                    title="Student assignment view"
                  >
                    <option value="group">All Students ({taggedStudents.length})</option>
                    <option value="single">Single Student (1)</option>
                  </select>
                  <ChevronDown size={14} className="filter-select-chevron" />
                </div>

                {/* Status Filter */}
                <div className="filter-select-wrapper">
                  <Clock size={15} className="filter-select-icon" />
                  <select 
                    className="filter-pill-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    title="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Completed</option>
                  </select>
                  <ChevronDown size={14} className="filter-select-chevron" />
                </div>

                {/* Sort Control */}
                <div className="filter-select-wrapper">
                  <ArrowUpDown size={15} className="filter-select-icon" />
                  <select 
                    className="filter-pill-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'default' | 'name' | 'status')}
                    title="Sort students"
                  >
                    <option value="default">Sort by</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDown size={14} className="filter-select-chevron" />
                </div>
              </div>
            </div>

            {/* ==============================================================
               Student List Rows: Compact Professional Cards
               ============================================================== */}
            <div className="student-rows-container">
              {displayStudents.length === 0 ? (
                <div className="empty-students-card">
                  <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                    No students found matching your search and filter in this cohort.
                  </p>
                </div>
              ) : (
                displayStudents.map((student, idx) => {
                  const avatarData = getAvatarData(student.name, idx);
                  const totalSubtopics = student.volunteerSubtopics?.length || 3;
                  const isCompleted = student.status === 'approved';
                  const reviewedSubtopics = isCompleted 
                    ? totalSubtopics 
                    : (student.volunteerSubtopics?.filter(s => s.isReviewed)?.length || 0);
                  const progressPercent = Math.min(100, Math.round((reviewedSubtopics / totalSubtopics) * 100));

                  return (
                    <div key={student.id} className="student-row-card">
                      {/* Left: Avatar + Name + Degree & College */}
                      <div className="student-row-left">
                        <div 
                          className="student-initial-avatar" 
                          style={{ background: avatarData.bg, color: avatarData.color }}
                        >
                          {avatarData.initial}
                        </div>
                        <div className="student-info-meta">
                          <span className="student-name-text">{student.name}</span>
                          <span className="student-degree-text">
                            {student.degree}{student.institution ? ` • ${student.institution}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Progress + Status */}
                      <div className="student-row-middle">
                        <div className="student-progress-col">
                          <span className="student-progress-label">
                            {reviewedSubtopics} / {totalSubtopics} reviewed
                          </span>
                          <div className="student-progress-bar">
                            <div 
                              className={`student-progress-fill ${isCompleted ? 'green' : 'yellow'}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <span className={`status-pill ${isCompleted ? 'completed' : 'pending'}`}>
                          {isCompleted ? (
                            <>
                              <CheckCircle size={14} />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock size={14} />
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Right: Actions */}
                      <div className="student-row-right-actions">
                        <button 
                          type="button"
                          className="btn-student-view"
                          onClick={() => {
                            setSelectedStudentForViewId(student.id);
                            setActiveRole('student');
                          }}
                          title="See what this student sees"
                        >
                          <Eye size={15} />
                          <span>Student View</span>
                        </button>

                        {isCompleted ? (
                          <button 
                            type="button"
                            className="btn-view-feedback"
                            onClick={() => openStudentReview(student.id)}
                            title="View feedback"
                          >
                            <FileText size={15} />
                            <span>View Feedback</span>
                          </button>
                        ) : (
                          <button 
                            type="button"
                            className="btn-review-primary"
                            onClick={() => openStudentReview(student.id)}
                            title="Review resume"
                          >
                            <span>Review</span>
                            <ChevronRight size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ==============================================================
               Page Footer: Showing Count & Pagination
               ============================================================== */}
            <div className="dashboard-footer-row">
              <span className="footer-count-text">
                Showing {displayStudents.length} student{displayStudents.length === 1 ? '' : 's'}
              </span>

              <div className="footer-pagination-group">
                <button type="button" className="pagination-arrow-btn" aria-label="Previous page">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="pagination-num-btn">
                  1
                </button>
                <button type="button" className="pagination-arrow-btn" aria-label="Next page">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation (Preserved) */}
      <nav className="mobile-bottom-nav">
        <button className="mobile-nav-item active">
          <DashboardIcon size={18} />
          <span>Home</span>
        </button>
        <button className="mobile-nav-item" onClick={() => setVolunteerAssignmentMode(volunteerAssignmentMode === 'single' ? 'group' : 'single')}>
          <UsersIcon size={18} />
          <span>{volunteerAssignmentMode === 'single' ? 'Switch to Group' : 'Switch to Single'}</span>
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
