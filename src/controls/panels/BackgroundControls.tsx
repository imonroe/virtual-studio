import React, { useRef } from 'react';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig, ImageConfig } from '@/types/studio';

export const BackgroundControls: React.FC = () => {
  const background = useStudioStore((state) => state.background);
  const setBackground = useStudioStore((state) => state.setBackground);
  const toggleBackground = useStudioStore((state) => state.toggleBackground);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGradient = background.type === 'gradient';
  const isImage = background.type === 'image';
  
  const gradientConfig = isGradient ? background.config as GradientConfig : null;
  const imageConfig = isImage ? background.config as ImageConfig : null;

  const updateGradientConfig = (updates: Partial<GradientConfig>) => {
    if (!gradientConfig) return;
    setBackground({
      config: { ...gradientConfig, ...updates }
    });
  };

  const updateImageConfig = (updates: Partial<ImageConfig>) => {
    if (!imageConfig) return;
    setBackground({
      config: { ...imageConfig, ...updates }
    });
  };

  const switchToGradient = () => {
    setBackground({
      type: 'gradient',
      config: {
        colors: ['#1a1a2e', '#16213e', '#0f3460'],
        angle: 135,
        type: 'linear',
        animated: true,
        animationSpeed: 0.5
      }
    });
  };

  const switchToImage = () => {
    // For now, always start with empty URL - user can upload image
    setBackground({
      type: 'image',
      config: {
        url: '',
        fit: 'cover',
        position: { x: 0, y: 0 }
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Convert file to data URL instead of blob URL for better persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      console.log('Image uploaded, data URL length:', dataUrl.length);
      
      // Switch to image type if not already
      if (!isImage) {
        setBackground({
          type: 'image',
          config: {
            url: dataUrl,
            fit: 'cover',
            position: { x: 0, y: 0 }
          }
        });
      } else {
        updateImageConfig({ url: dataUrl });
      }
    };
    
    reader.onerror = () => {
      console.error('Failed to read uploaded file');
      alert('Failed to read the uploaded file.');
    };
    
    // Read file as data URL
    reader.readAsDataURL(file);
  };

  const addColor = () => {
    if (!gradientConfig) return;
    const newColors = [...gradientConfig.colors, '#646cff'];
    updateGradientConfig({ colors: newColors });
  };

  const removeColor = (index: number) => {
    if (!gradientConfig || gradientConfig.colors.length <= 2) return;
    const newColors = gradientConfig.colors.filter((_, i) => i !== index);
    updateGradientConfig({ colors: newColors });
  };

  const updateColor = (index: number, color: string) => {
    if (!gradientConfig) return;
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
        <label className="control-label">Background Type</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            className={`control-button ${isGradient ? 'active' : ''}`}
            onClick={switchToGradient}
          >
            Gradient
          </button>
          <button
            className={`control-button ${isImage ? 'active' : ''}`}
            onClick={switchToImage}
          >
            Image
          </button>
        </div>
      </div>

      {isImage && (
        <>
          <div className="control-group">
            <label className="control-label">Upload Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              className="control-button"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageConfig?.url ? 'Change Image' : 'Select Image'}
            </button>
            {imageConfig?.url && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
                Image uploaded
              </div>
            )}
          </div>

          <div className="control-group">
            <label className="control-label">Image Fit</label>
            <select
              className="control-select"
              value={imageConfig?.fit || 'cover'}
              onChange={(e) => updateImageConfig({ fit: e.target.value as 'cover' | 'contain' | 'fill' })}
            >
              <option value="cover">Cover (fill stage, crop if needed)</option>
              <option value="contain">Contain (fit entire image)</option>
              <option value="fill">Fill (stretch to fit)</option>
            </select>
          </div>
        </>
      )}

      {isGradient && (
        <>
          <div className="control-group">
            <label className="control-label">Gradient Type</label>
            <select
              className="control-select"
              value={gradientConfig?.type || 'linear'}
              onChange={(e) => updateGradientConfig({ type: e.target.value as any })}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
          </div>

          {gradientConfig?.type === 'linear' && (
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
            {gradientConfig?.colors.map((color, index) => (
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
                {(gradientConfig?.colors.length || 0) > 2 && (
                  <button
                    className="control-button danger"
                    style={{ width: '32px', padding: '8px' }}
                    onClick={() => removeColor(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            )) || []}
            {(gradientConfig?.colors.length || 0) < 5 && (
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
                checked={gradientConfig?.animated || false}
                onChange={(e) => updateGradientConfig({ animated: e.target.checked })}
              />
              <label htmlFor="animated">Enable Animation</label>
            </div>
          </div>

          {gradientConfig?.animated && (
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
        </>
      )}
    </div>
  );
};