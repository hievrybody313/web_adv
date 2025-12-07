// SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data.success) setSettings(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async (key) => {
    try {
      await api.put(`/admin/settings/${key}`, { value: editValue });
      setSuccess('Setting updated');
      setEditingKey(null);
      fetchSettings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const defaultSettings = [
    { key: 'semester_start', label: 'Current Semester Start', defaultValue: '' },
    { key: 'semester_end', label: 'Current Semester End', defaultValue: '' },
    { key: 'registration_open', label: 'Registration Open', defaultValue: 'true' },
    { key: 'max_credits_per_semester', label: 'Max Credits Per Semester', defaultValue: '18' },
    { key: 'graduation_credits', label: 'Graduation Required Credits', defaultValue: '120' }
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="system-settings">
      <h2>System Settings</h2>
      {success && <div className="alert success">{success}</div>}
      <div className="settings-list">
        {defaultSettings.map(({ key, label, defaultValue }) => {
          const setting = settings.find(s => s.setting_key === key);
          const value = setting?.setting_value || defaultValue;
          const isEditing = editingKey === key;
          return (
            <div key={key} className="setting-item">
              <div className="setting-info">
                <label>{label}</label>
                <span className="setting-key">{key}</span>
              </div>
              {isEditing ? (
                <div className="setting-edit">
                  <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button className="btn small primary" onClick={() => handleSave(key)}>Save</button>
                  <button className="btn small" onClick={() => setEditingKey(null)}>Cancel</button>
                </div>
              ) : (
                <div className="setting-value">
                  <span>{value || 'Not set'}</span>
                  <button className="btn small" onClick={() => { setEditingKey(key); setEditValue(value); }}>Edit</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .system-settings { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .alert.success { background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
        .settings-list { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .setting-item:last-child { border-bottom: none; }
        .setting-info label { display: block; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
        .setting-key { font-size: 12px; color: #718096; font-family: monospace; }
        .setting-value, .setting-edit { display: flex; align-items: center; gap: 12px; }
        .setting-value span { color: #4a5568; min-width: 150px; }
        .setting-edit input { padding: 8px 12px; border: 2px solid #667eea; border-radius: 6px; width: 200px; }
        .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; background: #e2e8f0; }
        .btn.primary { background: #667eea; color: white; }
        .btn.small { padding: 6px 12px; }
      `}</style>
    </div>
  );
};

export default SystemSettings;
