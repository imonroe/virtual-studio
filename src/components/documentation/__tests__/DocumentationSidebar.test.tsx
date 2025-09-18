/**
 * Component tests for DocumentationSidebar
 * 
 * These tests validate the sidebar navigation functionality.
 * Tests MUST FAIL until DocumentationSidebar component is implemented.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar'
import type { DocumentationSidebarProps } from '@/types/documentation'

// Mock documentation structure for testing
const mockDocumentationStructure = {
  sections: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'New to Virtual Studio? Start here.',
      icon: 'play',
      order: 1,
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          order: 1,
          content: {
            overview: 'Welcome to Virtual Studio.',
            steps: []
          }
        },
        {
          id: 'first-time-setup',
          title: 'First Time Setup',
          order: 2,
          content: {
            overview: 'Setting up Virtual Studio for the first time.',
            steps: []
          }
        }
      ]
    },
    {
      id: 'backgrounds',
      title: 'Backgrounds',
      description: 'Customize your virtual studio backgrounds.',
      icon: 'image',
      order: 2,
      subsections: [
        {
          id: 'gradients',
          title: 'Gradient Backgrounds',
          order: 1,
          content: {
            overview: 'Create beautiful gradient backgrounds.',
            steps: []
          }
        },
        {
          id: 'solid-colors',
          title: 'Solid Colors',
          order: 2,
          content: {
            overview: 'Simple solid color backgrounds.',
            steps: []
          }
        }
      ]
    },
    {
      id: 'graphics',
      title: 'Graphics',
      description: 'Add and configure graphics overlays.',
      icon: 'layers',
      order: 3,
      subsections: []
    }
  ],
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
}

describe('T006: DocumentationSidebar Component Tests', () => {
  const mockOnToggle = vi.fn()
  const mockOnNavigate = vi.fn()
  
  const defaultProps: DocumentationSidebarProps = {
    structure: mockDocumentationStructure,
    currentSectionId: 'getting-started',
    currentSubsectionId: undefined,
    isOpen: true,
    onToggle: mockOnToggle,
    onNavigate: mockOnNavigate
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all sections from structure', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Backgrounds')).toBeInTheDocument()
      expect(screen.getByText('Graphics')).toBeInTheDocument()
    })

    it('should show section icons when provided', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      // Should have icon elements (exact implementation may vary)
      const sectionButtons = screen.getAllByRole('button')
      expect(sectionButtons.length).toBeGreaterThan(0)
    })

    it('should highlight current section', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const gettingStartedButton = screen.getByRole('button', { name: /getting started/i })
      expect(gettingStartedButton).toHaveClass('active')
    })

    it('should show subsections for current section', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      // Should show subsections for Getting Started
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('First Time Setup')).toBeInTheDocument()
    })

    it('should not show subsections for non-current sections', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      // Should not show subsections for Backgrounds since it's not current
      expect(screen.queryByText('Gradient Backgrounds')).not.toBeInTheDocument()
      expect(screen.queryByText('Solid Colors')).not.toBeInTheDocument()
    })

    it('should highlight current subsection when provided', () => {
      render(
        <DocumentationSidebar 
          {...defaultProps} 
          currentSubsectionId="overview"
        />
      )
      
      const overviewButton = screen.getByRole('button', { name: /overview/i })
      expect(overviewButton).toHaveClass('active')
    })
  })

  describe('Navigation Interactions', () => {
    it('should call onNavigate when section clicked', async () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      fireEvent.click(backgroundsButton)
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('backgrounds')
      })
    })

    it('should call onNavigate with subsection when subsection clicked', async () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const overviewButton = screen.getByRole('button', { name: /overview/i })
      fireEvent.click(overviewButton)
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('getting-started', 'overview')
      })
    })

    it('should expand subsections when section becomes current', () => {
      const { rerender } = render(<DocumentationSidebar {...defaultProps} />)
      
      // Initially should not show Backgrounds subsections
      expect(screen.queryByText('Gradient Backgrounds')).not.toBeInTheDocument()
      
      // Change to Backgrounds section
      rerender(
        <DocumentationSidebar 
          {...defaultProps} 
          currentSectionId="backgrounds"
        />
      )
      
      // Now should show Backgrounds subsections
      expect(screen.getByText('Gradient Backgrounds')).toBeInTheDocument()
      expect(screen.getByText('Solid Colors')).toBeInTheDocument()
    })

    it('should hide subsections when section becomes non-current', () => {
      const { rerender } = render(<DocumentationSidebar {...defaultProps} />)
      
      // Initially should show Getting Started subsections
      expect(screen.getByText('Overview')).toBeInTheDocument()
      
      // Change to Graphics section
      rerender(
        <DocumentationSidebar 
          {...defaultProps} 
          currentSectionId="graphics"
        />
      )
      
      // Should no longer show Getting Started subsections
      expect(screen.queryByText('Overview')).not.toBeInTheDocument()
    })
  })

  describe('Mobile Responsive Behavior', () => {
    it('should apply open class when isOpen is true', () => {
      render(<DocumentationSidebar {...defaultProps} isOpen={true} />)
      
      const sidebar = screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')
      expect(sidebar).toHaveClass('open')
    })

    it('should not apply open class when isOpen is false', () => {
      render(<DocumentationSidebar {...defaultProps} isOpen={false} />)
      
      const sidebar = screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')
      expect(sidebar).not.toHaveClass('open')
    })

    it('should remain accessible when closed on mobile', () => {
      render(<DocumentationSidebar {...defaultProps} isOpen={false} />)
      
      // Even when closed, navigation should still be accessible for screen readers
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper navigation role', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should have keyboard accessible section buttons', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const sectionButtons = screen.getAllByRole('button')
      sectionButtons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0')
      })
    })

    it('should have keyboard accessible subsection buttons', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const overviewButton = screen.getByRole('button', { name: /overview/i })
      expect(overviewButton).toHaveAttribute('tabIndex', '0')
    })

    it('should support keyboard navigation', async () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      backgroundsButton.focus()
      
      fireEvent.keyDown(backgroundsButton, { key: 'Enter' })
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('backgrounds')
      })
    })

    it('should have proper ARIA attributes for expanded sections', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const gettingStartedButton = screen.getByRole('button', { name: /getting started/i })
      expect(gettingStartedButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have proper ARIA attributes for collapsed sections', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const backgroundsButton = screen.getByRole('button', { name: /backgrounds/i })
      expect(backgroundsButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have proper focus management', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const firstButton = screen.getAllByRole('button')[0]
      expect(firstButton).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Empty State Handling', () => {
    it('should handle sections with no subsections', () => {
      render(<DocumentationSidebar {...defaultProps} currentSectionId="graphics" />)
      
      // Graphics section has no subsections, should not crash
      expect(screen.getByText('Graphics')).toBeInTheDocument()
      const graphicsButton = screen.getByRole('button', { name: /graphics/i })
      expect(graphicsButton).toHaveClass('active')
    })

    it('should handle empty documentation structure gracefully', () => {
      const emptyStructure = {
        sections: [],
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      }
      
      render(
        <DocumentationSidebar 
          {...defaultProps} 
          structure={emptyStructure}
        />
      )
      
      // Should not crash and should render sidebar container
      const sidebar = screen.getByRole('complementary') || screen.getByTestId('documentation-sidebar')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe('Section Ordering', () => {
    it('should display sections in order specified by order property', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const sectionButtons = screen.getAllByRole('button').filter(button => 
        ['Getting Started', 'Backgrounds', 'Graphics'].includes(button.textContent || '')
      )
      
      expect(sectionButtons[0]).toHaveTextContent('Getting Started')
      expect(sectionButtons[1]).toHaveTextContent('Backgrounds')
      expect(sectionButtons[2]).toHaveTextContent('Graphics')
    })

    it('should display subsections in order specified by order property', () => {
      render(<DocumentationSidebar {...defaultProps} />)
      
      const subsectionButtons = screen.getAllByRole('button').filter(button => 
        ['Overview', 'First Time Setup'].includes(button.textContent || '')
      )
      
      expect(subsectionButtons[0]).toHaveTextContent('Overview')
      expect(subsectionButtons[1]).toHaveTextContent('First Time Setup')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing icons gracefully', () => {
      const structureWithoutIcons = {
        ...mockDocumentationStructure,
        sections: mockDocumentationStructure.sections.map(section => ({
          ...section,
          icon: undefined
        }))
      }
      
      render(
        <DocumentationSidebar 
          {...defaultProps} 
          structure={structureWithoutIcons}
        />
      )
      
      // Should still render sections without icons
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Backgrounds')).toBeInTheDocument()
    })

    it('should handle invalid current section gracefully', () => {
      render(
        <DocumentationSidebar 
          {...defaultProps} 
          currentSectionId="non-existent-section"
        />
      )
      
      // Should still render all sections
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Backgrounds')).toBeInTheDocument()
      
      // Should not have any active section
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).not.toHaveClass('active')
      })
    })
  })
})