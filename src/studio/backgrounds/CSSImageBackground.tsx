import React from 'react';
import type { ImageConfig } from '@/types/studio';

interface CSSImageBackgroundProps {
  config: ImageConfig;
  visible: boolean;
}

export const CSSImageBackground: React.FC<CSSImageBackgroundProps> = ({ config, visible }) => {
  if (!visible || !config.url) {
    return null;
  }

  const getObjectFit = (): string => {
    switch (config.fit) {
      case 'cover': return 'cover';
      case 'contain': return 'contain';
      case 'fill': return 'fill';
      default: return 'cover';
    }
  };

  const getObjectPosition = (): string => {
    const x = config.position?.x || 0;
    const y = config.position?.y || 0;
    return `${x}% ${y}%`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Above canvas but behind overlays
        overflow: 'hidden'
      }}
    >
      <img
        src={config.url}
        alt="Background"
        style={{
          width: '100%',
          height: '100%',
          objectFit: getObjectFit() as React.CSSProperties['objectFit'],
          objectPosition: getObjectPosition(),
          display: 'block'
        }}
        onLoad={() => console.log('Image background loaded successfully')}
        onError={(e) => console.error('Image background failed to load:', e)}
      />
    </div>
  );
};