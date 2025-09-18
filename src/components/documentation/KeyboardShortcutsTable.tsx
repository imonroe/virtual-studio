import type { KeyboardShortcutsTableProps } from '@/types/documentation';
import './KeyboardShortcutsTable.css';

export function KeyboardShortcutsTable({
  shortcuts,
  groupByCategory = true
}: KeyboardShortcutsTableProps) {
  if (groupByCategory) {
    // Group shortcuts by category
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    }, {} as Record<string, typeof shortcuts>);

    return (
      <div className="keyboard-shortcuts-table">
        {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
          <div key={category} className="shortcut-category">
            <h4 className="category-title">{category}</h4>
            <div className="shortcuts-grid">
              {categoryShortcuts.map((shortcut, index) => (
                <div key={`${category}-${index}`} className="shortcut-item">
                  <div className="shortcut-key">
                    <kbd>{shortcut.key}</kbd>
                  </div>
                  <div className="shortcut-description">
                    <span className="description-text">{shortcut.description}</span>
                    {shortcut.context && (
                      <span className="context-text">({shortcut.context})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Simple flat list without grouping
  return (
    <div className="keyboard-shortcuts-table">
      <div className="shortcuts-grid">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="shortcut-item">
            <div className="shortcut-key">
              <kbd>{shortcut.key}</kbd>
            </div>
            <div className="shortcut-description">
              <span className="description-text">{shortcut.description}</span>
              <span className="category-badge">{shortcut.category}</span>
              {shortcut.context && (
                <span className="context-text">({shortcut.context})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}