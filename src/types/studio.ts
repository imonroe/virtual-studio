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
  particleCount: number;
  particleColor: string;
  particleSpeed: number;
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
  format: '12h' | '24h';
  timezone: string;
  showSeconds: boolean;
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

export interface StudioPreset {
  id: string;
  name: string;
  background: StudioBackground;
  lowerThird?: LowerThird;
  ticker?: Ticker;
  clock?: Clock;
  liveIndicator?: LiveIndicator;
}