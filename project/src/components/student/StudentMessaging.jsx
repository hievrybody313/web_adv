// StudentMessaging.jsx - Send messages to advisor
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchMessages(); }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/student/messages?type=${activeTab}`);
      if (response.data.success) setMessages(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    if (!newMessage.content.trim()) {
      setError('Message content is required');
      return;
    }
    try {
      await api.post('/student/messages', newMessage);
      setSuccess('Message sent to your advisor!');
      setShowCompose(false);
      setNewMessage({ subject: '', content: '' });
      fetchMessages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/student/messages/${messageId}/read`);
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="student-messaging">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="header-actions">
        <div className="tabs">
          <button className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
            📥 Inbox
          </button>
          <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
            📤 Sent
          </button>
        </div>
        <button className="btn primary" onClick={() => setShowCompose(true)}>
          ✉️ Message Advisor
        </button>
      </div>

      {showCompose && (
        <div className="compose-form">
          <h3>Message Your Advisor</h3>
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label>Subject (optional)</label>
              <input 
                type="text"
                value={newMessage.subject}
                onChange={e => setNewMessage({...newMessage, subject: e.target.value})}
                placeholder="What's this about?"
              />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={newMessage.content}
                onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Write your message here..."
                rows={5}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowCompose(false)}>Cancel</button>
              <button type="submit" className="btn primary">Send Message</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p className="loading">Loading messages...</p> : (
        <div className="messages-list">
          {messages.length > 0 ? messages.map(msg => (
            <div 
              key={msg.message_id} 
              className={`message-card ${!msg.is_read && activeTab === 'inbox' ? 'unread' : ''}`}
              onClick={() => activeTab === 'inbox' && !msg.is_read && markAsRead(msg.message_id)}
            >
              <div className="message-header">
                <div className="sender-info">
                  <span className="sender">{activeTab === 'inbox' ? msg.sender_name : `To: ${msg.recipient_name}`}</span>
                  {activeTab === 'inbox' && msg.sender_role && (
                    <span className="role-badge">{msg.sender_role}</span>
                  )}
                </div>
                <span className="date">{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              {msg.subject && <div className="subject">{msg.subject}</div>}
              <p className="content">{msg.content}</p>
            </div>
          )) : (
            <div className="no-data">
              <span className="icon">✉️</span>
              <p>No messages in {activeTab}</p>
              {activeTab === 'inbox' && (
                <button className="btn primary" onClick={() => setShowCompose(true)}>
                  Send your first message
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .student-messaging { animation: fadeIn 0.3s ease; }
        .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; }
        .alert.error { background: #fef2f2; color: #dc2626; }
        .alert.success { background: #dcfce7; color: #166534; }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .tabs { display: flex; gap: 8px; }
        .tab { padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; background: #e5e7eb; font-weight: 600; color: #4b5563; }
        .tab.active { background: #10b981; color: white; }
        .btn { padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; background: #e5e7eb; color: #4b5563; }
        .btn.primary { background: #10b981; color: white; }
        .compose-form { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; }
        .compose-form h3 { margin: 0 0 20px; color: #1f2937; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 600; color: #374151; font-size: 14px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 14px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #10b981; }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .messages-list { display: flex; flex-direction: column; gap: 12px; }
        .message-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.2s; }
        .message-card:hover { transform: translateX(4px); }
        .message-card.unread { border-left: 4px solid #10b981; background: #f0fdf4; }
        .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .sender-info { display: flex; align-items: center; gap: 8px; }
        .sender { font-weight: 600; color: #1f2937; }
        .role-badge { padding: 2px 8px; background: #dbeafe; color: #1d4ed8; border-radius: 10px; font-size: 11px; text-transform: capitalize; }
        .date { font-size: 12px; color: #6b7280; }
        .subject { font-weight: 500; color: #374151; margin-bottom: 8px; }
        .content { margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
        .no-data { text-align: center; padding: 60px; background: white; border-radius: 16px; }
        .no-data .icon { font-size: 48px; display: block; margin-bottom: 12px; }
        .no-data p { color: #6b7280; margin: 0 0 16px; }
        .loading { text-align: center; color: #6b7280; padding: 40px; }
      `}</style>
    </div>
  );
};

export default StudentMessaging;
