import React, { useState } from 'react';
import { useStudioStore } from '@services/state/studioStore';
import type { Ticker } from '@/types/studio';

export const TickerControls: React.FC = () => {
  const ticker = useStudioStore((state) => state.ticker);
  const setTicker = useStudioStore((state) => state.setTicker);
  const toggleTicker = useStudioStore((state) => state.toggleTicker);
  const [newTickerItem, setNewTickerItem] = useState('');

  const updateTicker = (updates: Partial<Ticker>) => {
    if (ticker) {
      setTicker(updates);
    } else {
      setTicker({ visible: true, content: [], ...updates });
    }
  };

  const addTickerItem = () => {
    if (newTickerItem.trim() && ticker) {
      const newContent = [...ticker.content, newTickerItem.trim()];
      updateTicker({ content: newContent });
      setNewTickerItem('');
    }
  };

  const removeTickerItem = (index: number) => {
    if (ticker) {
      const newContent = ticker.content.filter((_, i) => i !== index);
      updateTicker({ content: newContent });
    }
  };

  const updateTickerItem = (index: number, value: string) => {
    if (ticker) {
      const newContent = [...ticker.content];
      newContent[index] = value;
      updateTicker({ content: newContent });
    }
  };

  return (
    <div className="control-section">
      <h3>News Ticker</h3>
      
      <div className="control-group">
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="tickerVisible"
            checked={ticker?.visible || false}
            onChange={(e) => {
              if (!ticker) {
                // Create a new ticker when toggling on
                setTicker({
                  visible: e.target.checked,
                  content: ['Breaking News: Sample ticker content'],
                  speed: 50
                });
              } else {
                toggleTicker();
              }
            }}
          />
          <label htmlFor="tickerVisible">Show Ticker</label>
        </div>
      </div>

      {ticker?.visible && (
        <>
          <div className="control-group">
            <label className="control-label">Ticker Items</label>
            {ticker.content.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={item}
                  onChange={(e) => updateTickerItem(index, e.target.value)}
                  placeholder="Enter news item..."
                />
                <button
                  className="control-button danger"
                  style={{ width: '32px', padding: '8px' }}
                  onClick={() => removeTickerItem(index)}
                >
                  ×
                </button>
              </div>
            ))}
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="control-input"
                style={{ flex: 1 }}
                value={newTickerItem}
                onChange={(e) => setNewTickerItem(e.target.value)}
                placeholder="Add new ticker item..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTickerItem();
                  }
                }}
              />
              <button
                className="control-button primary"
                style={{ 
                  whiteSpace: 'nowrap',
                  minWidth: '60px',
                  width: '60px',
                  padding: '10px 8px'
                }}
                onClick={addTickerItem}
                disabled={!newTickerItem.trim()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Scroll Speed: {ticker.speed}px/s</label>
            <input
              type="range"
              className="control-input"
              min="20"
              max="100"
              value={ticker.speed}
              onChange={(e) => updateTicker({ speed: Number(e.target.value) })}
            />
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>Styling</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Background Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={ticker.backgroundColor.replace(/rgba?\([^)]+\)/, '#000000')}
                  onChange={(e) => updateTicker({ backgroundColor: e.target.value })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={ticker.backgroundColor}
                  onChange={(e) => updateTicker({ backgroundColor: e.target.value })}
                  placeholder="rgba(0, 0, 0, 0.9)"
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Text Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={ticker.textColor}
                  onChange={(e) => updateTicker({ textColor: e.target.value })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={ticker.textColor}
                  onChange={(e) => updateTicker({ textColor: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Font Size: {ticker.fontSize}px</label>
              <input
                type="range"
                className="control-input"
                min="10"
                max="20"
                value={ticker.fontSize}
                onChange={(e) => updateTicker({ fontSize: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>Quick Templates</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                className="control-button"
                onClick={() => updateTicker({
                  content: [
                    'Breaking: Market hits new record high',
                    'Weather: Sunny skies expected tomorrow',
                    'Sports: Championship finals tonight at 8 PM'
                  ],
                  backgroundColor: 'rgba(220, 38, 38, 0.9)',
                  textColor: '#ffffff',
                  speed: 50
                })}
              >
                Breaking News
              </button>
              <button
                className="control-button"
                onClick={() => updateTicker({
                  content: [
                    'NASDAQ +2.3%',
                    'DOW +1.8%',
                    'S&P 500 +2.1%',
                    'Bitcoin $45,232'
                  ],
                  backgroundColor: 'rgba(34, 197, 94, 0.9)',
                  textColor: '#ffffff',
                  speed: 60
                })}
              >
                Financial
              </button>
              <button
                className="control-button"
                onClick={() => updateTicker({
                  content: [
                    'Lakers vs Warriors - 7:30 PM EST',
                    'Championship Series Game 4',
                    'Playoff updates every hour'
                  ],
                  backgroundColor: 'rgba(249, 115, 22, 0.9)',
                  textColor: '#ffffff',
                  speed: 45
                })}
              >
                Sports
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};