/**
 * Integration tests for Documentation Routing
 * 
 * These tests validate the complete routing flow for documentation features.
 * Tests MUST FAIL until full documentation routing is implemented.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import App from '@/App'

// Mock analytics to avoid issues in tests
vi.mock('@/services/analytics', () => ({
  getEnvironmentConfig: () => ({
    measurementId: null,
    debug: false
  })
}))

// Mock consent banner
vi.mock('@/components/ConsentBanner', () => ({
  ConsentBanner: () => null
}))

// Mock analytics provider
vi.mock('@/providers/AnalyticsProvider', () => ({
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock analytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    isReady: false,
    hasConsent: false,
    trackPageView: vi.fn(),
    requestConsent: vi.fn()
  })
}))

describe('T008: Documentation Routing Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Route Access', () => {
    it('should render documentation page when navigating to /docs', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/virtual studio documentation/i)).toBeInTheDocument()
      })
    })

    it('should show getting started by default', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/getting started/i)).toBeInTheDocument()
        expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
      })
    })

    it('should handle direct access to specific sections', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=backgrounds']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/backgrounds/i)).toBeInTheDocument()
      })
    })

    it('should handle direct access to subsections', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=getting-started&subsection=overview']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/overview/i)).toBeInTheDocument()
        expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation Flow', () => {
    it('should navigate from home to documentation', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
      
      // Look for documentation link in landing page
      const docsLink = screen.getByRole('link', { name: /documentation|docs|help/i }) ||
                       screen.getByRole('button', { name: /documentation|docs|help/i })
      fireEvent.click(docsLink)
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/docs')
      })
    })

    it('should navigate back to studio from documentation', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const backButton = screen.getByRole('button', { name: /back to studio|studio/i })
      fireEvent.click(backButton)
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/app')
      })
    })

    it('should maintain URL state during navigation', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=backgrounds']}>
          <App />
        </MemoryRouter>
      )
      
      // Navigate to subsection
      const gradientLink = screen.getByRole('button', { name: /gradient/i })
      fireEvent.click(gradientLink)
      
      await waitFor(() => {
        expect(window.location.search).toContain('section=backgrounds')
        expect(window.location.search).toContain('subsection=gradients')
      })
    })

    it('should handle browser back/forward navigation', async () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      // Navigate to a section
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(screen.getByText(/customize your virtual studio backgrounds/i)).toBeInTheDocument()
      })
      
      // Simulate browser back
      rerender(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
      })
    })
  })

  describe('URL Parameter Handling', () => {
    it('should correctly parse section parameter', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=graphics']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/graphics/i)).toBeInTheDocument()
        expect(screen.getByText(/add and configure graphics overlays/i)).toBeInTheDocument()
      })
    })

    it('should correctly parse subsection parameter', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=graphics&subsection=lower-thirds']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/lower thirds/i)).toBeInTheDocument()
        expect(screen.getByText(/professional lower third graphics/i)).toBeInTheDocument()
      })
    })

    it('should handle invalid section parameters gracefully', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=invalid-section']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(
          screen.getByText(/section not found/i) || 
          screen.getByText(/welcome to virtual studio/i)
        ).toBeInTheDocument()
      })
    })

    it('should handle missing parameters gracefully', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/getting started/i)).toBeInTheDocument()
      })
    })

    it('should update URL when navigating sections', async () => {
      const mockHistoryPush = vi.fn()
      
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(window.location.search).toContain('section=backgrounds')
      })
    })
  })

  describe('Page Analytics', () => {
    it('should track page view for documentation page', async () => {
      const mockTrackPageView = vi.fn()
      
      vi.mocked(vi.doMock('@/hooks/useAnalytics', () => ({
        useAnalytics: () => ({
          isReady: true,
          hasConsent: true,
          trackPageView: mockTrackPageView,
          requestConsent: vi.fn()
        })
      })))
      
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(mockTrackPageView).toHaveBeenCalledWith(
          'Virtual Studio - Documentation',
          expect.any(String)
        )
      })
    })

    it('should update page title correctly', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(document.title).toContain('Documentation')
      })
    })
  })

  describe('Error Handling and Fallbacks', () => {
    it('should redirect unknown routes to home', async () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <App />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/')
      })
    })

    it('should handle documentation errors gracefully', async () => {
      // Mock console.error to suppress error logs in test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      // Should still render basic page structure even if there are errors
      await waitFor(() => {
        expect(screen.getByText(/virtual studio documentation/i)).toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })

    it('should maintain navigation state during errors', async () => {
      render(
        <MemoryRouter initialEntries={['/docs?section=invalid']}>
          <App />
        </MemoryRouter>
      )
      
      // Even with invalid section, navigation should still work
      const gettingStartedButton = screen.getByRole('button', { name: /getting started/i })
      fireEvent.click(gettingStartedButton)
      
      await waitFor(() => {
        expect(window.location.search).toContain('section=getting-started')
      })
    })
  })

  describe('Mobile Navigation', () => {
    it('should handle mobile sidebar toggle', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const sidebarToggle = screen.getByRole('button', { name: /toggle.*sidebar/i })
      fireEvent.click(sidebarToggle)
      
      await waitFor(() => {
        const sidebar = screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')
        expect(sidebar).toHaveClass('open')
      })
    })

    it('should maintain navigation functionality on mobile', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      // Even on mobile, navigation should work
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(window.location.search).toContain('section=backgrounds')
      })
    })
  })

  describe('Accessibility Navigation', () => {
    it('should support keyboard navigation through routes', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      backgroundsButton.focus()
      
      fireEvent.keyDown(backgroundsButton, { key: 'Enter' })
      
      await waitFor(() => {
        expect(window.location.search).toContain('section=backgrounds')
      })
    })

    it('should maintain focus management during navigation', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        // Focus should be managed appropriately after navigation
        expect(document.activeElement).toBeTruthy()
      })
    })

    it('should provide proper skip links', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      // Should have skip to content links for accessibility
      const skipLink = screen.getByText(/skip to.*content/i) || 
                       screen.getAllByRole('link')[0]
      expect(skipLink).toBeInTheDocument()
    })
  })

  describe('Performance and Caching', () => {
    it('should not reload entire page when navigating between sections', async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      const initialHtml = container.innerHTML
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        // Page structure should remain similar (SPA navigation)
        expect(container.querySelector('.documentation-page')).toBeInTheDocument()
      })
    })

    it('should maintain scroll position appropriately', async () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <App />
        </MemoryRouter>
      )
      
      // Scroll down
      window.scrollTo(0, 500)
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        // For new sections, should scroll to top
        expect(window.scrollY).toBe(0)
      })
    })
  })
})