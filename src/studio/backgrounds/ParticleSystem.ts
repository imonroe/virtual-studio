import * as THREE from 'three';
import vertexShader from '@engine/webgl/shaders/particles.vert';
import fragmentShader from '@engine/webgl/shaders/particles.frag';

export interface ParticleConfig {
  count: number;
  color: string;
  speed: number;
  size: number;
  opacity: number;
}

export class ParticleSystem {
  private mesh: THREE.Points | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private config: ParticleConfig;
  private startTime: number = 0;

  constructor(config: ParticleConfig) {
    this.config = config;
    this.startTime = performance.now() / 1000;
  }

  create(): THREE.Points {
    this.geometry = new THREE.BufferGeometry();

    // Create particle positions
    const positions = new Float32Array(this.config.count * 3);
    const sizes = new Float32Array(this.config.count);
    const alphas = new Float32Array(this.config.count);
    const velocities = new Float32Array(this.config.count * 3);

    for (let i = 0; i < this.config.count; i++) {
      const i3 = i * 3;

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;

      // Random sizes
      sizes[i] = this.config.size * (0.5 + Math.random() * 1.5);

      // Random alphas
      alphas[i] = this.config.opacity * (0.3 + Math.random() * 0.7);

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = 0;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        speed: { value: this.config.speed },
        color: { value: new THREE.Color(this.config.color) },
        resolution: { value: new THREE.Vector2(1920, 1080) }
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexColors: false,
      depthWrite: false,
      depthTest: true
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false; // Always render particles

    return this.mesh;
  }

  update(_deltaTime: number): void {
    if (!this.material) return;

    const currentTime = performance.now() / 1000;
    this.material.uniforms.time.value = currentTime - this.startTime;
  }

  updateConfig(config: Partial<ParticleConfig>): void {
    // Create a new config object to avoid modifying readonly properties
    this.config = { ...this.config, ...config };

    if (this.material) {
      if (config.color) {
        this.material.uniforms.color.value = new THREE.Color(config.color);
      }
      if (config.speed !== undefined) {
        this.material.uniforms.speed.value = config.speed;
      }
    }

    // Recreate geometry if particle count changed
    if (config.count !== undefined && config.count !== this.config.count) {
      this.recreateGeometry();
    }
  }

  private recreateGeometry(): void {
    if (this.geometry) {
      this.geometry.dispose();
    }

    // This would require rebuilding the entire particle system
    // For now, we'll just update the material properties
    console.log('Particle count change requires system recreation');
  }

  setResolution(width: number, height: number): void {
    if (this.material) {
      this.material.uniforms.resolution.value.set(width, height);
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

  getMesh(): THREE.Points | null {
    return this.mesh;
  }

  // Preset configurations
  static presets = {
    subtle: {
      count: 50,
      color: '#ffffff',
      speed: 0.1,
      size: 2,
      opacity: 0.3
    },
    snow: {
      count: 100,
      color: '#ffffff',
      speed: 0.2,
      size: 3,
      opacity: 0.6
    },
    stars: {
      count: 80,
      color: '#ffff88',
      speed: 0.05,
      size: 1.5,
      opacity: 0.8
    },
    dust: {
      count: 200,
      color: '#cccccc',
      speed: 0.15,
      size: 1,
      opacity: 0.2
    },
    magic: {
      count: 60,
      color: '#ff88ff',
      speed: 0.3,
      size: 4,
      opacity: 0.5
    }
  };
}