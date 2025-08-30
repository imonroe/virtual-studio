import React, { useMemo, useEffect, useRef } from 'react';
import type { GradientConfig } from '@/types/studio';
import './CSSGradientBackground.css';

interface CSSGradientBackgroundProps {
  config: GradientConfig;
}

export const CSSGradientBackground: React.FC<CSSGradientBackgroundProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const gradientStyle = useMemo(() => {
    const { colors, angle, type } = config;
    
    let gradient = '';
    const colorStops = colors.join(', ');
    
    switch (type) {
      case 'linear':
        gradient = `linear-gradient(${angle}deg, ${colorStops})`;
        break;
      case 'radial':
        gradient = `radial-gradient(circle at center, ${colorStops})`;
        break;
      case 'conic':
        gradient = `conic-gradient(from ${angle}deg at 50% 50%, ${colorStops})`;
        break;
    }
    
    return {
      background: gradient,
      backgroundSize: config.animated ? '200% 200%' : '100% 100%',
      animationDuration: config.animated ? `${20 / config.animationSpeed}s` : undefined
    };
  }, [config]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !config.animated) return;
    
    // Add animation class
    element.classList.add('animated-gradient');
    
    return () => {
      element.classList.remove('animated-gradient');
    };
  }, [config.animated]);

  return (
    <div 
      ref={containerRef}
      className="css-gradient-background"
      style={gradientStyle}
    >
      {config.animated && (
        <div className="gradient-overlay" />
      )}
    </div>
  );
};