// AdvisorDashboard.jsx - Advisor Dashboard page
// Located in: src/pages/AdvisorDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Sub-components for advisor features
import StudentList from '../components/advisor/StudentList';
import StudentProfile from '../components/advisor/StudentProfile';
import AppointmentManager from '../components/advisor/AppointmentManager';
import CourseRequests from '../components/advisor/CourseRequests';
import AdvisingNotes from '../components/advisor/AdvisingNotes';
import CourseSuggestions from '../components/advisor/CourseSuggestions';
import StudentProgress from '../components/advisor/StudentProgress';
import Messaging from '../components/advisor/Messaging';

const AdvisorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/advisor/dashboard');
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
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'My Students', icon: '👨‍🎓' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'requests', label: 'Course Requests', icon: '📝' },
    { id: 'suggestions', label: 'Suggest Courses', icon: '💡' },
    { id: 'progress', label: 'Student Progress', icon: '📈' },
    { id: 'messages', label: 'Messages', icon: '💬' },
  ];

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setActiveTab('student-profile');
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setActiveTab('students');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview data={dashboardData} loading={loading} onViewStudent={handleViewStudent} />;
      case 'students':
        return <StudentList onViewStudent={handleViewStudent} />;
      case 'student-profile':
        return <StudentProfile student={selectedStudent} onBack={handleBackToStudents} />;
      case 'appointments':
        return <AppointmentManager />;
      case 'requests':
        return <CourseRequests />;
      case 'suggestions':
        return <CourseSuggestions />;
      case 'progress':
        return <StudentProgress />;
      case 'messages':
        return <Messaging />;
      default:
        return <DashboardOverview data={dashboardData} loading={loading} onViewStudent={handleViewStudent} />;
    }
  };

  return (
    <div className="advisor-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? 'AS' : 'Advisor Panel'}</h2>
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
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'student-profile') {
                  setSelectedStudent(null);
                }
              }}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              {item.id === 'requests' && dashboardData?.counts?.pendingRequests > 0 && (
                <span className="badge">{dashboardData.counts.pendingRequests}</span>
              )}
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
            <h1>
              {activeTab === 'student-profile' && selectedStudent 
                ? `Student: ${selectedStudent.first_name} ${selectedStudent.last_name}`
                : menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <span className="user-info">
              Welcome, <strong>{user?.firstName} {user?.lastName}</strong>
            </span>
            <span className="dept-badge">{user?.department_name || 'Department'}</span>
            <span className="role-badge advisor">Advisor</span>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      <style jsx>{`
        .advisor-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
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
          font-size: 20px;
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
          border-radius: 8px;
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
          border-radius: 8px;
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
          color: #4a5568;
        }

        .dept-badge {
          padding: 6px 12px;
          background: #f0fdf4;
          color: #047857;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-badge.advisor {
          background: linear-gradient(135deg, #047857 0%, #065f46 100%);
          color: white;
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
const DashboardOverview = ({ data, loading, onViewStudent }) => {
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
    { label: 'Assigned Students', value: data.counts.students, icon: '👨‍🎓', color: '#047857' },
    { label: 'Pending Requests', value: data.counts.pendingRequests, icon: '📝', color: '#f59e0b' },
    { label: 'Upcoming Appointments', value: data.counts.upcomingAppointments, icon: '📅', color: '#3b82f6' },
    { label: 'Unread Messages', value: data.counts.unreadMessages, icon: '💬', color: '#8b5cf6' },
  ];

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
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
        <div className="dashboard-card">
          <h3>Students by Academic Status</h3>
          <div className="status-list">
            {data.studentsByStatus.map((status, index) => (
              <div key={index} className="status-item">
                <span className={`status-dot ${status.academic_status}`}></span>
                <span className="status-label">
                  {status.academic_status.replace('_', ' ')}
                </span>
                <span className="status-count">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Appointments</h3>
          <div className="appointment-list">
            {data.recentAppointments.length > 0 ? (
              data.recentAppointments.map((apt, index) => (
                <div key={index} className="appointment-item">
                  <div className="apt-info">
                    <span className="apt-student">{apt.student_name}</span>
                    <span className="apt-date">
                      {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className={`apt-type ${apt.meeting_type}`}>
                    {apt.meeting_type}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No upcoming appointments</p>
            )}
          </div>
        </div>

        <div className="dashboard-card full-width">
          <h3>Pending Course Requests</h3>
          <div className="requests-list">
            {data.recentRequests.length > 0 ? (
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Semester</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentRequests.map((req, index) => (
                    <tr key={index}>
                      <td>{req.student_name}</td>
                      <td><strong>{req.code}</strong> - {req.course_name}</td>
                      <td>
                        <span className={`request-type ${req.request_type}`}>
                          {req.request_type}
                        </span>
                      </td>
                      <td>{req.requested_semester}</td>
                      <td>{new Date(req.request_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No pending course requests</p>
            )}
          </div>
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 4px solid;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
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
          color: #065f46;
        }

        .stat-info p {
          margin: 4px 0 0;
          color: #718096;
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
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .dashboard-card.full-width {
          grid-column: 1 / -1;
        }

        .dashboard-card h3 {
          margin: 0 0 20px;
          color: #065f46;
          font-size: 18px;
        }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .status-dot.good_standing {
          background: #10b981;
        }

        .status-dot.probation {
          background: #f59e0b;
        }

        .status-dot.suspended {
          background: #ef4444;
        }

        .status-label {
          flex: 1;
          text-transform: capitalize;
          color: #4a5568;
        }

        .status-count {
          font-weight: 600;
          color: #065f46;
        }

        .appointment-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .appointment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .apt-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .apt-student {
          font-weight: 500;
          color: #1a1a2e;
        }

        .apt-date {
          font-size: 13px;
          color: #718096;
        }

        .apt-type {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .apt-type.in_person {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .apt-type.virtual {
          background: #ede9fe;
          color: #7c3aed;
        }

        .apt-type.phone {
          background: #fef3c7;
          color: #b45309;
        }

        .requests-table {
          width: 100%;
          border-collapse: collapse;
        }

        .requests-table th,
        .requests-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .requests-table th {
          background: #f7fafc;
          font-weight: 600;
          color: #4a5568;
          font-size: 13px;
        }

        .requests-table td {
          color: #2d3748;
        }

        .request-type {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .request-type.register {
          background: #dcfce7;
          color: #166534;
        }

        .request-type.drop {
          background: #fee2e2;
          color: #991b1b;
        }

        .request-type.add {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .no-data {
          color: #a0aec0;
          text-align: center;
          padding: 20px;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #718096;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #047857;
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
        }
      `}</style>
    </div>
  );
};

export default AdvisorDashboard;
