/**
 * ConsentBanner Component
 * 
 * GDPR-compliant consent banner for Google Analytics tracking.
 * Provides clear opt-in/opt-out mechanism for users.
 */

import React, { useEffect, useState } from 'react';
import type { ConsentBannerProps } from '@/types/analytics';
import { createConsentState } from '@/services/analytics';
import styles from './ConsentBanner.module.css';

const CONSENT_STORAGE_KEY = 'ga-consent-state';

export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  onAccept,
  onDecline,
  isVisible,
  message = 'We use analytics to improve your experience. This helps us understand how you interact with our application.',
  acceptText = 'Accept',
  declineText = 'Decline'
}) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const hasExistingConsent = checkExistingConsent();
    setShouldShow(isVisible && !hasExistingConsent);
  }, [isVisible]);

  const checkExistingConsent = (): boolean => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return false;
      
      const consent = JSON.parse(stored);
      return consent && typeof consent.analyticsStorage === 'boolean';
    } catch (error) {
      console.warn('[ConsentBanner] Failed to check existing consent:', error);
      return false;
    }
  };

  const handleAccept = () => {
    try {
      const consent = createConsentState(true);
      
      // Persist consent to localStorage
      const consentData = {
        ...consent,
        consentTimestamp: consent.consentTimestamp.toISOString()
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      
      setShouldShow(false);
      onAccept();
    } catch (error) {
      console.warn('[ConsentBanner] Failed to save consent:', error);
      // Still call onAccept even if storage fails
      onAccept();
    }
  };

  const handleDecline = () => {
    try {
      const consent = createConsentState(false);
      
      // Persist consent to localStorage (declined)
      const consentData = {
        ...consent,
        consentTimestamp: consent.consentTimestamp.toISOString()
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      
      setShouldShow(false);
      onDecline();
    } catch (error) {
      console.warn('[ConsentBanner] Failed to save consent:', error);
      // Still call onDecline even if storage fails
      onDecline();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      role="banner" 
      aria-label="Cookie consent banner"
      className={styles.banner}
      data-testid="consent-banner"
    >
      <div className={styles.content}>
        <div className={styles.message}>
          <p>{message}</p>
          <p className={styles.privacy}>
            We collect anonymous usage data to help improve Virtual Studio. 
            Your personal information is never tracked or stored.
          </p>
        </div>
        
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleDecline}
            onKeyDown={(e) => handleKeyDown(e, handleDecline)}
            className={`${styles.button} ${styles.decline}`}
            tabIndex={0}
            aria-label="Decline analytics cookies"
          >
            {declineText}
          </button>
          
          <button
            type="button"
            onClick={handleAccept}
            onKeyDown={(e) => handleKeyDown(e, handleAccept)}
            className={`${styles.button} ${styles.accept}`}
            tabIndex={0}
            aria-label="Accept analytics cookies"
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );
};