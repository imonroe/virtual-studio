import type { StudioBackground, LowerThird, Ticker, Clock, LiveIndicator, StudioPreset, ImageConfig, LogoConfig } from '@/types/studio';
import { createDefaultBackground } from '@services/state/defaults';

const STORAGE_KEY = 'virtual-studio-state';
const STORAGE_VERSION = '1.0';

// Data URLs (base64) can be megabytes each. localStorage typically caps at 5-10MB total,
// so anything above this threshold is dropped on quota fallback to keep settings persisting.
const DATA_URL_PERSIST_THRESHOLD = 200 * 1024;

// Standard QuotaExceededError DOMException codes across browsers
const QUOTA_ERROR_CODES = new Set([22, 1014]);
const QUOTA_ERROR_NAMES = new Set([
  'QuotaExceededError',
  'NS_ERROR_DOM_QUOTA_REACHED',
]);

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
  keyboardShortcutsVisible: boolean;
}

export interface StorageState {
  version: string;
  timestamp: number;
  state: SavedStudioState;
}

// Older saved states predate the `animated` field on Ticker. Fill in defaults
// at the persistence boundary so the rest of the app can treat `animated` as
// strictly boolean (matching the Ticker type).
const normalizeTicker = (ticker: Ticker | null | undefined): Ticker | null => {
  if (!ticker) return null;
  return ticker.animated === undefined ? { ...ticker, animated: true } : ticker;
};

const normalizeLoadedState = (state: SavedStudioState): SavedStudioState => ({
  ...state,
  ticker: normalizeTicker(state.ticker),
  presets: state.presets.map((preset) => ({
    ...preset,
    ticker: preset.ticker ? normalizeTicker(preset.ticker) ?? undefined : undefined,
  })),
});

// Detects browser quota errors without relying on `instanceof Error`. Browsers
// throw a DOMException for localStorage quota failures, and DOMException is not
// always a subclass of Error (notably in older WebKit), so check structurally.
const isQuotaError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as { name?: unknown; code?: unknown; message?: unknown };
  if (typeof candidate.name === 'string' && QUOTA_ERROR_NAMES.has(candidate.name)) {
    return true;
  }
  if (typeof candidate.code === 'number' && QUOTA_ERROR_CODES.has(candidate.code)) {
    return true;
  }
  if (typeof candidate.message === 'string' && /quota/i.test(candidate.message)) {
    return true;
  }
  return false;
};

const isLargeDataUrl = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.startsWith('data:') &&
  value.length > DATA_URL_PERSIST_THRESHOLD;

// Replace image backgrounds carrying a stripped data URL with a fresh default
// gradient (factory call avoids sharing references across multiple stripped
// backgrounds, which the in-place store updates would otherwise entangle).
const stripLargeImage = (background: StudioBackground): StudioBackground => {
  if (background.type === 'image' && background.config) {
    const config = background.config as ImageConfig;
    if (isLargeDataUrl(config.url)) {
      return createDefaultBackground();
    }
  }
  return background;
};

// Returns a state with large embedded data URLs (logos, image backgrounds) removed.
// Settings are preserved; the user will need to re-upload heavy assets after reload.
const stripHeavyAssets = (state: SavedStudioState): SavedStudioState => ({
  ...state,
  background: stripLargeImage(state.background),
  lastImageConfig:
    state.lastImageConfig && isLargeDataUrl(state.lastImageConfig.url)
      ? null
      : state.lastImageConfig,
  // Drop logos whose imageUrl can't be persisted entirely — keeping a record with
  // no imageUrl would leave phantom thumbnails in BrandingControls and an unrenderable
  // overlay (Logo bails when imageUrl is empty).
  logos: state.logos.filter((logo) => !isLargeDataUrl(logo.imageUrl)),
  presets: state.presets.map((preset) => ({
    ...preset,
    background: stripLargeImage(preset.background),
  })),
});

const buildStorageState = (state: SavedStudioState): StorageState => ({
  version: STORAGE_VERSION,
  timestamp: Date.now(),
  state,
});

const writeToStorage = (state: SavedStudioState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buildStorageState(state)));
};

export const localStorageService = {
  // Save state to localStorage. On quota errors, retries with heavy assets stripped.
  saveState: (state: SavedStudioState): void => {
    const fullState: SavedStudioState = {
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
      keyboardShortcutsVisible: state.keyboardShortcutsVisible,
    };

    try {
      writeToStorage(fullState);
      return;
    } catch (error) {
      if (!isQuotaError(error)) {
        console.error('Failed to save state to localStorage:', error);
        return;
      }
    }

    // Quota exceeded: try again without heavy embedded data URLs.
    try {
      writeToStorage(stripHeavyAssets(fullState));
      console.warn(
        '⚠️ localStorage quota exceeded. Saved settings without uploaded images/logos; re-upload after reload to restore them.'
      );
    } catch (error) {
      if (isQuotaError(error)) {
        console.warn(
          '⚠️ localStorage quota still exceeded after stripping uploaded assets. Settings will not persist this session.'
        );
      } else {
        console.error('Failed to save reduced state to localStorage:', error);
      }
    }
  },

  // Load state from localStorage
  loadState: (): SavedStudioState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
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

      return normalizeLoadedState(storageState.state);
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return null;
    }
  },

  // Clear stored state
  clearState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
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
