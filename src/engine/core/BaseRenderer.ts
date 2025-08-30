import type { Renderer, RenderMode, RenderStats, Size } from '@/types/rendering';

export abstract class BaseRenderer implements Renderer {
  protected canvas: HTMLCanvasElement | null = null;
  protected size: Size = { width: 0, height: 0 };
  protected pixelRatio: number = window.devicePixelRatio || 1;
  protected frameCount: number = 0;
  protected lastFrameTime: number = 0;
  protected fps: number = 0;
  protected frameTime: number = 0;
  protected isInitialized: boolean = false;

  abstract mode: RenderMode;

  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    this.updateCanvasSize();
    this.isInitialized = true;
    
    await this.onInitialize();
  }

  protected abstract onInitialize(): Promise<void>;

  abstract render(deltaTime: number): void;

  resize(width: number, height: number): void {
    this.size = { width, height };
    this.updateCanvasSize();
    this.onResize(width, height);
  }

  protected abstract onResize(width: number, height: number): void;

  protected updateCanvasSize(): void {
    if (!this.canvas) return;
    
    const { width, height } = this.size;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  protected updateStats(deltaTime: number): void {
    this.frameCount++;
    this.frameTime = deltaTime;
    
    const now = performance.now();
    if (now - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
    }
  }

  getStats(): RenderStats {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      drawCalls: 0,
      memory: (performance as any).memory?.usedJSHeapSize
    };
  }

  dispose(): void {
    this.onDispose();
    this.canvas = null;
    this.isInitialized = false;
  }

  protected abstract onDispose(): void;
}