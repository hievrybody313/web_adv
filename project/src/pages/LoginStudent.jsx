// LoginStudent.jsx - Student Login page
// Located in: src/pages/LoginStudent.jsx
// Uses student_number (ID) and password for authentication

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/student/login', formData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your Student ID and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Academic Advising</span>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Staff Login</Link>
            <Link to="/student-login" className="nav-link btn-primary">Student Login</Link>
          </div>
        </div>
      </nav>

      {/* Login Content */}
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo">🎓</div>
            <h1>Student Portal</h1>
            <p>Academic Advising System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your Student ID"
                required
                autoFocus
              />
              <span className="input-hint">e.g., STU001</span>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer-box">
            <p>Forgot your password? Contact your advisor.</p>
            <div className="portal-switch">
              <Link to="/login">Admin/Advisor Portal →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🎓</span>
              <span>Academic Advising System</span>
            </div>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/student-login">Student Portal</Link>
              <Link to="/login">Staff Portal</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Academic Advising System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #1f2937;
          font-weight: 700;
          font-size: 20px;
        }

        .logo-icon {
          font-size: 28px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          text-decoration: none;
          color: #4b5563;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #10b981;
        }

        .nav-link.btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 10px 24px;
          border-radius: 10px;
        }

        .nav-link.btn-primary:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #1f2937;
        }

        /* Login Container */
        .login-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%);
          padding: 100px 20px 40px;
        }

        .login-box {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 420px;
          overflow: hidden;
        }

        .login-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }

        .logo {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .login-header h1 {
          margin: 0 0 8px 0;
          font-size: 26px;
          font-weight: 700;
        }

        .login-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .login-form {
          padding: 40px 30px;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .form-group input::placeholder {
          color: #9ca3af;
        }

        .input-hint {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #6b7280;
        }

        .login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-footer-box {
          padding: 20px 30px;
          background: #f9fafb;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }

        .login-footer-box p {
          margin: 0 0 12px;
          color: #6b7280;
          font-size: 13px;
        }

        .portal-switch {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .portal-switch a {
          color: #059669;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }

        .portal-switch a:hover {
          text-decoration: underline;
        }

        /* Footer */
        .footer {
          background: #1f2937;
          padding: 60px 24px 30px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 30px;
          border-bottom: 1px solid #374151;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #10b981;
        }

        .footer-bottom {
          padding-top: 30px;
          text-align: center;
        }

        .footer-bottom p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            gap: 16px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }

          .nav-links.active {
            display: flex;
          }

          .footer-content {
            flex-direction: column;
            gap: 24px;
          }

          .footer-links {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .login-header {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 22px;
          }

          .login-form {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginStudent;