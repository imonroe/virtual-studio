import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Analytics tracking component for route changes
function AnalyticsTracker() {
  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    // Track page view on route change
    if (analytics.isReady && analytics.hasConsent) {
      const pageTitle = getPageTitle(location.pathname);
      analytics.trackPageView(pageTitle, window.location.href);
    }
  }, [location.pathname, analytics]);

  return null;
}

// Get page title based on route
function getPageTitle(pathname: string): string {
  switch (pathname) {
    case '/':
      return 'Virtual Studio - Home';
    case '/app':
      return 'Virtual Studio - Application';
    case '/feedback':
      return 'Virtual Studio - Feedback';
    case '/docs':
      return 'Virtual Studio - Documentation';
    default:
      return 'Virtual Studio';
  }
}

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
      <AnalyticsTracker />
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
  const { measurementId, debug } = getEnvironmentConfig();

  const handleConsentRequired = () => {
    if (debug) {
      console.log('[App] Consent required for analytics');
    }
  };

  const handleAnalyticsError = (error: Error) => {
    console.warn('[App] Analytics error:', error);
  };

  return (
    <AnalyticsProvider
      measurementId={measurementId}
      debug={debug}
      onConsentRequired={handleConsentRequired}
      onError={handleAnalyticsError}
    >
      <Router>
        <AppContent />
      </Router>
    </AnalyticsProvider>
  );
}

export default App;