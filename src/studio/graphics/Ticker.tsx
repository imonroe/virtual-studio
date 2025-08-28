import React, { useEffect, useRef, useState } from 'react';
import type { Ticker as TickerType } from '@types/studio';
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
      element.style.setProperty('--scroll-speed', `${config.speed}s`);
      
      // Calculate animation duration based on content length and speed
      const duration = Math.max(scrollWidth / config.speed, 10);
      element.style.setProperty('--animation-duration', `${duration}s`);
    }
  }, [config, scrollWidth]);

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
            animation: scrollWidth > containerWidth 
              ? `tickerScroll var(--animation-duration, 30s) linear infinite`
              : 'none'
          }}
        >
          {/* Duplicate content for seamless loop */}
          <span>{tickerContent}</span>
          {scrollWidth > containerWidth && (
            <span style={{ marginLeft: '100px' }}>{tickerContent}</span>
          )}
        </div>
      </div>
    </div>
  );
};