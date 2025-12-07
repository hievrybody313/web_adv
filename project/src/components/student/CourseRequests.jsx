// CourseRequests.jsx - Submit and manage course registration requests
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    requestType: 'register',
    requestedSemester: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => { fetchRequests(); }, [filter]);

  const fetchRequests = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await api.get(`/student/course-requests${params}`);
      if (response.data.success) setRequests(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get('/student/courses/available');
      if (response.data.success) setAvailableCourses(response.data.data);
    } catch (err) { console.error(err); }
  };

  const handleOpenForm = () => {
    fetchAvailableCourses();
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.courseId || !formData.requestedSemester) {
      setError('Please select a course and semester');
      return;
    }

    try {
      await api.post('/student/course-requests', formData);
      setSuccess('Course request submitted successfully!');
      setShowForm(false);
      setFormData({ courseId: '', requestType: 'register', requestedSemester: '' });
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      await api.delete(`/student/course-requests/${requestId}`);
      setSuccess('Request cancelled');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const getStatusColor = (status) => {
    const colors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };
    return colors[status] || '#6b7280';
  };

  const getTypeColor = (type) => {
    const colors = { register: '#10b981', add: '#3b82f6', drop: '#ef4444' };
    return colors[type] || '#6b7280';
  };

  const filteredCourses = availableCourses.filter(c => {
    if (courseFilter && !c.name.toLowerCase().includes(courseFilter.toLowerCase()) && 
        !c.code.toLowerCase().includes(courseFilter.toLowerCase())) return false;
    return true;
  });

  const getCurrentSemester = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (month >= 8) return `Fall ${year}`;
    if (month >= 5) return `Summer ${year}`;
    return `Spring ${year}`;
  };

  const getSemesters = () => {
    const current = getCurrentSemester();
    const year = parseInt(current.split(' ')[1]);
    return [
      current,
      `Spring ${year + 1}`,
      `Summer ${year + 1}`,
      `Fall ${year + 1}`
    ];
  };

  return (
    <div className="course-requests">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <div className="filters">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button className="btn primary" onClick={handleOpenForm}>
          + New Course Request
        </button>
      </div>

      {showForm && (
        <div className="request-form">
          <h3>Submit Course Request</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Request Type</label>
                <select 
                  value={formData.requestType}
                  onChange={e => setFormData({...formData, requestType: e.target.value})}
                >
                  <option value="register">Register</option>
                  <option value="add">Add</option>
                  <option value="drop">Drop</option>
                </select>
              </div>
              <div className="form-group">
                <label>Semester *</label>
                <select 
                  value={formData.requestedSemester}
                  onChange={e => setFormData({...formData, requestedSemester: e.target.value})}
                  required
                >
                  <option value="">Select Semester</option>
                  {getSemesters().map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Search Courses</label>
              <input 
                type="text"
                placeholder="Search by course code or name..."
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
              />
            </div>

            <div className="courses-grid">
              {filteredCourses.map(course => (
                <div 
                  key={course.course_id}
                  className={`course-card ${formData.courseId === course.course_id ? 'selected' : ''} 
                              ${course.isEnrolled || course.isCompleted || course.hasPendingRequest ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!course.isEnrolled && !course.isCompleted && !course.hasPendingRequest) {
                      setFormData({...formData, courseId: course.course_id});
                    }
                  }}
                >
                  <div className="course-header">
                    <strong>{course.code}</strong>
                    <span className="credits">{course.credits} cr</span>
                  </div>
                  <p className="course-name">{course.name}</p>
                  <div className="course-status">
                    {course.isCompleted && <span className="badge completed">Completed</span>}
                    {course.isEnrolled && <span className="badge enrolled">Enrolled</span>}
                    {course.hasPendingRequest && <span className="badge pending">Pending</span>}
                    {!course.prerequisitesMet && <span className="badge prereq">Prerequisites Required</span>}
                    {!course.hasCapacity && <span className="badge full">Full</span>}
                  </div>
                  {course.prerequisites?.length > 0 && (
                    <p className="prereqs">Prereqs: {course.prerequisites.map(p => p.code).join(', ')}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn primary" disabled={!formData.courseId}>
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p className="loading">Loading requests...</p> : (
        <div className="requests-list">
          {requests.length > 0 ? requests.map(req => (
            <div key={req.request_id} className="request-card">
              <div className="request-info">
                <div className="course-code">
                  <strong>{req.code}</strong>
                  <span 
                    className="type-badge"
                    style={{ background: `${getTypeColor(req.request_type)}15`, color: getTypeColor(req.request_type) }}
                  >
                    {req.request_type}
                  </span>
                </div>
                <p className="course-name">{req.course_name}</p>
                <div className="request-meta">
                  <span>{req.credits} credits</span>
                  <span>•</span>
                  <span>{req.requested_semester}</span>
                  <span>•</span>
                  <span>Requested: {new Date(req.request_date).toLocaleDateString()}</span>
                </div>
                {req.advisor_notes && (
                  <p className="advisor-notes">
                    <strong>Advisor Notes:</strong> {req.advisor_notes}
                  </p>
                )}
              </div>
              <div className="request-status">
                <span 
                  className="status-badge"
                  style={{ background: `${getStatusColor(req.status)}15`, color: getStatusColor(req.status) }}
                >
                  {req.status}
                </span>
                {req.status === 'pending' && (
                  <button className="btn small danger" onClick={() => handleCancel(req.request_id)}>Cancel</button>
                )}
                {req.decision_date && (
                  <span className="decision-date">
                    {req.status === 'approved' ? '✓ ' : '✗ '}
                    {new Date(req.decision_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )) : (
            <div className="no-data">
              <p>No course requests found</p>
              <button className="btn primary" onClick={handleOpenForm}>Submit Your First Request</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .course-requests { animation: fadeIn 0.3s ease; }
        .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; }
        .alert.error { background: #fef2f2; color: #dc2626; }
        .alert.success { background: #dcfce7; color: #166534; }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .filters select { padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; background: #e5e7eb; color: #4b5563; }
        .btn.primary { background: #10b981; color: white; }
        .btn.small { padding: 6px 12px; font-size: 13px; }
        .btn.danger { background: #fef2f2; color: #dc2626; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .request-form { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; }
        .request-form h3 { margin: 0 0 20px; color: #1f2937; }
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px; }
        .form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #10b981; }
        .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; max-height: 350px; overflow-y: auto; padding: 4px; margin-bottom: 20px; }
        .course-card { padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .course-card:hover:not(.disabled) { border-color: #10b981; }
        .course-card.selected { border-color: #10b981; background: #f0fdf4; }
        .course-card.disabled { opacity: 0.6; cursor: not-allowed; }
        .course-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .course-header strong { color: #10b981; }
        .credits { font-size: 12px; color: #6b7280; }
        .course-name { margin: 0 0 8px; font-size: 14px; color: #374151; }
        .course-status { display: flex; flex-wrap: wrap; gap: 4px; }
        .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
        .badge.completed { background: #dcfce7; color: #166534; }
        .badge.enrolled { background: #dbeafe; color: #1d4ed8; }
        .badge.pending { background: #fef3c7; color: #b45309; }
        .badge.prereq { background: #fee2e2; color: #dc2626; }
        .badge.full { background: #f3f4f6; color: #6b7280; }
        .prereqs { margin: 8px 0 0; font-size: 11px; color: #9ca3af; }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .requests-list { display: flex; flex-direction: column; gap: 16px; }
        .request-card { display: flex; justify-content: space-between; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .course-code { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .course-code strong { font-size: 18px; color: #10b981; }
        .type-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .request-info .course-name { margin: 0 0 8px; color: #374151; }
        .request-meta { display: flex; gap: 8px; font-size: 13px; color: #6b7280; }
        .advisor-notes { margin: 12px 0 0; padding: 10px 12px; background: #f9fafb; border-radius: 8px; font-size: 13px; color: #4b5563; }
        .request-status { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .decision-date { font-size: 12px; color: #6b7280; }
        .no-data { text-align: center; padding: 60px; background: white; border-radius: 16px; }
        .no-data p { color: #6b7280; margin-bottom: 16px; }
        .loading { text-align: center; color: #6b7280; padding: 40px; }
      `}</style>
    </div>
  );
};

export default CourseRequests;
