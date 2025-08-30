import React, { useState } from 'react';
import { useStudioStore } from '@services/state/studioStore';

export const PresetControls: React.FC = () => {
  const presets = useStudioStore((state) => state.presets);
  const activePresetId = useStudioStore((state) => state.activePresetId);
  const savePreset = useStudioStore((state) => state.savePreset);
  const loadPreset = useStudioStore((state) => state.loadPreset);
  const deletePreset = useStudioStore((state) => state.deletePreset);
  
  const [presetName, setPresetName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim());
      setPresetName('');
    }
  };

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="control-section">
      <h3>Presets</h3>
      
      <div className="control-group">
        <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>Save Current Setup</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="control-input"
            style={{ flex: 1 }}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter preset name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSavePreset();
              }
            }}
          />
          <button
            className="control-button primary"
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="control-group">
        <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>
          Saved Presets ({presets.length})
        </h4>
        
        {presets.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic' }}>
            No presets saved yet. Save your current setup to create your first preset.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {presets.map((preset) => (
              <div
                key={preset.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: activePresetId === preset.id ? 'rgba(100, 108, 255, 0.2)' : '#2a2a2a',
                  borderRadius: '4px',
                  border: `1px solid ${activePresetId === preset.id ? '#646cff' : '#444'}`
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#fff', marginBottom: '2px' }}>
                    {preset.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {/* Show a brief description of what's in the preset */}
                    {[
                      preset.background.type,
                      preset.lowerThird ? 'lower third' : null,
                      preset.ticker ? 'ticker' : null,
                      preset.clock?.visible ? 'clock' : null,
                      preset.liveIndicator?.visible ? 'live indicator' : null
                    ].filter(Boolean).join(', ')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="control-button"
                    style={{ 
                      padding: '6px 12px',
                      fontSize: '12px',
                      minWidth: 'auto'
                    }}
                    onClick={() => loadPreset(preset.id)}
                  >
                    Load
                  </button>
                  
                  {showDeleteConfirm === preset.id ? (
                    <>
                      <button
                        className="control-button danger"
                        style={{ 
                          padding: '6px 8px',
                          fontSize: '12px',
                          minWidth: 'auto'
                        }}
                        onClick={() => handleDeletePreset(preset.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="control-button"
                        style={{ 
                          padding: '6px 8px',
                          fontSize: '12px',
                          minWidth: 'auto'
                        }}
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      className="control-button danger"
                      style={{ 
                        padding: '6px 8px',
                        fontSize: '12px',
                        minWidth: 'auto'
                      }}
                      onClick={() => setShowDeleteConfirm(preset.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="control-group" style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: '12px' }}>Import/Export</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          <button
            className="control-button"
            onClick={() => {
              // Export presets to JSON
              const dataStr = JSON.stringify(presets, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              
              const exportFileDefaultName = 'virtual-studio-presets.json';
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
            disabled={presets.length === 0}
          >
            Export Presets
          </button>
          
          <label style={{ position: 'relative' }}>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const importedPresets = JSON.parse(event.target?.result as string);
                      // Here you would implement the import logic
                      console.log('Imported presets:', importedPresets);
                      alert('Import feature coming soon!');
                    } catch (error) {
                      alert('Invalid preset file');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <span className="control-button" style={{ cursor: 'pointer', textAlign: 'center' }}>
              Import Presets
            </span>
          </label>
        </div>
      </div>

      <div className="control-group" style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: '12px' }}>Default Templates</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          <button
            className="control-button"
            onClick={() => {
              savePreset('News Studio');
              // You could also programmatically set up a news-style configuration here
            }}
          >
            Create News Template
          </button>
          <button
            className="control-button"
            onClick={() => {
              savePreset('Gaming Stream');
              // You could also programmatically set up a gaming-style configuration here
            }}
          >
            Create Gaming Template
          </button>
          <button
            className="control-button"
            onClick={() => {
              savePreset('Corporate Meeting');
              // You could also programmatically set up a corporate-style configuration here
            }}
          >
            Create Corporate Template
          </button>
        </div>
      </div>
    </div>
  );
};