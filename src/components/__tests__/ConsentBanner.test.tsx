/**
 * Integration tests for ConsentBanner component
 * 
 * These tests validate the consent flow and user interaction.
 * Tests MUST FAIL until ConsentBanner component is implemented.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConsentBanner } from '@/components/ConsentBanner'
import type { ConsentBannerProps } from '@/types/analytics'

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

describe('T008: ConsentBanner Integration Tests', () => {
  const defaultProps: ConsentBannerProps = {
    onAccept: vi.fn(),
    onDecline: vi.fn(),
    isVisible: true,
    message: 'We use analytics to improve your experience.',
    acceptText: 'Accept',
    declineText: 'Decline'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Rendering', () => {
    it('should render consent banner when visible', () => {
      render(<ConsentBanner {...defaultProps} />)
      
      expect(screen.getByText('We use analytics to improve your experience.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument()
    })

    it('should not render when not visible', () => {
      render(<ConsentBanner {...defaultProps} isVisible={false} />)
      
      expect(screen.queryByText('We use analytics to improve your experience.')).not.toBeInTheDocument()
    })

    it('should use custom text props', () => {
      const customProps = {
        ...defaultProps,
        message: 'Custom consent message',
        acceptText: 'Yes, I agree',
        declineText: 'No, thanks'
      }
      
      render(<ConsentBanner {...customProps} />)
      
      expect(screen.getByText('Custom consent message')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Yes, I agree' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'No, thanks' })).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onAccept when accept button clicked', async () => {
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      fireEvent.click(acceptButton)
      
      await waitFor(() => {
        expect(onAccept).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onDecline when decline button clicked', async () => {
      const onDecline = vi.fn()
      render(<ConsentBanner {...defaultProps} onDecline={onDecline} />)
      
      const declineButton = screen.getByRole('button', { name: 'Decline' })
      fireEvent.click(declineButton)
      
      await waitFor(() => {
        expect(onDecline).toHaveBeenCalledTimes(1)
      })
    })

    it('should persist consent choice to localStorage', async () => {
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      fireEvent.click(acceptButton)
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'ga-consent-state',
          expect.stringContaining('"analyticsStorage":true')
        )
      })
    })

    it('should not show banner if consent already given', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        analyticsStorage: true,
        adStorage: false,
        consentTimestamp: new Date().toISOString(),
        consentVersion: '1.0.0'
      }))
      
      render(<ConsentBanner {...defaultProps} />)
      
      expect(screen.queryByText('We use analytics to improve your experience.')).not.toBeInTheDocument()
    })
  })

  describe('GDPR Compliance', () => {
    it('should include privacy information in banner', () => {
      render(<ConsentBanner {...defaultProps} />)
      
      // Should contain GDPR-compliant information
      const banner = screen.getByRole('banner') || screen.getByTestId('consent-banner')
      expect(banner).toBeInTheDocument()
      
      // Should have clear information about data processing
      expect(screen.getByText(/analytics/i)).toBeInTheDocument()
    })

    it('should provide clear opt-out mechanism', () => {
      render(<ConsentBanner {...defaultProps} />)
      
      const declineButton = screen.getByRole('button', { name: 'Decline' })
      expect(declineButton).toBeEnabled()
      expect(declineButton).toBeVisible()
    })

    it('should record consent timestamp', async () => {
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      fireEvent.click(acceptButton)
      
      await waitFor(() => {
        const setItemCall = mockLocalStorage.setItem.mock.calls.find(
          call => call[0] === 'ga-consent-state'
        )
        expect(setItemCall).toBeTruthy()
        
        const consentData = JSON.parse(setItemCall![1])
        expect(consentData.consentTimestamp).toBeTruthy()
        expect(new Date(consentData.consentTimestamp)).toBeInstanceOf(Date)
      })
    })

    it('should include consent version', async () => {
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      fireEvent.click(acceptButton)
      
      await waitFor(() => {
        const setItemCall = mockLocalStorage.setItem.mock.calls.find(
          call => call[0] === 'ga-consent-state'
        )
        expect(setItemCall).toBeTruthy()
        
        const consentData = JSON.parse(setItemCall![1])
        expect(consentData.consentVersion).toMatch(/^\d+\.\d+\.\d+$/)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ConsentBanner {...defaultProps} />)
      
      const banner = screen.getByRole('banner') || screen.getByTestId('consent-banner')
      expect(banner).toHaveAttribute('aria-label', expect.stringContaining('consent'))
    })

    it('should be keyboard navigable', () => {
      render(<ConsentBanner {...defaultProps} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      const declineButton = screen.getByRole('button', { name: 'Decline' })
      
      expect(acceptButton).toHaveAttribute('tabIndex', '0')
      expect(declineButton).toHaveAttribute('tabIndex', '0')
    })

    it('should handle keyboard interactions', async () => {
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      acceptButton.focus()
      
      fireEvent.keyDown(acceptButton, { key: 'Enter' })
      
      await waitFor(() => {
        expect(onAccept).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage unavailable')
      })
      
      const onAccept = vi.fn()
      render(<ConsentBanner {...defaultProps} onAccept={onAccept} />)
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      
      // Should not throw error
      expect(() => fireEvent.click(acceptButton)).not.toThrow()
      
      await waitFor(() => {
        expect(onAccept).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle invalid stored consent data', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')
      
      // Should not throw and should show banner
      expect(() => render(<ConsentBanner {...defaultProps} />)).not.toThrow()
      expect(screen.getByText('We use analytics to improve your experience.')).toBeInTheDocument()
    })
  })
})