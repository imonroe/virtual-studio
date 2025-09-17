/**
 * Contract: Component Integration Interface
 * 
 * Defines how React components should integrate with analytics
 * in Virtual Studio application.
 */

import { AnalyticsService, AnalyticsEvent } from './analytics-service';

/**
 * Props for the main Analytics provider component
 */
export interface AnalyticsProviderProps {
  children: React.ReactNode;
  measurementId?: string;
  debug?: boolean;
  onConsentRequired?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Context value provided by AnalyticsProvider
 */
export interface AnalyticsContextValue {
  service: AnalyticsService | null;
  isInitialized: boolean;
  hasConsent: boolean;
  trackPageView: (title: string, location?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  requestConsent: () => void;
  withdrawConsent: () => void;
}

/**
 * Hook return value for useAnalytics
 */
export interface UseAnalyticsReturn {
  trackPageView: (title: string, location?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  isReady: boolean;
  hasConsent: boolean;
  requestConsent: () => void;
  withdrawConsent: () => void;
}

/**
 * Props for consent banner component
 */
export interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
  message?: string;
  acceptText?: string;
  declineText?: string;
}

/**
 * Configuration for page tracking behavior
 */
export interface PageTrackingConfig {
  enabled: boolean;
  trackHashChanges: boolean;
  trackSearchParams: boolean;
  excludeRoutes?: string[];
  customPageTitle?: (location: Location) => string;
}

/**
 * Integration points with existing Virtual Studio components
 */
export interface StudioIntegrationHooks {
  /**
   * Called when App.tsx mounts - initialize analytics
   */
  onAppMount: (measurementId: string | undefined) => void;

  /**
   * Called on route changes - track page views
   */
  onRouteChange: (newPath: string, title?: string) => void;

  /**
   * Called when user interacts with studio controls
   * Should only track if user has consented
   */
  onStudioInteraction?: (interaction: {
    type: 'background_change' | 'overlay_toggle' | 'control_panel_action';
    details?: Record<string, any>;
  }) => void;
}

/**
 * Component lifecycle hooks for analytics
 */
export interface AnalyticsLifecycleHooks {
  onMount?: () => void;
  onUnmount?: () => void;
  onError?: (error: Error, errorInfo?: any) => void;
  onConsentChange?: (hasConsent: boolean) => void;
}

/**
 * Configuration for analytics initialization
 */
export interface AnalyticsInitConfig {
  measurementId: string;
  debug: boolean;
  requireConsent: boolean;
  pageTracking: PageTrackingConfig;
  hooks: AnalyticsLifecycleHooks;
}