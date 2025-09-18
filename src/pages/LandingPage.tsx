import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Virtual Video Studio</span>
            </h1>
            <p className="hero-subtitle">
              Professional broadcast graphics for content creators
            </p>
            <p className="hero-description">
              Create stunning backgrounds, lower thirds, and overlays for your live streams 
              and video content. Works seamlessly with OBS as a browser source.
            </p>
            <div className="hero-actions">
              <Link to="/app" className="cta-button primary">
                Launch Studio
              </Link>
              <Link to="/docs" className="cta-button secondary">
                Documentation
              </Link>
              <a href="#features" className="cta-button secondary">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="studio-preview">
              <div className="preview-background"></div>
              <div className="preview-lower-third">
                <div className="preview-name">John Doe</div>
                <div className="preview-title">Content Creator</div>
              </div>
              <div className="preview-live-indicator">LIVE</div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>Everything You Need for Professional Broadcasts</h2>
            <p>Virtual Studio provides all the tools content creators need to elevate their visual presentation</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Dynamic Backgrounds</h3>
              <p>Beautiful gradient and particle effects generated in real-time. No static images needed.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h3>Lower Thirds</h3>
              <p>Animated text overlays with customizable styling for names, titles, and information.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Live Overlays</h3>
              <p>Clock display, live indicators, and ticker tape for real-time information.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3>Logo & Branding</h3>
              <p>Upload and position your logos and watermarks with precise control.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>OBS Integration</h3>
              <p>Seamless browser source compatibility for streaming software.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>60fps Performance</h3>
              <p>Optimized WebGL rendering ensures smooth graphics at broadcast quality.</p>
            </div>
          </div>
        </section>

        {/* Tech Specs Section */}
        <section className="specs-section">
          <div className="section-header">
            <h2>Built for Creators</h2>
            <p>Modern web technology meets broadcast-quality graphics</p>
          </div>
          
          <div className="specs-grid">
            <div className="spec-group">
              <h4>Performance</h4>
              <ul>
                <li>60fps at 1080p resolution</li>
                <li>Hardware accelerated WebGL</li>
                <li>Low CPU usage</li>
                <li>Real-time updates</li>
              </ul>
            </div>
            
            <div className="spec-group">
              <h4>Compatibility</h4>
              <ul>
                <li>Modern browsers (Chrome, Firefox, Safari, Edge)</li>
                <li>OBS Studio browser source</li>
                <li>1080p, 720p, 4K output</li>
                <li>Transparent backgrounds</li>
              </ul>
            </div>
            
            <div className="spec-group">
              <h4>Features</h4>
              <ul>
                <li>Keyboard shortcuts</li>
                <li>Preset saving/loading</li>
                <li>Local storage persistence</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Elevate Your Content?</h2>
            <p>Start creating professional broadcast graphics in seconds</p>
            <Link to="/app" className="cta-button primary large">
              Launch Virtual Studio
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Virtual Studio</h3>
              <p>Open source broadcast graphics for content creators</p>
            </div>
            <div className="footer-links">
              <a href="https://github.com/imonroe/virtual-studio" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <Link to="/app">Launch App</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 <a href="https://monroedigitalconsulting.com" target="_blank" rel="noopener noreferrer">Monroe Digital LLC</a>. Built with React, TypeScript, and WebGL.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};