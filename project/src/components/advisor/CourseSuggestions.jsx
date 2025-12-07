// CourseSuggestions.jsx - Suggest courses to students
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseSuggestions = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/advisor/students');
      if (response.data.success) setStudents(response.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/advisor/courses/available');
      if (response.data.success) setCourses(response.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || selectedCourses.length === 0) return;
    try {
      await api.post(`/advisor/students/${selectedStudent}/suggest-courses`, {
        courseIds: selectedCourses,
        semester,
        notes
      });
      setSuccess('Recommendations sent successfully!');
      setSelectedCourses([]);
      setNotes('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const toggleCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <div className="course-suggestions">
      <h2>Suggest Courses</h2>
      {success && <div className="alert success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Select Student</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
            <option value="">Choose a student...</option>
            {students.map(s => (
              <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.student_number})</option>
            ))}
          </select>
        </div>
        <div className="form-section">
          <label>Semester</label>
          <input type="text" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g., Fall 2025" />
        </div>
        <div className="form-section">
          <label>Select Courses to Recommend ({selectedCourses.length} selected)</label>
          <div className="courses-grid">
            {courses.map(course => (
              <div 
                key={course.course_id} 
                className={`course-item ${selectedCourses.includes(course.course_id) ? 'selected' : ''}`}
                onClick={() => toggleCourse(course.course_id)}
              >
                <strong>{course.code}</strong>
                <span>{course.name}</span>
                <span className="credits">{course.credits} cr</span>
              </div>
            ))}
          </div>
        </div>
        <div className="form-section">
          <label>Additional Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any additional recommendations or notes..." />
        </div>
        <button type="submit" className="btn primary" disabled={!selectedStudent || selectedCourses.length === 0}>
          Send Recommendations
        </button>
      </form>
      <style jsx>{`
        .course-suggestions { animation: fadeIn 0.3s ease; max-width: 800px; }
        h2 { margin-bottom: 20px; }
        .alert.success { background: #dcfce7; color: #166534; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
        .form-section { margin-bottom: 20px; }
        .form-section label { display: block; margin-bottom: 8px; font-weight: 600; color: #1a1a2e; }
        .form-section select, .form-section input, .form-section textarea { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
        .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; max-height: 300px; overflow-y: auto; padding: 4px; }
        .course-item { padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .course-item:hover { border-color: #047857; }
        .course-item.selected { border-color: #047857; background: #04785710; }
        .course-item strong { display: block; color: #047857; margin-bottom: 4px; }
        .course-item span { display: block; font-size: 13px; color: #4a5568; }
        .course-item .credits { color: #718096; margin-top: 4px; }
        .btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn.primary { background: #047857; color: white; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default CourseSuggestions;
