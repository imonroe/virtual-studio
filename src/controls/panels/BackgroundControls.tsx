import React, { useRef } from 'react';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig, ImageConfig, SolidConfig, AnimatedConfig } from '@/types/studio';

export const BackgroundControls: React.FC = () => {
  const background = useStudioStore((state) => state.background);
  const setBackground = useStudioStore((state) => state.setBackground);
  const toggleBackground = useStudioStore((state) => state.toggleBackground);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGradient = background.type === 'gradient';
  const isSolid = background.type === 'solid';
  const isAnimated = background.type === 'animated';
  const isImage = background.type === 'image';
  
  const gradientConfig = isGradient ? background.config as GradientConfig : null;
  const solidConfig = isSolid ? background.config as SolidConfig : null;
  const animatedConfig = isAnimated ? background.config as AnimatedConfig : null;
  const imageConfig = isImage ? background.config as ImageConfig : null;

  const updateGradientConfig = (updates: Partial<GradientConfig>) => {
    if (!gradientConfig) return;
    setBackground({
      config: { ...gradientConfig, ...updates }
    });
  };

  const updateSolidConfig = (updates: Partial<SolidConfig>) => {
    if (!solidConfig) return;
    setBackground({
      config: { ...solidConfig, ...updates }
    });
  };

  const updateAnimatedConfig = (updates: Partial<AnimatedConfig>) => {
    if (!animatedConfig) return;
    setBackground({
      config: { ...animatedConfig, ...updates }
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

  const switchToSolid = () => {
    setBackground({
      type: 'solid',
      config: {
        color: '#00ff00' // Default to chroma key green
      }
    });
  };

  const switchToAnimated = (variant: 'waves' | 'neural' = 'waves') => {
    if (variant === 'neural') {
      setBackground({
        type: 'animated',
        config: {
          variant: 'neural',
          neural: {
            nodeCount: 25,
            nodeSize: 8,
            connectionDensity: 0.4,
            dataFlowSpeed: 1.0,
            packetCount: 20,
            colors: {
              background: '#1a1a2e',
              nodeCore: '#646cff',
              nodeGlow: '#00f5ff',
              connection: '#646cff',
              packet: '#00f5ff'
            },
            quality: 'auto'
          }
        }
      });
    } else {
      setBackground({
        type: 'animated',
        config: {
          variant: 'waves',
          waves: {
            count: 4,
            frequencies: [1.0, 1.5, 2.0, 2.5],
            amplitudes: [0.5, 0.3, 0.4, 0.2],
            speed: 1.0,
            colors: {
              primary: '#646cff',
              secondary: '#8b5cf6',
              highlight: '#00f5ff'
            },
            edgeCoverage: { top: 0.1, bottom: 0.15 },
            quality: 'auto'
          }
        }
      });
    }
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            className={`control-button ${isGradient ? 'active' : ''}`}
            onClick={switchToGradient}
          >
            Gradient
          </button>
          <button
            className={`control-button ${isSolid ? 'active' : ''}`}
            onClick={switchToSolid}
          >
            Solid
          </button>
          <button
            className={`control-button ${isAnimated && animatedConfig?.variant === 'waves' ? 'active' : ''}`}
            onClick={() => switchToAnimated('waves')}
          >
            Waves
          </button>
          <button
            className={`control-button ${isAnimated && animatedConfig?.variant === 'neural' ? 'active' : ''}`}
            onClick={() => switchToAnimated('neural')}
          >
            Neural
          </button>
          <button
            className={`control-button ${isImage ? 'active' : ''}`}
            onClick={switchToImage}
          >
            Image
          </button>
        </div>
      </div>

      {isSolid && (
        <>
          <div className="control-group">
            <label className="control-label">Background Color</label>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <input
                type="color"
                value={solidConfig?.color || '#00ff00'}
                onChange={(e) => updateSolidConfig({ color: e.target.value })}
                aria-label="Color picker"
              />
              <input
                type="text"
                className="control-input"
                style={{ flex: 1 }}
                value={solidConfig?.color || '#00ff00'}
                onChange={(e) => updateSolidConfig({ color: e.target.value })}
                placeholder="#000000"
                aria-label="Hex color value"
              />
            </div>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>
              Chroma Key Presets
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className="control-button"
                onClick={() => updateSolidConfig({ color: '#00ff00' })}
              >
                Green Screen
              </button>
              <button
                className="control-button"
                onClick={() => updateSolidConfig({ color: '#0000ff' })}
              >
                Blue Screen
              </button>
              <button
                className="control-button"
                onClick={() => updateSolidConfig({ color: '#000000' })}
              >
                Pure Black
              </button>
              <button
                className="control-button"
                onClick={() => updateSolidConfig({ color: '#ffffff' })}
              >
                Pure White
              </button>
            </div>
          </div>
        </>
      )}

      {isAnimated && animatedConfig?.variant === 'neural' && (
        <>
          <div className="control-group">
            <label className="control-label">Network Density: {animatedConfig.neural?.nodeCount || 25} nodes</label>
            <input
              type="range"
              className="control-input"
              min="15"
              max="45"
              value={animatedConfig.neural?.nodeCount || 25}
              onChange={(e) => updateAnimatedConfig({
                neural: { 
                  ...animatedConfig.neural!, 
                  nodeCount: Number(e.target.value) 
                }
              })}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Data Flow Speed: {animatedConfig.neural?.dataFlowSpeed || 1.0}x</label>
            <input
              type="range"
              className="control-input"
              min="0.1"
              max="2.0"
              step="0.1"
              value={animatedConfig.neural?.dataFlowSpeed || 1.0}
              onChange={(e) => updateAnimatedConfig({
                neural: { 
                  ...animatedConfig.neural!, 
                  dataFlowSpeed: Number(e.target.value) 
                }
              })}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Connection Density: {Math.round((animatedConfig.neural?.connectionDensity || 0.4) * 100)}%</label>
            <input
              type="range"
              className="control-input"
              min="0.2"
              max="0.8"
              step="0.1"
              value={animatedConfig.neural?.connectionDensity || 0.4}
              onChange={(e) => updateAnimatedConfig({
                neural: { 
                  ...animatedConfig.neural!, 
                  connectionDensity: Number(e.target.value) 
                }
              })}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Neural Network Colors</label>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '80px' }}>Node Core:</label>
              <input
                type="color"
                value={animatedConfig.neural?.colors.nodeCore || '#646cff'}
                onChange={(e) => updateAnimatedConfig({
                  neural: { 
                    ...animatedConfig.neural!, 
                    colors: { 
                      ...animatedConfig.neural!.colors, 
                      nodeCore: e.target.value 
                    }
                  }
                })}
              />
            </div>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '80px' }}>Node Glow:</label>
              <input
                type="color"
                value={animatedConfig.neural?.colors.nodeGlow || '#00f5ff'}
                onChange={(e) => updateAnimatedConfig({
                  neural: { 
                    ...animatedConfig.neural!, 
                    colors: { 
                      ...animatedConfig.neural!.colors, 
                      nodeGlow: e.target.value 
                    }
                  }
                })}
              />
            </div>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '80px' }}>Data Packet:</label>
              <input
                type="color"
                value={animatedConfig.neural?.colors.packet || '#00f5ff'}
                onChange={(e) => updateAnimatedConfig({
                  neural: { 
                    ...animatedConfig.neural!, 
                    colors: { 
                      ...animatedConfig.neural!.colors, 
                      packet: e.target.value 
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>
              Neural Network Presets
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  neural: {
                    ...animatedConfig.neural!,
                    colors: {
                      background: '#1a1a2e',
                      nodeCore: '#646cff',
                      nodeGlow: '#00f5ff',
                      connection: '#646cff',
                      packet: '#00f5ff'
                    },
                    dataFlowSpeed: 1.0
                  }
                })}
              >
                AI Blue
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  neural: {
                    ...animatedConfig.neural!,
                    colors: {
                      background: '#2d1b69',
                      nodeCore: '#8b5cf6',
                      nodeGlow: '#a855f7',
                      connection: '#8b5cf6',
                      packet: '#c084fc'
                    },
                    dataFlowSpeed: 0.8
                  }
                })}
              >
                Deep Purple
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  neural: {
                    ...animatedConfig.neural!,
                    colors: {
                      background: '#0c4a6e',
                      nodeCore: '#0ea5e9',
                      nodeGlow: '#38bdf8',
                      connection: '#0ea5e9',
                      packet: '#7dd3fc'
                    },
                    dataFlowSpeed: 1.2
                  }
                })}
              >
                Cyber Blue
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  neural: {
                    ...animatedConfig.neural!,
                    colors: {
                      background: '#064e3b',
                      nodeCore: '#10b981',
                      nodeGlow: '#34d399',
                      connection: '#10b981',
                      packet: '#6ee7b7'
                    },
                    dataFlowSpeed: 1.5
                  }
                })}
              >
                Matrix Green
              </button>
            </div>
          </div>
        </>
      )}

      {isAnimated && animatedConfig?.variant === 'waves' && (
        <>
          <div className="control-group">
            <label className="control-label">Wave Count: {animatedConfig.waves?.count || 4}</label>
            <input
              type="range"
              className="control-input"
              min="2"
              max="8"
              value={animatedConfig.waves?.count || 4}
              onChange={(e) => updateAnimatedConfig({
                waves: { 
                  ...animatedConfig.waves!, 
                  count: Number(e.target.value) 
                }
              })}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Animation Speed: {animatedConfig.waves?.speed || 1.0}x</label>
            <input
              type="range"
              className="control-input"
              min="0.1"
              max="3.0"
              step="0.1"
              value={animatedConfig.waves?.speed || 1.0}
              onChange={(e) => updateAnimatedConfig({
                waves: { 
                  ...animatedConfig.waves!, 
                  speed: Number(e.target.value) 
                }
              })}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Wave Colors</label>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '60px' }}>Primary:</label>
              <input
                type="color"
                value={animatedConfig.waves?.colors.primary || '#646cff'}
                onChange={(e) => updateAnimatedConfig({
                  waves: { 
                    ...animatedConfig.waves!, 
                    colors: { 
                      ...animatedConfig.waves!.colors, 
                      primary: e.target.value 
                    }
                  }
                })}
              />
            </div>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '60px' }}>Secondary:</label>
              <input
                type="color"
                value={animatedConfig.waves?.colors.secondary || '#8b5cf6'}
                onChange={(e) => updateAnimatedConfig({
                  waves: { 
                    ...animatedConfig.waves!, 
                    colors: { 
                      ...animatedConfig.waves!.colors, 
                      secondary: e.target.value 
                    }
                  }
                })}
              />
            </div>
            <div className="color-picker" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', minWidth: '60px' }}>Highlight:</label>
              <input
                type="color"
                value={animatedConfig.waves?.colors.highlight || '#00f5ff'}
                onChange={(e) => updateAnimatedConfig({
                  waves: { 
                    ...animatedConfig.waves!, 
                    colors: { 
                      ...animatedConfig.waves!.colors, 
                      highlight: e.target.value 
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="control-group">
            <h4 style={{ margin: '16px 0 8px 0', color: '#ccc', fontSize: '12px' }}>
              Wave Presets
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  waves: {
                    ...animatedConfig.waves!,
                    colors: {
                      primary: '#646cff',
                      secondary: '#8b5cf6',
                      highlight: '#00f5ff'
                    },
                    speed: 1.0
                  }
                })}
              >
                Tech Blue
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  waves: {
                    ...animatedConfig.waves!,
                    colors: {
                      primary: '#ff6b6b',
                      secondary: '#feca57',
                      highlight: '#ff9ff3'
                    },
                    speed: 0.8
                  }
                })}
              >
                Warm Sunset
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  waves: {
                    ...animatedConfig.waves!,
                    colors: {
                      primary: '#00d2d3',
                      secondary: '#54a0ff',
                      highlight: '#5f27cd'
                    },
                    speed: 1.5
                  }
                })}
              >
                Ocean Flow
              </button>
              <button
                className="control-button"
                onClick={() => updateAnimatedConfig({
                  waves: {
                    ...animatedConfig.waves!,
                    colors: {
                      primary: '#10ac84',
                      secondary: '#1dd1a1',
                      highlight: '#55efc4'
                    },
                    speed: 0.6
                  }
                })}
              >
                Matrix Green
              </button>
            </div>
          </div>
        </>
      )}

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
              onChange={(e) => updateGradientConfig({ type: e.target.value as 'linear' | 'radial' | 'conic' })}
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