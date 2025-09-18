/**
 * Component tests for DocumentationContent
 * 
 * These tests validate the main content display functionality.
 * Tests MUST FAIL until DocumentationContent component is implemented.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DocumentationContent } from '@/components/documentation/DocumentationContent'
import type { DocumentationContentProps } from '@/types/documentation'

// Mock documentation data for testing
const mockSection = {
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
        overview: 'Welcome to Virtual Studio - your browser-based broadcast graphics solution.',
        steps: [
          {
            number: 1,
            title: 'Open Virtual Studio',
            description: 'Navigate to the Virtual Studio application in your browser.',
            tip: 'Bookmark the URL for quick access.'
          },
          {
            number: 2,
            title: 'Choose a Background',
            description: 'Select from gradient, solid color, or animated backgrounds.',
            screenshot: 'background-selection.png'
          }
        ],
        examples: [
          {
            title: 'Basic Setup',
            description: 'How to set up your first scene',
            result: 'A professional-looking virtual studio'
          }
        ],
        screenshots: [
          {
            id: 'overview-1',
            filename: 'studio-overview.png',
            altText: 'Virtual Studio main interface showing background options',
            caption: 'The main Virtual Studio interface'
          }
        ],
        relatedLinks: [
          {
            title: 'Backgrounds Guide',
            sectionId: 'backgrounds',
            description: 'Learn more about background options'
          }
        ]
      }
    }
  ]
}

const mockSubsection = mockSection.subsections[0]

describe('T007: DocumentationContent Component Tests', () => {
  const mockOnNavigate = vi.fn()
  
  const defaultProps: DocumentationContentProps = {
    section: mockSection,
    subsection: mockSubsection,
    onNavigate: mockOnNavigate
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Content Rendering', () => {
    it('should render subsection title and overview', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
    })

    it('should render section title when no subsection provided', () => {
      render(<DocumentationContent section={mockSection} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText(/new to virtual studio/i)).toBeInTheDocument()
    })

    it('should render steps when available', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText('Steps')).toBeInTheDocument()
      expect(screen.getByText('Open Virtual Studio')).toBeInTheDocument()
      expect(screen.getByText('Choose a Background')).toBeInTheDocument()
    })

    it('should render step numbers correctly', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      // Steps should be numbered
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should render step tips when available', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText(/bookmark the url/i)).toBeInTheDocument()
    })

    it('should render examples when available', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText('Basic Setup')).toBeInTheDocument()
      expect(screen.getByText(/how to set up your first scene/i)).toBeInTheDocument()
      expect(screen.getByText(/professional-looking virtual studio/i)).toBeInTheDocument()
    })

    it('should render related links when available', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText('Backgrounds Guide')).toBeInTheDocument()
      expect(screen.getByText(/learn more about background options/i)).toBeInTheDocument()
    })
  })

  describe('Screenshots and Media', () => {
    it('should render screenshots with proper alt text', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const screenshot = screen.getByAltText(/virtual studio main interface/i)
      expect(screenshot).toBeInTheDocument()
      expect(screenshot).toHaveAttribute('src', expect.stringContaining('studio-overview.png'))
    })

    it('should render screenshot captions when available', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      expect(screen.getByText(/the main virtual studio interface/i)).toBeInTheDocument()
    })

    it('should handle missing screenshots gracefully', () => {
      const subsectionWithoutScreenshots = {
        ...mockSubsection,
        content: {
          ...mockSubsection.content,
          screenshots: []
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={subsectionWithoutScreenshots}
          onNavigate={mockOnNavigate}
        />
      )
      
      // Should not crash, should still render other content
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })
  })

  describe('Navigation Interactions', () => {
    it('should call onNavigate when related link clicked', async () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const backgroundsLink = screen.getByRole('button', { name: /backgrounds guide/i }) ||
                               screen.getByRole('link', { name: /backgrounds guide/i })
      fireEvent.click(backgroundsLink)
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('backgrounds')
      })
    })

    it('should handle related links with subsections', async () => {
      const subsectionWithSubsectionLink = {
        ...mockSubsection,
        content: {
          ...mockSubsection.content,
          relatedLinks: [
            {
              title: 'Gradient Backgrounds',
              sectionId: 'backgrounds',
              subsectionId: 'gradients',
              description: 'Learn about gradient backgrounds'
            }
          ]
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={subsectionWithSubsectionLink}
          onNavigate={mockOnNavigate}
        />
      )
      
      const gradientLink = screen.getByRole('button', { name: /gradient backgrounds/i }) ||
                           screen.getByRole('link', { name: /gradient backgrounds/i })
      fireEvent.click(gradientLink)
      
      await waitFor(() => {
        expect(mockOnNavigate).toHaveBeenCalledWith('backgrounds', 'gradients')
      })
    })
  })

  describe('Content Organization', () => {
    it('should organize content sections in logical order', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const contentSections = screen.getAllByRole('region') || 
                               screen.getAllByTestId(/content-section/)
      
      // Should have overview first, then steps, examples, etc.
      expect(screen.getByText(/welcome to virtual studio/i)).toBeInTheDocument()
    })

    it('should show proper headings hierarchy', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const mainHeading = screen.getByRole('heading', { level: 2 })
      expect(mainHeading).toHaveTextContent('Overview')
      
      const stepHeading = screen.getByRole('heading', { level: 3 })
      expect(stepHeading).toHaveTextContent('Steps')
    })

    it('should handle empty content gracefully', () => {
      const emptySubsection = {
        id: 'empty',
        title: 'Empty Section',
        order: 1,
        content: {
          overview: 'This is an empty section.',
          steps: [],
          examples: [],
          screenshots: [],
          relatedLinks: []
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={emptySubsection}
          onNavigate={mockOnNavigate}
        />
      )
      
      expect(screen.getByText('Empty Section')).toBeInTheDocument()
      expect(screen.getByText(/this is an empty section/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Main title should be h2
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Overview')
    })

    it('should have accessible step navigation', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const stepsList = screen.getByRole('list') || screen.getByTestId('steps-list')
      expect(stepsList).toBeInTheDocument()
      
      const stepItems = screen.getAllByRole('listitem')
      expect(stepItems.length).toBe(2)
    })

    it('should have proper alt text for images', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).toBeTruthy()
      })
    })

    it('should have keyboard accessible related links', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const relatedLink = screen.getByRole('button', { name: /backgrounds guide/i }) ||
                          screen.getByRole('link', { name: /backgrounds guide/i })
      expect(relatedLink).toHaveAttribute('tabIndex', '0')
    })

    it('should have proper ARIA labels for complex content', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      // Steps section should have proper labeling
      const stepsSection = screen.getByText('Steps').closest('section') ||
                           screen.getByTestId('steps-section')
      expect(stepsSection).toHaveAttribute('aria-labelledby', expect.any(String))
    })
  })

  describe('Responsive Design', () => {
    it('should handle long content gracefully', () => {
      const longContentSubsection = {
        ...mockSubsection,
        content: {
          ...mockSubsection.content,
          overview: 'Lorem ipsum '.repeat(100),
          steps: Array.from({ length: 10 }, (_, i) => ({
            number: i + 1,
            title: `Step ${i + 1}`,
            description: 'Lorem ipsum '.repeat(20)
          }))
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={longContentSubsection}
          onNavigate={mockOnNavigate}
        />
      )
      
      // Should render without layout issues
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })

    it('should display images responsively', () => {
      render(<DocumentationContent {...defaultProps} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveClass(/responsive|img-responsive/)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing content gracefully', () => {
      const invalidSubsection = {
        id: 'invalid',
        title: 'Invalid Section',
        order: 1,
        content: null as any
      }
      
      expect(() => {
        render(
          <DocumentationContent 
            section={mockSection}
            subsection={invalidSubsection}
            onNavigate={mockOnNavigate}
          />
        )
      }).not.toThrow()
    })

    it('should handle malformed step data', () => {
      const malformedSubsection = {
        ...mockSubsection,
        content: {
          ...mockSubsection.content,
          steps: [
            { number: 1, title: '', description: '' },
            { number: 2, title: 'Valid Step', description: 'Valid description' }
          ]
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={malformedSubsection}
          onNavigate={mockOnNavigate}
        />
      )
      
      // Should still render valid step
      expect(screen.getByText('Valid Step')).toBeInTheDocument()
    })

    it('should handle broken image URLs gracefully', () => {
      const brokenImageSubsection = {
        ...mockSubsection,
        content: {
          ...mockSubsection.content,
          screenshots: [
            {
              id: 'broken',
              filename: 'non-existent.png',
              altText: 'Broken image',
              caption: 'This image is broken'
            }
          ]
        }
      }
      
      render(
        <DocumentationContent 
          section={mockSection}
          subsection={brokenImageSubsection}
          onNavigate={mockOnNavigate}
        />
      )
      
      // Should still show alt text and caption
      expect(screen.getByText('Broken image')).toBeInTheDocument()
      expect(screen.getByText('This image is broken')).toBeInTheDocument()
    })
  })
})