// StudentSchedule.jsx - View course schedule and appointments
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSchedule(); }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/student/schedule');
      if (response.data.success) setSchedule(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="loading">Loading schedule...</div>;
  if (!schedule) return <div className="error">Failed to load schedule</div>;

  return (
    <div className="student-schedule">
      {/* Current Courses */}
      <section className="schedule-section">
        <h2>📚 Current Courses</h2>
        {schedule.courses.length > 0 ? (
          <div className="courses-grid">
            {schedule.courses.map(course => (
              <div key={course.enrollment_id} className="course-card">
                <div className="course-code">{course.code}</div>
                <h4>{course.name}</h4>
                <p className="course-info">
                  {course.credits} credits • {course.department_name}
                </p>
                <p className="semester">{course.semester}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No current courses enrolled</p>
          </div>
        )}
      </section>

      {/* Upcoming Appointments */}
      <section className="schedule-section">
        <h2>📅 Upcoming Advising Appointments</h2>
        {schedule.appointments.length > 0 ? (
          <div className="appointments-timeline">
            {schedule.appointments.map(apt => (
              <div key={apt.appointment_id} className="appointment-item">
                <div className="apt-date">
                  <span className="day">{new Date(apt.appointment_date).getDate()}</span>
                  <span className="month">{new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="apt-connector"></div>
                <div className="apt-details">
                  <div className="apt-time">
                    {new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <h4>Advising Session with {apt.advisor_name}</h4>
                  <div className="apt-meta">
                    <span className="type">{apt.meeting_type?.replace('_', ' ')}</span>
                    {apt.office_location && <span className="location">📍 {apt.office_location}</span>}
                    <span className="duration">{apt.duration_minutes} min</span>
                  </div>
                  {apt.notes && <p className="notes">{apt.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No upcoming appointments scheduled</p>
          </div>
        )}
      </section>

      {/* Calendar View Placeholder */}
      <section className="schedule-section">
        <h2>🗓️ This Week</h2>
        <div className="week-view">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + 1 + index);
            const isToday = new Date().toDateString() === date.toDateString();
            const dayAppointments = schedule.appointments.filter(apt => 
              new Date(apt.appointment_date).toDateString() === date.toDateString()
            );

            return (
              <div key={day} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <span className="day-name">{day}</span>
                  <span className="day-date">{date.getDate()}</span>
                </div>
                <div className="day-content">
                  {schedule.courses.length > 0 && (
                    <div className="course-block">
                      {schedule.courses.length} courses
                    </div>
                  )}
                  {dayAppointments.map(apt => (
                    <div key={apt.appointment_id} className="apt-block">
                      <span className="time">
                        {new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="title">Advising</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .student-schedule { animation: fadeIn 0.3s ease; }
        .schedule-section { margin-bottom: 30px; }
        .schedule-section h2 { margin: 0 0 20px; color: #1f2937; font-size: 18px; }
        .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .course-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .course-code { display: inline-block; padding: 6px 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 8px; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
        .course-card h4 { margin: 0 0 8px; color: #1f2937; }
        .course-info { margin: 0 0 4px; font-size: 14px; color: #6b7280; }
        .semester { margin: 0; font-size: 13px; color: #10b981; font-weight: 500; }
        .appointments-timeline { display: flex; flex-direction: column; gap: 16px; }
        .appointment-item { display: flex; gap: 16px; align-items: flex-start; }
        .apt-date { text-align: center; padding: 12px 16px; background: #10b981; border-radius: 12px; color: white; min-width: 60px; }
        .apt-date .day { display: block; font-size: 24px; font-weight: 700; }
        .apt-date .month { display: block; font-size: 12px; text-transform: uppercase; }
        .apt-connector { width: 2px; background: #e5e7eb; height: 100%; min-height: 80px; }
        .apt-details { flex: 1; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .apt-time { font-size: 14px; color: #10b981; font-weight: 600; margin-bottom: 4px; }
        .apt-details h4 { margin: 0 0 8px; color: #1f2937; }
        .apt-meta { display: flex; gap: 12px; font-size: 13px; color: #6b7280; flex-wrap: wrap; }
        .apt-meta span { text-transform: capitalize; }
        .apt-details .notes { margin: 12px 0 0; padding: 10px; background: #f9fafb; border-radius: 8px; font-size: 13px; color: #4b5563; }
        .week-view { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .day-column { border-radius: 12px; overflow: hidden; }
        .day-column.today { background: #f0fdf4; }
        .day-header { padding: 12px; text-align: center; background: #f9fafb; }
        .day-column.today .day-header { background: #10b981; color: white; }
        .day-name { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .day-date { display: block; font-size: 18px; font-weight: 700; }
        .day-content { padding: 12px; min-height: 100px; }
        .course-block { padding: 8px; background: #dbeafe; border-radius: 6px; font-size: 12px; color: #1d4ed8; text-align: center; margin-bottom: 8px; }
        .apt-block { padding: 8px; background: #dcfce7; border-radius: 6px; font-size: 11px; color: #166534; margin-bottom: 4px; }
        .apt-block .time { display: block; font-weight: 600; }
        .no-data { background: white; border-radius: 16px; padding: 40px; text-align: center; }
        .no-data p { color: #6b7280; margin: 0; }
        .loading, .error { text-align: center; padding: 40px; color: #6b7280; }
        @media (max-width: 768px) {
          .week-view { grid-template-columns: repeat(5, 1fr); overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};

export default StudentSchedule;
