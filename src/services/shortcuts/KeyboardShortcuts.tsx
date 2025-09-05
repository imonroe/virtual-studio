import React, { useEffect, useMemo } from 'react';
import { useStudioStore } from '@services/state/studioStore';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: (event?: KeyboardEvent) => void;
  description: string;
}

const useKeyboardShortcuts = () => {
  const toggleBackground = useStudioStore((state) => state.toggleBackground);
  const toggleClock = useStudioStore((state) => state.toggleClock);
  const toggleLiveIndicator = useStudioStore((state) => state.toggleLiveIndicator);
  const toggleLowerThird = useStudioStore((state) => state.toggleLowerThird);
  const toggleTicker = useStudioStore((state) => state.toggleTicker);
  const toggleControlPanel = useStudioStore((state) => state.toggleControlPanel);
  const setPreviewMode = useStudioStore((state) => state.setPreviewMode);
  const setLowerThird = useStudioStore((state) => state.setLowerThird);
  const setTicker = useStudioStore((state) => state.setTicker);
  const lowerThird = useStudioStore((state) => state.lowerThird);
  const ticker = useStudioStore((state) => state.ticker);
  const previewMode = useStudioStore((state) => state.previewMode);

  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    {
      key: '0',
      action: toggleBackground,
      description: 'Toggle Background'
    },
    {
      key: '1',
      action: toggleClock,
      description: 'Toggle Clock'
    },
    {
      key: '2',
      action: toggleLiveIndicator,
      description: 'Toggle Live Indicator'
    },
    {
      key: '3',
      action: () => {
        if (!lowerThird) {
          setLowerThird({
            visible: true,
            title: 'Sample Title',
            subtitle: 'Sample Subtitle'
          });
        } else {
          toggleLowerThird();
        }
      },
      description: 'Toggle Lower Third'
    },
    {
      key: '4',
      action: () => {
        if (!ticker) {
          setTicker({
            visible: true,
            content: ['Breaking News: Sample ticker content'],
            speed: 50
          });
        } else {
          toggleTicker();
        }
      },
      description: 'Toggle Ticker'
    },
    {
      key: 'Tab',
      action: (event?: KeyboardEvent) => {
        if (event) event.preventDefault();
        toggleControlPanel();
      },
      description: 'Toggle Control Panel'
    },
    {
      key: 'p',
      action: () => setPreviewMode(!previewMode),
      description: 'Toggle Preview Mode'
    },
    {
      key: 'Escape',
      action: () => {
        // Hide all visible overlays
        const state = useStudioStore.getState();
        if (state.clock.visible) toggleClock();
        if (state.liveIndicator.visible) toggleLiveIndicator();
        if (state.lowerThird?.visible) toggleLowerThird();
        if (state.ticker?.visible) toggleTicker();
      },
      description: 'Hide All Overlays'
    }
  ], [
    toggleBackground,
    toggleClock,
    toggleLiveIndicator,
    toggleLowerThird,
    toggleTicker,
    toggleControlPanel,
    setPreviewMode,
    setLowerThird,
    setTicker,
    lowerThird,
    ticker,
    previewMode
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('🎹 Key pressed:', {
        key: event.key,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        target: event.target?.constructor.name
      });

      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        console.log('🎹 Ignoring key press - user typing in input field');
        return;
      }

      const shortcut = shortcuts.find((s) => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = (s.ctrlKey || false) === event.ctrlKey;
        const shiftMatch = (s.shiftKey || false) === event.shiftKey;
        const altMatch = (s.altKey || false) === event.altKey;
        
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      console.log('🎹 Found shortcut:', shortcut ? shortcut.description : 'None');

      if (shortcut) {
        event.preventDefault();
        console.log('🎹 Executing shortcut:', shortcut.description);
        
        // Visual feedback for shortcut activation
        const notification = document.createElement('div');
        notification.textContent = `⌨️ ${shortcut.description}`;
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10000;
          animation: fadeInOut 2s ease-in-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `;
        
        if (!document.querySelector('#shortcut-animation')) {
          style.id = 'shortcut-animation';
          document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 2000);
        
        shortcut.action(event);
      }
    };

    console.log('🎹 Keyboard shortcuts initialized with', shortcuts.length, 'shortcuts');
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🎹 Keyboard shortcuts cleanup');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return { shortcuts };
};

export { useKeyboardShortcuts, type KeyboardShortcut };

// Simple shortcut display interface
interface SimpleShortcut {
  key: string;
  description: string;
}

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp: React.FC<{ shortcuts: KeyboardShortcut[] | SimpleShortcut[] }> = ({ shortcuts }) => {
  return (
    <div className="shortcuts-help">
      <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>
        Keyboard Shortcuts
      </h4>
      <div style={{ fontSize: '12px', color: '#aaa' }}>
        {shortcuts.map((shortcut, index) => {
          const fullShortcut = shortcut as KeyboardShortcut;
          return (
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
                {fullShortcut.ctrlKey && 'Ctrl+'}
                {fullShortcut.shiftKey && 'Shift+'}
                {fullShortcut.altKey && 'Alt+'}
                {shortcut.key === ' ' ? 'Space' : shortcut.key}
              </kbd>
            </div>
          );
        })}
      </div>
    </div>
  );
};