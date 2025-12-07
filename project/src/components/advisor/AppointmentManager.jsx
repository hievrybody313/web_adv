// AppointmentManager.jsx - Advisor appointment management
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchAppointments(); }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await api.get(`/advisor/appointments${params}`);
      if (response.data.success) setAppointments(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'complete') {
        await api.put(`/advisor/appointments/${id}/complete`);
      } else {
        await api.put(`/advisor/appointments/${id}/status`, { status: action });
      }
      fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    const colors = { scheduled: '#3b82f6', completed: '#10b981', cancelled: '#ef4444', no_show: '#f59e0b' };
    return colors[status] || '#718096';
  };

  return (
    <div className="appointment-manager">
      <h2>My Appointments</h2>
      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="appointments-list">
          {appointments.map(apt => (
            <div key={apt.appointment_id} className="appointment-card">
              <div className="apt-header">
                <div className="apt-date">
                  <span className="day">{new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
                  <span className="time">{new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                <div className="apt-info">
                  <h3>{apt.student_name}</h3>
                  <span>{apt.student_number} • {apt.student_email}</span>
                </div>
                <span className="status" style={{background: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status)}}>{apt.status}</span>
              </div>
              <div className="apt-details">
                <span className="type">{apt.meeting_type}</span>
                <span className="duration">{apt.duration_minutes} min</span>
              </div>
              {apt.notes && <p className="apt-notes">{apt.notes}</p>}
              {apt.status === 'scheduled' && (
                <div className="apt-actions">
                  <button className="btn success" onClick={() => handleAction(apt.appointment_id, 'complete')}>Complete</button>
                  <button className="btn danger" onClick={() => handleAction(apt.appointment_id, 'cancelled')}>Cancel</button>
                </div>
              )}
            </div>
          ))}
          {appointments.length === 0 && <p className="no-data">No appointments found</p>}
        </div>
      )}
      <style jsx>{`
        .appointment-manager { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .filters { margin-bottom: 20px; }
        .filters select { padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .appointments-list { display: flex; flex-direction: column; gap: 16px; }
        .appointment-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .apt-header { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
        .apt-date { text-align: center; padding: 8px 16px; background: #04785720; border-radius: 8px; }
        .apt-date .day { display: block; font-weight: 600; color: #047857; }
        .apt-date .time { font-size: 13px; color: #065f46; }
        .apt-info { flex: 1; }
        .apt-info h3 { margin: 0 0 4px; color: #1a1a2e; }
        .apt-info span { color: #718096; font-size: 13px; }
        .status { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
        .apt-details { display: flex; gap: 16px; margin-bottom: 12px; }
        .type, .duration { padding: 4px 10px; background: #f7fafc; border-radius: 6px; font-size: 13px; color: #4a5568; }
        .apt-notes { color: #4a5568; font-size: 14px; margin: 0; padding: 12px; background: #f7fafc; border-radius: 6px; }
        .apt-actions { display: flex; gap: 8px; margin-top: 12px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn.success { background: #dcfce7; color: #166534; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .no-data { text-align: center; color: #718096; padding: 40px; }
      `}</style>
    </div>
  );
};

export default AppointmentManager;
