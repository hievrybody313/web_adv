// App.js - Main application component with routing
// Located in: src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import LoginStudent from './pages/LoginStudent';
import AdminDashboard from './pages/AdminDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'advisor') {
      return <Navigate to="/advisor/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'advisor') {
      return <Navigate to="/advisor/dashboard" replace />;
    }
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/student-login" 
              element={
                <PublicRoute>
                  <LoginStudent />
                </PublicRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Advisor Routes */}
            <Route 
              path="/advisor/*" 
              element={
                <ProtectedRoute allowedRoles={['advisor']}>
                  <AdvisorDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            {/* 404 - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
            {/* 404 - Not Found */}
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>Page not found</p>
                  <a href="/login">Go to Login</a>
                </div>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                       'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app {
          min-height: 100vh;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f0f2f5;
        }

        .loading-screen .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-screen p {
          color: #718096;
          font-size: 16px;
        }

        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f0f2f5;
          text-align: center;
        }

        .not-found h1 {
          font-size: 120px;
          color: #667eea;
          margin-bottom: 10px;
        }

        .not-found p {
          color: #718096;
          font-size: 24px;
          margin-bottom: 30px;
        }

        .not-found a {
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .not-found a:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </Router>
  );
}

export default App;