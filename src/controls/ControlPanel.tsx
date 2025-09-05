import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackgroundControls } from './panels/BackgroundControls';
import { LowerThirdControls } from './panels/LowerThirdControls';
import { TickerControls } from './panels/TickerControls';
import { OverlayControls } from './panels/OverlayControls';
import { PresetControls } from './panels/PresetControls';
import { StorageControls } from './panels/StorageControls';
import { BrandingControls } from './panels/BrandingControls';
import { useStudioStore } from '@services/state/studioStore';
import './ControlPanel.css';

type TabType = 'background' | 'lower-third' | 'ticker' | 'overlays' | 'branding' | 'presets' | 'storage';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'background', label: 'Background', icon: '🎨' },
  { id: 'lower-third', label: 'Lower Third', icon: '📰' },
  { id: 'ticker', label: 'Ticker', icon: '📊' },
  { id: 'overlays', label: 'Overlays', icon: '⏰' },
  { id: 'branding', label: 'Branding', icon: '🏷️' },
  { id: 'presets', label: 'Presets', icon: '💾' },
  { id: 'storage', label: 'Storage', icon: '🗄️' }
];

export const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('background');
  const controlPanelOpen = useStudioStore((state) => state.controlPanelOpen);
  const toggleControlPanel = useStudioStore((state) => state.toggleControlPanel);
  const keyboardShortcutsVisible = useStudioStore((state) => state.keyboardShortcutsVisible);
  const toggleKeyboardShortcuts = useStudioStore((state) => state.toggleKeyboardShortcuts);
  // Shortcuts for display in help panel (not functional, just for UI)
  const shortcuts = [
    { key: '0', description: 'Toggle Background' },
    { key: '1', description: 'Toggle Clock' },
    { key: '2', description: 'Toggle Live Indicator' },
    { key: '3', description: 'Toggle Lower Third' },
    { key: '4', description: 'Toggle Ticker' },
    { key: 'Tab', description: 'Toggle Control Panel' },
    { key: 'p', description: 'Toggle Preview Mode' },
    { key: 'Escape', description: 'Hide All Overlays' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'background':
        return <BackgroundControls />;
      case 'lower-third':
        return <LowerThirdControls />;
      case 'ticker':
        return <TickerControls />;
      case 'overlays':
        return <OverlayControls />;
      case 'branding':
        return <BrandingControls />;
      case 'presets':
        return <PresetControls />;
      case 'storage':
        return <StorageControls />;
      default:
        return <BackgroundControls />;
    }
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <button 
        className="control-panel-toggle"
        onClick={toggleControlPanel}
        aria-label={controlPanelOpen ? 'Close controls' : 'Open controls'}
      >
        {controlPanelOpen ? '✕' : '⚙️'}
      </button>

      <div className={`control-panel ${controlPanelOpen ? 'open' : 'closed'}`}>
        <div className="control-panel-header">
          <h2>Virtual Studio Controls</h2>
          <button 
            className="close-button"
            onClick={toggleControlPanel}
            aria-label="Close controls"
          >
            ✕
          </button>
        </div>

        <div className="control-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`control-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="control-content">
          {renderTabContent()}
        </div>

        <div className="control-panel-footer">
          <div className="keyboard-shortcuts-section">
            <div className="shortcuts-header">
              <h4 style={{ margin: '0', color: '#fff', fontSize: '14px' }}>
                Keyboard Shortcuts
              </h4>
              <button
                className="shortcuts-toggle-button"
                onClick={toggleKeyboardShortcuts}
                aria-expanded={keyboardShortcutsVisible}
                aria-label={keyboardShortcutsVisible ? 'Hide keyboard shortcuts' : 'Show keyboard shortcuts'}
                title={keyboardShortcutsVisible ? 'Hide shortcuts' : 'Show shortcuts'}
              >
                {keyboardShortcutsVisible ? '▼' : '▶'}
              </button>
            </div>
            {keyboardShortcutsVisible && (
              <div className="shortcuts-content">
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '12px' }}>
                  {shortcuts.map((shortcut, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '4px',
                        alignItems: 'center'
                      }}
                    >
                      <span>{shortcut.description}</span>
                      <kbd style={{
                        background: '#333',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}>
                        {shortcut.key === ' ' ? 'Space' : shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="status-info" style={{ marginTop: '16px' }}>
            <div className="status-item">
              <span className="status-label">FPS:</span>
              <span className="status-value">60</span>
            </div>
            <div className="status-item">
              <span className="status-label">Mode:</span>
              <span className="status-value">WebGL</span>
            </div>
          </div>
          
          {/* Feedback Button */}
          <div className="feedback-section" style={{ marginTop: '16px' }}>
            <Link to="/feedback" className="feedback-button" title="Report bugs or request features">
              💬 Send Feedback
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};