import React, { useEffect, useRef, useState } from 'react';
import type { Ticker as TickerType } from '@/types/studio';
import './Ticker.css';

interface TickerProps {
  config: TickerType;
}

export const Ticker: React.FC<TickerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Combine all ticker content into a single scrolling string
  const tickerContent = config.content.join(' • ');

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      setScrollWidth(textRef.current.scrollWidth);
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [tickerContent, config.fontSize]);

  useEffect(() => {
    // Update CSS variables for dynamic styling
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.setProperty('--bg-color', config.backgroundColor);
      element.style.setProperty('--text-color', config.textColor);
      element.style.setProperty('--font-size', `${config.fontSize}px`);
      
      // Calculate animation duration based on content length and speed (px per second)
      // Use total content width + container width for smooth looping
      const totalDistance = scrollWidth + containerWidth;
      const duration = totalDistance / config.speed;
      element.style.setProperty('--animation-duration', `${Math.max(duration, 5)}s`);
    }
  }, [config, scrollWidth, containerWidth]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!config.visible || config.content.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="ticker-container"
    >
      <div className="ticker-label">
        <span>BREAKING</span>
      </div>
      <div className="ticker-content">
        <div
          ref={textRef}
          className="ticker-text"
          style={{
            animation: config.animated && config.content.length > 0
              ? `tickerScroll var(--animation-duration, 30s) linear infinite`
              : 'none'
          }}
        >
          {/* Always duplicate content for seamless loop when animated */}
          <span>{tickerContent}</span>
          {config.animated && config.content.length > 0 && (
            <span style={{ marginLeft: '40px' }}>{tickerContent}</span>
          )}
        </div>
      </div>
    </div>
  );
};