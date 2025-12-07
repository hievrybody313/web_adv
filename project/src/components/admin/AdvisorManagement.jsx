// AdvisorManagement.jsx - Admin component for managing advisors
// Located in: src/components/admin/AdvisorManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdvisorManagement = () => {
  const [advisors, setAdvisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    departmentId: '',
    officeLocation: '',
    phoneExtension: '',
    maxStudents: 50
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdvisors();
    fetchDepartments();
  }, []);

  const fetchAdvisors = async () => {
    try {
      const response = await api.get('/admin/advisors');
      if (response.data.success) {
        setAdvisors(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch advisors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingAdvisor) {
        await api.put(`/admin/advisors/${editingAdvisor.advisor_id}`, formData);
        setSuccess('Advisor updated successfully');
      } else {
        await api.post('/admin/advisors', formData);
        setSuccess('Advisor created successfully');
      }
      fetchAdvisors();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (advisor) => {
    setEditingAdvisor(advisor);
    setFormData({
      username: advisor.username,
      email: advisor.email,
      password: '',
      firstName: advisor.first_name,
      lastName: advisor.last_name,
      phone: advisor.phone || '',
      departmentId: advisor.department_id,
      officeLocation: advisor.office_location || '',
      phoneExtension: advisor.phone_extension || '',
      maxStudents: advisor.max_students,
      isAvailable: advisor.is_available
    });
    setShowModal(true);
  };

  const handleDelete = async (advisorId) => {
    if (!window.confirm('Are you sure you want to delete this advisor?')) return;

    try {
      await api.delete(`/admin/advisors/${advisorId}`);
      setSuccess('Advisor deleted successfully');
      fetchAdvisors();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete advisor');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      setSuccess(`Advisor ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchAdvisors();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdvisor(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      departmentId: '',
      officeLocation: '',
      phoneExtension: '',
      maxStudents: 50
    });
    setError('');
  };

  if (loading) {
    return <div className="loading">Loading advisors...</div>;
  }

  return (
    <div className="advisor-management">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <h2>Manage Advisors ({advisors.length})</h2>
        <button className="btn primary" onClick={() => setShowModal(true)}>
          + Add Advisor
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Office</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map(advisor => (
              <tr key={advisor.advisor_id}>
                <td>
                  <strong>{advisor.first_name} {advisor.last_name}</strong>
                  <br />
                  <small>@{advisor.username}</small>
                </td>
                <td>{advisor.email}</td>
                <td>{advisor.department_name}</td>
                <td>{advisor.office_location || '-'}</td>
                <td>
                  {advisor.student_count} / {advisor.max_students}
                </td>
                <td>
                  <span className={`status-badge ${advisor.is_active ? 'active' : 'inactive'}`}>
                    {advisor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn small" onClick={() => handleEdit(advisor)}>
                      Edit
                    </button>
                    <button 
                      className={`btn small ${advisor.is_active ? 'warning' : 'success'}`}
                      onClick={() => handleToggleStatus(advisor.user_id, advisor.is_active)}
                    >
                      {advisor.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="btn small danger"
                      onClick={() => handleDelete(advisor.advisor_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAdvisor ? 'Edit Advisor' : 'Add New Advisor'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingAdvisor}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {!editingAdvisor && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingAdvisor}
                      minLength={8}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Office Location</label>
                  <input
                    type="text"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Extension</label>
                  <input
                    type="text"
                    name="phoneExtension"
                    value={formData.phoneExtension}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Max Students</label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    min={1}
                    max={200}
                  />
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingAdvisor ? 'Update' : 'Create'} Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .advisor-management {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-actions h2 {
          margin: 0;
          color: #1a1a2e;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .alert.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        th {
          background: #f7fafc;
          font-weight: 600;
          color: #4a5568;
          font-size: 13px;
          text-transform: uppercase;
        }

        td small {
          color: #718096;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn:hover {
          background: #cbd5e0;
        }

        .btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn.small {
          padding: 6px 12px;
          font-size: 13px;
        }

        .btn.warning {
          background: #fef3c7;
          color: #b45309;
        }

        .btn.success {
          background: #dcfce7;
          color: #166534;
        }

        .btn.danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          color: #1a1a2e;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
        }

        form {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 500;
          color: #4a5568;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-error {
          color: #991b1b;
          font-size: 14px;
          margin-top: 16px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #718096;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvisorManagement;
