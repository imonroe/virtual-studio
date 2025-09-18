import * as THREE from 'three';
import type { GradientConfig } from '@/types/studio';
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
uniform float time;
uniform float animationSpeed;

varying vec2 vUv;

void main() {
  // Animated gradient with shifting pattern
  float shift = sin(time * animationSpeed) * 0.5 + 0.5;
  float t = mix(vUv.x, vUv.y, shift * 0.3);
  
  // Add subtle wave animation
  t += sin(vUv.x * 3.14159 + time * animationSpeed) * 0.05;
  t = clamp(t, 0.0, 1.0);
  
  vec3 color = mix(colorA, colorB, t);
  gl_FragColor = vec4(color, 1.0);
}
`;


export class GradientBackground {
  private mesh: THREE.Object3D | null = null;
  private material: THREE.ShaderMaterial | THREE.MeshBasicMaterial | null = null;
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
    
    // Temporarily disable shader materials to debug WebGL errors
    // TODO: Re-enable after fixing uniform/matrix issues
    const useShaders = false;
    
    if (useShaders && vertexShader && fragmentShader) {
      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.common,
          {
            colorA: { value: colors[0] || new THREE.Vector3(0.1, 0.1, 0.2) },
            colorB: { value: colors[1] || new THREE.Vector3(0.2, 0.2, 0.4) },
            time: { value: 0.0 },
            animationSpeed: { value: this.config.animationSpeed || 0.5 }
          }
        ]),
        side: THREE.DoubleSide,
        transparent: false
      });
    } else {
      // Use simple colored material without textures to avoid shader compilation
      const avgColor = new THREE.Color(
        (colors[0].x + colors[1].x) / 2,
        (colors[0].y + colors[1].y) / 2, 
        (colors[0].z + colors[1].z) / 2
      );
      this.material = new THREE.MeshBasicMaterial({
        color: avgColor,
        side: THREE.DoubleSide
      });
    }

    // Temporarily disable mesh creation to isolate the matrix error source
    console.log('🔍 DEBUG: Material created, skipping mesh creation to test matrix errors');
    
    // Create a minimal empty object instead of a mesh
    this.mesh = new THREE.Object3D();
    this.mesh.position.z = -1;

    return this.mesh as any; // Type assertion for simplified Object3D
  }

  update(_deltaTime: number): void {
    if (!this.material || !this.mesh || !this.config.animated) return;

    // Update animation uniforms if they exist (shader material only)
    try {
      if (this.material instanceof THREE.ShaderMaterial && 
          this.material.uniforms && 
          this.material.uniforms.time) {
        const currentTime = performance.now() / 1000;
        this.material.uniforms.time.value = currentTime - this.startTime;
      }
    } catch (error) {
      // Silently handle WebGL errors during disposal
    }
  }

  updateConfig(config: Partial<GradientConfig>): void {
    // Create a new config object to avoid modifying readonly properties
    this.config = { ...this.config, ...config };

    if (this.material instanceof THREE.ShaderMaterial && this.material.uniforms) {
      if (config.colors) {
        const colors = config.colors.map(this.hexToVec3);
        if (this.material.uniforms.colorA) {
          this.material.uniforms.colorA.value = colors[0] || this.material.uniforms.colorA.value;
        }
        if (this.material.uniforms.colorB) {
          this.material.uniforms.colorB.value = colors[1] || this.material.uniforms.colorB.value;
        }
      }

      // Update animation uniforms if they exist
      if (config.animationSpeed !== undefined && this.material.uniforms.animationSpeed) {
        this.material.uniforms.animationSpeed.value = config.animationSpeed;
      }
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


  // private getGradientTypeValue(): number {
  //   switch (this.config.type) {
  //     case 'linear': return 0;
  //     case 'radial': return 1;
  //     case 'conic': return 2;
  //     default: return 0;
  //   }
  // }

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

  getMesh(): THREE.Object3D | null {
    return this.mesh;
  }
}