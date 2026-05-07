import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { localStorageService, type SavedStudioState } from '@services/storage/localStorage';
import type { ImageConfig, LogoConfig, StudioBackground } from '@/types/studio';

const largeDataUrl = (sizeKb: number): string =>
  'data:image/png;base64,' + 'A'.repeat(sizeKb * 1024);

const buildLogo = (id: string, imageUrl: string): LogoConfig => ({
  id,
  visible: true,
  name: id,
  imageUrl,
  fileName: `${id}.png`,
  position: 'bottom-right',
  size: 150,
  opacity: 1,
  offset: { x: 20, y: 20 },
  uploadTimestamp: 0,
});

const baseState: SavedStudioState = {
  background: {
    id: 'bg-1',
    type: 'image',
    visible: true,
    config: { url: largeDataUrl(400), fit: 'cover', position: { x: 0, y: 0 } } as ImageConfig,
  } as StudioBackground,
  lowerThird: null,
  ticker: {
    id: 't1',
    visible: true,
    content: ['hello'],
    speed: 50,
    backgroundColor: '#000',
    textColor: '#fff',
    fontSize: 14,
    animated: true,
  },
  clock: {
    visible: false,
    showTime: true,
    format: '12h',
    timezone: 'UTC',
    showSeconds: true,
    showDate: false,
    dateFormat: 'short',
    position: { x: 0, y: 0 },
    style: { color: '#fff', fontSize: 24, fontFamily: 'Inter' },
  },
  liveIndicator: {
    visible: false,
    text: 'LIVE',
    blinking: true,
    color: '#f00',
    position: { x: 0, y: 0 },
  },
  logos: [
    buildLogo('logo-heavy', largeDataUrl(400)),
    buildLogo('logo-light', 'data:image/png;base64,small'),
  ],
  presets: [],
  activePresetId: null,
  targetFPS: 60,
  quality: 'high',
  lastImageConfig: { url: largeDataUrl(400), fit: 'cover', position: { x: 0, y: 0 } },
  keyboardShortcutsVisible: true,
};

const makeQuotaError = (): DOMException => {
  // jsdom supports DOMException; fall back to a structurally-similar object otherwise.
  if (typeof DOMException === 'function') {
    return new DOMException('quota exceeded', 'QuotaExceededError');
  }
  const err = new Error('quota exceeded') as Error & { name: string; code: number };
  err.name = 'QuotaExceededError';
  err.code = 22;
  return err as unknown as DOMException;
};

describe('localStorageService.saveState quota fallback', () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the full state once when storage has room', () => {
    setItemSpy.mockImplementation(() => {});

    localStorageService.saveState(baseState);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
    const written = JSON.parse(setItemSpy.mock.calls[0][1] as string);
    expect(written.state.logos).toHaveLength(2);
    expect(written.state.background.type).toBe('image');
  });

  it('retries with stripped assets when a quota DOMException is thrown', () => {
    let calls = 0;
    setItemSpy.mockImplementation(() => {
      calls += 1;
      if (calls === 1) throw makeQuotaError();
    });

    localStorageService.saveState(baseState);

    expect(setItemSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();

    const reduced = JSON.parse(setItemSpy.mock.calls[1][1] as string);
    expect(reduced.state.background.type).toBe('gradient');
    expect(reduced.state.lastImageConfig).toBeNull();
    expect(reduced.state.logos).toHaveLength(1);
    expect(reduced.state.logos[0].id).toBe('logo-light');
    // Non-asset settings are preserved
    expect(reduced.state.ticker.animated).toBe(true);
  });

  it('logs an error and does not retry on non-quota failures', () => {
    setItemSpy.mockImplementation(() => {
      throw new Error('disk on fire');
    });

    localStorageService.saveState(baseState);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
