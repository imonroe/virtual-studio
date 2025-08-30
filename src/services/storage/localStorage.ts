import type { StudioBackground, LowerThird, Ticker, Clock, LiveIndicator, StudioPreset, ImageConfig, LogoConfig } from '@/types/studio';

const STORAGE_KEY = 'virtual-studio-state';
const STORAGE_VERSION = '1.0';

export interface SavedStudioState {
  background: StudioBackground;
  lowerThird: LowerThird | null;
  ticker: Ticker | null;
  clock: Clock;
  liveIndicator: LiveIndicator;
  logos: LogoConfig[];
  presets: StudioPreset[];
  activePresetId: string | null;
  targetFPS: 60 | 30;
  quality: 'low' | 'medium' | 'high';
  lastImageConfig: ImageConfig | null;
}

export interface StorageState {
  version: string;
  timestamp: number;
  state: SavedStudioState;
}

export const localStorageService = {
  // Save state to localStorage
  saveState: (state: { background: StudioBackground; lowerThird: LowerThird | null; ticker: Ticker | null; clock: Clock; liveIndicator: LiveIndicator; logos: LogoConfig[]; presets: StudioPreset[]; activePresetId: string | null; targetFPS: 60 | 30; quality: 'low' | 'medium' | 'high'; lastImageConfig: ImageConfig | null }): void => {
    try {
      const storageState: StorageState = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        state: {
          background: state.background,
          lowerThird: state.lowerThird,
          ticker: state.ticker,
          clock: state.clock,
          liveIndicator: state.liveIndicator,
          logos: state.logos,
          presets: state.presets,
          activePresetId: state.activePresetId,
          targetFPS: state.targetFPS,
          quality: state.quality,
          lastImageConfig: state.lastImageConfig,
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageState));
      console.log('💾 Studio state saved to localStorage');
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  },

  // Load state from localStorage
  loadState: (): SavedStudioState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('📁 No saved state found in localStorage');
        return null;
      }

      const storageState: StorageState = JSON.parse(stored);
      
      // Check version compatibility
      if (storageState.version !== STORAGE_VERSION) {
        console.warn('⚠️ Stored state version mismatch, ignoring saved state');
        return null;
      }

      // Check if state is not too old (optional: 30 days)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
      if (Date.now() - storageState.timestamp > maxAge) {
        console.warn('⚠️ Stored state is too old, ignoring saved state');
        return null;
      }

      console.log('📂 Studio state loaded from localStorage');
      return storageState.state;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return null;
    }
  },

  // Clear stored state
  clearState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Studio state cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear state from localStorage:', error);
    }
  },

  // Check if localStorage is available
  isAvailable: (): boolean => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  // Get storage info
  getStorageInfo: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const storageState: StorageState = JSON.parse(stored);
      return {
        version: storageState.version,
        timestamp: storageState.timestamp,
        lastSaved: new Date(storageState.timestamp).toLocaleString(),
        size: new Blob([stored]).size
      };
    } catch {
      return null;
    }
  }
};