// StudentDashboard.jsx - Student Dashboard page
// Located in: src/pages/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Sub-components for student features
import StudentProfile from '../components/student/StudentProfile';
import RequestAppointment from '../components/student/RequestAppointment';
import CourseRequests from '../components/student/CourseRequests';
import AcademicPlan from '../components/student/AcademicPlan';
import AdvisorFeedback from '../components/student/AdvisorFeedback';
import StudentMessaging from '../components/student/StudentMessaging';
import StudentAnnouncements from '../components/student/StudentAnnouncements';
import StudentSchedule from '../components/student/StudentSchedule';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/student/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'course-requests', label: 'Course Requests', icon: '📝' },
    { id: 'academic-plan', label: 'Academic Plan', icon: '📚' },
    { id: 'feedback', label: 'Advisor Feedback', icon: '💬' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'schedule', label: 'My Schedule', icon: '🗓️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview data={dashboardData} loading={loading} user={user} />;
      case 'profile':
        return <StudentProfile />;
      case 'appointments':
        return <RequestAppointment />;
      case 'course-requests':
        return <CourseRequests />;
      case 'academic-plan':
        return <AcademicPlan />;
      case 'feedback':
        return <AdvisorFeedback />;
      case 'messages':
        return <StudentMessaging />;
      case 'announcements':
        return <StudentAnnouncements />;
      case 'schedule':
        return <StudentSchedule />;
      default:
        return <DashboardOverview data={dashboardData} loading={loading} user={user} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good_standing': return '#10b981';
      case 'probation': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? '🎓' : 'Student Portal'}</h2>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              {item.id === 'messages' && dashboardData?.counts?.unreadMessages > 0 && (
                <span className="badge">{dashboardData.counts.unreadMessages}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1>{menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-id">{user?.studentNumber}</span>
            </div>
            <span 
              className="status-badge"
              style={{ 
                background: `${getStatusColor(user?.academicStatus)}20`, 
                color: getStatusColor(user?.academicStatus) 
              }}
            >
              {user?.academicStatus?.replace('_', ' ')}
            </span>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      <style jsx>{`
        .student-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f0fdf4;
        }

        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #065f46 0%, #047857 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 18px;
          white-space: nowrap;
          overflow: hidden;
        }

        .collapse-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .nav-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border-radius: 10px;
          margin-bottom: 4px;
          transition: all 0.2s;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        .nav-icon {
          font-size: 18px;
          min-width: 24px;
          text-align: center;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          flex: 1;
        }

        .badge {
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .sidebar.collapsed + .main-content {
          margin-left: 70px;
        }

        .top-header {
          background: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left h1 {
          margin: 0;
          font-size: 24px;
          color: #065f46;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          display: block;
          font-weight: 600;
          color: #1f2937;
        }

        .user-id {
          display: block;
          font-size: 13px;
          color: #6b7280;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .content-area {
          padding: 30px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .main-content {
            margin-left: 70px;
          }

          .sidebar-header h2 {
            display: none;
          }

          .nav-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ data, loading, user }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="error-state">Failed to load dashboard data</div>;
  }

  const statCards = [
    { label: 'Current Courses', value: data.counts.currentCourses, icon: '📚', color: '#10b981' },
    { label: 'Pending Requests', value: data.counts.pendingRequests, icon: '📝', color: '#f59e0b' },
    { label: 'Upcoming Appointments', value: data.counts.upcomingAppointments, icon: '📅', color: '#3b82f6' },
    { label: 'Unread Messages', value: data.counts.unreadMessages, icon: '✉️', color: '#8b5cf6' },
  ];

  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className="dashboard-overview">
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Welcome back, {user?.firstName}! 👋</h2>
          <p>Here's what's happening with your academic journey.</p>
        </div>
        <div className="welcome-info">
          <div className="info-item">
            <span className="label">Major</span>
            <span className="value">{user?.majorName}</span>
          </div>
          <div className="info-item">
            <span className="label">GPA</span>
            <span className="value">{user?.gpa ? parseFloat(user.gpa).toFixed(2) : 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Advisor</span>
            <span className="value">{user?.advisorName}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Next Appointment */}
        <div className="dashboard-card">
          <h3>📅 Next Appointment</h3>
          {data.nextAppointment ? (
            <div className="next-appointment">
              <div className="apt-date">
                <span className="day">
                  {new Date(data.nextAppointment.appointment_date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="time">
                  {new Date(data.nextAppointment.appointment_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="apt-info">
                <p className="advisor">with {data.nextAppointment.advisor_name}</p>
                <p className="type">{data.nextAppointment.meeting_type}</p>
              </div>
            </div>
          ) : (
            <p className="no-data">No upcoming appointments</p>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="dashboard-card">
          <h3>💬 Recent Advisor Notes</h3>
          {data.recentNotes?.length > 0 ? (
            <div className="notes-list">
              {data.recentNotes.map((note, index) => (
                <div key={index} className={`note-item ${note.note_type}`}>
                  <span className="note-type">{note.note_type?.replace('_', ' ')}</span>
                  <p className="note-content">{note.content.substring(0, 100)}...</p>
                  <span className="note-date">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent notes from advisor</p>
          )}
        </div>

        {/* Announcements */}
        <div className="dashboard-card full-width">
          <h3>📢 Recent Announcements</h3>
          {data.announcements?.length > 0 ? (
            <div className="announcements-list">
              {data.announcements.map((ann, index) => (
                <div key={index} className="announcement-item">
                  <span 
                    className="priority-badge"
                    style={{ 
                      background: `${priorityColors[ann.priority]}15`, 
                      color: priorityColors[ann.priority] 
                    }}
                  >
                    {ann.priority}
                  </span>
                  <div className="ann-content">
                    <h4>{ann.title}</h4>
                    <p>{ann.content.substring(0, 150)}...</p>
                    <span className="ann-date">
                      {new Date(ann.created_at).toLocaleDateString()} • {ann.author_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No announcements</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-overview {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-card {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 16px;
          padding: 30px;
          color: white;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .welcome-content h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .welcome-content p {
          margin: 0;
          opacity: 0.9;
        }

        .welcome-info {
          display: flex;
          gap: 30px;
        }

        .info-item {
          text-align: center;
        }

        .info-item .label {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .info-item .value {
          display: block;
          font-weight: 600;
          font-size: 16px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 4px solid;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 28px;
          color: #1f2937;
        }

        .stat-info p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .dashboard-card {
          background: white;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .dashboard-card.full-width {
          grid-column: 1 / -1;
        }

        .dashboard-card h3 {
          margin: 0 0 20px;
          color: #1f2937;
          font-size: 16px;
        }

        .next-appointment {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 16px;
          background: #f0fdf4;
          border-radius: 10px;
        }

        .apt-date {
          text-align: center;
          padding: 12px 16px;
          background: #10b981;
          border-radius: 10px;
          color: white;
        }

        .apt-date .day {
          display: block;
          font-weight: 600;
          font-size: 14px;
        }

        .apt-date .time {
          display: block;
          font-size: 12px;
          opacity: 0.9;
        }

        .apt-info .advisor {
          margin: 0 0 4px;
          font-weight: 600;
          color: #1f2937;
        }

        .apt-info .type {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          text-transform: capitalize;
        }

        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .note-item {
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 3px solid #10b981;
        }

        .note-item.warning {
          border-left-color: #f59e0b;
        }

        .note-item.recommendation {
          border-left-color: #3b82f6;
        }

        .note-type {
          display: inline-block;
          font-size: 11px;
          color: #059669;
          text-transform: capitalize;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .note-content {
          margin: 0 0 4px;
          color: #4b5563;
          font-size: 14px;
        }

        .note-date {
          font-size: 12px;
          color: #9ca3af;
        }

        .announcements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .announcement-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 10px;
        }

        .priority-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
          align-self: flex-start;
        }

        .ann-content {
          flex: 1;
        }

        .ann-content h4 {
          margin: 0 0 6px;
          color: #1f2937;
          font-size: 15px;
        }

        .ann-content p {
          margin: 0 0 8px;
          color: #4b5563;
          font-size: 14px;
        }

        .ann-date {
          font-size: 12px;
          color: #9ca3af;
        }

        .no-data {
          color: #9ca3af;
          text-align: center;
          padding: 20px;
          font-style: italic;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .welcome-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;