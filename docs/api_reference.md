# Virtual Studio API Reference

This document provides comprehensive API documentation for Virtual Studio's components, hooks, types, and services.

## Table of Contents

1. [Core Types](#core-types)
2. [State Management](#state-management)
3. [Components](#components)
4. [Rendering Engine](#rendering-engine)
5. [Animation System](#animation-system)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Storage Service](#storage-service)

## Core Types

### Studio Types

#### `StudioBackground`
```typescript
interface StudioBackground {
  id: string;
  type: 'gradient' | 'solid' | 'image' | 'animated';
  visible: boolean;
  config: GradientConfig | SolidConfig | ImageConfig | AnimatedConfig;
}
```

#### `GradientConfig`
```typescript
interface GradientConfig {
  colors: string[];        // Array of CSS color values
  angle: number;          // Gradient angle in degrees (0-360)
  type: 'linear' | 'radial' | 'conic';
  animated: boolean;      // Enable gradient animation
  animationSpeed: number; // Animation speed multiplier (0.1-2.0)
}
```

#### `ImageConfig`
```typescript
interface ImageConfig {
  url: string;           // Image URL or data URI
  fit: 'cover' | 'contain' | 'fill'; // CSS object-fit value
  position: { x: number; y: number }; // Position offset in pixels
}
```

#### `LowerThird`
```typescript
interface LowerThird {
  id: string;
  visible: boolean;
  title: string;         // Main title text
  subtitle: string;      // Subtitle text
  position: 'left' | 'center' | 'right';
  animation: 'slide' | 'fade' | 'scale';
  style: LowerThirdStyle;
}
```

#### `LowerThirdStyle`
```typescript
interface LowerThirdStyle {
  backgroundColor: string; // CSS color value
  textColor: string;      // CSS color value
  fontSize: number;       // Font size in pixels
  fontFamily: string;     // CSS font family
  padding: number;        // Padding in pixels
  borderRadius: number;   // Border radius in pixels
  glassMorphism: boolean; // Enable glass morphism effect
}
```

#### `Ticker`
```typescript
interface Ticker {
  id: string;
  visible: boolean;
  content: string[];      // Array of ticker text items
  speed: number;          // Animation speed (pixels per second)
  backgroundColor: string; // CSS color value
  textColor: string;      // CSS color value
  fontSize: number;       // Font size in pixels
}
```

#### `Clock`
```typescript
interface Clock {
  visible: boolean;
  format: '12h' | '24h';
  timezone: string;       // IANA timezone identifier
  showSeconds: boolean;
  position: { x: number; y: number };
  style: {
    color: string;        // CSS color value
    fontSize: number;     // Font size in pixels
    fontFamily: string;   // CSS font family
  };
}
```

#### `LiveIndicator`
```typescript
interface LiveIndicator {
  visible: boolean;
  text: string;          // Display text (e.g., "LIVE", "ON AIR")
  blinking: boolean;     // Enable blinking animation
  color: string;         // CSS color value
  position: { x: number; y: number };
}
```

### Rendering Types

#### `RenderMode`
```typescript
type RenderMode = 'webgl' | 'canvas2d' | 'css';
```

#### `Renderer`
```typescript
interface Renderer {
  mode: RenderMode;
  initialize(canvas: HTMLCanvasElement): Promise<void>;
  render(deltaTime: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
  getStats(): RenderStats;
}
```

#### `RenderStats`
```typescript
interface RenderStats {
  fps: number;           // Current frames per second
  frameTime: number;     // Time per frame in milliseconds
  drawCalls: number;     // Number of draw calls per frame
  memory?: number;       // Memory usage in MB (if available)
}
```

## State Management

### `useStudioStore`

Main Zustand store providing centralized state management.

#### State Properties

```typescript
interface StudioState {
  // Content
  background: StudioBackground;
  lowerThird: LowerThird | null;
  ticker: Ticker | null;
  clock: Clock;
  liveIndicator: LiveIndicator;
  
  // Persistence
  lastImageConfig: ImageConfig | null;
  presets: StudioPreset[];
  activePresetId: string | null;
  
  // UI State
  controlPanelOpen: boolean;
  previewMode: boolean;
  
  // Performance
  targetFPS: 60 | 30;
  quality: 'low' | 'medium' | 'high';
}
```

#### Actions

```typescript
// Content Actions
setBackground(background: Partial<StudioBackground>): void;
setLowerThird(lowerThird: Partial<LowerThird> | null): void;
setTicker(ticker: Partial<Ticker> | null): void;
setClock(clock: Partial<Clock>): void;
setLiveIndicator(indicator: Partial<LiveIndicator>): void;

// Preset Actions  
savePreset(name: string): string;
loadPreset(presetId: string): void;
deletePreset(presetId: string): void;

// Quick Toggle Actions
toggleBackground(): void;
toggleLowerThird(): void;
toggleTicker(): void;
toggleClock(): void;
toggleLiveIndicator(): void;

// UI Actions
toggleControlPanel(): void;
setPreviewMode(enabled: boolean): void;

// Performance Actions
setTargetFPS(fps: 60 | 30): void;
setQuality(quality: 'low' | 'medium' | 'high'): void;
```

#### Usage Examples

```typescript
// Get state values
const background = useStudioStore((state) => state.background);
const lowerThird = useStudioStore((state) => state.lowerThird);

// Get actions
const setBackground = useStudioStore((state) => state.setBackground);
const toggleClock = useStudioStore((state) => state.toggleClock);

// Update background
setBackground({
  type: 'gradient',
  config: {
    colors: ['#ff0000', '#0000ff'],
    angle: 135,
    type: 'linear',
    animated: true,
    animationSpeed: 0.5
  }
});

// Create lower third
setLowerThird({
  visible: true,
  title: 'John Doe',
  subtitle: 'Software Developer',
  position: 'left',
  animation: 'slide'
});
```

### Selectors

Pre-built selectors for common use cases:

```typescript
const selectBackground = (state: StudioState) => state.background;
const selectLowerThird = (state: StudioState) => state.lowerThird;
const selectTicker = (state: StudioState) => state.ticker;
const selectClock = (state: StudioState) => state.clock;
const selectLiveIndicator = (state: StudioState) => state.liveIndicator;
const selectPresets = (state: StudioState) => state.presets;
const selectQualitySettings = (state: StudioState) => ({
  targetFPS: state.targetFPS,
  quality: state.quality
});
```

## Components

### Studio Graphics

#### `<LowerThird>`

Displays animated lower third graphics.

```typescript
interface LowerThirdProps {
  config: LowerThird;
}

// Usage
<LowerThird config={lowerThird} />
```

**Features:**
- Multiple animation types (slide, fade, scale)
- Glass morphism effects
- Responsive positioning
- Real-time configuration updates

#### `<Ticker>`

Scrolling ticker tape component.

```typescript
interface TickerProps {
  config: Ticker;
}

// Usage
<Ticker config={ticker} />
```

**Features:**
- Smooth scrolling animation
- Multiple content items
- Configurable speed
- Breaking news styles

### Backgrounds

#### `<CSSGradientBackground>`

CSS-based gradient background with animation support.

```typescript
interface CSSGradientBackgroundProps {
  config: GradientConfig;
}

// Usage
<CSSGradientBackground config={gradientConfig} />
```

**Features:**
- Linear, radial, and conic gradients
- Smooth color transitions
- Animation support
- Hardware acceleration

#### `<CSSImageBackground>`

CSS-based image background with positioning controls.

```typescript
interface CSSImageBackgroundProps {
  config: ImageConfig;
  visible: boolean;
}

// Usage
<CSSImageBackground config={imageConfig} visible={true} />
```

**Features:**
- Multiple fit modes (cover, contain, fill)
- Position adjustment
- Opacity controls
- Responsive scaling

### Control Panels

#### `<ControlPanel>`

Main control interface for live editing.

```typescript
// Usage
<ControlPanel />
```

**Features:**
- Tabbed interface
- Real-time preview
- Responsive design
- Keyboard shortcuts integration

## Rendering Engine

### `RenderingEngine`

Core rendering system with WebGL and fallback support.

```typescript
interface RenderingEngineConfig {
  preferredMode?: RenderMode;
  autoStart?: boolean;
  targetFPS?: number;
}

class RenderingEngine {
  constructor(config: RenderingEngineConfig);
  
  // Lifecycle
  initialize(canvas: HTMLCanvasElement): Promise<void>;
  start(): void;
  stop(): void;
  dispose(): void;
  
  // Configuration
  setTargetFPS(fps: number): void;
  resize(width: number, height: number): void;
  
  // Rendering
  onRender(callback: (deltaTime: number) => void): void;
  
  // Information
  getMode(): RenderMode | null;
  getStats(): RenderStats | null;
  getCanvas(): HTMLCanvasElement | null;
  getWebGLContext(): WebGLRenderer | null;
  isWebGL(): boolean;
}
```

### Usage Example

```typescript
const engine = new RenderingEngine({
  preferredMode: 'webgl',
  autoStart: true,
  targetFPS: 60
});

await engine.initialize(canvasElement);

engine.onRender((deltaTime) => {
  // Update animations
  backgroundRenderer.update(deltaTime);
});

// Get performance stats
const stats = engine.getStats();
console.log(`FPS: ${stats.fps}, Frame Time: ${stats.frameTime}ms`);
```

### WebGL Specific

#### `WebGLRenderer`

WebGL-based renderer using Three.js.

```typescript
class WebGLRenderer implements Renderer {
  // Three.js integration
  getScene(): THREE.Scene | null;
  getCamera(): THREE.Camera | null;
  getRenderer(): THREE.WebGLRenderer | null;
  
  // Utility methods
  static isSupported(): boolean;
}
```

## Animation System

### Spring Animations

Physics-based spring animations for natural motion.

```typescript
interface SpringConfig {
  tension?: number;    // Spring tension (default: 170)
  friction?: number;   // Spring friction (default: 26)  
  precision?: number;  // Animation precision (default: 0.01)
}

class SpringAnimation {
  constructor(config?: SpringConfig);
  interpolate(from: number, to: number): number[];
}
```

### Easing Functions

Pre-built easing functions for smooth animations.

```typescript
class BezierEasing {
  static presets = {
    broadcast: [0.25, 0.46, 0.45, 0.94],
    smooth: [0.43, 0.13, 0.23, 0.96],
    snap: [0.68, -0.55, 0.265, 1.55]
  };
  
  static create(controlPoints: number[]): EasingFunction;
}
```

## Keyboard Shortcuts

### `useKeyboardShortcuts`

Hook providing keyboard shortcut functionality.

```typescript
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

const useKeyboardShortcuts = () => {
  return { shortcuts: KeyboardShortcut[] };
};
```

### Default Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `0` | Toggle Background | Show/hide background |
| `1` | Toggle Clock | Show/hide clock |
| `2` | Toggle Live Indicator | Show/hide live indicator |
| `3` | Toggle Lower Third | Show/hide lower third |
| `4` | Toggle Ticker | Show/hide ticker |
| `Tab` | Toggle Control Panel | Show/hide control panel |
| `p` | Toggle Preview Mode | Enable/disable preview |
| `Escape` | Hide All Overlays | Hide all graphic overlays |

### Usage Example

```typescript
const MyComponent = () => {
  const { shortcuts } = useKeyboardShortcuts();
  
  return (
    <div>
      <KeyboardShortcutsHelp shortcuts={shortcuts} />
    </div>
  );
};
```

## Storage Service

### `localStorageService`

Handles persistent storage of application state.

```typescript
interface LocalStorageService {
  isAvailable(): boolean;
  saveState(state: Partial<StudioState>): void;
  loadState(): Partial<StudioState> | null;
  clearState(): void;
}
```

#### Methods

```typescript
// Check if localStorage is available
const available = localStorageService.isAvailable();

// Save current state
localStorageService.saveState({
  background,
  lowerThird,
  ticker,
  clock,
  liveIndicator,
  presets
});

// Load saved state
const savedState = localStorageService.loadState();

// Clear all saved data
localStorageService.clearState();
```

## Error Handling

### Common Error Types

```typescript
// Rendering errors
try {
  await engine.initialize(canvas);
} catch (error) {
  if (error instanceof WebGLUnsupportedError) {
    // Fallback to CSS rendering
  }
}

// Storage errors
try {
  localStorageService.saveState(state);
} catch (error) {
  console.warn('Failed to save state:', error);
}
```

### Performance Monitoring

```typescript
// Monitor rendering performance
const stats = engine.getStats();
if (stats.fps < 30) {
  // Reduce quality settings
  setQuality('low');
  setTargetFPS(30);
}

// Memory monitoring
if (stats.memory && stats.memory > 200) {
  console.warn('High memory usage detected');
}
```

## TypeScript Support

Virtual Studio is fully typed with TypeScript. All interfaces and types are exported from their respective modules:

```typescript
// Import types
import type { 
  StudioBackground, 
  LowerThird, 
  Ticker,
  GradientConfig 
} from '@types/studio';

import type { 
  RenderMode, 
  Renderer, 
  RenderStats 
} from '@types/rendering';
```

## Migration Guide

### From Version 1.x to 2.x

Key breaking changes and migration steps:

1. **State Management**: Updated to Zustand 5.x
   ```typescript
   // Old (v1.x)
   const state = useStore(store => store);
   
   // New (v2.x) 
   const background = useStudioStore(state => state.background);
   ```

2. **Component Props**: Standardized prop interfaces
   ```typescript
   // Old (v1.x)
   <LowerThird title="Title" subtitle="Subtitle" />
   
   // New (v2.x)
   <LowerThird config={{ title: "Title", subtitle: "Subtitle" }} />
   ```

3. **Rendering Engine**: Updated API
   ```typescript
   // Old (v1.x)
   engine.setMode('webgl');
   
   // New (v2.x)
   const engine = new RenderingEngine({ preferredMode: 'webgl' });
   ```

## Performance Best Practices

1. **State Subscriptions**: Use selective subscriptions
   ```typescript
   // Good
   const background = useStudioStore(state => state.background);
   
   // Avoid
   const state = useStudioStore();
   ```

2. **Component Memoization**: Memoize expensive components
   ```typescript
   const ExpensiveComponent = React.memo(({ config }) => {
     // Component implementation
   });
   ```

3. **Animation Optimization**: Use GPU-accelerated properties
   ```typescript
   // Good - GPU accelerated
   transform: translateX(100px);
   opacity: 0.5;
   
   // Avoid - causes reflow
   left: 100px;
   display: none;
   ```

---

*This API reference is automatically generated from TypeScript definitions and may be updated as the application evolves.*