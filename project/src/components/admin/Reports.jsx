// Reports.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('student-progress');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReport(activeReport); }, [activeReport]);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/reports/${type}`);
      if (response.data.success) setReportData(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const reports = [
    { id: 'student-progress', label: 'Student Progress' },
    { id: 'advisor-activity', label: 'Advisor Activity' }
  ];

  return (
    <div className="reports">
      <h2>Reports</h2>
      <div className="report-tabs">
        {reports.map(r => (
          <button key={r.id} className={`tab ${activeReport === r.id ? 'active' : ''}`} onClick={() => setActiveReport(r.id)}>{r.label}</button>
        ))}
      </div>
      {loading ? <p>Loading report...</p> : (
        <div className="report-content">
          {activeReport === 'student-progress' && (
            <table>
              <thead><tr><th>Department</th><th>Students</th><th>Avg GPA</th><th>Good Standing</th><th>Probation</th><th>Suspended</th></tr></thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.department}</td>
                    <td>{row.total_students}</td>
                    <td>{row.avg_gpa ? parseFloat(row.avg_gpa).toFixed(2) : '-'}</td>
                    <td style={{color: '#10b981'}}>{row.good_standing}</td>
                    <td style={{color: '#f59e0b'}}>{row.on_probation}</td>
                    <td style={{color: '#ef4444'}}>{row.suspended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeReport === 'advisor-activity' && (
            <table>
              <thead><tr><th>Advisor</th><th>Department</th><th>Students</th><th>Capacity</th><th>Appointments</th><th>Notes</th><th>Requests</th></tr></thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.advisor_name}</td>
                    <td>{row.department}</td>
                    <td>{row.assigned_students}</td>
                    <td>{row.max_students}</td>
                    <td>{row.completed_appointments}</td>
                    <td>{row.notes_count}</td>
                    <td>{row.requests_handled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <style jsx>{`
        .reports { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .report-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; background: #e2e8f0; color: #4a5568; font-weight: 500; }
        .tab.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .report-content { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; font-size: 13px; }
      `}</style>
    </div>
  );
};

export default Reports;