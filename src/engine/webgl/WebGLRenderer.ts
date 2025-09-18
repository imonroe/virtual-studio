import * as THREE from 'three';
import { BaseRenderer } from '../core/BaseRenderer';
import type { RenderMode } from '@/types/rendering';

export class WebGLRenderer extends BaseRenderer {
  mode: RenderMode = 'webgl';
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  // private composer: any = null; // Will implement post-processing later

  protected async onInitialize(): Promise<void> {
    if (!this.canvas) throw new Error('Canvas not initialized');

    // Initialize Three.js renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // For OBS capture
    });

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Create scene
    this.scene = new THREE.Scene();

    // Create orthographic camera for 2D rendering
    const aspect = this.size.width / this.size.height;
    this.camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      1,
      -1,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Enable extensions for advanced effects
    const gl = this.renderer.getContext();
    if (!gl) throw new Error('WebGL context not available');

    // Check for WebGL2
    if (!(gl instanceof WebGL2RenderingContext)) {
      console.warn('WebGL2 not available, falling back to WebGL1');
    }
  }

  render(deltaTime: number): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    this.updateStats(deltaTime);
    
    try {
      // Render the scene
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('🔍 WebGL: Render error:', error);
    }
  }

  protected onResize(width: number, height: number): void {
    if (!this.renderer || !this.camera) return;

    this.renderer.setSize(width, height);
    
    // Update camera aspect
    const aspect = width / height;
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.updateProjectionMatrix();
  }

  protected onDispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    if (this.scene) {
      // Clean up scene resources
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(m => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      this.scene = null;
    }
    
    this.camera = null;
  }

  // Public methods for scene manipulation
  getScene(): THREE.Scene | null {
    return this.scene;
  }

  getCamera(): THREE.Camera | null {
    return this.camera;
  }

  getThreeRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  // Check WebGL support
  static isSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
      );
    } catch {
      return false;
    }
  }
}