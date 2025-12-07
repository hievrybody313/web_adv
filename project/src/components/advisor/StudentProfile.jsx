// StudentProfile.jsx - Detailed student profile view
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentProfile = ({ student, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState({ content: '', noteType: 'session_note', isVisibleToStudent: true });

  useEffect(() => { if (student) fetchProfile(); }, [student]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/advisor/students/${student.student_id}`);
      if (response.data.success) setProfile(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/advisor/students/${student.student_id}/notes`, newNote);
      setNewNote({ content: '', noteType: 'session_note', isVisibleToStudent: true });
      fetchProfile();
    } catch (err) { console.error(err); }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await api.put(`/advisor/course-requests/${requestId}`, { status });
      fetchProfile();
    } catch (err) { console.error(err); }
  };

  const getGradeColor = (grade) => {
    if (!grade) return '#718096';
    if (['A', 'A+', 'A-'].includes(grade)) return '#10b981';
    if (['B', 'B+', 'B-'].includes(grade)) return '#3b82f6';
    if (['C', 'C+', 'C-'].includes(grade)) return '#f59e0b';
    if (['D', 'D+', 'D-'].includes(grade)) return '#ef4444';
    return '#ef4444';
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div className="student-profile">
      <button className="back-btn" onClick={onBack}>← Back to Students</button>
      
      <div className="profile-header">
        <div className="avatar">{profile.first_name[0]}{profile.last_name[0]}</div>
        <div className="header-info">
          <h2>{profile.first_name} {profile.last_name}</h2>
          <p>{profile.student_number} • {profile.email}</p>
          <div className="header-meta">
            <span className="badge">{profile.major_name}</span>
            <span className={`status ${profile.academic_status}`}>{profile.academic_status?.replace('_', ' ')}</span>
            <span className="gpa">GPA: <strong>{profile.gpa ? parseFloat(profile.gpa).toFixed(2) : 'N/A'}</strong></span>
          </div>
        </div>
        <div className="credits-summary">
          <div className="credit-item"><span>{profile.creditsSummary?.completed || 0}</span>Completed</div>
          <div className="credit-item"><span>{profile.creditsSummary?.current || 0}</span>In Progress</div>
        </div>
      </div>

      <div className="tabs">
        {['overview', 'courses', 'notes', 'requests'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="card">
              <h3>Contact Information</h3>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
              <p><strong>Enrolled:</strong> {profile.enrollment_date ? new Date(profile.enrollment_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Expected Graduation:</strong> {profile.expected_graduation ? new Date(profile.expected_graduation).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="card">
              <h3>Upcoming Appointments</h3>
              {profile.upcomingAppointments?.length > 0 ? profile.upcomingAppointments.map(apt => (
                <div key={apt.appointment_id} className="appointment-item">
                  <span>{new Date(apt.appointment_date).toLocaleString()}</span>
                  <span className="type">{apt.meeting_type}</span>
                </div>
              )) : <p className="no-data">No upcoming appointments</p>}
            </div>
            <div className="card">
              <h3>Pending Requests</h3>
              {profile.pendingRequests?.length > 0 ? profile.pendingRequests.map(req => (
                <div key={req.request_id} className="request-item">
                  <span><strong>{req.code}</strong> - {req.name}</span>
                  <span className={`type ${req.request_type}`}>{req.request_type}</span>
                </div>
              )) : <p className="no-data">No pending requests</p>}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h3>Academic History</h3>
            <table>
              <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Semester</th><th>Status</th><th>Grade</th></tr></thead>
              <tbody>
                {profile.academicHistory?.map(course => (
                  <tr key={course.enrollment_id}>
                    <td><strong>{course.code}</strong></td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.semester}</td>
                    <td><span className={`status-badge ${course.status}`}>{course.status}</span></td>
                    <td style={{color: getGradeColor(course.grade), fontWeight: 600}}>{course.grade || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-section">
            <form onSubmit={handleAddNote} className="add-note-form">
              <h3>Add New Note</h3>
              <textarea value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} placeholder="Write your advising note..." rows={3} required />
              <div className="note-options">
                <select value={newNote.noteType} onChange={e => setNewNote({...newNote, noteType: e.target.value})}>
                  <option value="session_note">Session Note</option>
                  <option value="recommendation">Recommendation</option>
                  <option value="warning">Warning</option>
                  <option value="progress_update">Progress Update</option>
                </select>
                <label><input type="checkbox" checked={newNote.isVisibleToStudent} onChange={e => setNewNote({...newNote, isVisibleToStudent: e.target.checked})} /> Visible to student</label>
                <button type="submit" className="btn primary">Add Note</button>
              </div>
            </form>
            <div className="notes-list">
              <h3>Previous Notes</h3>
              {profile.advisingNotes?.map(note => (
                <div key={note.note_id} className={`note-card ${note.note_type}`}>
                  <div className="note-header">
                    <span className="note-type">{note.note_type?.replace('_', ' ')}</span>
                    <span className="note-date">{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                  <p>{note.content}</p>
                  {!note.is_visible_to_student && <span className="private-badge">Private</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-section">
            <h3>Course Requests</h3>
            {profile.pendingRequests?.length > 0 ? (
              <table>
                <thead><tr><th>Course</th><th>Type</th><th>Semester</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {profile.pendingRequests.map(req => (
                    <tr key={req.request_id}>
                      <td><strong>{req.code}</strong> - {req.name}</td>
                      <td><span className={`type-badge ${req.request_type}`}>{req.request_type}</span></td>
                      <td>{req.requested_semester}</td>
                      <td>{new Date(req.request_date).toLocaleDateString()}</td>
                      <td>
                        <button className="btn small success" onClick={() => handleRequestAction(req.request_id, 'approved')}>Approve</button>
                        <button className="btn small danger" onClick={() => handleRequestAction(req.request_id, 'rejected')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No pending course requests</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        .student-profile { animation: fadeIn 0.3s ease; }
        .back-btn { background: none; border: none; color: #047857; font-size: 14px; cursor: pointer; margin-bottom: 20px; padding: 0; }
        .profile-header { display: flex; gap: 20px; background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #047857 0%, #065f46 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 600; }
        .header-info { flex: 1; }
        .header-info h2 { margin: 0 0 4px; }
        .header-info p { color: #718096; margin: 0 0 12px; }
        .header-meta { display: flex; gap: 12px; align-items: center; }
        .badge { background: #04785720; color: #047857; padding: 4px 12px; border-radius: 12px; font-size: 13px; }
        .status { padding: 4px 12px; border-radius: 12px; font-size: 13px; text-transform: capitalize; }
        .status.good_standing { background: #dcfce7; color: #166534; }
        .status.probation { background: #fef3c7; color: #b45309; }
        .status.suspended { background: #fee2e2; color: #991b1b; }
        .gpa { color: #4a5568; }
        .credits-summary { display: flex; gap: 20px; }
        .credit-item { text-align: center; padding: 12px 20px; background: #f7fafc; border-radius: 8px; }
        .credit-item span { display: block; font-size: 24px; font-weight: 600; color: #047857; }
        .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; background: #e2e8f0; text-transform: capitalize; font-weight: 500; }
        .tab.active { background: #047857; color: white; }
        .tab-content { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .card { background: #f7fafc; padding: 20px; border-radius: 8px; }
        .card h3 { margin: 0 0 16px; color: #1a1a2e; font-size: 16px; }
        .card p { margin: 8px 0; color: #4a5568; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; font-size: 13px; }
        .status-badge { padding: 3px 8px; border-radius: 10px; font-size: 11px; text-transform: capitalize; }
        .status-badge.current { background: #dbeafe; color: #1d4ed8; }
        .status-badge.completed { background: #dcfce7; color: #166534; }
        .status-badge.dropped { background: #fee2e2; color: #991b1b; }
        .add-note-form { background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .add-note-form h3 { margin: 0 0 12px; font-size: 16px; }
        .add-note-form textarea { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; resize: vertical; }
        .note-options { display: flex; gap: 12px; align-items: center; margin-top: 12px; }
        .note-options select { padding: 8px 12px; border: 2px solid #e2e8f0; border-radius: 6px; }
        .note-options label { display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .notes-list h3 { margin: 0 0 16px; font-size: 16px; }
        .note-card { background: #f7fafc; padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #047857; }
        .note-card.warning { border-left-color: #f59e0b; }
        .note-card.recommendation { border-left-color: #3b82f6; }
        .note-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .note-type { font-size: 12px; color: #047857; text-transform: capitalize; font-weight: 500; }
        .note-date { font-size: 12px; color: #718096; }
        .note-card p { margin: 0; color: #4a5568; }
        .private-badge { display: inline-block; margin-top: 8px; font-size: 11px; background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 10px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn.primary { background: #047857; color: white; }
        .btn.small { padding: 6px 10px; font-size: 12px; margin-right: 8px; }
        .btn.success { background: #dcfce7; color: #166534; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .type-badge { padding: 3px 8px; border-radius: 10px; font-size: 11px; }
        .type-badge.register { background: #dcfce7; color: #166534; }
        .type-badge.drop { background: #fee2e2; color: #991b1b; }
        .no-data { color: #718096; font-style: italic; }
        .loading, .error { text-align: center; padding: 40px; color: #718096; }
      `}</style>
    </div>
  );
};

export default StudentProfile;