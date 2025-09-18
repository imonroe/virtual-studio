import { keyboardShortcuts, troubleshootingEntries } from '@/content/documentation/documentationContent';
import type { DocumentationContentProps } from '@/types/documentation';
import { useState } from 'react';
import { KeyboardShortcutsTable } from './KeyboardShortcutsTable';
import { TroubleshootingList } from './TroubleshootingList';

export function DocumentationContent({
  section,
  subsection,
  onNavigate
}: DocumentationContentProps) {
  const [selectedTroubleshootingCategory, setSelectedTroubleshootingCategory] = useState<string | undefined>(undefined);

  const handleRelatedLinkClick = (sectionId: string, subsectionId?: string) => {
    onNavigate(sectionId, subsectionId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // Special handling for keyboard shortcuts section
  if (section.id === 'keyboard-shortcuts') {
    return (
      <div className="documentation-content">
        <div className="content-section" role="region" aria-labelledby="content-title">
          <header className="content-header">
            <h2 id="content-title" role="heading" aria-level={2}>
              Keyboard Shortcuts
            </h2>
            <p className="content-description">Master Virtual Studio with these keyboard shortcuts for lightning-fast control during live streams and recordings.</p>
          </header>

          <div className="content-body">
            <KeyboardShortcutsTable shortcuts={keyboardShortcuts} groupByCategory={true} />
          </div>
        </div>
      </div>
    );
  }

  // Special handling for troubleshooting section
  if (section.id === 'troubleshooting') {
    return (
      <div className="documentation-content">
        <div className="content-section" role="region" aria-labelledby="content-title">
          <header className="content-header">
            <h2 id="content-title" role="heading" aria-level={2}>
              Troubleshooting
            </h2>
            <p className="content-description">Find solutions to common Virtual Studio issues and problems.</p>
          </header>

          <div className="content-body">
            <TroubleshootingList 
              entries={troubleshootingEntries}
              selectedCategory={selectedTroubleshootingCategory}
              onCategoryFilter={setSelectedTroubleshootingCategory}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show subsection content if provided, otherwise show section overview
  if (subsection) {
    const content = subsection.content;
    
    return (
      <div className="documentation-content">
        <div className="content-section" role="region" aria-labelledby="content-title">
          <header className="content-header">
            <h2 id="content-title" role="heading" aria-level={2}>
              {subsection.title}
            </h2>
          </header>

          <div className="content-body">
            <div className="subsection-content">
              <p className="content-overview">{content.overview}</p>
              
              {content.steps && content.steps.length > 0 && (
                <div className="content-steps" data-testid="steps-section">
                  <h3 id="steps-heading" role="heading" aria-level={3}>Steps</h3>
                  <ol 
                    className="steps-list" 
                    role="list"
                    data-testid="steps-list"
                    aria-labelledby="steps-heading"
                  >
                    {content.steps.map(step => (
                      <li key={step.number} className="step-item" role="listitem">
                        <h4 role="heading" aria-level={4}>
                          <span className="step-number">{step.number}.) </span>
                          {step.title}
                        </h4>
                        <p>{step.description}</p>
                        {step.tip && (
                          <div className="step-tip">
                            <strong>Tip:</strong> {step.tip}
                          </div>
                        )}
                        {step.screenshot && (
                          <img 
                            src={`/docs/images/${step.screenshot}`}
                            alt={`Screenshot for step ${step.number}: ${step.title}`}
                            className="step-screenshot responsive img-responsive"
                          />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {content.examples && content.examples.length > 0 && (
                <div className="content-examples">
                  <h3 role="heading" aria-level={3}>Examples</h3>
                  <div className="examples-list">
                    {content.examples.map((example, index) => (
                      <div key={index} className="example-item">
                        <h4 role="heading" aria-level={4}>{example.title}</h4>
                        <p>{example.description}</p>
                        {example.code && (
                          <pre className="example-code">
                            <code>{example.code}</code>
                          </pre>
                        )}
                        <div className="example-result">
                          <strong>Result:</strong> {example.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.screenshots && content.screenshots.length > 0 && (
                <div className="content-screenshots">
                  <h3 role="heading" aria-level={3}>Screenshots</h3>
                  <div className="screenshots-grid">
                    {content.screenshots.map(screenshot => (
                      <figure key={screenshot.id} className="screenshot-figure">
                        <img
                          src={`/docs/images/${screenshot.filename}`}
                          alt={screenshot.altText}
                          className="screenshot-image responsive img-responsive"
                          width={screenshot.width}
                          height={screenshot.height}
                          role="img"
                        />
                        {screenshot.caption && (
                          <figcaption className="screenshot-caption">
                            {screenshot.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {content.relatedLinks && content.relatedLinks.length > 0 && (
                <div className="content-related-links">
                  <h3 role="heading" aria-level={3}>Related Topics</h3>
                  <ul className="related-links-list" role="list">
                    {content.relatedLinks.map((link, index) => (
                      <li key={index} role="listitem">
                        <button
                          className="related-link-button"
                          onClick={() => handleRelatedLinkClick(link.sectionId, link.subsectionId)}
                          onKeyDown={(e) => handleKeyDown(e, () => handleRelatedLinkClick(link.sectionId, link.subsectionId))}
                          tabIndex={0}
                          role="button"
                        >
                          <strong>{link.title}</strong>
                          {link.description && <span className="link-description">{link.description}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show section overview when no subsection is selected
  return (
    <div className="documentation-content">
      <div className="content-section" role="region" aria-labelledby="section-title">
        <header className="content-header">
          <h2 id="section-title" role="heading" aria-level={2}>
            {section.title}
          </h2>
          <p className="content-description">{section.description}</p>
        </header>

        <div className="content-body">
          <div className="section-overview">
            <p>Select a topic from the navigation to get started.</p>
            
            {section.subsections.length > 0 && (
              <div className="subsection-grid">
                {section.subsections
                  .sort((a, b) => a.order - b.order)
                  .map(subsection => (
                    <button
                      key={subsection.id}
                      className="subsection-card"
                      onClick={() => handleRelatedLinkClick(section.id, subsection.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleRelatedLinkClick(section.id, subsection.id))}
                      tabIndex={0}
                      role="button"
                    >
                      <h3 role="heading" aria-level={3}>{subsection.title}</h3>
                      <p>{subsection.content.overview}</p>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}