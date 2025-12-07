// Messaging.jsx - Advisor messaging system
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ recipientId: '', subject: '', content: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchStudents();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/advisor/messages?type=${activeTab}`);
      if (response.data.success) setMessages(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/advisor/students');
      if (response.data.success) setStudents(response.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await api.post('/advisor/messages', newMessage);
      setSuccess('Message sent!');
      setShowCompose(false);
      setNewMessage({ recipientId: '', subject: '', content: '' });
      fetchMessages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/advisor/messages/${messageId}/read`);
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="messaging">
      <div className="msg-header">
        <h2>Messages</h2>
        <button className="btn primary" onClick={() => setShowCompose(true)}>+ New Message</button>
      </div>
      {success && <div className="alert success">{success}</div>}

      <div className="tabs">
        <button className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>Inbox</button>
        <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>Sent</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="messages-list">
          {messages.map(msg => (
            <div 
              key={msg.message_id} 
              className={`message-card ${!msg.is_read && activeTab === 'inbox' ? 'unread' : ''}`}
              onClick={() => activeTab === 'inbox' && !msg.is_read && markAsRead(msg.message_id)}
            >
              <div className="msg-top">
                <span className="from">{activeTab === 'inbox' ? msg.sender_name : msg.recipient_name}</span>
                <span className="date">{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              {msg.subject && <div className="subject">{msg.subject}</div>}
              <p className="content">{msg.content}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="no-data">No messages</p>}
        </div>
      )}

      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Message</h3>
              <button className="close-btn" onClick={() => setShowCompose(false)}>×</button>
            </div>
            <form onSubmit={handleSend}>
              <div className="form-group">
                <label>To</label>
                <select value={newMessage.recipientId} onChange={e => setNewMessage({...newMessage, recipientId: e.target.value})} required>
                  <option value="">Select student...</option>
                  {students.map(s => (
                    <option key={s.student_id} value={s.user_id}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" value={newMessage.subject} onChange={e => setNewMessage({...newMessage, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea value={newMessage.content} onChange={e => setNewMessage({...newMessage, content: e.target.value})} rows={5} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowCompose(false)}>Cancel</button>
                <button type="submit" className="btn primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .messaging { animation: fadeIn 0.3s ease; }
        .msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        h2 { margin: 0; }
        .alert.success { background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
        .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; background: #e2e8f0; font-weight: 500; }
        .tab.active { background: #047857; color: white; }
        .messages-list { display: flex; flex-direction: column; gap: 12px; }
        .message-card { background: white; border-radius: 12px; padding: 16px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; }
        .message-card.unread { border-left: 4px solid #047857; background: #f0fdf4; }
        .msg-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .from { font-weight: 600; color: #1a1a2e; }
        .date { font-size: 12px; color: #718096; }
        .subject { font-weight: 500; color: #4a5568; margin-bottom: 8px; }
        .content { margin: 0; color: #4a5568; font-size: 14px; white-space: pre-wrap; }
        .no-data { text-align: center; color: #718096; padding: 40px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; background: #e2e8f0; }
        .btn.primary { background: #047857; color: white; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { margin: 0; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
        form { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 500; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
      `}</style>
    </div>
  );
};

export default Messaging;
