// StudentManagement.jsx - Admin component for managing students
// Located in: src/components/admin/StudentManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filters, setFilters] = useState({
    departmentId: '',
    advisorId: '',
    status: ''
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    studentNumber: '',
    majorId: '',
    advisorId: '',
    gpa: '',
    academicStatus: 'good_standing',
    enrollmentDate: '',
    expectedGraduation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchAdvisors();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.departmentId) params.append('departmentId', filters.departmentId);
      if (filters.advisorId) params.append('advisorId', filters.advisorId);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/admin/students?${params}`);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch students');
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

  const fetchAdvisors = async () => {
    try {
      const response = await api.get('/admin/advisors');
      if (response.data.success) {
        setAdvisors(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch advisors');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingStudent) {
        await api.put(`/admin/students/${editingStudent.student_id}`, formData);
        setSuccess('Student updated successfully');
      } else {
        await api.post('/admin/students', formData);
        setSuccess('Student created successfully');
      }
      fetchStudents();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      email: student.email,
      password: '',
      firstName: student.first_name,
      lastName: student.last_name,
      phone: student.phone || '',
      studentNumber: student.student_number,
      majorId: student.department_id,
      advisorId: student.advisor_id,
      gpa: student.gpa || '',
      academicStatus: student.academic_status,
      enrollmentDate: student.enrollment_date?.split('T')[0] || '',
      expectedGraduation: student.expected_graduation?.split('T')[0] || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/admin/students/${studentId}`);
      setSuccess('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password (min 8 characters):');
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
      setSuccess('Password reset successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      studentNumber: '',
      majorId: '',
      advisorId: '',
      gpa: '',
      academicStatus: 'good_standing',
      enrollmentDate: '',
      expectedGraduation: ''
    });
    setError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good_standing': return '#10b981';
      case 'probation': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#718096';
    }
  };

  return (
    <div className="student-management">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <h2>Manage Students ({students.length})</h2>
        <button className="btn primary" onClick={() => setShowModal(true)}>
          + Add Student
        </button>
      </div>

      <div className="filters">
        <select name="departmentId" value={filters.departmentId} onChange={handleFilterChange}>
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select name="advisorId" value={filters.advisorId} onChange={handleFilterChange}>
          <option value="">All Advisors</option>
          {advisors.map(advisor => (
            <option key={advisor.advisor_id} value={advisor.advisor_id}>
              {advisor.first_name} {advisor.last_name}
            </option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="good_standing">Good Standing</option>
          <option value="probation">Probation</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Email</th>
                <th>Major</th>
                <th>Advisor</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.student_id}>
                  <td>
                    <strong>{student.first_name} {student.last_name}</strong>
                    <br />
                    <small>@{student.username}</small>
                  </td>
                  <td>{student.student_number}</td>
                  <td>{student.email}</td>
                  <td>{student.major_name}</td>
                  <td>{student.advisor_name}</td>
                  <td>{student.gpa ? parseFloat(student.gpa).toFixed(2) : '-'}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: `${getStatusColor(student.academic_status)}20`, 
                               color: getStatusColor(student.academic_status) }}
                    >
                      {student.academic_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn small" onClick={() => handleEdit(student)}>
                        Edit
                      </button>
                      <button 
                        className="btn small warning"
                        onClick={() => handleResetPassword(student.user_id)}
                      >
                        Reset PW
                      </button>
                      <button 
                        className="btn small danger"
                        onClick={() => handleDelete(student.student_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="no-data">No students found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
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
                  <label>Student Number *</label>
                  <input
                    type="text"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingStudent}
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
                    disabled={!!editingStudent}
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
                {!editingStudent && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingStudent}
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
                  <label>Major *</label>
                  <select
                    name="majorId"
                    value={formData.majorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Major</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Advisor *</label>
                  <select
                    name="advisorId"
                    value={formData.advisorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Advisor</option>
                    {advisors.map(advisor => (
                      <option key={advisor.advisor_id} value={advisor.advisor_id}>
                        {advisor.first_name} {advisor.last_name} ({advisor.department_name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>GPA</label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="4"
                  />
                </div>
                <div className="form-group">
                  <label>Academic Status</label>
                  <select
                    name="academicStatus"
                    value={formData.academicStatus}
                    onChange={handleInputChange}
                  >
                    <option value="good_standing">Good Standing</option>
                    <option value="probation">Probation</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Enrollment Date</label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Expected Graduation</label>
                  <input
                    type="date"
                    name="expectedGraduation"
                    value={formData.expectedGraduation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingStudent ? 'Update' : 'Create'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .student-management {
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

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filters select {
          padding: 10px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          min-width: 180px;
        }

        .filters select:focus {
          outline: none;
          border-color: #667eea;
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
          text-transform: capitalize;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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
          padding: 6px 10px;
          font-size: 12px;
        }

        .btn.warning {
          background: #fef3c7;
          color: #b45309;
        }

        .btn.danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #718096;
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
          max-width: 700px;
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

          .filters {
            flex-direction: column;
          }

          .filters select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentManagement;