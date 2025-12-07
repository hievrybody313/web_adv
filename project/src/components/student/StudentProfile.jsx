// StudentProfile.jsx - View and edit student profile
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        setPhone(response.data.data.phone || '');
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      await api.put('/student/profile', { phone });
      setSuccess('Profile updated successfully');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    const colors = { good_standing: '#10b981', probation: '#f59e0b', suspended: '#ef4444' };
    return colors[status] || '#6b7280';
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Failed to load profile</div>;

  return (
    <div className="student-profile">
      {success && <div className="alert success">{success}</div>}

      <div className="profile-header">
        <div className="avatar">{profile.first_name[0]}{profile.last_name[0]}</div>
        <div className="header-info">
          <h2>{profile.first_name} {profile.last_name}</h2>
          <p className="student-id">{profile.student_number}</p>
          <span 
            className="status-badge"
            style={{ background: `${getStatusColor(profile.academic_status)}15`, color: getStatusColor(profile.academic_status) }}
          >
            {profile.academic_status?.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Full Name</span>
              <span className="value">{profile.first_name} {profile.last_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Username</span>
              <span className="value">@{profile.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone</span>
              {editing ? (
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="edit-input" />
              ) : (
                <span className="value">{profile.phone || 'Not provided'}</span>
              )}
            </div>
          </div>
          <div className="card-actions">
            {editing ? (
              <>
                <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn primary" onClick={handleSave}>Save</button>
              </>
            ) : (
              <button className="btn" onClick={() => setEditing(true)}>Edit Phone</button>
            )}
          </div>
        </div>

        <div className="profile-card">
          <h3>Academic Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Major</span>
              <span className="value">{profile.major_name} ({profile.major_code})</span>
            </div>
            <div className="info-item">
              <span className="label">GPA</span>
              <span className="value gpa">{profile.gpa ? parseFloat(profile.gpa).toFixed(2) : 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Enrollment Date</span>
              <span className="value">{profile.enrollment_date ? new Date(profile.enrollment_date).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Expected Graduation</span>
              <span className="value">{profile.expected_graduation ? new Date(profile.expected_graduation).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Assigned Advisor</h3>
          <div className="advisor-info">
            <div className="advisor-avatar">👨‍🏫</div>
            <div className="advisor-details">
              <h4>{profile.advisor_name}</h4>
              <p>{profile.advisor_email}</p>
              <p>Office: {profile.advisor_office || 'N/A'}</p>
              {profile.advisor_phone && <p>Ext: {profile.advisor_phone}</p>}
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Credits Progress</h3>
          <div className="credits-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(100, (profile.creditsSummary.completed / profile.creditsSummary.required) * 100)}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <div className="stat">
                <span className="number">{profile.creditsSummary.completed}</span>
                <span className="label">Completed</span>
              </div>
              <div className="stat">
                <span className="number">{profile.creditsSummary.inProgress}</span>
                <span className="label">In Progress</span>
              </div>
              <div className="stat">
                <span className="number">{profile.creditsSummary.required - profile.creditsSummary.completed}</span>
                <span className="label">Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .student-profile { animation: fadeIn 0.3s ease; }
        .alert.success { background: #dcfce7; color: #166534; padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; }
        .profile-header { display: flex; gap: 20px; align-items: center; margin-bottom: 30px; padding: 24px; background: white; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 700; }
        .header-info h2 { margin: 0 0 4px; color: #1f2937; }
        .student-id { color: #6b7280; margin: 0 0 8px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: capitalize; }
        .profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
        .profile-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .profile-card h3 { margin: 0 0 20px; color: #1f2937; font-size: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
        .info-list { display: flex; flex-direction: column; gap: 14px; }
        .info-item { display: flex; justify-content: space-between; align-items: center; }
        .info-item .label { color: #6b7280; font-size: 14px; }
        .info-item .value { color: #1f2937; font-weight: 500; }
        .info-item .value.gpa { font-size: 20px; color: #10b981; }
        .edit-input { padding: 8px 12px; border: 2px solid #10b981; border-radius: 8px; font-size: 14px; width: 150px; }
        .card-actions { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 10px; justify-content: flex-end; }
        .btn { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; background: #e5e7eb; color: #4b5563; }
        .btn.primary { background: #10b981; color: white; }
        .advisor-info { display: flex; gap: 16px; align-items: center; }
        .advisor-avatar { width: 60px; height: 60px; background: #f0fdf4; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .advisor-details h4 { margin: 0 0 4px; color: #1f2937; }
        .advisor-details p { margin: 0; color: #6b7280; font-size: 14px; }
        .credits-progress { text-align: center; }
        .progress-bar { height: 16px; background: #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 8px; transition: width 0.5s ease; }
        .progress-stats { display: flex; justify-content: space-around; }
        .stat { text-align: center; }
        .stat .number { display: block; font-size: 24px; font-weight: 700; color: #10b981; }
        .stat .label { font-size: 12px; color: #6b7280; }
        .loading, .error { text-align: center; padding: 40px; color: #6b7280; }
      `}</style>
    </div>
  );
};

export default StudentProfile;