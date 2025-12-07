// Home.jsx - Landing page with navbar and 4 sections
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="home-page">
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Your Academic Success Starts Here</h1>
            <p>
              Connect with your advisor, plan your courses, and stay on track 
              for graduation with our comprehensive academic advising system.
            </p>
            <div className="hero-buttons">
              <Link to="/student-login" className="btn btn-primary">
                Student Portal
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Staff Portal
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="illustration-card card-1">📚</div>
              <div className="illustration-card card-2">📅</div>
              <div className="illustration-card card-3">🎯</div>
              <div className="illustration-card card-4">💬</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Everything You Need to Succeed</h2>
            <p>Our platform provides all the tools for effective academic advising</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Scheduling</h3>
              <p>Book advising appointments online with just a few clicks. Choose your preferred time and meeting format.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your academic journey with real-time progress tracking, GPA calculations, and graduation requirements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Course Planning</h3>
              <p>Submit course registration requests, view prerequisites, and plan your semester with advisor guidance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Communication</h3>
              <p>Message your advisor directly, receive feedback and recommendations, all in one secure platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign In</h3>
                <p>Log in with your student ID to access your personalized dashboard and academic information.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Connect</h3>
                <p>Schedule appointments with your assigned advisor, submit course requests, and send messages.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Succeed</h3>
                <p>Stay on track with your academic plan, receive guidance, and achieve your educational goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Students Advised</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Expert Advisors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">System Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Access your academic advising portal now and take control of your educational journey.</p>
            <div className="cta-buttons">
              <Link to="/student-login" className="btn btn-white">
                Student Login
              </Link>
              <Link to="/login" className="btn btn-outline">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </section>

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
        .home-page {
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

        /* Hero Section */
        .hero-section {
          padding: 140px 24px 80px;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%);
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 48px;
          line-height: 1.2;
          color: #065f46;
          margin: 0 0 20px;
        }

        .hero-content p {
          font-size: 18px;
          color: #4b5563;
          line-height: 1.7;
          margin: 0 0 32px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
        }

        .btn {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
        }

        .btn-secondary {
          background: white;
          color: #065f46;
          border: 2px solid #10b981;
        }

        .btn-secondary:hover {
          background: #f0fdf4;
        }

        .hero-illustration {
          position: relative;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illustration-card {
          position: absolute;
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          animation: float 3s ease-in-out infinite;
        }

        .card-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .card-2 { top: 10%; right: 20%; animation-delay: 0.5s; }
        .card-3 { bottom: 20%; left: 20%; animation-delay: 1s; }
        .card-4 { bottom: 10%; right: 10%; animation-delay: 1.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* Features Section */
        .features-section {
          padding: 100px 24px;
          background: white;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 36px;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .section-header p {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .feature-card {
          background: #f9fafb;
          padding: 32px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: #f0fdf4;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 20px;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .feature-card p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        /* How It Works Section */
        .how-it-works-section {
          padding: 100px 24px;
          background: #f9fafb;
        }

        .steps-container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 20px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 280px;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .step-content h3 {
          font-size: 20px;
          color: #1f2937;
          margin: 0 0 10px;
        }

        .step-content p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .step-connector {
          width: 80px;
          height: 2px;
          background: #d1d5db;
          margin-top: 30px;
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 24px;
          background: linear-gradient(135deg, #065f46 0%, #047857 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .stat-item {
          text-align: center;
          color: white;
        }

        .stat-number {
          display: block;
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 16px;
          opacity: 0.9;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 24px;
          background: white;
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 36px;
          color: #1f2937;
          margin: 0 0 16px;
        }

        .cta-content p {
          font-size: 18px;
          color: #6b7280;
          margin: 0 0 32px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-white {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .btn-outline {
          background: transparent;
          color: #065f46;
          border: 2px solid #10b981;
        }

        .btn-outline:hover {
          background: #f0fdf4;
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
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-illustration {
            display: none;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

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

          .hero-content h1 {
            font-size: 32px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps-container {
            flex-direction: column;
            align-items: center;
          }

          .step-connector {
            width: 2px;
            height: 40px;
            margin: 0;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .stat-number {
            font-size: 36px;
          }

          .cta-buttons {
            flex-direction: column;
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
      `}</style>
    </div>
  );
};

export default Home;