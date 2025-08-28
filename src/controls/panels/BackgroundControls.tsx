import React from 'react';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig } from '@types/studio';

export const BackgroundControls: React.FC = () => {
  const background = useStudioStore((state) => state.background);
  const setBackground = useStudioStore((state) => state.setBackground);
  const toggleBackground = useStudioStore((state) => state.toggleBackground);

  const gradientConfig = background.config as GradientConfig;

  const updateGradientConfig = (updates: Partial<GradientConfig>) => {
    setBackground({
      config: { ...gradientConfig, ...updates }
    });
  };

  const addColor = () => {
    const newColors = [...gradientConfig.colors, '#646cff'];
    updateGradientConfig({ colors: newColors });
  };

  const removeColor = (index: number) => {
    if (gradientConfig.colors.length > 2) {
      const newColors = gradientConfig.colors.filter((_, i) => i !== index);
      updateGradientConfig({ colors: newColors });
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...gradientConfig.colors];
    newColors[index] = color;
    updateGradientConfig({ colors: newColors });
  };

  return (
    <div className="control-section">
      <h3>Background Settings</h3>
      
      <div className="control-group">
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="backgroundVisible"
            checked={background.visible}
            onChange={toggleBackground}
          />
          <label htmlFor="backgroundVisible">Show Background</label>
        </div>
      </div>
      
      <div className="control-group">
        <label className="control-label">Gradient Type</label>
        <select
          className="control-select"
          value={gradientConfig.type}
          onChange={(e) => updateGradientConfig({ type: e.target.value as any })}
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
          <option value="conic">Conic</option>
        </select>
      </div>

      {gradientConfig.type === 'linear' && (
        <div className="control-group">
          <label className="control-label">Angle: {gradientConfig.angle}°</label>
          <input
            type="range"
            className="control-input"
            min="0"
            max="360"
            value={gradientConfig.angle}
            onChange={(e) => updateGradientConfig({ angle: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="control-group">
        <label className="control-label">Colors</label>
        {gradientConfig.colors.map((color, index) => (
          <div key={index} className="color-picker" style={{ marginBottom: '8px' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => updateColor(index, e.target.value)}
            />
            <input
              type="text"
              className="control-input"
              style={{ flex: 1 }}
              value={color}
              onChange={(e) => updateColor(index, e.target.value)}
              placeholder="#000000"
            />
            {gradientConfig.colors.length > 2 && (
              <button
                className="control-button danger"
                style={{ width: '32px', padding: '8px' }}
                onClick={() => removeColor(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {gradientConfig.colors.length < 5 && (
          <button
            className="control-button"
            onClick={addColor}
          >
            Add Color
          </button>
        )}
      </div>

      <div className="control-group">
        <div className="control-checkbox">
          <input
            type="checkbox"
            id="animated"
            checked={gradientConfig.animated}
            onChange={(e) => updateGradientConfig({ animated: e.target.checked })}
          />
          <label htmlFor="animated">Enable Animation</label>
        </div>
      </div>

      {gradientConfig.animated && (
        <div className="control-group">
          <label className="control-label">Animation Speed: {gradientConfig.animationSpeed}x</label>
          <input
            type="range"
            className="control-input"
            min="0.1"
            max="2"
            step="0.1"
            value={gradientConfig.animationSpeed}
            onChange={(e) => updateGradientConfig({ animationSpeed: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="control-group">
        <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>Quick Presets</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            className="control-button"
            onClick={() => updateGradientConfig({
              colors: ['#1a1a2e', '#16213e', '#0f3460'],
              angle: 135,
              type: 'linear'
            })}
          >
            Deep Blue
          </button>
          <button
            className="control-button"
            onClick={() => updateGradientConfig({
              colors: ['#667eea', '#764ba2'],
              angle: 45,
              type: 'linear'
            })}
          >
            Purple Haze
          </button>
          <button
            className="control-button"
            onClick={() => updateGradientConfig({
              colors: ['#f093fb', '#f5576c'],
              angle: 90,
              type: 'linear'
            })}
          >
            Sunset
          </button>
          <button
            className="control-button"
            onClick={() => updateGradientConfig({
              colors: ['#4facfe', '#00f2fe'],
              angle: 180,
              type: 'linear'
            })}
          >
            Ocean
          </button>
        </div>
      </div>
    </div>
  );
};