import React, { useState, useEffect } from 'react';
import { localStorageService } from '@services/storage/localStorage';

export const StorageControls: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{ version: string; timestamp: number; lastSaved: string; size: number } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Update storage info every few seconds
    const updateInfo = () => {
      setStorageInfo(localStorageService.getStorageInfo());
    };
    
    updateInfo();
    const interval = setInterval(updateInfo, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClearStorage = () => {
    localStorageService.clearState();
    setStorageInfo(null);
    setShowClearConfirm(false);
    // Refresh the page to reload defaults
    window.location.reload();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="control-section">
      <h3>Storage & Data</h3>
      
      {localStorageService.isAvailable() ? (
        <>
          <div className="control-group">
            <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>
              Auto-Save Status
            </h4>
            <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '12px' }}>
              Your settings are automatically saved to browser storage and will persist across page reloads.
            </div>
            
            {storageInfo ? (
              <div style={{ 
                background: '#2a2a2a', 
                padding: '12px', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#ccc'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Last Saved:</strong> {storageInfo.lastSaved}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Storage Size:</strong> {formatFileSize(storageInfo.size)}
                </div>
                <div>
                  <strong>Version:</strong> {storageInfo.version}
                </div>
              </div>
            ) : (
              <div style={{ 
                background: '#333', 
                padding: '12px', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#888'
              }}>
                No saved data found
              </div>
            )}
          </div>

          <div className="control-group">
            <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '14px' }}>
              Data Management
            </h4>
            
            {!showClearConfirm ? (
              <button
                className="control-button danger"
                onClick={() => setShowClearConfirm(true)}
                disabled={!storageInfo}
              >
                Clear Saved Settings
              </button>
            ) : (
              <div>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#ff6b6b', 
                  marginBottom: '12px',
                  fontWeight: '500'
                }}>
                  ⚠️ This will delete all your saved settings and reload the page with defaults.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="control-button danger"
                    onClick={handleClearStorage}
                    style={{ flex: 1 }}
                  >
                    Yes, Clear All
                  </button>
                  <button
                    className="control-button"
                    onClick={() => setShowClearConfirm(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="control-group">
            <h4 style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: '12px' }}>
              What Gets Saved?
            </h4>
            <div style={{ fontSize: '11px', color: '#888' }}>
              • Background settings & colors<br/>
              • Lower third text & styling<br/>
              • Ticker content & settings<br/>
              • Clock & live indicator config<br/>
              • Custom presets<br/>
              • Performance settings
            </div>
          </div>
        </>
      ) : (
        <div className="control-group">
          <div style={{ 
            background: '#433', 
            padding: '12px', 
            borderRadius: '4px',
            fontSize: '13px',
            color: '#ffcc99'
          }}>
            ⚠️ Browser storage is not available. Settings will not persist across page reloads.
          </div>
        </div>
      )}
    </div>
  );
};