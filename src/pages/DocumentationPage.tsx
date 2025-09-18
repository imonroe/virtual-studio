import { DocumentationBreadcrumbs } from '@/components/documentation/DocumentationBreadcrumbs';
import { DocumentationContent } from '@/components/documentation/DocumentationContent';
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar';
import { documentationStructure } from '@/content/documentation/documentationContent';
import type {
  BreadcrumbItem,
  DocumentationPageProps,
  NavigationState
} from '@/types/documentation';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './DocumentationPage.css';

export function DocumentationPage({ initialSection, initialSubsection }: DocumentationPageProps = {}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract section and subsection from URL params if not provided as props
  const currentSectionId = initialSection || searchParams.get('section') || 'getting-started';
  const currentSubsectionId = initialSubsection || searchParams.get('subsection') || undefined;
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentSectionId,
    currentSubsectionId,
    breadcrumbs: [],
    sidebarOpen: false
  });

  // Using real documentation content

  const updateNavigationState = useCallback((sectionId: string, subsectionId?: string) => {
    const section = documentationStructure.sections.find(s => s.id === sectionId);
    const subsection = section?.subsections.find(s => s.id === subsectionId);
    
    // Build breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Documentation', sectionId: '', subsectionId: undefined }
    ];
    
    if (section) {
      breadcrumbs.push({ title: section.title, sectionId: section.id, subsectionId: undefined });
      
      if (subsection) {
        breadcrumbs.push({ title: subsection.title, sectionId: section.id, subsectionId: subsection.id });
      }
    }

    setNavigationState(prev => ({
      currentSectionId: sectionId,
      currentSubsectionId: subsectionId,
      breadcrumbs,
      sidebarOpen: prev.sidebarOpen
    }));
  }, [documentationStructure]);

  // Update navigation state when URL params change
  useEffect(() => {
    const newSectionId = searchParams.get('section') || 'getting-started';
    const newSubsectionId = searchParams.get('subsection') || undefined;
    
    if (newSectionId !== navigationState.currentSectionId || newSubsectionId !== navigationState.currentSubsectionId) {
      updateNavigationState(newSectionId, newSubsectionId);
    }
  }, [searchParams, navigationState.currentSectionId, navigationState.currentSubsectionId, updateNavigationState]);

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    const params = new URLSearchParams();
    params.set('section', sectionId);
    if (subsectionId) {
      params.set('subsection', subsectionId);
    }
    navigate(`/docs?${params.toString()}`);
  };

  const toggleSidebar = () => {
    setNavigationState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen
    }));
  };

  const currentSection = documentationStructure.sections.find(s => s.id === navigationState.currentSectionId);
  const currentSubsection = currentSection?.subsections.find(s => s.id === navigationState.currentSubsectionId);

  return (
    <div className="documentation-page">
      {/* Header */}
      <header className="documentation-header">
        <div className="header-content">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle navigation sidebar"
          >
            <span className="hamburger"></span>
          </button>
          
          <h1>Virtual Video Studio Documentation</h1>
          
          <nav className="header-nav">
            <button 
              className="back-to-studio"
              onClick={() => navigate('/app')}
              title="Back to Virtual Studio"
              aria-label="Back to Studio"
            >
              ← Studio
            </button>
          </nav>
        </div>
      </header>

      <div className="documentation-layout">
        {/* Sidebar */}
        <DocumentationSidebar
          structure={documentationStructure}
          currentSectionId={navigationState.currentSectionId}
          currentSubsectionId={navigationState.currentSubsectionId}
          isOpen={navigationState.sidebarOpen}
          onToggle={toggleSidebar}
          onNavigate={handleNavigate}
        />

        {/* Main Content */}
        <main className="documentation-main">
          {/* Breadcrumbs */}
          <DocumentationBreadcrumbs
            breadcrumbs={navigationState.breadcrumbs}
            onNavigate={handleNavigate}
          />

          {/* Content */}
          {currentSection ? (
            <DocumentationContent
              section={currentSection}
              subsection={currentSubsection}
              onNavigate={handleNavigate}
            />
          ) : (
            <div className="content-error">
              <h2>Section Not Found</h2>
              <p>The requested documentation section could not be found.</p>
              <button onClick={() => handleNavigate('getting-started')}>
                Go to Getting Started
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}