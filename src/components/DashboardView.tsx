import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DashboardIcon, StudentsIcon, ReviewsIcon, LogoutIcon, 
  UsersIcon, ClockIcon, CheckCircleIcon, SearchIcon 
} from './Icons';
import { Student } from '../data/studentsData';

interface StudentCardProps {
  student: Student;
  onReview: () => void;
  onViewAsStudent: () => void;
}

export const DashboardView: React.FC = () => {
  const { 
    volunteer, 
    students, 
    searchQuery, 
    setSearchQuery, 
    filterStatus, 
    setFilterStatus, 
    activeSidebarTab, 
    setActiveSidebarTab,
    openStudentReview,
    logout,
    stats,
    setActiveRole,
    setSelectedStudentForViewId 
  } = useApp();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.degree.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className="dashboard-sidebar">
        <ul className="sidebar-nav-list">
          <li>
            <a 
              className={`sidebar-nav-item ${activeSidebarTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('dashboard')}
            >
              <DashboardIcon size={18} />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeSidebarTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('students')}
            >
              <StudentsIcon size={18} />
              <span>Students</span>
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeSidebarTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('reviews')}
            >
              <ReviewsIcon size={18} />
              <span>My Reviews</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-bottom">
          <button 
            className="logout-btn" 
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                logout();
              }
            }}
          >
            <LogoutIcon size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Dashboard Main View */}
      <main className="dashboard-main">
        {/* Top Greeting Banner */}
        <div className="dashboard-header-banner">
          <div>
            <h1 className="greeting-title">
              Hi, {volunteer.name} <span style={{ display: 'inline-block', animation: 'wave 1.5s infinite', transformOrigin: '70% 70%' }}>👋</span>
            </h1>
            <p className="greeting-subtitle">{stats.assigned} resumes assigned</p>
          </div>

          <div className="progress-summary-box">
            <div className="progress-label-wrap">
              <span>{stats.completed} of {stats.assigned} completed</span>
              <span className="progress-pct">{stats.percentage}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="metric-cards-grid">
          <div className="metric-card">
            <div className="metric-icon-bubble blue">
              <UsersIcon size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-value">{stats.assigned}</span>
              <span className="metric-label">Assigned</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-bubble orange">
              <ClockIcon size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-value">{stats.pending}</span>
              <span className="metric-label">Pending</span>
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
              placeholder="Search students..." 
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
              <option value="all">Filter All</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="changes_required">Changes Required</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Students List */}
        <div className="student-cards-list">
          {filteredStudents.length === 0 ? (
            <div className="white-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No students found matching your search and filter.
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
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button className="mobile-nav-item active">
          <DashboardIcon size={18} />
          <span>Home</span>
        </button>
        <button className="mobile-nav-item">
          <StudentsIcon size={18} />
          <span>Students</span>
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

  return (
    <div className="student-card-item">
      <div className="student-info-col">
        <img src={student.avatar} alt={student.name} className="student-avatar" />
        <div className="student-name-meta">
          <span className="student-name">{student.name}</span>
          <span className="student-degree">{student.degree}</span>
        </div>
      </div>

      <div className="student-actions-col">
        <span className={`status-badge ${statusBadgeClass}`}>
          {statusText}
        </span>
        <button 
          className="btn btn-outline btn-sm"
          style={{ fontSize: '12px', padding: '6px 10px' }}
          onClick={onViewAsStudent}
          title="See what this student sees"
        >
          🎓 Student View
        </button>
        <button 
          className={`btn ${buttonClass} student-action-btn`}
          onClick={onReview}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
