/**
 * Contract: Analytics Service Interface
 * 
 * Defines the public interface for Google Analytics integration
 * in Virtual Studio React application.
 */

export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  consentGiven: boolean;
  debug?: boolean;
}

export interface AnalyticsEvent {
  eventName: string;
  parameters?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
}

export interface ConsentState {
  analyticsStorage: boolean;
  adStorage: boolean;
  consentTimestamp: Date;
  consentVersion: string;
}

export interface AnalyticsService {
  /**
   * Initialize analytics with configuration
   * @param config - Analytics configuration
   * @throws Error if measurementId is invalid
   */
  initialize(config: AnalyticsConfig): Promise<void>;

  /**
   * Track a page view event
   * @param pageTitle - Title of the page
   * @param pageLocation - URL of the page
   * @returns Promise that resolves when tracking completes
   */
  trackPageView(pageTitle: string, pageLocation: string): Promise<void>;

  /**
   * Track a custom event
   * @param event - Event to track
   * @returns Promise that resolves when tracking completes
   */
  trackEvent(event: AnalyticsEvent): Promise<void>;

  /**
   * Update consent state
   * @param consent - New consent state
   */
  updateConsent(consent: ConsentState): Promise<void>;

  /**
   * Get current consent state
   * @returns Current consent state or null if not set
   */
  getConsent(): ConsentState | null;

  /**
   * Check if analytics is properly initialized
   * @returns true if ready to track events
   */
  isInitialized(): boolean;

  /**
   * Gracefully shutdown analytics (cleanup)
   */
  shutdown(): void;
}

/**
 * Environment Variables Contract
 * These variables must be defined at build time
 */
export interface EnvironmentConfig {
  VITE_GA_MEASUREMENT_ID?: string;
}

/**
 * Window object extensions for gtag
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Error types for analytics operations
 */
export class AnalyticsError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AnalyticsError';
  }
}

export class ConsentRequiredError extends AnalyticsError {
  constructor() {
    super('User consent required before tracking', 'CONSENT_REQUIRED');
  }
}

export class InvalidConfigError extends AnalyticsError {
  constructor(field: string) {
    super(`Invalid configuration: ${field}`, 'INVALID_CONFIG');
  }
}