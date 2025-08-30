import { useEffect, useMemo } from 'react';
import { useStudioStore } from '@services/state/studioStore';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
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
      action: toggleControlPanel,
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
        // Hide all overlays
        toggleClock();
        toggleLiveIndicator();
        toggleLowerThird();
        toggleTicker();
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
      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const shortcut = shortcuts.find((s) => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = (s.ctrlKey || false) === event.ctrlKey;
        const shiftMatch = (s.shiftKey || false) === event.shiftKey;
        const altMatch = (s.altKey || false) === event.altKey;
        
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return { shortcuts };
};

export { useKeyboardShortcuts };

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp: React.FC<{ shortcuts: KeyboardShortcut[] }> = ({ shortcuts }) => {
  return (
    <div className="shortcuts-help">
      <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '14px' }}>
        Keyboard Shortcuts
      </h4>
      <div style={{ fontSize: '12px', color: '#aaa' }}>
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
              {shortcut.ctrlKey && 'Ctrl+'}
              {shortcut.shiftKey && 'Shift+'}
              {shortcut.altKey && 'Alt+'}
              {shortcut.key === ' ' ? 'Space' : shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};