// AdvisorFeedback.jsx - View advisor notes and recommendations
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdvisorFeedback = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/student/feedback');
      if (response.data.success) setNotes(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getNoteTypeColor = (type) => {
    const colors = { session_note: '#3b82f6', recommendation: '#10b981', warning: '#f59e0b', progress_update: '#8b5cf6' };
    return colors[type] || '#6b7280';
  };

  const filteredNotes = filter ? notes.filter(n => n.note_type === filter) : notes;

  if (loading) return <div className="loading">Loading feedback...</div>;

  return (
    <div className="advisor-feedback">
      <div className="header">
        <h2>Advisor Feedback & Notes</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="session_note">Session Notes</option>
          <option value="recommendation">Recommendations</option>
          <option value="warning">Warnings</option>
          <option value="progress_update">Progress Updates</option>
        </select>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="notes-list">
          {filteredNotes.map(note => (
            <div key={note.note_id} className="note-card" style={{ borderLeftColor: getNoteTypeColor(note.note_type) }}>
              <div className="note-header">
                <span className="note-type" style={{ background: `${getNoteTypeColor(note.note_type)}15`, color: getNoteTypeColor(note.note_type) }}>
                  {note.note_type?.replace('_', ' ')}
                </span>
                <span className="note-date">{new Date(note.created_at).toLocaleDateString()}</span>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <span className="advisor">From: {note.advisor_name}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <span className="icon">📝</span>
          <p>No feedback from your advisor yet</p>
        </div>
      )}

      <style jsx>{`
        .advisor-feedback { animation: fadeIn 0.3s ease; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .header h2 { margin: 0; color: #1f2937; }
        .header select { padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; }
        .notes-list { display: flex; flex-direction: column; gap: 16px; }
        .note-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid; }
        .note-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .note-type { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .note-date { font-size: 13px; color: #6b7280; }
        .note-content { margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap; }
        .note-footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
        .advisor { font-size: 13px; color: #6b7280; }
        .no-data { text-align: center; padding: 60px; background: white; border-radius: 16px; }
        .no-data .icon { font-size: 48px; display: block; margin-bottom: 12px; }
        .no-data p { color: #6b7280; margin: 0; }
        .loading { text-align: center; padding: 40px; color: #6b7280; }
      `}</style>
    </div>
  );
};

export default AdvisorFeedback;
