/**
 * Contract tests for Analytics Types and Validation
 * 
 * These tests validate the analytics type definitions and validation logic.
 * Tests MUST FAIL until types and validation are implemented.
 */

import { describe, it, expect } from 'vitest'
import type { AnalyticsConfig, AnalyticsEvent, ConsentState } from '@/types/analytics'
import { 
  AnalyticsError, 
  ConsentRequiredError, 
  InvalidConfigError,
  validateAnalyticsConfig,
  validateAnalyticsEvent,
  validateConsentState
} from '@/types/analytics'

describe('T007: Analytics Types Contract Tests', () => {
  describe('AnalyticsConfig Validation', () => {
    it('should validate correct measurement ID format', () => {
      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: true,
        debug: false
      }

      expect(() => validateAnalyticsConfig(config)).not.toThrow()
    })

    it('should reject invalid measurement ID formats', () => {
      const invalidConfigs = [
        { measurementId: 'GA-INVALID', enabled: true, consentGiven: true },
        { measurementId: 'G-SHORT', enabled: true, consentGiven: true },
        { measurementId: 'G-TOOLONGID123', enabled: true, consentGiven: true },
        { measurementId: 'g-lowercase', enabled: true, consentGiven: true },
        { measurementId: '', enabled: true, consentGiven: true }
      ]

      invalidConfigs.forEach(config => {
        expect(() => validateAnalyticsConfig(config as AnalyticsConfig))
          .toThrow('Invalid configuration: measurementId')
      })
    })

    it('should require measurementId when enabled', () => {
      const config = {
        measurementId: '',
        enabled: true,
        consentGiven: true
      } as AnalyticsConfig

      expect(() => validateAnalyticsConfig(config))
        .toThrow('Invalid configuration: measurementId')
    })

    it('should require consent when enabled', () => {
      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: false
      }

      expect(() => validateAnalyticsConfig(config))
        .toThrow('User consent required before tracking')
    })
  })

  describe('AnalyticsEvent Validation', () => {
    it('should validate correct event structure', () => {
      const event: AnalyticsEvent = {
        eventName: 'page_view',
        parameters: { page_title: 'Test', page_location: '/test' },
        timestamp: new Date(),
        sessionId: 'session-123'
      }

      expect(() => validateAnalyticsEvent(event)).not.toThrow()
    })

    it('should reject empty event names', () => {
      const event: AnalyticsEvent = {
        eventName: '',
        timestamp: new Date()
      }

      expect(() => validateAnalyticsEvent(event)).toThrow()
    })

    it('should validate GA4 naming conventions', () => {
      const validEvents = [
        'page_view',
        'user_engagement',
        'custom_event_name',
        'background_change'
      ]

      const invalidEvents = [
        'pageView',  // camelCase not allowed
        'page-view', // hyphens not allowed
        'page view', // spaces not allowed
        'PAGE_VIEW'  // uppercase not recommended
      ]

      validEvents.forEach(eventName => {
        const event: AnalyticsEvent = { eventName, timestamp: new Date() }
        expect(() => validateAnalyticsEvent(event)).not.toThrow()
      })

      invalidEvents.forEach(eventName => {
        const event: AnalyticsEvent = { eventName, timestamp: new Date() }
        expect(() => validateAnalyticsEvent(event)).toThrow()
      })
    })

    it('should ensure parameters are serializable', () => {
      const serializableEvent: AnalyticsEvent = {
        eventName: 'test_event',
        parameters: {
          string: 'value',
          number: 123,
          boolean: true,
          null: null,
          nested: { key: 'value' }
        },
        timestamp: new Date()
      }

      expect(() => validateAnalyticsEvent(serializableEvent)).not.toThrow()

      const nonSerializableEvent: AnalyticsEvent = {
        eventName: 'test_event',
        parameters: {
          func: () => {}, // functions not serializable
          circular: {} as any
        },
        timestamp: new Date()
      }
      nonSerializableEvent.parameters!.circular.self = nonSerializableEvent.parameters!.circular

      expect(() => validateAnalyticsEvent(nonSerializableEvent)).toThrow()
    })
  })

  describe('ConsentState Validation', () => {
    it('should validate correct consent structure', () => {
      const consent: ConsentState = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date(),
        consentVersion: '1.0.0'
      }

      expect(() => validateConsentState(consent)).not.toThrow()
    })

    it('should require timestamp when consent given', () => {
      const consent = {
        analyticsStorage: true,
        adStorage: false,
        consentVersion: '1.0.0'
        // missing consentTimestamp
      } as ConsentState

      expect(() => validateConsentState(consent)).toThrow()
    })

    it('should validate consent version format', () => {
      const validVersions = ['1.0.0', '2.1.3', '10.0.0']
      const invalidVersions = ['1.0', 'v1.0.0', '1.0.0-beta', '']

      validVersions.forEach(consentVersion => {
        const consent: ConsentState = {
          analyticsStorage: true,
          adStorage: false,
          consentTimestamp: new Date(),
          consentVersion
        }
        expect(() => validateConsentState(consent)).not.toThrow()
      })

      invalidVersions.forEach(consentVersion => {
        const consent: ConsentState = {
          analyticsStorage: true,
          adStorage: false,
          consentTimestamp: new Date(),
          consentVersion
        }
        expect(() => validateConsentState(consent)).toThrow()
      })
    })
  })

  describe('Error Classes', () => {
    it('should create AnalyticsError with code', () => {
      const error = new AnalyticsError('Test message', 'TEST_CODE')
      
      expect(error.name).toBe('AnalyticsError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error instanceof Error).toBe(true)
    })

    it('should create ConsentRequiredError', () => {
      const error = new ConsentRequiredError()
      
      expect(error.name).toBe('AnalyticsError')
      expect(error.message).toBe('User consent required before tracking')
      expect(error.code).toBe('CONSENT_REQUIRED')
      expect(error instanceof AnalyticsError).toBe(true)
    })

    it('should create InvalidConfigError', () => {
      const error = new InvalidConfigError('measurementId')
      
      expect(error.name).toBe('AnalyticsError')
      expect(error.message).toBe('Invalid configuration: measurementId')
      expect(error.code).toBe('INVALID_CONFIG')
      expect(error instanceof AnalyticsError).toBe(true)
    })
  })
})