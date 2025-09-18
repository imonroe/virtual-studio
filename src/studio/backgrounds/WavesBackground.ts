import * as THREE from 'three';
import type { AnimatedConfig } from '@/types/studio';

// Vertex shader for full-screen quad
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader for geometric waves
const fragmentShader = `
uniform float time;
uniform int waveCount;
uniform float frequencies[8];
uniform float amplitudes[8];
uniform float speed;
uniform vec3 colorPrimary;
uniform vec3 colorSecondary;
uniform vec3 colorHighlight;
uniform vec2 edgeCoverage;
uniform vec2 resolution;

varying vec2 vUv;

float wave(vec2 pos, float frequency, float amplitude, float phase) {
  return amplitude * sin(pos.x * frequency + phase);
}

vec3 calculateWaveColor(vec2 pos, float waveValue, float edgeFactor) {
  // Create interference patterns
  float intensity = abs(waveValue) * edgeFactor;
  
  // Color mixing based on wave intensity
  vec3 baseColor = mix(colorPrimary, colorSecondary, intensity);
  
  // Add highlights for interference peaks
  float highlight = smoothstep(0.7, 1.0, intensity);
  baseColor = mix(baseColor, colorHighlight, highlight * 0.3);
  
  return baseColor;
}

void main() {
  vec2 pos = vUv;
  vec2 screenPos = gl_FragCoord.xy / resolution;
  
  // Calculate edge masks for top and bottom areas
  float topMask = smoothstep(0.0, edgeCoverage.x, 1.0 - pos.y);
  float bottomMask = smoothstep(0.0, edgeCoverage.y, pos.y);
  float edgeMask = max(topMask, bottomMask);
  
  if (edgeMask < 0.01) {
    // Transparent in middle area
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
  
  // Calculate wave interference
  float waveSum = 0.0;
  float phaseOffset = time * speed;
  
  for (int i = 0; i < 8; i++) {
    if (i >= waveCount) break;
    
    float freq = frequencies[i];
    float amp = amplitudes[i];
    float phase = phaseOffset + float(i) * 0.5;
    
    // Create waves along x-axis with slight y variation
    float w = wave(vec2(pos.x * 6.28318, pos.y * 2.0), freq, amp, phase);
    waveSum += w;
  }
  
  // Normalize wave value
  waveSum = waveSum / float(waveCount);
  
  // Calculate final color
  vec3 color = calculateWaveColor(pos, waveSum, edgeMask);
  
  // Apply edge mask to alpha for smooth blending
  float alpha = edgeMask * 0.8;
  
  gl_FragColor = vec4(color, alpha);
}
`;

export class WavesBackground {
  private mesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private config: AnimatedConfig;
  private startTime: number = 0;

  constructor(config: AnimatedConfig) {
    this.config = config;
    this.startTime = performance.now() / 1000;
  }

  create(): THREE.Mesh {
    // Create full-screen quad geometry
    this.geometry = new THREE.PlaneGeometry(4, 2, 1, 1);

    // Get waves config with defaults
    const wavesConfig = this.config.waves || this.getDefaultWavesConfig();

    // Temporarily disable shader material to debug WebGL errors
    // TODO: Re-enable after fixing uniform/matrix issues
    const useShaders = false;
    
    if (useShaders) {
      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0.0 },
          waveCount: { value: Math.min(wavesConfig.count, 8) },
          frequencies: { value: this.padArray(wavesConfig.frequencies, 8, 1.0) },
          amplitudes: { value: this.padArray(wavesConfig.amplitudes, 8, 0.5) },
          speed: { value: wavesConfig.speed },
          colorPrimary: { value: this.hexToVec3(wavesConfig.colors.primary) },
          colorSecondary: { value: this.hexToVec3(wavesConfig.colors.secondary) },
          colorHighlight: { value: this.hexToVec3(wavesConfig.colors.highlight) },
          edgeCoverage: { value: new THREE.Vector2(wavesConfig.edgeCoverage.top, wavesConfig.edgeCoverage.bottom) },
          resolution: { value: new THREE.Vector2(1920, 1080) }
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending
      });
    } else {
      // Use basic material with wave-like color
      this.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(wavesConfig.colors.primary),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      }) as any; // Type assertion to match expected ShaderMaterial type
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material!);
    this.mesh.position.z = -1; // Place behind other elements

    return this.mesh;
  }

  update(_deltaTime: number): void {
    if (!this.material || !this.mesh || !this.material.uniforms) return;

    try {
      if (this.material instanceof THREE.ShaderMaterial && 
          this.material.uniforms.time) {
        const currentTime = performance.now() / 1000;
        this.material.uniforms.time.value = currentTime - this.startTime;
      }
    } catch (error) {
      // Silently handle WebGL errors during disposal
    }
    
    void _deltaTime; // Explicitly ignore parameter
  }

  updateConfig(config: Partial<AnimatedConfig>): void {
    // Create a new config object to avoid modifying readonly properties
    this.config = { ...this.config, ...config };

    if (!this.material || !this.material.uniforms || !config.waves) return;

    const wavesConfig = config.waves;

    // Update shader uniforms
    if (wavesConfig.count !== undefined) {
      this.material.uniforms.waveCount.value = Math.min(wavesConfig.count, 8);
    }
    if (wavesConfig.frequencies) {
      this.material.uniforms.frequencies.value = this.padArray(wavesConfig.frequencies, 8, 1.0);
    }
    if (wavesConfig.amplitudes) {
      this.material.uniforms.amplitudes.value = this.padArray(wavesConfig.amplitudes, 8, 0.5);
    }
    if (wavesConfig.speed !== undefined) {
      this.material.uniforms.speed.value = wavesConfig.speed;
    }
    if (wavesConfig.colors) {
      this.material.uniforms.colorPrimary.value.copy(this.hexToVec3(wavesConfig.colors.primary));
      this.material.uniforms.colorSecondary.value.copy(this.hexToVec3(wavesConfig.colors.secondary));
      this.material.uniforms.colorHighlight.value.copy(this.hexToVec3(wavesConfig.colors.highlight));
    }
    if (wavesConfig.edgeCoverage) {
      this.material.uniforms.edgeCoverage.value.set(wavesConfig.edgeCoverage.top, wavesConfig.edgeCoverage.bottom);
    }
  }

  setVisible(visible: boolean): void {
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  private getDefaultWavesConfig() {
    return {
      count: 4,
      frequencies: [1.0, 1.5, 2.0, 2.5],
      amplitudes: [0.5, 0.3, 0.4, 0.2],
      speed: 1.0,
      colors: {
        primary: '#646cff',
        secondary: '#8b5cf6',
        highlight: '#00f5ff'
      },
      edgeCoverage: { top: 0.1, bottom: 0.15 },
      quality: 'auto' as const
    };
  }

  private hexToVec3(hex: string): THREE.Vector3 {
    const color = new THREE.Color(hex);
    return new THREE.Vector3(color.r, color.g, color.b);
  }

  private padArray(arr: number[], length: number, defaultValue: number): number[] {
    const result = [...arr];
    while (result.length < length) {
      result.push(defaultValue);
    }
    return result.slice(0, length);
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