import * as THREE from 'three';
import type { SolidConfig } from '@/types/studio';

export class SolidBackground {
  private mesh: THREE.Mesh | null = null;
  private material: THREE.MeshBasicMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private config: SolidConfig;

  constructor(config: SolidConfig) {
    this.config = config;
  }

  create(): THREE.Mesh {
    // Create geometry that covers the entire view (same as GradientBackground)
    this.geometry = new THREE.PlaneGeometry(4, 2, 1, 1);

    // Use MeshBasicMaterial for optimal performance with solid colors
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.config.color),
      side: THREE.DoubleSide,
      transparent: false
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.z = -1; // Place behind other elements

    console.log('SolidBackground mesh created with color:', this.config.color);
    return this.mesh;
  }

  update(_deltaTime: number): void {
    // Solid backgrounds don't need animation updates
    // This method exists for interface consistency
    void _deltaTime; // Explicitly ignore parameter
  }

  updateConfig(config: Partial<SolidConfig>): void {
    Object.assign(this.config, config);

    // Update material color if it changed
    if (config.color && this.material) {
      this.material.color.set(new THREE.Color(config.color));
      console.log('SolidBackground color updated to:', config.color);
    }
  }

  setVisible(visible: boolean): void {
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  dispose(): void {
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }

    if (this.material) {
      this.material.dispose();
      this.material = null;
    }

    this.mesh = null;
  }

  getMesh(): THREE.Mesh | null {
    return this.mesh;
  }
}