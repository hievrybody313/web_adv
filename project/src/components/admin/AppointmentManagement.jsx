// AppointmentManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });

  useEffect(() => { fetchAppointments(); }, [filters]);

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/appointments?${params}`);
      if (response.data.success) setAppointments(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    const colors = { scheduled: '#3b82f6', completed: '#10b981', cancelled: '#ef4444', no_show: '#f59e0b' };
    return colors[status] || '#718096';
  };

  return (
    <div className="appointment-management">
      <h2>Manage Appointments</h2>
      <div className="filters">
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
        <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
        <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Date/Time</th><th>Student</th><th>Advisor</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.appointment_id}>
                  <td>{new Date(apt.appointment_date).toLocaleString()}</td>
                  <td>{apt.student_name}<br/><small>{apt.student_number}</small></td>
                  <td>{apt.advisor_name}</td>
                  <td>{apt.meeting_type}</td>
                  <td><span style={{background: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status), padding: '4px 10px', borderRadius: '12px', fontSize: '12px'}}>{apt.status}</span></td>
                  <td>
                    {apt.status === 'scheduled' && (
                      <><button className="btn small" onClick={() => handleStatusChange(apt.appointment_id, 'completed')}>Complete</button>
                      <button className="btn small danger" onClick={() => handleStatusChange(apt.appointment_id, 'cancelled')}>Cancel</button></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        .appointment-management { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .filters { display: flex; gap: 12px; margin-bottom: 20px; }
        .filters select, .filters input { padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; font-size: 13px; }
        .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; margin-right: 8px; background: #e2e8f0; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        small { color: #718096; }
      `}</style>
    </div>
  );
};

export default AppointmentManagement;
