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
      const newScrollWidth = textRef.current.scrollWidth;
      const newContainerWidth = containerRef.current.offsetWidth;
      setScrollWidth(newScrollWidth);
      setContainerWidth(newContainerWidth);
    }
  }, [tickerContent, config.fontSize]);

  useEffect(() => {
    // Update CSS variables for dynamic styling
    if (containerRef.current) {
      const element = containerRef.current;
      element.style.setProperty('--bg-color', config.backgroundColor);
      element.style.setProperty('--text-color', config.textColor);
      element.style.setProperty('--font-size', `${config.fontSize}px`);
      
      // Calculate animation duration for seamless looping
      // For seamless looping with pixel-based animation, the text needs to move
      // from its starting position until the second copy appears in the first copy's place
      const loopDistance = scrollWidth + 40; // text width + margin for seamless transition
      const duration = loopDistance / config.speed;
      const finalDuration = Math.max(duration, 2);
      
      // Set CSS custom properties for pixel-based animation
      element.style.setProperty('--animation-duration', `${finalDuration}s`);
      element.style.setProperty('--loop-distance', `-${loopDistance}px`);
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