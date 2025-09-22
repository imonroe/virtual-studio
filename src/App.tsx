import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Studio } from './pages/Studio';
import { FeedbackPage } from './pages/FeedbackPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { ConsentBanner } from '@/components/ConsentBanner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getEnvironmentConfig } from '@/services/analytics';
import './App.css';

// Note: Page view tracking is now handled automatically by Google Analytics
// No manual tracking needed with default gtag configuration

// Main app content with analytics
function AppContent() {
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const analytics = useAnalytics();
  const { measurementId } = getEnvironmentConfig();

  useEffect(() => {
    // Show consent banner if we have a measurement ID and haven't shown it before
    const hasSeenBanner = localStorage.getItem('analytics-banner-seen');
    if (measurementId && !hasSeenBanner) {
      setShowConsentBanner(true);
    }
  }, [measurementId]);

  const handleConsentAccept = () => {
    // User accepts - analytics already running by default, just hide banner
    localStorage.setItem('analytics-banner-seen', 'true');
    setShowConsentBanner(false);
  };

  const handleConsentDecline = () => {
    // User opts out - disable analytics and hide banner
    analytics.withdrawConsent();
    localStorage.setItem('analytics-banner-seen', 'true');
    setShowConsentBanner(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Studio />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ConsentBanner
        isVisible={showConsentBanner}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        message="We're collecting anonymous usage analytics to improve Virtual Studio. You can opt out at any time."
        acceptText="Continue with Analytics"
        declineText="Opt Out"
      />
    </>
  );
}

function App() {
  const handleAnalyticsError = (error: Error) => {
    console.warn('[App] Analytics error:', error);
  };

  return (
    <AnalyticsProvider
      onError={handleAnalyticsError}
    >
      <Router>
        <AppContent />
      </Router>
    </AnalyticsProvider>
  );
}

export default App;