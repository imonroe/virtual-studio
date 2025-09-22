/**
 * Analytics Service Implementation
 * 
 * Google Analytics GA4 service for Virtual Studio React application.
 * Handles initialization, tracking, and consent management.
 */

import type { 
  AnalyticsService, 
  AnalyticsConfig, 
  AnalyticsEvent, 
  ConsentState
} from '@/types/analytics';
import {
  validateAnalyticsConfig,
  validateAnalyticsEvent,
  validateConsentState
} from '@/types/analytics';

const CONSENT_STORAGE_KEY = 'ga-consent-state';
const CURRENT_CONSENT_VERSION = '1.0.0';

export class AnalyticsServiceImpl implements AnalyticsService {
  private config: AnalyticsConfig | null = null;
  private initialized = false;

  async initialize(config: AnalyticsConfig): Promise<void> {
    try {
      // Validate configuration
      validateAnalyticsConfig(config);
      
      this.config = { ...config };
      
      // Load gtag script if not already loaded
      if (!window.gtag) {
        await this.loadGtagScript(config.measurementId);
      }
      
      // Configure gtag with consent mode
      if (config.consentGiven && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied' // We only use analytics, not ads
        });
      }
      
      this.initialized = true;
      
    } catch (error) {
      console.error('[Analytics] Initialization failed:', error);
      throw error;
    }
  }

  private async loadGtagScript(measurementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Initialize dataLayer if not exists
      window.dataLayer = window.dataLayer || [];
      
      // Create gtag function
      function gtag(...args: any[]): void {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;
      
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.onload = () => {
        // Initialize gtag
        if (window.gtag) {
          window.gtag('js', new Date());
          window.gtag('config', measurementId, {
            send_page_view: false, // We'll handle page views manually
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        }
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Analytics script'));
      };
      
      document.head.appendChild(script);
    });
  }

  async trackPageView(pageTitle: string, pageLocation: string): Promise<void> {
    if (!pageTitle || pageTitle.trim() === '') {
      throw new Error('Page title is required');
    }
    
    if (!this.initialized || !this.config?.consentGiven) {
      if (this.config?.debug) {
        console.warn('[Analytics] Cannot track page view: not initialized or no consent');
      }
      return;
    }

    try {
      const event: AnalyticsEvent = {
        eventName: 'page_view',
        parameters: {
          page_title: pageTitle,
          page_location: pageLocation || window.location.href
        },
        timestamp: new Date()
      };

      await this.trackEvent(event);
    } catch (error) {
      console.warn('[Analytics] Page view tracking failed:', error);
    }
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !this.config?.consentGiven) {
      if (this.config?.debug) {
        console.warn('[Analytics] Cannot track event: not initialized or no consent');
      }
      return;
    }

    try {
      // Validate event
      validateAnalyticsEvent(event);
      
      if (!window.gtag) {
        console.warn('[Analytics] gtag is not available. Event not tracked.');
        return;
      }

      // Track event with gtag
      window.gtag('event', event.eventName, event.parameters || {});
      
    } catch (error) {
      console.warn('[Analytics] Event tracking failed:', error);
    }
  }

  async updateConsent(consent: ConsentState): Promise<void> {
    try {
      // Validate consent state
      validateConsentState(consent);
      
      // Update gtag consent
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: consent.analyticsStorage ? 'granted' : 'denied',
          ad_storage: consent.adStorage ? 'granted' : 'denied'
        });
      }
      
      // Persist consent to localStorage
      try {
        const consentData = {
          ...consent,
          consentTimestamp: consent.consentTimestamp.toISOString()
        };
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      } catch (error) {
        console.warn('[Analytics] Failed to persist consent to localStorage:', error);
      }
      
      // Update config if initialized
      if (this.config) {
        this.config.consentGiven = consent.analyticsStorage;
      }
      
    } catch (error) {
      console.error('[Analytics] Failed to update consent:', error);
      throw error;
    }
  }

  getConsent(): ConsentState | null {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        return null;
      }
      
      const data = JSON.parse(stored);
      return {
        ...data,
        consentTimestamp: new Date(data.consentTimestamp)
      };
    } catch (error) {
      console.warn('[Analytics] Failed to retrieve consent from localStorage:', error);
      return null;
    }
  }

  isInitialized(): boolean {
    return this.initialized && !!this.config?.consentGiven;
  }

  shutdown(): void {
    this.config = null;
    this.initialized = false;
    
    // Note: We don't clear gtag or consent as they might be needed after shutdown
  }
}

/**
 * Utility functions
 */
export function createConsentState(accepted: boolean): ConsentState {
  return {
    analyticsStorage: accepted,
    adStorage: false, // We don't use advertising features
    consentTimestamp: new Date(),
    consentVersion: CURRENT_CONSENT_VERSION
  };
}

export function isValidMeasurementId(measurementId: string): boolean {
  return /^G-[A-Z0-9]{10}$/.test(measurementId);
}

export function getEnvironmentConfig(): { measurementId?: string; debug?: boolean } {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const debug = import.meta.env.VITE_GA_DEBUG === 'true' || import.meta.env.NODE_ENV === 'development';

  // Enhanced logging for debugging
  if (debug) {
    console.log('📊 [Analytics] Environment configuration:', {
      measurementId: measurementId ? `${measurementId.substring(0, 5)}...` : 'NOT SET',
      debug: debug,
      nodeEnv: import.meta.env.NODE_ENV,
      mode: import.meta.env.MODE
    });
  }

  // Validate environment configuration
  if (import.meta.env.NODE_ENV === 'production' && !measurementId) {
    console.warn('⚠️  [Analytics] VITE_GA_MEASUREMENT_ID not configured for production build. Analytics will be disabled.');
  } else if (!measurementId) {
    if (debug) {
      console.info('ℹ️  [Analytics] VITE_GA_MEASUREMENT_ID not set. Analytics will be disabled. Set this in .env file for development.');
    }
  } else if (measurementId && !isValidMeasurementId(measurementId)) {
    console.warn('⚠️  [Analytics] Invalid VITE_GA_MEASUREMENT_ID format. Expected format: G-XXXXXXXXXX');
  } else if (debug) {
    console.log('✅ [Analytics] Valid measurement ID configured');
  }

  return {
    measurementId,
    debug
  };
}

// Singleton instance for the application
let analyticsInstance: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsServiceImpl();
  }
  return analyticsInstance;
}