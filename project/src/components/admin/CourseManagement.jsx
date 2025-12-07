// CourseManagement.jsx - Admin component for managing courses
// Located in: src/components/admin/CourseManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', description: '', credits: 3,
    departmentId: '', semester: '', capacity: '', prerequisites: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      if (response.data.success) setCourses(response.data.data);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      if (response.data.success) setDepartments(response.data.data);
    } catch (err) {
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
    try {
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse.course_id}`, formData);
        setSuccess('Course updated successfully');
      } else {
        await api.post('/admin/courses', formData);
        setSuccess('Course created successfully');
      }
      fetchCourses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code, name: course.name, description: course.description || '',
      credits: course.credits, departmentId: course.department_id,
      semester: course.semester || '', capacity: course.capacity || '',
      isActive: course.is_active,
      prerequisites: course.prerequisites?.map(p => p.prerequisite_course_id) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      setSuccess('Course deleted');
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({ code: '', name: '', description: '', credits: 3, departmentId: '', semester: '', capacity: '', prerequisites: [] });
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div className="course-management">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <h2>Manage Courses ({courses.length})</h2>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Add Course</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Enrolled</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.course_id}>
                <td><strong>{course.code}</strong></td>
                <td>{course.name}</td>
                <td>{course.department_name}</td>
                <td>{course.credits}</td>
                <td>{course.enrolled_count}{course.capacity && ` / ${course.capacity}`}</td>
                <td>
                  <span className={`status-badge ${course.is_active ? 'active' : 'inactive'}`}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn small" onClick={() => handleEdit(course)}>Edit</button>
                  <button className="btn small danger" onClick={() => handleDelete(course.course_id)}>Delete</button>
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
              <h3>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Code *</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Course Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group" style={{gridColumn: '1/-1'}}>
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                </div>
                <div className="form-group">
                  <label>Credits *</label>
                  <input type="number" name="credits" value={formData.credits} onChange={handleInputChange} min={1} max={6} required />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} required>
                    <option value="">Select</option>
                    {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="e.g., Fall 2025" />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} min={1} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">{editingCourse ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .course-management { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header-actions h2 { margin: 0; color: #1a1a2e; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert.error { background: #fee2e2; color: #991b1b; }
        .alert.success { background: #dcfce7; color: #166534; }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; font-size: 13px; text-transform: uppercase; }
        .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.inactive { background: #fee2e2; color: #991b1b; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; background: #e2e8f0; color: #4a5568; margin-right: 8px; }
        .btn.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn.small { padding: 6px 12px; font-size: 13px; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { margin: 0; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #718096; }
        form { padding: 24px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-weight: 500; color: #4a5568; font-size: 14px; }
        .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        .loading { text-align: center; padding: 40px; color: #718096; }
      `}</style>
    </div>
  );
};

export default CourseManagement;
