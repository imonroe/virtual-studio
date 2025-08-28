import React from 'react';
import { useStudioStore } from '@services/state/studioStore';

export const OverlayControls: React.FC = () => {
  const clock = useStudioStore((state) => state.clock);
  const liveIndicator = useStudioStore((state) => state.liveIndicator);
  const setClock = useStudioStore((state) => state.setClock);
  const setLiveIndicator = useStudioStore((state) => state.setLiveIndicator);
  const toggleClock = useStudioStore((state) => state.toggleClock);
  const toggleLiveIndicator = useStudioStore((state) => state.toggleLiveIndicator);

  return (
    <div className="control-section">
      <h3>Clock & Indicators</h3>
      
      {/* Clock Controls */}
      <div className="control-group">
        <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>Clock</h4>
        
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="clockVisible"
            checked={clock.visible}
            onChange={toggleClock}
          />
          <label htmlFor="clockVisible">Show Clock</label>
        </div>

        {clock.visible && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Format</label>
              <select
                className="control-select"
                value={clock.format}
                onChange={(e) => setClock({ format: e.target.value as any })}
              >
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="showSeconds"
                checked={clock.showSeconds}
                onChange={(e) => setClock({ showSeconds: e.target.checked })}
              />
              <label htmlFor="showSeconds">Show Seconds</label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Timezone</label>
              <select
                className="control-select"
                value={clock.timezone}
                onChange={(e) => setClock({ timezone: e.target.value })}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Position X: {clock.position.x}px</label>
              <input
                type="range"
                className="control-input"
                min="0"
                max="400"
                value={clock.position.x}
                onChange={(e) => setClock({ 
                  position: { ...clock.position, x: Number(e.target.value) }
                })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Position Y: {clock.position.y}px</label>
              <input
                type="range"
                className="control-input"
                min="0"
                max="200"
                value={clock.position.y}
                onChange={(e) => setClock({ 
                  position: { ...clock.position, y: Number(e.target.value) }
                })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Text Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={clock.style.color}
                  onChange={(e) => setClock({ 
                    style: { ...clock.style, color: e.target.value }
                  })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={clock.style.color}
                  onChange={(e) => setClock({ 
                    style: { ...clock.style, color: e.target.value }
                  })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Font Size: {clock.style.fontSize}px</label>
              <input
                type="range"
                className="control-input"
                min="16"
                max="48"
                value={clock.style.fontSize}
                onChange={(e) => setClock({ 
                  style: { ...clock.style, fontSize: Number(e.target.value) }
                })}
              />
            </div>
          </>
        )}
      </div>

      {/* Live Indicator Controls */}
      <div className="control-group" style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>Live Indicator</h4>
        
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="liveVisible"
            checked={liveIndicator.visible}
            onChange={toggleLiveIndicator}
          />
          <label htmlFor="liveVisible">Show Live Indicator</label>
        </div>

        {liveIndicator.visible && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Text</label>
              <input
                type="text"
                className="control-input"
                value={liveIndicator.text}
                onChange={(e) => setLiveIndicator({ text: e.target.value })}
                placeholder="LIVE"
              />
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="blinking"
                checked={liveIndicator.blinking}
                onChange={(e) => setLiveIndicator({ blinking: e.target.checked })}
              />
              <label htmlFor="blinking">Blinking Animation</label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Position X: {liveIndicator.position.x}px</label>
              <input
                type="range"
                className="control-input"
                min="0"
                max="400"
                value={liveIndicator.position.x}
                onChange={(e) => setLiveIndicator({ 
                  position: { ...liveIndicator.position, x: Number(e.target.value) }
                })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Position Y: {liveIndicator.position.y}px</label>
              <input
                type="range"
                className="control-input"
                min="0"
                max="200"
                value={liveIndicator.position.y}
                onChange={(e) => setLiveIndicator({ 
                  position: { ...liveIndicator.position, y: Number(e.target.value) }
                })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="control-label">Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={liveIndicator.color}
                  onChange={(e) => setLiveIndicator({ color: e.target.value })}
                />
                <input
                  type="text"
                  className="control-input"
                  style={{ flex: 1 }}
                  value={liveIndicator.color}
                  onChange={(e) => setLiveIndicator({ color: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Presets */}
      <div className="control-group" style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: '12px' }}>Quick Layouts</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          <button
            className="control-button"
            onClick={() => {
              setClock({ 
                visible: true,
                position: { x: 20, y: 20 },
                style: { ...clock.style, fontSize: 24 }
              });
              setLiveIndicator({ 
                visible: true,
                position: { x: 20, y: 60 },
                color: '#ff0000'
              });
            }}
          >
            Top Left Layout
          </button>
          <button
            className="control-button"
            onClick={() => {
              setClock({ 
                visible: true,
                position: { x: 300, y: 20 },
                style: { ...clock.style, fontSize: 20 }
              });
              setLiveIndicator({ 
                visible: true,
                position: { x: 300, y: 50 },
                color: '#00ff00'
              });
            }}
          >
            Top Right Layout
          </button>
          <button
            className="control-button"
            onClick={() => {
              setClock({ visible: false });
              setLiveIndicator({ visible: false });
            }}
          >
            Hide All
          </button>
        </div>
      </div>
    </div>
  );
};