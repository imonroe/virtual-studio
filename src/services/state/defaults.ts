import type { StudioBackground, GradientConfig } from '@/types/studio';

export const defaultGradientConfig: GradientConfig = {
  colors: ['#1a1a2e', '#16213e', '#0f3460'],
  angle: 135,
  type: 'linear',
  animated: true,
  animationSpeed: 0.5,
};

export const createDefaultBackground = (): StudioBackground => ({
  id: 'default-bg',
  type: 'gradient',
  visible: true,
  config: { ...defaultGradientConfig },
});
