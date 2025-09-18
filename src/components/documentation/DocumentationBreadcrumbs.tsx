import type { DocumentationBreadcrumbsProps } from '@/types/documentation';

export function DocumentationBreadcrumbs({
  breadcrumbs,
  onNavigate
}: DocumentationBreadcrumbsProps) {
  const handleBreadcrumbClick = (sectionId: string, subsectionId?: string) => {
    if (sectionId) {
      onNavigate(sectionId, subsectionId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation" role="navigation">
      {breadcrumbs.map((crumb, index) => (
        <span key={`${crumb.sectionId}-${crumb.subsectionId || 'root'}`} className="breadcrumb">
          {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
          {index === 0 ? (
            <span className="breadcrumb-home">{crumb.title}</span>
          ) : (
            <button
              className="breadcrumb-link"
              onClick={() => handleBreadcrumbClick(crumb.sectionId, crumb.subsectionId)}
              onKeyDown={(e) => handleKeyDown(e, () => handleBreadcrumbClick(crumb.sectionId, crumb.subsectionId))}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${crumb.title}`}
            >
              {crumb.title}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}