/**
 * Integration tests for useAnalytics hook
 * 
 * These tests validate page tracking and analytics hook behavior.
 * Tests MUST FAIL until useAnalytics hook is implemented.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '@/hooks/useAnalytics'

// Mock gtag
const mockGtag = vi.fn()
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GA_MEASUREMENT_ID: 'G-TEST123456'
  },
  writable: true
})

describe('T009: useAnalytics Hook Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGtag.mockClear()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    // Clean up any timers or side effects
    vi.clearAllTimers()
  })

  describe('Hook Initialization', () => {
    it('should return analytics interface', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(result.current).toBeDefined()
      expect(typeof result.current.trackPageView).toBe('function')
      expect(typeof result.current.trackEvent).toBe('function')
      expect(typeof result.current.requestConsent).toBe('function')
      expect(typeof result.current.withdrawConsent).toBe('function')
      expect(typeof result.current.isReady).toBe('boolean')
      expect(typeof result.current.hasConsent).toBe('boolean')
    })

    it('should initialize as not ready without consent', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(result.current.isReady).toBe(false)
      expect(result.current.hasConsent).toBe(false)
    })

    it('should load previous consent from localStorage', () => {
      const existingConsent = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date().toISOString(),
        consentVersion: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingConsent))
      
      const { result } = renderHook(() => useAnalytics())
      
      expect(result.current.hasConsent).toBe(true)
      expect(result.current.isReady).toBe(true)
    })
  })

  describe('Consent Management', () => {
    it('should handle consent acceptance', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.requestConsent()
      })
      
      expect(result.current.hasConsent).toBe(true)
      expect(result.current.isReady).toBe(true)
      
      // Should update gtag consent
      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied'
      })
      
      // Should persist to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ga-consent-state',
        expect.stringContaining('"analyticsStorage":true')
      )
    })

    it('should handle consent withdrawal', async () => {
      // Start with consent given
      const existingConsent = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date().toISOString(),
        consentVersion: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingConsent))
      
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.withdrawConsent()
      })
      
      expect(result.current.hasConsent).toBe(false)
      expect(result.current.isReady).toBe(false)
      
      // Should update gtag consent
      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      })
      
      // Should remove from localStorage
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ga-consent-state')
    })
  })

  describe('Page View Tracking', () => {
    beforeEach(async () => {
      // Set up consent for tracking tests
      const existingConsent = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date().toISOString(),
        consentVersion: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingConsent))
    })

    it('should track page view with title and location', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackPageView('Virtual Studio', '/dashboard')
      })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Virtual Studio',
        page_location: '/dashboard'
      })
    })

    it('should track page view with only title', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackPageView('Virtual Studio')
      })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Virtual Studio',
        page_location: window.location.href
      })
    })

    it('should not track without consent', async () => {
      mockLocalStorage.getItem.mockReturnValue(null) // No consent
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackPageView('Virtual Studio')
      })
      
      // Should not call gtag for tracking
      expect(mockGtag).not.toHaveBeenCalledWith('event', 'page_view', expect.any(Object))
    })

    it('should handle tracking errors gracefully', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      // Mock gtag to throw error
      mockGtag.mockImplementation(() => {
        throw new Error('Tracking failed')
      })
      
      // Should not throw
      await act(async () => {
        expect(() => result.current.trackPageView('Test')).not.toThrow()
      })
    })
  })

  describe('Custom Event Tracking', () => {
    beforeEach(async () => {
      // Set up consent for tracking tests
      const existingConsent = {
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date().toISOString(),
        consentVersion: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingConsent))
    })

    it('should track custom events', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackEvent('background_change', {
          background_type: 'gradient',
          background_name: 'sunset'
        })
      })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'background_change', {
        background_type: 'gradient',
        background_name: 'sunset'
      })
    })

    it('should track events without parameters', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackEvent('user_engagement')
      })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'user_engagement', {})
    })

    it('should not track custom events without consent', async () => {
      mockLocalStorage.getItem.mockReturnValue(null) // No consent
      const { result } = renderHook(() => useAnalytics())
      
      await act(async () => {
        result.current.trackEvent('test_event')
      })
      
      // Should not call gtag for tracking
      expect(mockGtag).not.toHaveBeenCalledWith('event', 'test_event', expect.any(Object))
    })
  })

  describe('Environment Configuration', () => {
    it('should handle missing measurement ID gracefully', () => {
      // Mock environment without measurement ID
      Object.defineProperty(import.meta, 'env', {
        value: {},
        writable: true
      })
      
      const { result } = renderHook(() => useAnalytics())
      
      // Should still provide interface but not be ready
      expect(result.current.isReady).toBe(false)
      expect(typeof result.current.trackPageView).toBe('function')
    })

    it('should validate measurement ID format', () => {
      // Mock invalid measurement ID
      Object.defineProperty(import.meta, 'env', {
        value: {
          VITE_GA_MEASUREMENT_ID: 'INVALID-ID'
        },
        writable: true
      })
      
      const { result } = renderHook(() => useAnalytics())
      
      // Should not be ready with invalid ID
      expect(result.current.isReady).toBe(false)
    })
  })

  describe('Performance and Memory', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useAnalytics())
      
      // Should not throw on unmount
      expect(() => unmount()).not.toThrow()
    })

    it('should handle rapid consecutive calls', async () => {
      const { result } = renderHook(() => useAnalytics())
      
      // Set up consent
      await act(async () => {
        result.current.requestConsent()
      })
      
      // Make rapid consecutive calls
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          result.current.trackPageView(`Page ${i}`)
        }
      })
      
      // Should handle all calls without errors
      expect(mockGtag).toHaveBeenCalledTimes(11) // 1 consent + 10 page views
    })

    it('should not create memory leaks with event listeners', () => {
      const { unmount } = renderHook(() => useAnalytics())
      
      // Mock addEventListener to track listeners
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      unmount()
      
      // Should clean up any event listeners
      if (addEventListenerSpy.mock.calls.length > 0) {
        expect(removeEventListenerSpy).toHaveBeenCalled()
      }
      
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })
})