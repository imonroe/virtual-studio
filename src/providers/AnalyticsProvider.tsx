/**
 * AnalyticsProvider Context
 * 
 * React context provider for Google Analytics integration.
 * Provides analytics functionality throughout the application.
 */

import React, { createContext, useContext } from 'react';
import type { AnalyticsProviderProps, AnalyticsContextValue } from '@/types/analytics';
import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  onError
}) => {
  const analytics = useAnalytics();

  // Note: With opt-out model, we no longer need to trigger consent required
  // Analytics initialize by default, consent callbacks are only for explicit opt-out

  // Handle consent request
  const handleRequestConsent = () => {
    try {
      analytics.requestConsent();
    } catch (error) {
      console.error('[AnalyticsProvider] Failed to request consent:', error);
      onError?.(error as Error);
    }
  };

  // Handle consent withdrawal
  const handleWithdrawConsent = () => {
    try {
      analytics.withdrawConsent();
    } catch (error) {
      console.error('[AnalyticsProvider] Failed to withdraw consent:', error);
      onError?.(error as Error);
    }
  };

  // Enhanced page view tracking
  const handleTrackPageView = (title: string, location?: string) => {
    try {
      analytics.trackPageView(title, location);
    } catch (error) {
      console.warn('[AnalyticsProvider] Page view tracking failed:', error);
      onError?.(error as Error);
    }
  };

  // Enhanced event tracking
  const handleTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    try {
      analytics.trackEvent(eventName, parameters);
    } catch (error) {
      console.warn('[AnalyticsProvider] Event tracking failed:', error);
      onError?.(error as Error);
    }
  };

  const contextValue: AnalyticsContextValue = {
    service: null, // We don't expose the service directly
    isInitialized: analytics.isReady,
    hasConsent: analytics.hasConsent,
    trackPageView: handleTrackPageView,
    trackEvent: handleTrackEvent,
    requestConsent: handleRequestConsent,
    withdrawConsent: handleWithdrawConsent
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook to use analytics context
 */
export const useAnalyticsContext = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  
  return context;
};

/**
 * Higher-order component for analytics tracking
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WithAnalyticsComponent = (props: P) => {
    const analytics = useAnalyticsContext();
    
    return <Component {...props} analytics={analytics} />;
  };
  
  WithAnalyticsComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`;
  
  return WithAnalyticsComponent;
}