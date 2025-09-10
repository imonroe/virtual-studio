export interface StudioBackground {
  id: string;
  type: 'gradient' | 'solid' | 'image' | 'animated';
  visible: boolean;
  config: GradientConfig | SolidConfig | ImageConfig | AnimatedConfig;
}

export interface GradientConfig {
  colors: string[];
  angle: number;
  type: 'linear' | 'radial' | 'conic';
  animated: boolean;
  animationSpeed: number;
}

export interface SolidConfig {
  color: string;
}

export interface ImageConfig {
  url: string;
  fit: 'cover' | 'contain' | 'fill';
  position: { x: number; y: number };
}

export interface AnimatedConfig {
  variant: 'particles' | 'waves' | 'neural';
  particles?: {
    count: number;
    color: string;
    speed: number;
  };
  waves?: {
    count: number; // 2-8 waves
    frequencies: number[];
    amplitudes: number[];
    speed: number;
    colors: {
      primary: string; // #646cff
      secondary: string; // #8b5cf6  
      highlight: string; // #00f5ff
    };
    edgeCoverage: { top: number; bottom: number };
    quality: 'auto' | 'low' | 'medium' | 'high';
  };
  neural?: {
    nodeCount: number; // 15-45 nodes
    nodeSize: number; // Node circle radius in pixels
    connectionDensity: number; // 0.2-0.8, controls network connectivity
    dataFlowSpeed: number; // 0.1-2.0, data packet travel speed
    packetCount: number; // 10-50, simultaneous traveling packets
    colors: {
      background: string; // Deep blue #1a1a2e
      nodeCore: string; // Accent blue #646cff  
      nodeGlow: string; // Cyan highlights #00f5ff
      connection: string; // Connection lines #646cff + alpha
      packet: string; // Data packet color #00f5ff
    };
    quality: 'auto' | 'low' | 'medium' | 'high';
  };
  backgroundGradient?: GradientConfig;
}

export interface LowerThird {
  id: string;
  visible: boolean;
  title: string;
  subtitle: string;
  position: 'left' | 'center' | 'right';
  animation: 'slide' | 'fade' | 'scale';
  style: LowerThirdStyle;
}

export interface LowerThirdStyle {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  padding: number;
  borderRadius: number;
  glassMorphism: boolean;
}

export interface Ticker {
  id: string;
  visible: boolean;
  content: string[];
  speed: number;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export interface Clock {
  visible: boolean;
  showTime: boolean;
  format: '12h' | '24h';
  timezone: string;
  showSeconds: boolean;
  showDate: boolean;
  dateFormat: 'short' | 'medium' | 'long';
  position: { x: number; y: number };
  style: {
    color: string;
    fontSize: number;
    fontFamily: string;
  };
}

export interface LiveIndicator {
  visible: boolean;
  text: string;
  blinking: boolean;
  color: string;
  position: { x: number; y: number };
}

// Re-export branding types for consistency
export type { LogoPosition, LogoConfig, BrandingState } from './branding';

// Import for direct use
import type { BrandingState } from './branding';

export interface StudioPreset {
  id: string;
  name: string;
  background: StudioBackground;
  lowerThird?: LowerThird;
  ticker?: Ticker;
  clock?: Clock;
  liveIndicator?: LiveIndicator;
  branding?: BrandingState;
}