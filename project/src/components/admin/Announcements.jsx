// Announcements.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', targetRole: 'all', priority: 'medium' });
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      if (response.data.success) setAnnouncements(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/announcements', formData);
      setSuccess('Announcement created');
      fetchAnnouncements();
      setShowModal(false);
      setFormData({ title: '', content: '', targetRole: 'all', priority: 'medium' });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete announcement?')) return;
    await api.delete(`/admin/announcements/${id}`);
    fetchAnnouncements();
  };

  const handleToggle = async (ann) => {
    await api.put(`/admin/announcements/${ann.announcement_id}`, { ...ann, isActive: !ann.is_active });
    fetchAnnouncements();
  };

  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className="announcements">
      <div className="header-actions">
        <h2>Announcements</h2>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ New Announcement</button>
      </div>
      {success && <div className="alert success">{success}</div>}
      {loading ? <p>Loading...</p> : (
        <div className="announcements-list">
          {announcements.map(ann => (
            <div key={ann.announcement_id} className={`announcement-card ${!ann.is_active ? 'inactive' : ''}`}>
              <div className="ann-header">
                <h3>{ann.title}</h3>
                <span className="priority" style={{background: `${priorityColors[ann.priority]}20`, color: priorityColors[ann.priority]}}>{ann.priority}</span>
              </div>
              <p className="ann-content">{ann.content}</p>
              <div className="ann-meta">
                <span>Target: {ann.target_role}</span>
                <span>By: {ann.created_by_name}</span>
                <span>{new Date(ann.created_at).toLocaleDateString()}</span>
              </div>
              <div className="ann-actions">
                <button className="btn small" onClick={() => handleToggle(ann)}>{ann.is_active ? 'Deactivate' : 'Activate'}</button>
                <button className="btn small danger" onClick={() => handleDelete(ann.announcement_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>New Announcement</h3><button className="close-btn" onClick={() => setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title *</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="form-group"><label>Content *</label><textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={4} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Target</label><select value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})}><option value="all">All</option><option value="students">Students</option><option value="advisors">Advisors</option></select></div>
                <div className="form-group"><label>Priority</label><select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              </div>
              <div className="form-actions"><button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn primary">Create</button></div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .announcements { animation: fadeIn 0.3s ease; }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .alert.success { background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
        .announcements-list { display: flex; flex-direction: column; gap: 16px; }
        .announcement-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .announcement-card.inactive { opacity: 0.6; }
        .ann-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ann-header h3 { margin: 0; color: #1a1a2e; }
        .priority { padding: 4px 10px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
        .ann-content { color: #4a5568; margin-bottom: 16px; white-space: pre-wrap; }
        .ann-meta { display: flex; gap: 20px; font-size: 13px; color: #718096; margin-bottom: 12px; }
        .ann-actions { display: flex; gap: 8px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; background: #e2e8f0; }
        .btn.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn.small { padding: 6px 12px; font-size: 13px; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
        form { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 500; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
      `}</style>
    </div>
  );
};

export default Announcements;
