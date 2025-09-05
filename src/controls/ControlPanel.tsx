import React, { useState } from 'react';
import { BackgroundControls } from './panels/BackgroundControls';
import { LowerThirdControls } from './panels/LowerThirdControls';
import { TickerControls } from './panels/TickerControls';
import { OverlayControls } from './panels/OverlayControls';
import { PresetControls } from './panels/PresetControls';
import { StorageControls } from './panels/StorageControls';
import { BrandingControls } from './panels/BrandingControls';
import { KeyboardShortcutsHelp } from '@services/shortcuts/KeyboardShortcuts';
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
          <KeyboardShortcutsHelp shortcuts={shortcuts} />
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
        </div>
      </div>
    </>
  );
};