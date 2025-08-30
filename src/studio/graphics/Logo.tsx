import React from 'react';
import type { LogoConfig } from '@/types/branding';

interface LogoProps {
  config: LogoConfig;
}

export const Logo: React.FC<LogoProps> = ({ config }) => {
  if (!config.visible || !config.imageUrl) {
    return null;
  }

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: `${config.size}px`,
      height: `${config.size}px`,
      opacity: config.opacity,
      zIndex: 10,
      objectFit: 'contain',
      userSelect: 'none',
      pointerEvents: 'none'
    };

    switch (config.position) {
      case 'top-left':
        return {
          ...baseStyles,
          top: `${config.offset.y}px`,
          left: `${config.offset.x}px`
        };
      case 'top-right':
        return {
          ...baseStyles,
          top: `${config.offset.y}px`,
          right: `${config.offset.x}px`
        };
      case 'bottom-left':
        return {
          ...baseStyles,
          bottom: `${config.offset.y}px`,
          left: `${config.offset.x}px`
        };
      case 'bottom-right':
        return {
          ...baseStyles,
          bottom: `${config.offset.y}px`,
          right: `${config.offset.x}px`
        };
    }
  };

  return (
    <img
      src={config.imageUrl}
      alt={`Logo: ${config.name}`}
      style={getPositionStyles()}
      draggable={false}
    />
  );
};