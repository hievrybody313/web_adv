// AdminDashboard.jsx - Admin Dashboard page
// Located in: src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Sub-components for different admin features
import AdvisorManagement from '../components/admin/AdvisorManagement';
import StudentManagement from '../components/admin/StudentManagement';
import CourseManagement from '../components/admin/CourseManagement';
import DepartmentManagement from '../components/admin/DepartmentManagement';
import AppointmentManagement from '../components/admin/AppointmentManagement';
import SystemSettings from '../components/admin/SystemSettings';
import Reports from '../components/admin/Reports';
import AuditLogs from '../components/admin/AuditLogs';
import Announcements from '../components/admin/Announcements';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardError('');
      console.log('Fetching dashboard data...');
      const response = await api.get('/admin/reports/dashboard');
      console.log('Dashboard response:', response.data);
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setDashboardError(response.data.message || 'Failed to load data');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      const errMsg = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      setDashboardError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'advisors', label: 'Manage Advisors', icon: '👨‍🏫' },
    { id: 'students', label: 'Manage Students', icon: '👨‍🎓' },
    { id: 'courses', label: 'Manage Courses', icon: '📚' },
    { id: 'departments', label: 'Manage Departments', icon: '🏛️' },
    { id: 'appointments', label: 'Manage Appointments', icon: '📅' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'reports', label: 'View Reports', icon: '📈' },
    { id: 'logs', label: 'View Logs', icon: '📋' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview data={dashboardData} loading={loading} error={dashboardError} />;
      case 'advisors':
        return <AdvisorManagement />;
      case 'students':
        return <StudentManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'announcements':
        return <Announcements />;
      case 'settings':
        return <SystemSettings />;
      case 'reports':
        return <Reports />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <DashboardOverview data={dashboardData} loading={loading} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? 'AS' : 'Admin Panel'}</h2>
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
            <span className="user-info">
              Welcome, <strong>{user?.firstName} {user?.lastName}</strong>
            </span>
            <span className="role-badge admin">Admin</span>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
        }

        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
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
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          color: #f87171;
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
          color: #1a1a2e;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          color: #4a5568;
        }

        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-badge.admin {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
const DashboardOverview = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load dashboard data</p>
        <small style={{color: '#e53e3e', marginTop: '10px', display: 'block'}}>{error}</small>
      </div>
    );
  }

  if (!data) {
    return <div className="error-state">No dashboard data available</div>;
  }

  const statCards = [
    { label: 'Total Students', value: data.counts.students, icon: '👨‍🎓', color: '#667eea' },
    { label: 'Total Advisors', value: data.counts.advisors, icon: '👨‍🏫', color: '#48bb78' },
    { label: 'Active Courses', value: data.counts.courses, icon: '📚', color: '#ed8936' },
    { label: 'Departments', value: data.counts.departments, icon: '🏛️', color: '#9f7aea' },
    { label: 'Pending Requests', value: data.counts.pendingRequests, icon: '📝', color: '#f56565' },
    { label: 'Upcoming Appointments', value: data.counts.upcomingAppointments, icon: '📅', color: '#38b2ac' },
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
          <h3>Students by Status</h3>
          <div className="status-list">
            {data.studentsByStatus && data.studentsByStatus.length > 0 ? data.studentsByStatus.map((status, index) => (
              <div key={index} className="status-item">
                <span className="status-label">
                  {status.academic_status.replace('_', ' ')}
                </span>
                <span className="status-count">{status.count}</span>
              </div>
            )) : <p className="no-data">No student data available</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-action">{activity.action}</span>
                <span className="activity-user">{activity.user_name}</span>
                <span className="activity-time">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
            )) : <p className="no-data">No recent activity</p>}
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
          color: #1a1a2e;
        }

        .stat-info p {
          margin: 4px 0 0;
          color: #718096;
          font-size: 14px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .dashboard-card h3 {
          margin: 0 0 20px;
          color: #1a1a2e;
          font-size: 18px;
        }

        .status-list, .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .status-label {
          text-transform: capitalize;
          color: #4a5568;
        }

        .status-count {
          font-weight: 600;
          color: #1a1a2e;
        }

        .activity-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
          gap: 4px;
        }

        .activity-action {
          font-weight: 500;
          color: #1a1a2e;
        }

        .activity-user {
          color: #667eea;
          font-size: 14px;
        }

        .activity-time {
          color: #a0aec0;
          font-size: 12px;
        }

        .no-data {
          color: #a0aec0;
          font-size: 14px;
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
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;