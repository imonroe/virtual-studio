import { BaseRenderer } from '../core/BaseRenderer';
import type { RenderMode } from '@/types/rendering';

export class Canvas2DRenderer extends BaseRenderer {
  mode: RenderMode = 'canvas2d';
  private ctx: CanvasRenderingContext2D | null = null;
  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;

  protected async onInitialize(): Promise<void> {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const context = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Better performance
      willReadFrequently: false
    });

    if (!context) {
      throw new Error('Could not get 2D context');
    }

    this.ctx = context;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Create offscreen canvas for double buffering if supported
    if (typeof OffscreenCanvas !== 'undefined') {
      this.offscreenCanvas = new OffscreenCanvas(
        this.canvas.width,
        this.canvas.height
      );
      this.offscreenCtx = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    }
  }

  render(deltaTime: number): void {
    if (!this.ctx) return;

    this.updateStats(deltaTime);

    const renderCtx = this.offscreenCtx || this.ctx;

    // Clear canvas
    renderCtx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    // Save state
    renderCtx.save();

    // Apply pixel ratio scaling
    renderCtx.scale(this.pixelRatio, this.pixelRatio);

    // Render content (will be extended by specific implementations)
    this.renderContent(renderCtx);

    // Restore state
    renderCtx.restore();

    // If using offscreen canvas, copy to main canvas
    if (this.offscreenCtx && this.ctx && this.offscreenCanvas) {
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
  }

  protected renderContent(_ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    // Override in subclasses
  }

  protected onResize(width: number, height: number): void {
    if (this.offscreenCanvas) {
      this.offscreenCanvas.width = width * this.pixelRatio;
      this.offscreenCanvas.height = height * this.pixelRatio;
    }
  }

  protected onDispose(): void {
    this.ctx = null;
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
  }

  // Utility methods for common 2D operations
  drawGradient(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
    angle: number = 0
  ): void {
    const gradient = this.createLinearGradient(ctx, x, y, width, height, angle);
    
    const step = 1 / (colors.length - 1);
    colors.forEach((color, i) => {
      gradient.addColorStop(i * step, color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }

  private createLinearGradient(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number
  ): CanvasGradient {
    const rad = (angle * Math.PI) / 180;
    const cx = x + width / 2;
    const cy = y + height / 2;
    const diagonal = Math.sqrt(width * width + height * height) / 2;
    
    const x0 = cx + Math.cos(rad + Math.PI) * diagonal;
    const y0 = cy + Math.sin(rad + Math.PI) * diagonal;
    const x1 = cx + Math.cos(rad) * diagonal;
    const y1 = cy + Math.sin(rad) * diagonal;
    
    return ctx.createLinearGradient(x0, y0, x1, y1);
  }

  // Check Canvas2D support (fallback option)
  static isSupported(): boolean {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('2d');
  }
}