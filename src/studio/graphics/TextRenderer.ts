export interface TextConfig {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  maxWidth?: number;
  shadow?: {
    blur: number;
    color: string;
    offsetX: number;
    offsetY: number;
  };
  outline?: {
    width: number;
    color: string;
  };
}

export class TextRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
  private pixelRatio: number;

  constructor(width: number, height: number, pixelRatio: number = window.devicePixelRatio) {
    this.pixelRatio = pixelRatio;
    
    // Create main canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    
    const ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    });
    
    if (!ctx) {
      throw new Error('Could not get 2D context for text rendering');
    }
    
    this.ctx = ctx;
    this.ctx.scale(pixelRatio, pixelRatio);
    
    // Create offscreen canvas for better performance if available
    if (typeof OffscreenCanvas !== 'undefined') {
      this.offscreenCanvas = new OffscreenCanvas(width * pixelRatio, height * pixelRatio);
      this.offscreenCtx = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
      if (this.offscreenCtx) {
        this.offscreenCtx.scale(pixelRatio, pixelRatio);
      }
    }
  }

  clear(): void {
    const ctx = this.offscreenCtx || this.ctx;
    ctx.clearRect(0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);
  }

  renderText(config: TextConfig): void {
    const ctx = this.offscreenCtx || this.ctx;
    
    ctx.save();
    
    // Set font properties
    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    ctx.textAlign = config.align || 'left';
    ctx.textBaseline = config.baseline || 'top';
    
    // Apply shadow if configured
    if (config.shadow) {
      ctx.shadowBlur = config.shadow.blur;
      ctx.shadowColor = config.shadow.color;
      ctx.shadowOffsetX = config.shadow.offsetX;
      ctx.shadowOffsetY = config.shadow.offsetY;
    }
    
    // Draw outline if configured
    if (config.outline) {
      ctx.strokeStyle = config.outline.color;
      ctx.lineWidth = config.outline.width;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      
      if (config.maxWidth) {
        ctx.strokeText(config.text, config.x, config.y, config.maxWidth);
      } else {
        ctx.strokeText(config.text, config.x, config.y);
      }
    }
    
    // Draw main text
    ctx.fillStyle = config.color;
    if (config.maxWidth) {
      ctx.fillText(config.text, config.x, config.y, config.maxWidth);
    } else {
      ctx.fillText(config.text, config.x, config.y);
    }
    
    ctx.restore();
    
    // Copy to main canvas if using offscreen
    if (this.offscreenCtx && this.offscreenCanvas) {
      this.ctx.clearRect(0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);
      this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);
    }
  }

  renderMultilineText(config: TextConfig & { lineHeight?: number }): void {
    const lines = this.wrapText(config.text, config.maxWidth || Infinity, config.fontSize, config.fontFamily);
    const lineHeight = config.lineHeight || config.fontSize * 1.2;
    
    lines.forEach((line, index) => {
      this.renderText({
        ...config,
        text: line,
        y: config.y + (index * lineHeight)
      });
    });
  }

  private wrapText(text: string, maxWidth: number, fontSize: number, fontFamily: string): string[] {
    const ctx = this.offscreenCtx || this.ctx;
    ctx.font = `${fontSize}px ${fontFamily}`;
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  measureText(text: string, fontSize: number, fontFamily: string): TextMetrics {
    const ctx = this.offscreenCtx || this.ctx;
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text);
  }

  resize(width: number, height: number): void {
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    
    if (this.offscreenCanvas && this.offscreenCtx) {
      this.offscreenCanvas.width = width * this.pixelRatio;
      this.offscreenCanvas.height = height * this.pixelRatio;
      this.offscreenCtx.scale(this.pixelRatio, this.pixelRatio);
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  toDataURL(type?: string, quality?: number): string {
    return this.canvas.toDataURL(type, quality);
  }

  dispose(): void {
    // Clean up resources
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
  }
}

// Utility class for animated text effects
export class AnimatedTextRenderer extends TextRenderer {
  private animations: Map<string, any> = new Map();

  typewriterEffect(
    config: TextConfig,
    duration: number,
    onComplete?: () => void
  ): void {
    const fullText = config.text;
    let currentIndex = 0;
    const startTime = performance.now();
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentIndex = Math.floor(fullText.length * progress);
      
      this.clear();
      this.renderText({
        ...config,
        text: fullText.substring(0, currentIndex)
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animate();
  }

  fadeInEffect(
    config: TextConfig,
    duration: number,
    onComplete?: () => void
  ): void {
    const startTime = performance.now();
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const alpha = progress;
      
      this.clear();
      const ctx = this.getCanvas().getContext('2d')!;
      ctx.globalAlpha = alpha;
      this.renderText(config);
      ctx.globalAlpha = 1;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animate();
  }
}