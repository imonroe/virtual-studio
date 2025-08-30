import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { localStorageService } from '@services/storage/localStorage';
import type { 
  StudioBackground, 
  LowerThird, 
  Ticker, 
  Clock, 
  LiveIndicator,
  StudioPreset,
  GradientConfig,
  ImageConfig
} from '@/types/studio';

interface StudioState {
  // Current active elements
  background: StudioBackground;
  lowerThird: LowerThird | null;
  ticker: Ticker | null;
  clock: Clock;
  liveIndicator: LiveIndicator;
  
  // Last used image config for persistence
  lastImageConfig: ImageConfig | null;
  
  // Presets
  presets: StudioPreset[];
  activePresetId: string | null;
  
  // UI State
  controlPanelOpen: boolean;
  previewMode: boolean;
  
  // Performance settings
  targetFPS: 60 | 30;
  quality: 'low' | 'medium' | 'high';
  
  // Actions
  setBackground: (background: Partial<StudioBackground>) => void;
  setLastImageConfig: (config: ImageConfig) => void;
  setLowerThird: (lowerThird: Partial<LowerThird> | null) => void;
  setTicker: (ticker: Partial<Ticker> | null) => void;
  setClock: (clock: Partial<Clock>) => void;
  setLiveIndicator: (indicator: Partial<LiveIndicator>) => void;
  
  // Preset actions
  savePreset: (name: string) => string;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  
  // UI actions
  toggleControlPanel: () => void;
  setPreviewMode: (enabled: boolean) => void;
  
  // Performance actions
  setTargetFPS: (fps: 60 | 30) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  
  // Quick actions
  toggleBackground: () => void;
  toggleLowerThird: () => void;
  toggleTicker: () => void;
  toggleClock: () => void;
  toggleLiveIndicator: () => void;
}

// Default gradient background
const defaultGradientConfig: GradientConfig = {
  colors: ['#1a1a2e', '#16213e', '#0f3460'],
  angle: 135,
  type: 'linear',
  animated: true,
  animationSpeed: 0.5
};

const defaultBackground: StudioBackground = {
  id: 'default-bg',
  type: 'gradient',
  visible: true,
  config: defaultGradientConfig
};

const defaultClock: Clock = {
  visible: false,
  format: '12h',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  showSeconds: true,
  position: { x: 20, y: 20 },
  style: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Inter, sans-serif'
  }
};

const defaultLiveIndicator: LiveIndicator = {
  visible: false,
  text: 'LIVE',
  blinking: true,
  color: '#ff0000',
  position: { x: 20, y: 60 }
};

// Load initial state from localStorage or use defaults
const getInitialState = () => {
  const savedState = localStorageService.loadState();
  
  if (savedState) {
    return {
      background: savedState.background || defaultBackground,
      lowerThird: savedState.lowerThird || null,
      ticker: savedState.ticker || null,
      clock: savedState.clock || defaultClock,
      liveIndicator: savedState.liveIndicator || defaultLiveIndicator,
      lastImageConfig: savedState.lastImageConfig || null,
      presets: savedState.presets || [],
      activePresetId: savedState.activePresetId || null,
      controlPanelOpen: true, // UI state - don't persist
      previewMode: true, // UI state - don't persist
      targetFPS: savedState.targetFPS || 60,
      quality: savedState.quality || 'high',
    };
  }
  
  return {
    background: defaultBackground,
    lowerThird: null,
    ticker: null,
    clock: defaultClock,
    liveIndicator: defaultLiveIndicator,
    lastImageConfig: null,
    presets: [],
    activePresetId: null,
    controlPanelOpen: true,
    previewMode: true,
    targetFPS: 60,
    quality: 'high',
  };
};

export const useStudioStore = create<StudioState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state from localStorage or defaults
      ...getInitialState(),

      // Actions
      setBackground: (background) =>
        set((state) => {
          Object.assign(state.background, background);
          // Store image config for persistence
          if (background.type === 'image' && background.config) {
            state.lastImageConfig = background.config as ImageConfig;
          }
        }),

      setLowerThird: (lowerThird) =>
        set((state) => {
          if (lowerThird === null) {
            state.lowerThird = null;
          } else if (state.lowerThird) {
            Object.assign(state.lowerThird, lowerThird);
          } else {
            state.lowerThird = {
              id: `lt-${Date.now()}`,
              visible: true,
              title: '',
              subtitle: '',
              position: 'left',
              animation: 'slide',
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textColor: '#ffffff',
                fontSize: 16,
                fontFamily: 'Inter, sans-serif',
                padding: 16,
                borderRadius: 4,
                glassMorphism: true
              },
              ...lowerThird
            };
          }
        }),

      setTicker: (ticker) =>
        set((state) => {
          if (ticker === null) {
            state.ticker = null;
          } else if (state.ticker) {
            Object.assign(state.ticker, ticker);
          } else {
            state.ticker = {
              id: `ticker-${Date.now()}`,
              visible: true,
              content: [],
              speed: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              textColor: '#ffffff',
              fontSize: 14,
              ...ticker
            };
          }
        }),

      setClock: (clock) =>
        set((state) => {
          Object.assign(state.clock, clock);
        }),

      setLiveIndicator: (indicator) =>
        set((state) => {
          Object.assign(state.liveIndicator, indicator);
        }),

      savePreset: (name) => {
        const presetId = `preset-${Date.now()}`;
        const state = get();
        
        set((draft) => {
          draft.presets.push({
            id: presetId,
            name,
            background: { ...state.background },
            lowerThird: state.lowerThird ? { ...state.lowerThird } : undefined,
            ticker: state.ticker ? { ...state.ticker } : undefined,
            clock: { ...state.clock },
            liveIndicator: { ...state.liveIndicator }
          });
          draft.activePresetId = presetId;
        });
        
        return presetId;
      },

      loadPreset: (presetId) =>
        set((state) => {
          const preset = state.presets.find((p) => p.id === presetId);
          if (preset) {
            state.background = { ...preset.background };
            state.lowerThird = preset.lowerThird ? { ...preset.lowerThird } : null;
            state.ticker = preset.ticker ? { ...preset.ticker } : null;
            if (preset.clock) {
              state.clock = { ...preset.clock };
            }
            if (preset.liveIndicator) {
              state.liveIndicator = { ...preset.liveIndicator };
            }
            state.activePresetId = presetId;
          }
        }),

      deletePreset: (presetId) =>
        set((state) => {
          const index = state.presets.findIndex((p) => p.id === presetId);
          if (index !== -1) {
            state.presets.splice(index, 1);
            if (state.activePresetId === presetId) {
              state.activePresetId = null;
            }
          }
        }),

      toggleControlPanel: () =>
        set((state) => {
          state.controlPanelOpen = !state.controlPanelOpen;
        }),

      setPreviewMode: (enabled) =>
        set((state) => {
          state.previewMode = enabled;
        }),

      setTargetFPS: (fps) =>
        set((state) => {
          state.targetFPS = fps;
        }),

      setQuality: (quality) =>
        set((state) => {
          state.quality = quality;
        }),

      toggleBackground: () =>
        set((state) => {
          state.background.visible = !state.background.visible;
        }),

      toggleLowerThird: () =>
        set((state) => {
          if (state.lowerThird) {
            state.lowerThird.visible = !state.lowerThird.visible;
          }
        }),

      toggleTicker: () =>
        set((state) => {
          if (state.ticker) {
            state.ticker.visible = !state.ticker.visible;
          }
        }),

      toggleClock: () =>
        set((state) => {
          state.clock.visible = !state.clock.visible;
        }),

      toggleLiveIndicator: () =>
        set((state) => {
          state.liveIndicator.visible = !state.liveIndicator.visible;
        }),

      setLastImageConfig: (config) =>
        set((state) => {
          state.lastImageConfig = config;
        })
    }))
  )
);

// Selectors for common use cases
export const selectBackground = (state: StudioState) => state.background;
export const selectLowerThird = (state: StudioState) => state.lowerThird;
export const selectTicker = (state: StudioState) => state.ticker;
export const selectClock = (state: StudioState) => state.clock;
export const selectLiveIndicator = (state: StudioState) => state.liveIndicator;
export const selectPresets = (state: StudioState) => state.presets;
export const selectQualitySettings = (state: StudioState) => ({
  targetFPS: state.targetFPS,
  quality: state.quality
});

// Auto-save state to localStorage whenever it changes
let saveTimeout: NodeJS.Timeout | null = null;

if (localStorageService.isAvailable()) {
  useStudioStore.subscribe((state) => {
    // Debounce saves to avoid excessive writes
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(() => {
      localStorageService.saveState(state);
    }, 500); // Save 500ms after last change
  });
  
  console.log('💾 Auto-save enabled for Virtual Studio state');
} else {
  console.warn('⚠️ localStorage not available, settings will not persist');
}