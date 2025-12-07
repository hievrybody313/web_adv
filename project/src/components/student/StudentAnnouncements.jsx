// StudentAnnouncements.jsx - View announcements
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/student/announcements');
      if (response.data.success) setAnnouncements(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  if (loading) return <div className="loading">Loading announcements...</div>;

  return (
    <div className="student-announcements">
      <h2>📢 Announcements</h2>
      
      {announcements.length > 0 ? (
        <div className="announcements-list">
          {announcements.map(ann => (
            <div key={ann.announcement_id} className="announcement-card">
              <div className="ann-header">
                <span 
                  className="priority"
                  style={{ background: `${priorityColors[ann.priority]}15`, color: priorityColors[ann.priority] }}
                >
                  {ann.priority} priority
                </span>
                <span className="date">{new Date(ann.created_at).toLocaleDateString()}</span>
              </div>
              <h3>{ann.title}</h3>
              <p className="content">{ann.content}</p>
              <div className="ann-footer">
                <span className="author">Posted by {ann.author_name}</span>
                {ann.expires_at && (
                  <span className="expires">Expires: {new Date(ann.expires_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <span className="icon">📢</span>
          <p>No announcements at this time</p>
        </div>
      )}

      <style jsx>{`
        .student-announcements { animation: fadeIn 0.3s ease; }
        h2 { margin: 0 0 24px; color: #1f2937; }
        .announcements-list { display: flex; flex-direction: column; gap: 16px; }
        .announcement-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .ann-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .priority { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .date { font-size: 13px; color: #6b7280; }
        .announcement-card h3 { margin: 0 0 12px; color: #1f2937; }
        .content { margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap; }
        .ann-footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; }
        .no-data { text-align: center; padding: 60px; background: white; border-radius: 16px; }
        .no-data .icon { font-size: 48px; display: block; margin-bottom: 12px; }
        .no-data p { color: #6b7280; margin: 0; }
        .loading { text-align: center; padding: 40px; color: #6b7280; }
      `}</style>
    </div>
  );
};

export default StudentAnnouncements;
