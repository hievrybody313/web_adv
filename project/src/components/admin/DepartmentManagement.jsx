// DepartmentManagement.jsx - Admin component for managing departments
// Located in: src/components/admin/DepartmentManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      if (response.data.success) setDepartments(response.data.data);
    } catch (err) { setError('Failed to fetch departments'); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await api.put(`/admin/departments/${editingDept.department_id}`, formData);
        setSuccess('Department updated');
      } else {
        await api.post('/admin/departments', formData);
        setSuccess('Department created');
      }
      fetchDepartments();
      closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete department?')) return;
    try {
      await api.delete(`/admin/departments/${id}`);
      setSuccess('Deleted'); fetchDepartments();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const closeModal = () => { setShowModal(false); setEditingDept(null); setFormData({ name: '', code: '', description: '' }); };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dept-management">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="header-actions">
        <h2>Manage Departments ({departments.length})</h2>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Add Department</button>
      </div>
      <div className="cards-grid">
        {departments.map(dept => (
          <div key={dept.department_id} className="dept-card">
            <div className="dept-header">
              <h3>{dept.name}</h3>
              <span className="dept-code">{dept.code}</span>
            </div>
            <p className="dept-desc">{dept.description || 'No description'}</p>
            <div className="dept-stats">
              <div><strong>{dept.advisor_count}</strong> Advisors</div>
              <div><strong>{dept.student_count}</strong> Students</div>
              <div><strong>{dept.course_count}</strong> Courses</div>
            </div>
            {dept.head_name && <div className="dept-head">Head: {dept.head_name}</div>}
            <div className="dept-actions">
              <button className="btn small" onClick={() => { setEditingDept(dept); setFormData({ name: dept.name, code: dept.code, description: dept.description || '' }); setShowModal(true); }}>Edit</button>
              <button className="btn small danger" onClick={() => handleDelete(dept.department_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDept ? 'Edit' : 'Add'} Department</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-group"><label>Code *</label><input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required maxLength={10} /></div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">{editingDept ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dept-management { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert.error { background: #fee2e2; color: #991b1b; }
        .alert.success { background: #dcfce7; color: #166534; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .dept-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .dept-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .dept-header h3 { margin: 0; color: #1a1a2e; }
        .dept-code { background: #667eea20; color: #667eea; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .dept-desc { color: #718096; font-size: 14px; margin-bottom: 16px; }
        .dept-stats { display: flex; gap: 16px; margin-bottom: 12px; font-size: 14px; color: #4a5568; }
        .dept-head { font-size: 13px; color: #667eea; margin-bottom: 12px; }
        .dept-actions { display: flex; gap: 8px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; background: #e2e8f0; color: #4a5568; }
        .btn.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn.small { padding: 6px 12px; font-size: 13px; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
        form { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #4a5568; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .loading { text-align: center; padding: 40px; color: #718096; }
      `}</style>
    </div>
  );
};

export default DepartmentManagement;
