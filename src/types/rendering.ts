export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface RenderContext {
  canvas: HTMLCanvasElement;
  size: Size;
  pixelRatio: number;
}

export interface Layer {
  id: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  blendMode?: GlobalCompositeOperation;
}

export interface RenderStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  memory?: number;
}

export type RenderMode = 'webgl' | 'canvas2d' | 'css';

export interface Renderer {
  mode: RenderMode;
  initialize(canvas: HTMLCanvasElement): Promise<void>;
  render(deltaTime: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
  getStats(): RenderStats;
}