// AuditLogs.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [limit, setLimit] = useState(100);

  const fetchLogs = async (filterAction, filterLimit) => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching logs with limit:', filterLimit);
      const response = await api.get('/admin/logs', {
        params: {
          action: filterAction || undefined,
          limit: filterLimit
        }
      });
      console.log('Response:', response.data);
      if (response.data.success) {
        setLogs(response.data.data || []);
        setError('');
      } else {
        setError(response.data.message || 'Failed to load logs');
      }
    } catch (err) { 
      console.error('Fetch logs error:', err); 
      setError(err.response?.data?.message || err.message || 'Failed to load audit logs');
    } finally { 
      setLoading(false); 
    }
  };

  // Fetch on mount only
  useEffect(() => { 
    fetchLogs('', 100); 
  }, []);

  const handleRefresh = () => {
    fetchLogs(actionFilter, limit);
  };

  return (
    <div className="audit-logs">
      <h2>Audit Logs</h2>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Filter by action..." 
          value={actionFilter} 
          onChange={e => setActionFilter(e.target.value)} 
        />
        <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
          <option value={50}>Last 50</option>
          <option value={100}>Last 100</option>
          <option value={500}>Last 500</option>
        </select>
        <button onClick={handleRefresh} className="refresh-btn">Search</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading ? <p>Loading...</p> : logs.length === 0 ? (
        <div className="empty-state">
          <p>No audit logs found</p>
          <small>Logs will appear here as actions are performed in the system</small>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>IP Address</th></tr></thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.log_id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.user_name}<br/><small>@{log.username}</small></td>
                  <td><span className="action-badge">{log.action}</span></td>
                  <td>{log.entity_type} {log.entity_id && `#${log.entity_id}`}</td>
                  <td><code>{log.ip_address}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        .audit-logs { animation: fadeIn 0.3s ease; }
        h2 { margin-bottom: 20px; }
        .filters { display: flex; gap: 12px; margin-bottom: 20px; }
        .filters input, .filters select { padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; }
        .filters input { flex: 1; max-width: 300px; }
        .refresh-btn { padding: 10px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
        .refresh-btn:hover { background: #5a67d8; }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow-x: auto; max-height: 600px; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; color: #4a5568; font-size: 13px; position: sticky; top: 0; }
        .action-badge { background: #667eea20; color: #667eea; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-family: monospace; }
        small { color: #718096; }
        code { background: #f7fafc; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
        .empty-state { text-align: center; padding: 40px; background: white; border-radius: 12px; color: #718096; }
        .empty-state p { font-size: 16px; margin-bottom: 8px; }
        .error-msg { color: #e53e3e; margin-bottom: 16px; padding: 12px; background: #fee2e2; border-radius: 8px; }
      `}</style>
    </div>
  );
};

export default AuditLogs;