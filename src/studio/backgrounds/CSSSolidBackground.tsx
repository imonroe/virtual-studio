import React from 'react';
import type { SolidConfig } from '@/types/studio';

interface CSSSolidBackgroundProps {
  config: SolidConfig;
}

export const CSSSolidBackground: React.FC<CSSSolidBackgroundProps> = ({ config }) => {
  return (
    <div 
      className="css-solid-background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: config.color,
        zIndex: 1
      }}
    />
  );
};