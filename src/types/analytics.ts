/**
 * Analytics Types and Interfaces
 * 
 * TypeScript definitions for Google Analytics GA4 integration
 * in Virtual Studio React application.
 */

import type { ReactNode } from 'react';

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
  public readonly code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'AnalyticsError';
    this.code = code;
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

/**
 * React Component Props and Interfaces
 */
export interface AnalyticsProviderProps {
  children: ReactNode;
  measurementId?: string;
  debug?: boolean;
  onConsentRequired?: () => void;
  onError?: (error: Error) => void;
}

export interface AnalyticsContextValue {
  service: AnalyticsService | null;
  isInitialized: boolean;
  hasConsent: boolean;
  trackPageView: (title: string, location?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  requestConsent: () => void;
  withdrawConsent: () => void;
}

export interface UseAnalyticsReturn {
  trackPageView: (title: string, location?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  isReady: boolean;
  hasConsent: boolean;
  requestConsent: () => void;
  withdrawConsent: () => void;
}

export interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
  message?: string;
  acceptText?: string;
  declineText?: string;
}

/**
 * Validation Functions
 */
export function validateAnalyticsConfig(config: AnalyticsConfig): void {
  if (!config.measurementId && config.enabled) {
    throw new InvalidConfigError('measurementId');
  }
  
  if (config.measurementId && !/^G-[A-Z0-9]{10}$/.test(config.measurementId)) {
    throw new InvalidConfigError('measurementId');
  }
  
  if (config.enabled && !config.consentGiven) {
    throw new ConsentRequiredError();
  }
}

export function validateAnalyticsEvent(event: AnalyticsEvent): void {
  if (!event.eventName || event.eventName.trim() === '') {
    throw new AnalyticsError('Event name is required', 'INVALID_EVENT');
  }
  
  // Validate GA4 naming conventions
  if (!/^[a-z][a-z0-9_]*$/.test(event.eventName)) {
    throw new AnalyticsError('Event name must follow GA4 naming conventions (lowercase, underscores)', 'INVALID_EVENT_NAME');
  }
  
  // Check if parameters are serializable
  if (event.parameters) {
    try {
      JSON.stringify(event.parameters);
    } catch (error) {
      throw new AnalyticsError('Event parameters must be serializable', 'INVALID_PARAMETERS');
    }
  }
}

export function validateConsentState(consent: ConsentState): void {
  if ((consent.analyticsStorage || consent.adStorage) && !consent.consentTimestamp) {
    throw new AnalyticsError('Consent timestamp is required when consent is given', 'INVALID_CONSENT');
  }
  
  if (!consent.consentVersion || !/^\d+\.\d+\.\d+$/.test(consent.consentVersion)) {
    throw new AnalyticsError('Consent version must be in semver format (x.y.z)', 'INVALID_CONSENT_VERSION');
  }
}