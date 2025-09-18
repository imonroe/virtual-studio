import type { DocumentationSidebarProps } from '@/types/documentation';

export function DocumentationSidebar({
  structure,
  currentSectionId,
  currentSubsectionId,
  isOpen,
  onToggle: _onToggle,
  onNavigate
}: DocumentationSidebarProps) {
  // Sort sections by order
  const sortedSections = [...structure.sections].sort((a, b) => a.order - b.order);

  const handleSectionClick = (sectionId: string) => {
    onNavigate(sectionId);
  };

  const handleSubsectionClick = (sectionId: string, subsectionId: string) => {
    onNavigate(sectionId, subsectionId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <aside 
      className={`documentation-sidebar ${isOpen ? 'open' : ''}`}
      role="complementary"
      data-testid="documentation-sidebar"
    >
      <nav className="sidebar-nav" role="navigation">
        {sortedSections.map(section => {
          const isCurrentSection = section.id === currentSectionId;
          const sortedSubsections = [...section.subsections].sort((a, b) => a.order - b.order);
          
          return (
            <div key={section.id} className="nav-section">
              <button
                className={`nav-section-button ${isCurrentSection ? 'active' : ''}`}
                onClick={() => handleSectionClick(section.id)}
                onKeyDown={(e) => handleKeyDown(e, () => handleSectionClick(section.id))}
                aria-expanded={isCurrentSection && section.subsections.length > 0}
                tabIndex={0}
              >
                {section.icon && <span className="nav-icon">{section.icon}</span>}
                <span className="nav-title">{section.title}</span>
              </button>
              
              {isCurrentSection && sortedSubsections.length > 0 && (
                <ul className="nav-subsections" role="list">
                  {sortedSubsections.map(subsection => {
                    const isCurrentSubsection = subsection.id === currentSubsectionId;
                    
                    return (
                      <li key={subsection.id} role="listitem">
                        <button
                          className={`nav-subsection-button ${isCurrentSubsection ? 'active' : ''}`}
                          onClick={() => handleSubsectionClick(section.id, subsection.id)}
                          onKeyDown={(e) => handleKeyDown(e, () => handleSubsectionClick(section.id, subsection.id))}
                          tabIndex={0}
                        >
                          {subsection.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}