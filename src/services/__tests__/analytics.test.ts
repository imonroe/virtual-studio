/**
 * Contract tests for AnalyticsService
 * 
 * These tests define the expected behavior of the analytics service
 * and MUST FAIL until the service is implemented.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { AnalyticsService, AnalyticsConfig, ConsentState } from '@/types/analytics'
import { AnalyticsServiceImpl } from '@/services/analytics'

// Mock gtag for testing
const mockGtag = vi.fn()
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
})

describe('AnalyticsService Contract Tests', () => {
  let analyticsService: AnalyticsService

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    mockGtag.mockClear()
    
    // Create new service instance for each test
    analyticsService = new AnalyticsServiceImpl()
  })

  afterEach(() => {
    if (analyticsService?.shutdown) {
      analyticsService.shutdown()
    }
  })

  describe('T004: AnalyticsService.initialize()', () => {
    it('should initialize with valid configuration', async () => {
      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: true,
        debug: false
      }

      await expect(analyticsService.initialize(config)).resolves.toBeUndefined()
      expect(analyticsService.isInitialized()).toBe(true)
    })

    it('should reject invalid measurement ID format', async () => {
      const config: AnalyticsConfig = {
        measurementId: 'INVALID-ID',
        enabled: true,
        consentGiven: true
      }

      await expect(analyticsService.initialize(config)).rejects.toThrow('Invalid configuration: measurementId')
    })

    it('should not initialize without consent', async () => {
      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: false
      }

      await expect(analyticsService.initialize(config)).rejects.toThrow('User consent required before tracking')
    })
  })

  describe('T005: AnalyticsService.trackPageView()', () => {
    beforeEach(async () => {
      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: true
      }
      await analyticsService.initialize(config)
    })

    it('should track page view with title and location', async () => {
      await expect(analyticsService.trackPageView('Test Page', '/test')).resolves.toBeUndefined()
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Test Page',
        page_location: '/test'
      })
    })

    it('should track page view with only title', async () => {
      await expect(analyticsService.trackPageView('Test Page', window.location.href)).resolves.toBeUndefined()
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_title: 'Test Page'
      }))
    })

    it('should reject empty title', async () => {
      await expect(analyticsService.trackPageView('', '/test')).rejects.toThrow()
    })
  })

  describe('T006: AnalyticsService.updateConsent()', () => {
    it('should update consent state', async () => {
      const consent: ConsentState = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date(),
        consentVersion: '1.0.0'
      }

      await expect(analyticsService.updateConsent(consent)).resolves.toBeUndefined()
      
      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied'
      })
    })

    it('should persist consent to localStorage', async () => {
      const consent: ConsentState = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date(),
        consentVersion: '1.0.0'
      }

      await analyticsService.updateConsent(consent)
      
      const stored = localStorage.getItem('ga-consent-state')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toMatchObject({
        analyticsStorage: true,
        adStorage: false,
        consentVersion: '1.0.0'
      })
    })

    it('should retrieve consent from getConsent()', async () => {
      const consent: ConsentState = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date(),
        consentVersion: '1.0.0'
      }

      await analyticsService.updateConsent(consent)
      
      const retrieved = analyticsService.getConsent()
      expect(retrieved).toMatchObject({
        analyticsStorage: true,
        adStorage: false,
        consentVersion: '1.0.0'
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle gtag not available gracefully', async () => {
      // Temporarily remove gtag
      const originalGtag = window.gtag
      delete (window as any).gtag

      const config: AnalyticsConfig = {
        measurementId: 'G-XXXXXXXXXX',
        enabled: true,
        consentGiven: true
      }

      // Should not throw but should log warning
      await expect(analyticsService.initialize(config)).resolves.toBeUndefined()
      
      // Restore gtag
      window.gtag = originalGtag
    })

    it('should handle localStorage unavailable gracefully', async () => {
      // Mock localStorage to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      })

      const consent: ConsentState = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date(),
        consentVersion: '1.0.0'
      }

      // Should not throw
      await expect(analyticsService.updateConsent(consent)).resolves.toBeUndefined()
      
      // Restore localStorage
      localStorage.setItem = originalSetItem
    })
  })
})