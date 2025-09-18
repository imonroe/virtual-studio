/**
 * Component tests for DocumentationPage navigation
 * 
 * These tests validate the main documentation page functionality.
 * Tests MUST FAIL until DocumentationPage component is fully implemented.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { DocumentationPage } from '@/pages/DocumentationPage'

// Mock React Router hooks
const mockNavigate = vi.fn()
const mockSearchParams = {
  get: vi.fn(),
  set: vi.fn(),
  clear: vi.fn(),
  delete: vi.fn()
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()]
  }
})

// Test wrapper with Router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('T005: DocumentationPage Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.get.mockReturnValue(null)
  })

  describe('Page Rendering', () => {
    it('should render documentation page with header', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      expect(screen.getByText('Virtual Studio Documentation')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /back to studio/i })).toBeInTheDocument()
    })

    it('should render sidebar with navigation sections', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should show main navigation sections
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Backgrounds')).toBeInTheDocument()
      expect(screen.getByText('Graphics')).toBeInTheDocument()
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
    })

    it('should show default section content on load', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should default to Getting Started
      expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
    })
  })

  describe('Navigation Functionality', () => {
    it('should navigate to different sections', async () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const backgroundsButton = screen.getByRole('button', { name: 'Backgrounds' })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/docs?section=backgrounds')
      })
    })

    it('should update breadcrumbs when navigating', async () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const backgroundsButton = screen.getByRole('button', { name: 'Backgrounds' })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(screen.getByText('Backgrounds')).toBeInTheDocument()
      })
    })

    it('should navigate to subsections', async () => {
      // Set up with a section selected
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'backgrounds'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const gradientSubsection = screen.getByRole('button', { name: 'Gradient Backgrounds' })
      fireEvent.click(gradientSubsection)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/docs?section=backgrounds&subsection=gradients')
      })
    })

    it('should handle back to studio navigation', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const backButton = screen.getByRole('button', { name: /back to studio/i })
      fireEvent.click(backButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/app')
    })
  })

  describe('Mobile Responsive Features', () => {
    it('should show sidebar toggle on mobile', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const sidebarToggle = screen.getByRole('button', { name: /toggle navigation sidebar/i })
      expect(sidebarToggle).toBeInTheDocument()
    })

    it('should toggle sidebar when button clicked', async () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const sidebarToggle = screen.getByRole('button', { name: /toggle navigation sidebar/i })
      const sidebar = screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')
      
      // Should start closed on mobile (assuming mobile breakpoint)
      fireEvent.click(sidebarToggle)
      
      await waitFor(() => {
        expect(sidebar).toHaveClass('open')
      })
    })
  })

  describe('URL Parameter Handling', () => {
    it('should load specific section from URL params', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'graphics'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should show graphics section content
      expect(screen.getByText(/add and configure graphics overlays/i)).toBeInTheDocument()
    })

    it('should load specific subsection from URL params', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'graphics'
        if (key === 'subsection') return 'lower-thirds'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should show lower thirds subsection
      expect(screen.getByText(/professional lower third graphics/i)).toBeInTheDocument()
    })

    it('should fallback to getting started for invalid section', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'invalid-section'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should show error state or fallback to getting started
      expect(
        screen.getByText(/section not found/i) || screen.getByText(/welcome to virtual studio/i)
      ).toBeInTheDocument()
    })
  })

  describe('Content Display', () => {
    it('should show section overview when no subsection selected', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'backgrounds'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      expect(screen.getByText(/select a topic from the navigation/i)).toBeInTheDocument()
    })

    it('should show subsection content when subsection selected', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'getting-started'
        if (key === 'subsection') return 'overview'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })

    it('should display step-by-step instructions', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'getting-started'
        if (key === 'subsection') return 'overview'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      // Should show steps
      expect(screen.getByText('Steps')).toBeInTheDocument()
      expect(screen.getByText('Open Virtual Studio')).toBeInTheDocument()
      expect(screen.getByText('Choose a Background')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should show error state for non-existent section', () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'non-existent'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      expect(screen.getByText(/section not found/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to getting started/i })).toBeInTheDocument()
    })

    it('should handle navigation to getting started from error state', async () => {
      mockSearchParams.get.mockImplementation((key) => {
        if (key === 'section') return 'non-existent'
        return null
      })
      
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const gettingStartedButton = screen.getByRole('button', { name: /go to getting started/i })
      fireEvent.click(gettingStartedButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/docs?section=getting-started')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Virtual Studio Documentation')
    })

    it('should have proper navigation landmarks', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
      expect(screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')).toBeInTheDocument()
    })

    it('should have keyboard accessible navigation', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const navigationButtons = screen.getAllByRole('button')
      navigationButtons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0')
      })
    })

    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <DocumentationPage />
        </TestWrapper>
      )
      
      const sidebarToggle = screen.getByRole('button', { name: /toggle navigation sidebar/i })
      expect(sidebarToggle).toHaveAttribute('aria-label', 'Toggle navigation sidebar')
    })
  })
})