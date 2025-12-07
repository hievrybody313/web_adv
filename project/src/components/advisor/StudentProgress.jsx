// StudentProgress.jsx - Track student graduation progress
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/advisor/students');
      if (response.data.success) setStudents(response.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchProgress = async (studentId) => {
    setLoading(true);
    try {
      const response = await api.get(`/advisor/students/${studentId}/graduation-progress`);
      if (response.data.success) setProgress(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    if (studentId) {
      setSelectedStudent(studentId);
      fetchProgress(studentId);
    } else {
      setSelectedStudent(null);
      setProgress(null);
    }
  };

  return (
    <div className="student-progress">
      <h2>Student Progress Tracking</h2>
      <div className="student-select">
        <select value={selectedStudent || ''} onChange={handleStudentSelect}>
          <option value="">Select a student...</option>
          {students.map(s => (
            <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.student_number})</option>
          ))}
        </select>
      </div>

      {loading && <p className="loading">Loading progress...</p>}
      
      {progress && !loading && (
        <div className="progress-content">
          <div className="progress-header">
            <h3>{progress.student.first_name} {progress.student.last_name}</h3>
            <span>{progress.student.major_name}</span>
          </div>

          <div className="progress-stats">
            <div className="stat-card">
              <div className="progress-bar">
                <div className="fill" style={{width: `${progress.creditsSummary.progressPercent}%`}}></div>
              </div>
              <span className="percent">{progress.creditsSummary.progressPercent}%</span>
              <span className="label">Progress to Graduation</span>
            </div>
            <div className="stat-card">
              <span className="value">{progress.creditsSummary.completed}</span>
              <span className="label">Credits Completed</span>
            </div>
            <div className="stat-card">
              <span className="value">{progress.creditsSummary.inProgress}</span>
              <span className="label">Credits In Progress</span>
            </div>
            <div className="stat-card">
              <span className="value">{progress.creditsSummary.remaining}</span>
              <span className="label">Credits Remaining</span>
            </div>
          </div>

          <div className="courses-section">
            <h4>Current Courses</h4>
            {progress.currentCourses.length > 0 ? (
              <div className="course-list">
                {progress.currentCourses.map(c => (
                  <div key={c.enrollment_id} className="course-item">
                    <strong>{c.code}</strong> - {c.name} ({c.credits} cr)
                  </div>
                ))}
              </div>
            ) : <p className="no-data">No current courses</p>}
          </div>

          <div className="courses-section">
            <h4>Completed Courses ({progress.completedCourses.length})</h4>
            <div className="course-list completed">
              {progress.completedCourses.map(c => (
                <div key={c.enrollment_id} className="course-item">
                  <span><strong>{c.code}</strong> - {c.name}</span>
                  <span className="grade" style={{color: getGradeColor(c.grade)}}>{c.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .student-progress { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .student-select { margin-bottom: 24px; }
        .student-select select { width: 100%; max-width: 400px; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
        .loading { color: #718096; }
        .progress-content { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .progress-header { margin-bottom: 24px; }
        .progress-header h3 { margin: 0 0 4px; color: #1a1a2e; }
        .progress-header span { color: #718096; }
        .progress-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 30px; }
        .stat-card { background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card:first-child { grid-column: 1 / -1; text-align: left; }
        .progress-bar { height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
        .progress-bar .fill { height: 100%; background: linear-gradient(90deg, #047857, #10b981); border-radius: 10px; transition: width 0.5s ease; }
        .percent { font-size: 24px; font-weight: 700; color: #047857; }
        .value { display: block; font-size: 32px; font-weight: 700; color: #047857; }
        .label { display: block; font-size: 13px; color: #718096; margin-top: 4px; }
        .courses-section { margin-top: 24px; }
        .courses-section h4 { margin: 0 0 12px; color: #1a1a2e; }
        .course-list { display: flex; flex-direction: column; gap: 8px; }
        .course-list.completed { max-height: 300px; overflow-y: auto; }
        .course-item { padding: 12px 16px; background: #f7fafc; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .grade { font-weight: 600; }
        .no-data { color: #718096; font-style: italic; }
      `}</style>
    </div>
  );
};

const getGradeColor = (grade) => {
  if (!grade) return '#718096';
  if (['A', 'A+', 'A-'].includes(grade)) return '#10b981';
  if (['B', 'B+', 'B-'].includes(grade)) return '#3b82f6';
  if (['C', 'C+', 'C-'].includes(grade)) return '#f59e0b';
  return '#ef4444';
};

export default StudentProgress;
