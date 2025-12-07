// StudentList.jsx - Advisor's assigned students list
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentList = ({ onViewStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchStudents(); }, [search, statusFilter]);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const response = await api.get(`/advisor/students?${params}`);
      if (response.data.success) setStudents(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    const colors = { good_standing: '#10b981', probation: '#f59e0b', suspended: '#ef4444' };
    return colors[status] || '#718096';
  };

  return (
    <div className="student-list">
      <div className="filters">
        <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="good_standing">Good Standing</option>
          <option value="probation">Probation</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.student_id} className="student-card" onClick={() => onViewStudent(student)}>
              <div className="student-header">
                <div className="avatar">{student.first_name[0]}{student.last_name[0]}</div>
                <div className="student-info">
                  <h3>{student.first_name} {student.last_name}</h3>
                  <span className="student-id">{student.student_number}</span>
                </div>
              </div>
              <div className="student-details">
                <div className="detail"><span>Major:</span> {student.major_name}</div>
                <div className="detail"><span>GPA:</span> {student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}</div>
                <div className="detail"><span>Courses:</span> {student.current_courses} current, {student.completed_courses} completed</div>
              </div>
              <div className="student-footer">
                <span className="status" style={{background: `${getStatusColor(student.academic_status)}20`, color: getStatusColor(student.academic_status)}}>
                  {student.academic_status?.replace('_', ' ')}
                </span>
                <button className="btn small">View Profile →</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && students.length === 0 && <div className="no-data">No students found</div>}
      <style jsx>{`
        .student-list { animation: fadeIn 0.3s ease; }
        .filters { display: flex; gap: 12px; margin-bottom: 20px; }
        .filters input { flex: 1; max-width: 300px; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .filters select { padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .student-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .student-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .student-header { display: flex; gap: 12px; margin-bottom: 16px; }
        .avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #047857 0%, #065f46 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
        .student-info h3 { margin: 0 0 4px 0; color: #1a1a2e; }
        .student-id { color: #718096; font-size: 13px; }
        .student-details { margin-bottom: 16px; }
        .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .detail span { color: #718096; }
        .student-footer { display: flex; justify-content: space-between; align-items: center; }
        .status { padding: 4px 10px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
        .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; background: #047857; color: white; }
        .no-data { text-align: center; padding: 40px; color: #718096; }
      `}</style>
    </div>
  );
};

export default StudentList;