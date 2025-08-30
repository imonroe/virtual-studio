import React, { useEffect, useRef, useState } from 'react';
import type { LowerThird as LowerThirdType } from '@/types/studio';
import './LowerThird.css';

interface LowerThirdProps {
  config: LowerThirdType;
  isAnimating?: boolean;
}

export const LowerThird: React.FC<LowerThirdProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    let enterTimer: NodeJS.Timeout;
    
    if (!config.visible) {
      setAnimationClass('lower-third-exit');
      return;
    }

    // Reset any display:none that might have been set
    if (containerRef.current) {
      containerRef.current.style.display = 'block';
    }

    // Start with enter animation
    setAnimationClass('lower-third-enter');
    
    // Then transition to active state
    enterTimer = setTimeout(() => {
      setAnimationClass('lower-third-active');
    }, 50); // Slightly longer delay to ensure smooth transition

    return () => {
      if (enterTimer) clearTimeout(enterTimer);
    };
  }, [config.visible]);

  useEffect(() => {
    // Update CSS variables for dynamic styling
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.setProperty('--bg-color', config.style.backgroundColor);
      element.style.setProperty('--text-color', config.style.textColor);
      element.style.setProperty('--font-size', `${config.style.fontSize}px`);
      element.style.setProperty('--font-family', config.style.fontFamily);
      element.style.setProperty('--padding', `${config.style.padding}px`);
      element.style.setProperty('--border-radius', `${config.style.borderRadius}px`);
    }
  }, [config.style]);

  // Handle exit animation completion
  useEffect(() => {
    if (!config.visible && animationClass === 'lower-third-exit') {
      const hideTimer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }, 500);
      
      return () => clearTimeout(hideTimer);
    }
  }, [config.visible, animationClass]);

  const getPositionClass = () => {
    switch (config.position) {
      case 'left': return 'lower-third-left';
      case 'center': return 'lower-third-center';
      case 'right': return 'lower-third-right';
      default: return 'lower-third-left';
    }
  };

  const getAnimationClass = () => {
    switch (config.animation) {
      case 'slide': return 'animation-slide';
      case 'fade': return 'animation-fade';
      case 'scale': return 'animation-scale';
      default: return 'animation-slide';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`lower-third ${getPositionClass()} ${getAnimationClass()} ${animationClass} ${
        config.style.glassMorphism ? 'glass-morphism' : ''
      }`}
      style={{ display: config.visible || animationClass === 'lower-third-exit' ? 'block' : 'none' }}
    >
      <div className="lower-third-content">
        {config.title && (
          <div className="lower-third-title">
            {config.title}
          </div>
        )}
        {config.subtitle && (
          <div className="lower-third-subtitle">
            {config.subtitle}
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="lower-third-accent" />
      <div className="lower-third-glow" />
    </div>
  );
};