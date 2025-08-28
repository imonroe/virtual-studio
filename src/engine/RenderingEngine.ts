import { WebGLRenderer } from './webgl/WebGLRenderer';
import { Canvas2DRenderer } from './canvas/Canvas2DRenderer';
import type { Renderer, RenderMode, RenderStats } from '@types/rendering';

export interface RenderingEngineConfig {
  preferredMode?: RenderMode;
  autoStart?: boolean;
  targetFPS?: number;
}

export class RenderingEngine {
  private renderer: Renderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private targetFrameTime: number = 1000 / 60; // 60 FPS default
  private isRunning: boolean = false;
  private renderCallback?: (deltaTime: number) => void;

  constructor(private config: RenderingEngineConfig = {}) {
    this.targetFrameTime = 1000 / (config.targetFPS || 60);
  }

  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    
    // Determine which renderer to use
    const mode = this.selectRenderMode();
    
    // Create appropriate renderer
    switch (mode) {
      case 'webgl':
        this.renderer = new WebGLRenderer();
        break;
      case 'canvas2d':
        this.renderer = new Canvas2DRenderer();
        break;
      default:
        throw new Error(`Unsupported render mode: ${mode}`);
    }

    await this.renderer.initialize(canvas);

    // Auto-start if configured
    if (this.config.autoStart !== false) {
      this.start();
    }

    // Handle resize
    this.setupResizeObserver();
  }

  private selectRenderMode(): RenderMode {
    const preferred = this.config.preferredMode;
    
    // If preferred mode is specified and supported, use it
    if (preferred) {
      if (preferred === 'webgl' && WebGLRenderer.isSupported()) {
        return 'webgl';
      }
      if (preferred === 'canvas2d' && Canvas2DRenderer.isSupported()) {
        return 'canvas2d';
      }
    }

    // Auto-detect best mode
    if (WebGLRenderer.isSupported()) {
      return 'webgl';
    }
    
    if (Canvas2DRenderer.isSupported()) {
      console.warn('WebGL not supported, falling back to Canvas2D');
      return 'canvas2d';
    }

    throw new Error('No suitable rendering mode available');
  }

  private setupResizeObserver(): void {
    if (!this.canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.resize(width, height);
      }
    });

    resizeObserver.observe(this.canvas);
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  }

  stop(): void {
    this.isRunning = false;
    
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = (): void => {
    if (!this.isRunning || !this.renderer) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Frame rate limiting
    if (deltaTime >= this.targetFrameTime) {
      // Call custom render callback if provided
      if (this.renderCallback) {
        this.renderCallback(deltaTime);
      }

      // Render frame
      this.renderer.render(deltaTime);
      
      this.lastTime = currentTime - (deltaTime % this.targetFrameTime);
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  resize(width: number, height: number): void {
    if (!this.renderer) return;
    this.renderer.resize(width, height);
  }

  onRender(callback: (deltaTime: number) => void): void {
    this.renderCallback = callback;
  }

  getRenderer(): Renderer | null {
    return this.renderer;
  }

  getMode(): RenderMode | null {
    return this.renderer?.mode || null;
  }

  getStats(): RenderStats | null {
    return this.renderer?.getStats() || null;
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  setTargetFPS(fps: number): void {
    this.targetFrameTime = 1000 / fps;
  }

  dispose(): void {
    this.stop();
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    this.canvas = null;
    this.renderCallback = undefined;
  }

  // Utility method to check if WebGL is being used
  isWebGL(): boolean {
    return this.renderer?.mode === 'webgl';
  }

  // Get the Three.js specific objects if using WebGL
  getWebGLContext(): WebGLRenderer | null {
    if (this.renderer instanceof WebGLRenderer) {
      return this.renderer;
    }
    return null;
  }
}