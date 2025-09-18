import React from 'react';
import type { AnimatedConfig } from '@/types/studio';

interface CSSWavesBackgroundProps {
  config: AnimatedConfig;
}

export const CSSWavesBackground: React.FC<CSSWavesBackgroundProps> = ({ config }) => {
  const wavesConfig = config.waves || {
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

  const animationDuration = `${8 / wavesConfig.speed}s`;
  
  // Create wave layers with different frequencies and colors
  const waveElements = Array.from({ length: Math.min(wavesConfig.count, 4) }, (_, index) => {
    // Interpolate colors for each wave
    const colorMix = index / (wavesConfig.count - 1);
    const isHighlight = index === 0; // First wave gets highlight color
    
    const backgroundColor = isHighlight 
      ? wavesConfig.colors.highlight 
      : (colorMix < 0.5 
        ? wavesConfig.colors.primary 
        : wavesConfig.colors.secondary);

    return (
      <div
        key={index}
        className={`wave-layer wave-${index}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.6 - (index * 0.1),
          backgroundImage: `linear-gradient(90deg, 
            transparent, 
            ${backgroundColor}40, 
            transparent)`,
          transform: `translateY(${index * 5}px)`,
          animationName: `waveMotion${index}`,
          animationDuration: animationDuration,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: `${index * 0.2}s`,
        }}
      />
    );
  });

  return (
    <div 
      className="css-waves-background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      {/* Top edge waves */}
      <div 
        className="waves-top"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${wavesConfig.edgeCoverage.top * 100}%`,
          overflow: 'hidden'
        }}
      >
        {waveElements}
      </div>

      {/* Bottom edge waves */}
      <div 
        className="waves-bottom"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${wavesConfig.edgeCoverage.bottom * 100}%`,
          overflow: 'hidden',
          transform: 'scaleY(-1)' // Flip for bottom waves
        }}
      >
        {waveElements}
      </div>

      {/* CSS animations for wave motion */}
      <style>{`
        @keyframes waveMotion0 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(20px) translateY(-5px); }
          50% { transform: translateX(0px) translateY(-10px); }
          75% { transform: translateX(-20px) translateY(-5px); }
        }
        
        @keyframes waveMotion1 {
          0%, 100% { transform: translateX(0px) translateY(5px); }
          33% { transform: translateX(-15px) translateY(0px); }
          66% { transform: translateX(15px) translateY(-5px); }
        }
        
        @keyframes waveMotion2 {
          0%, 100% { transform: translateX(0px) translateY(10px); }
          40% { transform: translateX(25px) translateY(5px); }
          80% { transform: translateX(-10px) translateY(0px); }
        }
        
        @keyframes waveMotion3 {
          0%, 100% { transform: translateX(0px) translateY(15px); }
          50% { transform: translateX(-30px) translateY(10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wave-layer {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};