import * as THREE from 'three';
import type { ImageConfig } from '@/types/studio';

export class ImageBackground {
  private mesh: THREE.Mesh | null = null;
  private material: THREE.MeshBasicMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private texture: THREE.Texture | null = null;
  private config: ImageConfig;

  constructor(config: ImageConfig) {
    this.config = config;
  }

  async create(): Promise<THREE.Mesh> {
    console.log('Creating ImageBackground with config:', this.config);
    
    // TEMP DEBUG: Create a simple test cube that should definitely be visible
    console.log('CREATING SIMPLE RED TEST CUBE');
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Bright red
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 1); // Put it in front of camera

    console.log('RED TEST CUBE created at position:', this.mesh.position);
    return this.mesh;
  }

  private async loadTexture(): Promise<void> {
    if (!this.config.url) {
      console.warn('No image URL provided for ImageBackground');
      return;
    }

    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        this.config.url,
        (texture) => {
          this.texture = texture;
          this.texture.minFilter = THREE.LinearFilter;
          this.texture.magFilter = THREE.LinearFilter;
          this.texture.wrapS = THREE.ClampToEdgeWrapping;
          this.texture.wrapT = THREE.ClampToEdgeWrapping;
          console.log('Image texture loaded successfully:', {
            width: texture.image.width,
            height: texture.image.height,
            format: texture.format,
            type: texture.type
          });
          resolve();
        },
        (progress) => {
          console.log('Loading image texture...', progress);
        },
        (error) => {
          console.error('Failed to load image texture:', error);
          this.texture = null;
          resolve(); // Don't reject, just continue without texture
        }
      );
    });
  }

  private applyImageFit(): void {
    if (!this.texture || !this.mesh) {
      console.log('Cannot apply image fit - missing texture or mesh:', { 
        hasTexture: !!this.texture, 
        hasMesh: !!this.mesh 
      });
      return;
    }

    console.log('Applying image fit:', this.config.fit);
    const imageAspect = this.texture.image.width / this.texture.image.height;
    const stageAspect = 16 / 9; // Our stage is 16:9
    console.log('Image aspect:', imageAspect, 'Stage aspect:', stageAspect);

    switch (this.config.fit) {
      case 'cover': {
        // Scale to cover the entire stage, crop if necessary
        if (imageAspect > stageAspect) {
          // Image is wider, scale based on height
          const scale = stageAspect / imageAspect;
          this.texture.repeat.set(scale, 1);
          this.texture.offset.set((1 - scale) / 2, 0);
        } else {
          // Image is taller, scale based on width
          const scale = imageAspect / stageAspect;
          console.log('Image is taller than stage, applying scale:', scale);
          this.texture.repeat.set(1, scale);
          this.texture.offset.set(0, (1 - scale) / 2);
          console.log('Texture repeat:', this.texture.repeat, 'offset:', this.texture.offset);
        }
        break;
      }
      case 'contain': {
        // Scale to fit entirely within the stage
        if (imageAspect > stageAspect) {
          // Image is wider, fit to width
          const scale = stageAspect / imageAspect;
          this.mesh.scale.set(1, scale, 1);
        } else {
          // Image is taller, fit to height
          const scale = imageAspect / stageAspect;
          this.mesh.scale.set(scale, 1, 1);
        }
        break;
      }
      case 'fill': {
        // Stretch to fill (default behavior, no changes needed)
        this.texture.repeat.set(1, 1);
        this.texture.offset.set(0, 0);
        this.mesh.scale.set(1, 1, 1);
        break;
      }
    }

    // Apply position offset
    if (this.config.position) {
      this.mesh.position.x = this.config.position.x * 0.01; // Convert percentage to world units
      this.mesh.position.y = this.config.position.y * 0.01;
    }

    // Force material update
    if (this.material) {
      this.material.needsUpdate = true;
    }
  }

  update(_deltaTime: number): void {
    // Static images don't need updates
    // Future: Could add subtle animations like ken burns effect
  }

  updateConfig(config: Partial<ImageConfig>): void {
    const oldUrl = this.config.url;
    this.config = { ...this.config, ...config };

    // If URL changed, reload texture
    if (config.url && config.url !== oldUrl) {
      this.loadTexture().then(() => {
        if (this.material && this.texture) {
          this.material.map = this.texture;
          this.material.needsUpdate = true;
          this.applyImageFit();
        }
      }).catch(console.error);
    }

    // If fit or position changed, reapply settings
    if (config.fit !== undefined || config.position !== undefined) {
      this.applyImageFit();
    }
  }

  setVisible(visible: boolean): void {
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  dispose(): void {
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }

    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }

    if (this.material) {
      this.material.dispose();
      this.material = null;
    }

    this.mesh = null;

    // Note: No need to clean up data URLs like blob URLs
  }

  getMesh(): THREE.Mesh | null {
    return this.mesh;
  }
}