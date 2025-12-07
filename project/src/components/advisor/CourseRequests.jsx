// CourseRequests.jsx - Advisor course request management
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { fetchRequests(); }, [filter]);

  const fetchRequests = async () => {
    try {
      const response = await api.get(`/advisor/course-requests?status=${filter}`);
      if (response.data.success) setRequests(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAction = async (id, status, notes = '') => {
    try {
      await api.put(`/advisor/course-requests/${id}`, { status, advisorNotes: notes });
      fetchRequests();
    } catch (err) { console.error(err); }
  };

  const getTypeColor = (type) => {
    const colors = { register: '#10b981', drop: '#ef4444', add: '#3b82f6' };
    return colors[type] || '#718096';
  };

  return (
    <div className="course-requests">
      <h2>Course Requests</h2>
      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="requests-list">
          {requests.map(req => (
            <div key={req.request_id} className="request-card">
              <div className="req-header">
                <div className="student-info">
                  <h3>{req.student_name}</h3>
                  <span>{req.student_number} • GPA: {req.gpa ? parseFloat(req.gpa).toFixed(2) : 'N/A'}</span>
                </div>
                <span className="type" style={{background: `${getTypeColor(req.request_type)}20`, color: getTypeColor(req.request_type)}}>{req.request_type}</span>
              </div>
              <div className="course-info">
                <strong>{req.code}</strong> - {req.course_name}
                <span className="credits">{req.credits} credits</span>
              </div>
              <div className="req-meta">
                <span>Semester: {req.requested_semester}</span>
                <span>Requested: {new Date(req.request_date).toLocaleDateString()}</span>
              </div>
              {filter === 'pending' && (
                <div className="req-actions">
                  <button className="btn success" onClick={() => handleAction(req.request_id, 'approved')}>Approve</button>
                  <button className="btn danger" onClick={() => handleAction(req.request_id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
          {requests.length === 0 && <p className="no-data">No {filter} requests found</p>}
        </div>
      )}
      <style jsx>{`
        .course-requests { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .filters { margin-bottom: 20px; }
        .filters select { padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .requests-list { display: flex; flex-direction: column; gap: 16px; }
        .request-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .req-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .student-info h3 { margin: 0 0 4px; color: #1a1a2e; }
        .student-info span { color: #718096; font-size: 13px; }
        .type { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
        .course-info { padding: 12px 16px; background: #f7fafc; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .credits { color: #047857; font-weight: 500; }
        .req-meta { display: flex; gap: 20px; font-size: 13px; color: #718096; margin-bottom: 12px; }
        .req-actions { display: flex; gap: 8px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn.success { background: #dcfce7; color: #166534; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .no-data { text-align: center; color: #718096; padding: 40px; }
      `}</style>
    </div>
  );
};

export default CourseRequests;