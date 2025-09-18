import type { TroubleshootingListProps } from '@/types/documentation';
import './TroubleshootingList.css';

export function TroubleshootingList({
  entries,
  selectedCategory,
  onCategoryFilter
}: TroubleshootingListProps) {
  // Get unique categories
  const categories = [...new Set(entries.map(entry => entry.category))];
  
  // Filter entries by selected category
  const filteredEntries = selectedCategory 
    ? entries.filter(entry => entry.category === selectedCategory)
    : entries;

  return (
    <div className="troubleshooting-list">
      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={`filter-button ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategoryFilter(undefined)}
        >
          All Issues
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Troubleshooting Entries */}
      <div className="troubleshooting-entries">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="troubleshooting-entry">
            <div className="entry-header">
              <h4 className="problem-title">{entry.problem}</h4>
              <span className="category-badge">{entry.category}</span>
            </div>
            
            <div className="entry-content">
              <div className="symptoms-section">
                <h5>Symptoms:</h5>
                <ul className="symptoms-list">
                  {entry.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              
              <div className="solution-section">
                <h5>Solution:</h5>
                <p className="solution-text">{entry.solution}</p>
              </div>

              {entry.relatedFeatures.length > 0 && (
                <div className="related-features">
                  <h6>Related Features:</h6>
                  <div className="feature-tags">
                    {entry.relatedFeatures.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="no-results">
          <p>No troubleshooting entries found for the selected category.</p>
        </div>
      )}
    </div>
  );
}