/**
 * useAnalytics Hook
 * 
 * React hook for Google Analytics integration in Virtual Studio.
 * Provides analytics functionality with consent management.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UseAnalyticsReturn, ConsentState } from '@/types/analytics';
import { getAnalyticsService, createConsentState, getEnvironmentConfig, isValidMeasurementId } from '@/services/analytics';

const CONSENT_STORAGE_KEY = 'ga-consent-state';

export function useAnalytics(): UseAnalyticsReturn {
  const [isReady, setIsReady] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  
  const analyticsService = getAnalyticsService();
  const { measurementId, debug } = getEnvironmentConfig();

  // Initialize analytics and load consent on mount
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Check if measurement ID is configured and valid
        if (!measurementId) {
          if (debug) {
            console.info('📊 [useAnalytics] No measurement ID configured - analytics disabled');
          }
          return;
        }

        if (!isValidMeasurementId(measurementId)) {
          console.warn('[useAnalytics] Invalid measurement ID format:', measurementId);
          return;
        }

        // Load existing consent - default to TRUE (opt-out model)
        const existingConsent = loadConsent();
        const consentGiven = existingConsent?.analyticsStorage !== false; // Only false if explicitly declined

        setHasConsent(consentGiven);

        // Initialize analytics unless explicitly declined
        if (consentGiven) {
          await analyticsService.initialize({
            measurementId,
            enabled: true,
            consentGiven: true,
            debug
          });

          setIsReady(true);

          if (debug) {
            console.log('✅ [useAnalytics] Analytics initialized (opt-out model - collecting by default)');
          }
        } else if (debug) {
          console.log('🚫 [useAnalytics] Analytics disabled - user explicitly declined');
        }
      } catch (error) {
        console.error('[useAnalytics] Initialization failed:', error);
      }
    };

    initializeAnalytics();
  }, [measurementId, debug, analyticsService]);

  // Load consent from localStorage
  const loadConsent = useCallback((): ConsentState | null => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      return {
        ...data,
        consentTimestamp: new Date(data.consentTimestamp)
      };
    } catch (error) {
      console.warn('[useAnalytics] Failed to load consent:', error);
      return null;
    }
  }, []);

  // Request user consent for analytics
  const requestConsent = useCallback(async () => {
    try {
      const consent = createConsentState(true);
      
      // Update analytics service consent
      await analyticsService.updateConsent(consent);
      
      // Initialize analytics if not already done
      if (!isReady && measurementId && isValidMeasurementId(measurementId)) {
        await analyticsService.initialize({
          measurementId,
          enabled: true,
          consentGiven: true,
          debug
        });
        setIsReady(true);
      }
      
      setHasConsent(true);
      
      if (debug) {
        console.log('✅ [useAnalytics] Consent granted and analytics initialized');
      }
    } catch (error) {
      console.error('[useAnalytics] Failed to grant consent:', error);
    }
  }, [analyticsService, isReady, measurementId, debug]);

  // Withdraw user consent for analytics
  const withdrawConsent = useCallback(async () => {
    try {
      const consent = createConsentState(false);
      
      // Update analytics service consent
      await analyticsService.updateConsent(consent);
      
      // Remove from localStorage
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      
      setHasConsent(false);
      setIsReady(false);
      
      if (debug) {
        console.log('[useAnalytics] Consent withdrawn');
      }
    } catch (error) {
      console.error('[useAnalytics] Failed to withdraw consent:', error);
    }
  }, [analyticsService, debug]);

  // Track page view
  const trackPageView = useCallback((title: string, location?: string) => {
    if (!isReady || !hasConsent) {
      if (debug) {
        console.warn('[useAnalytics] Cannot track page view: not ready or no consent');
      }
      return;
    }

    try {
      const pageLocation = location || window.location.href;
      analyticsService.trackPageView(title, pageLocation);
    } catch (error) {
      console.warn('[useAnalytics] Page view tracking failed:', error);
    }
  }, [analyticsService, isReady, hasConsent, debug]);

  // Track custom event
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!isReady || !hasConsent) {
      if (debug) {
        console.warn('[useAnalytics] Cannot track event: not ready or no consent');
      }
      return;
    }

    try {
      analyticsService.trackEvent({
        eventName,
        parameters: parameters || {},
        timestamp: new Date()
      });
    } catch (error) {
      console.warn('[useAnalytics] Event tracking failed:', error);
    }
  }, [analyticsService, isReady, hasConsent, debug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // No cleanup needed - service is singleton and should persist
      // across component unmounts
    };
  }, []);

  return {
    trackPageView,
    trackEvent,
    isReady,
    hasConsent,
    requestConsent,
    withdrawConsent
  };
}