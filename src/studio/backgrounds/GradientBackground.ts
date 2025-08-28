import * as THREE from 'three';
import type { GradientConfig } from '@types/studio';
// import vertexShader from '@engine/webgl/shaders/gradient.vert';
// import fragmentShader from '@engine/webgl/shaders/gradient.frag';

// Inline shaders for testing
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 colorA;
uniform vec3 colorB;

varying vec2 vUv;

void main() {
  // Simple horizontal gradient
  vec3 color = mix(colorA, colorB, vUv.x);
  gl_FragColor = vec4(color, 1.0);
}
`;

console.log('Using inline shaders');

export class GradientBackground {
  private mesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private config: GradientConfig;
  private startTime: number = 0;

  constructor(config: GradientConfig) {
    this.config = config;
    this.startTime = performance.now() / 1000;
  }

  create(): THREE.Mesh {
    // Create geometry that covers the entire view
    this.geometry = new THREE.PlaneGeometry(4, 2, 1, 1);

    // Parse colors and convert to vec3
    const colors = this.config.colors.map(this.hexToVec3);
    
    // Try to create shader material, fallback to basic material
    if (vertexShader && fragmentShader) {
      console.log('Creating shader material with GLSL shaders');
      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          colorA: { value: colors[0] || new THREE.Vector3(0.1, 0.1, 0.2) },
          colorB: { value: colors[1] || new THREE.Vector3(0.2, 0.2, 0.4) }
        },
        side: THREE.DoubleSide,
        transparent: false
      });
    } else {
      console.log('Falling back to basic material');
      // Fallback to basic material
      this.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(this.config.colors[0] || '#1a1a2e'),
        side: THREE.DoubleSide
      });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.z = -1; // Place behind other elements

    console.log('GradientBackground mesh created:', this.mesh);
    return this.mesh;
  }

  update(deltaTime: number): void {
    if (!this.material || !this.config.animated) return;

    // Since we removed the time uniform from the simplified shader,
    // we'll skip animation updates for now
    // const currentTime = performance.now() / 1000;
    // this.material.uniforms.time.value = currentTime - this.startTime;
  }

  updateConfig(config: Partial<GradientConfig>): void {
    Object.assign(this.config, config);

    if (this.material && this.material.uniforms) {
      if (config.colors) {
        const colors = config.colors.map(this.hexToVec3);
        if (this.material.uniforms.colorA) {
          this.material.uniforms.colorA.value = colors[0] || this.material.uniforms.colorA.value;
        }
        if (this.material.uniforms.colorB) {
          this.material.uniforms.colorB.value = colors[1] || this.material.uniforms.colorB.value;
        }
      }

      // Skip other uniform updates since they don't exist in our simplified shader
    }
  }

  setVisible(visible: boolean): void {
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  private hexToVec3(hex: string): THREE.Vector3 {
    const color = new THREE.Color(hex);
    return new THREE.Vector3(color.r, color.g, color.b);
  }

  private getGradientTypeValue(): number {
    switch (this.config.type) {
      case 'linear': return 0;
      case 'radial': return 1;
      case 'conic': return 2;
      default: return 0;
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