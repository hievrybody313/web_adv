// AcademicPlan.jsx - View completed, current, and remaining courses
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AcademicPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => { fetchPlan(); }, []);

  const fetchPlan = async () => {
    try {
      const response = await api.get('/student/academic-plan');
      if (response.data.success) setPlan(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getGradeColor = (grade) => {
    if (!grade) return '#6b7280';
    if (['A', 'A+', 'A-'].includes(grade)) return '#10b981';
    if (['B', 'B+', 'B-'].includes(grade)) return '#3b82f6';
    if (['C', 'C+', 'C-'].includes(grade)) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status) => {
    const colors = { current: '#3b82f6', completed: '#10b981', in_progress: '#8b5cf6', dropped: '#ef4444' };
    return colors[status] || '#6b7280';
  };

  if (loading) return <div className="loading">Loading academic plan...</div>;
  if (!plan) return <div className="error">Failed to load academic plan</div>;

  const tabs = [
    { id: 'current', label: 'Current', count: plan.currentCourses.length, icon: '📚' },
    { id: 'completed', label: 'Completed', count: plan.completedCourses.length, icon: '✅' },
    { id: 'dropped', label: 'Dropped', count: plan.droppedCourses.length, icon: '❌' }
  ];

  const courses = activeTab === 'current' ? plan.currentCourses : 
                  activeTab === 'completed' ? plan.completedCourses : plan.droppedCourses;

  return (
    <div className="academic-plan">
      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-main">
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10"
                strokeDasharray={`${plan.summary.progressPercent * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="progress-text">
              <span className="percent">{plan.summary.progressPercent}%</span>
              <span className="label">Complete</span>
            </div>
          </div>
        </div>
        <div className="progress-stats">
          <div className="stat-item">
            <span className="value">{plan.summary.completedCredits}</span>
            <span className="label">Credits Completed</span>
          </div>
          <div className="stat-item">
            <span className="value">{plan.summary.currentCredits}</span>
            <span className="label">Credits In Progress</span>
          </div>
          <div className="stat-item">
            <span className="value">{plan.summary.remainingCredits}</span>
            <span className="label">Credits Remaining</span>
          </div>
          <div className="stat-item">
            <span className="value gpa">{plan.summary.gpa || 'N/A'}</span>
            <span className="label">Current GPA</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="courses-section">
        {courses.length > 0 ? (
          <div className="courses-list">
            {courses.map(course => (
              <div key={course.enrollment_id} className="course-card">
                <div className="course-main">
                  <div className="course-code">{course.code}</div>
                  <div className="course-info">
                    <h4>{course.name}</h4>
                    <p className="course-meta">
                      {course.department_name} • {course.credits} credits • {course.semester}
                    </p>
                  </div>
                </div>
                <div className="course-status">
                  {activeTab === 'completed' && course.grade && (
                    <span className="grade" style={{ color: getGradeColor(course.grade) }}>
                      {course.grade}
                    </span>
                  )}
                  <span 
                    className="status-badge"
                    style={{ background: `${getStatusColor(course.status)}15`, color: getStatusColor(course.status) }}
                  >
                    {course.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-courses">
            <p>No {activeTab} courses</p>
          </div>
        )}
      </div>

      {/* Credits by Semester */}
      {activeTab === 'completed' && (
        <div className="semester-breakdown">
          <h3>Credits by Semester</h3>
          <div className="semester-list">
            {Object.entries(
              plan.completedCourses.reduce((acc, c) => {
                acc[c.semester] = (acc[c.semester] || 0) + c.credits;
                return acc;
              }, {})
            ).map(([semester, credits]) => (
              <div key={semester} className="semester-item">
                <span className="semester">{semester}</span>
                <div className="credits-bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${Math.min(100, (credits / 18) * 100)}%` }}
                  ></div>
                </div>
                <span className="credits">{credits} cr</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .academic-plan { animation: fadeIn 0.3s ease; }
        .progress-overview { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; display: flex; gap: 40px; align-items: center; }
        .progress-main { position: relative; }
        .progress-circle { width: 160px; height: 160px; position: relative; }
        .progress-circle svg { transform: rotate(-90deg); }
        .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .progress-text .percent { display: block; font-size: 36px; font-weight: 700; color: #10b981; }
        .progress-text .label { font-size: 14px; color: #6b7280; }
        .progress-stats { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-item { text-align: center; padding: 16px; background: #f9fafb; border-radius: 12px; }
        .stat-item .value { display: block; font-size: 28px; font-weight: 700; color: #1f2937; }
        .stat-item .value.gpa { color: #10b981; }
        .stat-item .label { font-size: 13px; color: #6b7280; }
        .tabs { display: flex; gap: 12px; margin-bottom: 24px; }
        .tab { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border: 2px solid #e5e7eb; border-radius: 14px; background: white; cursor: pointer; transition: all 0.2s; }
        .tab:hover { border-color: #10b981; }
        .tab.active { border-color: #10b981; background: #f0fdf4; }
        .tab-icon { font-size: 20px; }
        .tab-label { font-weight: 600; color: #374151; }
        .tab-count { background: #e5e7eb; padding: 2px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; color: #4b5563; }
        .tab.active .tab-count { background: #10b981; color: white; }
        .courses-section { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .courses-list { display: flex; flex-direction: column; gap: 12px; }
        .course-card { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f9fafb; border-radius: 14px; transition: transform 0.2s; }
        .course-card:hover { transform: translateX(4px); }
        .course-main { display: flex; gap: 16px; align-items: center; }
        .course-code { padding: 10px 14px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; font-weight: 700; font-size: 14px; }
        .course-info h4 { margin: 0 0 4px; color: #1f2937; }
        .course-meta { margin: 0; font-size: 13px; color: #6b7280; }
        .course-status { display: flex; align-items: center; gap: 12px; }
        .grade { font-size: 24px; font-weight: 700; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .no-courses { text-align: center; padding: 40px; color: #6b7280; }
        .semester-breakdown { margin-top: 24px; background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .semester-breakdown h3 { margin: 0 0 20px; color: #1f2937; font-size: 16px; }
        .semester-list { display: flex; flex-direction: column; gap: 12px; }
        .semester-item { display: flex; align-items: center; gap: 16px; }
        .semester-item .semester { min-width: 100px; font-weight: 500; color: #374151; }
        .credits-bar { flex: 1; height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden; }
        .bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 5px; }
        .semester-item .credits { min-width: 50px; text-align: right; font-weight: 600; color: #10b981; }
        .loading, .error { text-align: center; padding: 40px; color: #6b7280; }
        @media (max-width: 900px) {
          .progress-overview { flex-direction: column; text-align: center; }
          .progress-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default AcademicPlan;
