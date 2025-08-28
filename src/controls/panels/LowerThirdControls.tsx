import React from 'react';
import { useStudioStore } from '@services/state/studioStore';

export const LowerThirdControls: React.FC = () => {
  const lowerThird = useStudioStore((state) => state.lowerThird);
  const setLowerThird = useStudioStore((state) => state.setLowerThird);
  const toggleLowerThird = useStudioStore((state) => state.toggleLowerThird);

  const updateLowerThird = (updates: any) => {
    if (lowerThird) {
      setLowerThird(updates);
    } else {
      setLowerThird({ visible: true, ...updates });
    }
  };

  const updateStyle = (styleUpdates: any) => {
    updateLowerThird({
      style: { ...lowerThird?.style, ...styleUpdates }
    });
  };

  return (
    <div className="control-section">
      <h3>Lower Third</h3>
      
      <div className="control-group">
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="lowerThirdVisible"
            checked={lowerThird?.visible || false}
            onChange={(e) => {
              if (!lowerThird) {
                // Create a new lower third when toggling on
                setLowerThird({
                  visible: e.target.checked,
                  title: 'Sample Title',
                  subtitle: 'Sample Subtitle'
                });
              } else {
                toggleLowerThird();
              }
            }}
          />
          <label htmlFor="lowerThirdVisible">Show Lower Third</label>
        </div>
      </div>

      {lowerThird?.visible && (
        <>
          <div className="control-group">
            <label className="control-label">Title</label>
            <input
              type="text"
              className="control-input"
              value={lowerThird.title}
              onChange={(e) => updateLowerThird({ title: e.target.value })}
              placeholder="Enter title..."
            />
          </div>

          <div className="control-group">
            <label className="control-label">Subtitle</label>
            <input
              type="text"
              className="control-input"
              value={lowerThird.subtitle}
              onChange={(e) => updateLowerThird({ subtitle: e.target.value })}
              placeholder="Enter subtitle..."
            />
          </div>

          <div className="control-group">
            <label className="control-label">Position</label>
            <select
              className="control-select"
              value={lowerThird.position}
              onChange={(e) => updateLowerThird({ position: e.target.value })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Animation</label>
            <select
              className="control-select"
              value={lowerThird.animation}
              onChange={(e) => updateLowerThird({ animation: e.target.value })}
            >
              <option value="slide">Slide</option>
              <option value="fade">Fade</option>
              <option value="scale">Scale</option>
            </select>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>Styling</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Background Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={lowerThird.style.backgroundColor.replace(/rgba?\([^)]+\)/, '#000000')}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={lowerThird.style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  placeholder="rgba(0, 0, 0, 0.8)"
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Text Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={lowerThird.style.textColor}
                  onChange={(e) => updateStyle({ textColor: e.target.value })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={lowerThird.style.textColor}
                  onChange={(e) => updateStyle({ textColor: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Font Size: {lowerThird.style.fontSize}px</label>
              <input
                type="range"
                className="control-input"
                min="12"
                max="32"
                value={lowerThird.style.fontSize}
                onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Font Family</label>
              <select
                className="control-select"
                value={lowerThird.style.fontFamily}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Padding: {lowerThird.style.padding}px</label>
              <input
                type="range"
                className="control-input"
                min="8"
                max="32"
                value={lowerThird.style.padding}
                onChange={(e) => updateStyle({ padding: Number(e.target.value) })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Border Radius: {lowerThird.style.borderRadius}px</label>
              <input
                type="range"
                className="control-input"
                min="0"
                max="20"
                value={lowerThird.style.borderRadius}
                onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
              />
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="glassMorphism"
                checked={lowerThird.style.glassMorphism}
                onChange={(e) => updateStyle({ glassMorphism: e.target.checked })}
              />
              <label htmlFor="glassMorphism">Glass Morphism Effect</label>
            </div>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>Quick Templates</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                className="control-button"
                onClick={() => updateLowerThird({
                  title: 'John Doe',
                  subtitle: 'News Anchor',
                  style: {
                    ...lowerThird.style,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    textColor: '#ffffff',
                    fontSize: 16,
                    glassMorphism: false
                  }
                })}
              >
                News Style
              </button>
              <button
                className="control-button"
                onClick={() => updateLowerThird({
                  title: 'Live Stream',
                  subtitle: 'Gaming Session',
                  style: {
                    ...lowerThird.style,
                    backgroundColor: 'rgba(100, 108, 255, 0.8)',
                    textColor: '#ffffff',
                    fontSize: 18,
                    glassMorphism: true
                  }
                })}
              >
                Gaming Style
              </button>
              <button
                className="control-button"
                onClick={() => updateLowerThird({
                  title: 'Corporate Meeting',
                  subtitle: 'Q4 Results',
                  style: {
                    ...lowerThird.style,
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    textColor: '#e5e5e5',
                    fontSize: 14,
                    glassMorphism: false
                  }
                })}
              >
                Corporate Style
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};