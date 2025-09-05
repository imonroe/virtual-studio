import React from 'react';
import { Link } from 'react-router-dom';
import './FeedbackPage.css';

export const FeedbackPage: React.FC = () => {
  return (
    <div className="feedback-page">
      <div className="feedback-container">
        {/* Header */}
        <header className="feedback-header">
          <div className="feedback-nav">
            <Link to="/app" className="back-link">
              ← Back to Studio
            </Link>
            <Link to="/" className="home-link">
              Home
            </Link>
          </div>
          <div className="feedback-hero">
            <h1 className="feedback-title">
              <span className="gradient-text">Feedback & Support</span>
            </h1>
            <p className="feedback-subtitle">
              Help us improve Virtual Video Studio
            </p>
            <p className="feedback-description">
              Found a bug? Have a feature request? We'd love to hear from you! 
              Your feedback helps us make Virtual Video Studio better for everyone.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="feedback-main">
          <div className="feedback-content">
            <div className="feedback-info">
              <h2>What can you report?</h2>
              <div className="feedback-types">
                <div className="feedback-type">
                  <div className="feedback-icon">🐛</div>
                  <h3>Bug Reports</h3>
                  <p>Something not working as expected? Let us know about any issues you encounter.</p>
                </div>
                <div className="feedback-type">
                  <div className="feedback-icon">💡</div>
                  <h3>Feature Requests</h3>
                  <p>Have an idea for a new feature or improvement? We'd love to hear your suggestions.</p>
                </div>
                <div className="feedback-type">
                  <div className="feedback-icon">📝</div>
                  <h3>General Feedback</h3>
                  <p>Share your thoughts on the app's usability, design, or overall experience.</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Submit Your Feedback</h2>
              <p className="form-description">
                Fill out the form below and we'll create a GitHub issue to track your request.
                This helps us organize and prioritize improvements to the app.
              </p>
              
              <div className="form-container">
                <iframe
                  src="https://n8n.rage5.com/form/41033ab7-5145-408b-b13b-8d326a816ae7"
                  width="100%"
                  height="1160"
                  style={{ border: 'none' }}
                  title="Virtual Video Studio Feedback Form"
                  className="feedback-form"
                />
              </div>
              
              <div className="form-note">
                <p>
                  <strong>Note:</strong> By submitting feedback, you're helping improve Virtual Video Studio 
                  for the entire community. Your submission will create a public GitHub issue that our 
                  development team can track and prioritize.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="feedback-footer">
          <div className="footer-content">
            <div className="footer-links">
              <Link to="/app">Launch Studio</Link>
              <Link to="/">Home</Link>
              <a 
                href="https://github.com/imonroe/virtual-studio" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </div>
            <div className="footer-text">
              <p>&copy; 2025 Virtual Video Studio - Open Source Broadcast Graphics</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};