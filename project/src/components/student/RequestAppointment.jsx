// RequestAppointment.jsx - Book and manage advising appointments
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RequestAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    meetingType: 'in_person',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchAppointments(); }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await api.get(`/student/appointments${params}`);
      if (response.data.success) setAppointments(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.appointmentDate || !formData.appointmentTime) {
      setError('Please select date and time');
      return;
    }

    const dateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

    try {
      await api.post('/student/appointments', {
        appointmentDate: dateTime,
        meetingType: formData.meetingType,
        notes: formData.notes
      });
      setSuccess('Appointment requested successfully!');
      setShowForm(false);
      setFormData({ appointmentDate: '', appointmentTime: '', meetingType: 'in_person', notes: '' });
      fetchAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request appointment');
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/student/appointments/${appointmentId}/cancel`);
      setSuccess('Appointment cancelled');
      fetchAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusColor = (status) => {
    const colors = { scheduled: '#3b82f6', completed: '#10b981', cancelled: '#ef4444', no_show: '#f59e0b' };
    return colors[status] || '#6b7280';
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="request-appointment">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <div className="filters">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn primary" onClick={() => setShowForm(true)}>
          + Request Appointment
        </button>
      </div>

      {showForm && (
        <div className="appointment-form">
          <h3>Request New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={formData.appointmentDate}
                  min={getMinDate()}
                  onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input 
                  type="time"
                  value={formData.appointmentTime}
                  min="08:00"
                  max="17:00"
                  onChange={e => setFormData({...formData, appointmentTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Meeting Type</label>
                <select 
                  value={formData.meetingType}
                  onChange={e => setFormData({...formData, meetingType: e.target.value})}
                >
                  <option value="in_person">In Person</option>
                  <option value="virtual">Virtual</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="What would you like to discuss?"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn primary">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p className="loading">Loading appointments...</p> : (
        <div className="appointments-list">
          {appointments.length > 0 ? appointments.map(apt => (
            <div key={apt.appointment_id} className="appointment-card">
              <div className="apt-date-col">
                <span className="month">{new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="day">{new Date(apt.appointment_date).getDate()}</span>
                <span className="time">{new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
              <div className="apt-info">
                <h4>Advising Session</h4>
                <p className="advisor">with {apt.advisor_name}</p>
                <div className="apt-meta">
                  <span className="type">{apt.meeting_type?.replace('_', ' ')}</span>
                  {apt.office_location && <span className="location">📍 {apt.office_location}</span>}
                </div>
                {apt.notes && <p className="notes">{apt.notes}</p>}
              </div>
              <div className="apt-status">
                <span 
                  className="status-badge"
                  style={{ background: `${getStatusColor(apt.status)}15`, color: getStatusColor(apt.status) }}
                >
                  {apt.status}
                </span>
                {apt.status === 'scheduled' && (
                  <button className="btn small danger" onClick={() => handleCancel(apt.appointment_id)}>Cancel</button>
                )}
              </div>
            </div>
          )) : (
            <div className="no-data">
              <p>No appointments found</p>
              <button className="btn primary" onClick={() => setShowForm(true)}>Request Your First Appointment</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .request-appointment { animation: fadeIn 0.3s ease; }
        .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; }
        .alert.error { background: #fef2f2; color: #dc2626; }
        .alert.success { background: #dcfce7; color: #166534; }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .filters select { padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; background: #e5e7eb; color: #4b5563; }
        .btn.primary { background: #10b981; color: white; }
        .btn.small { padding: 6px 12px; font-size: 13px; }
        .btn.danger { background: #fef2f2; color: #dc2626; }
        .appointment-form { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; }
        .appointment-form h3 { margin: 0 0 20px; color: #1f2937; }
        .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #10b981; }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .appointments-list { display: flex; flex-direction: column; gap: 16px; }
        .appointment-card { display: flex; gap: 20px; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .apt-date-col { text-align: center; padding: 12px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; color: white; min-width: 80px; }
        .apt-date-col .month { display: block; font-size: 12px; text-transform: uppercase; opacity: 0.9; }
        .apt-date-col .day { display: block; font-size: 28px; font-weight: 700; line-height: 1.2; }
        .apt-date-col .time { display: block; font-size: 12px; opacity: 0.9; }
        .apt-info { flex: 1; }
        .apt-info h4 { margin: 0 0 4px; color: #1f2937; }
        .apt-info .advisor { margin: 0 0 8px; color: #6b7280; font-size: 14px; }
        .apt-meta { display: flex; gap: 12px; margin-bottom: 8px; }
        .apt-meta span { font-size: 13px; color: #6b7280; text-transform: capitalize; }
        .apt-info .notes { margin: 0; padding: 8px 12px; background: #f9fafb; border-radius: 6px; font-size: 14px; color: #4b5563; }
        .apt-status { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .no-data { text-align: center; padding: 60px; background: white; border-radius: 16px; }
        .no-data p { color: #6b7280; margin-bottom: 16px; }
        .loading { text-align: center; color: #6b7280; padding: 40px; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .appointment-card { flex-direction: column; }
          .apt-status { flex-direction: row; justify-content: space-between; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default RequestAppointment;
