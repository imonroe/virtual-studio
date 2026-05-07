import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Ticker as TickerType } from '@/types/studio';
import './Ticker.css';

interface TickerProps {
  config: TickerType;
}

export const Ticker: React.FC<TickerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLSpanElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  const tickerContent = config.content.join(' • ');
  // Treat undefined as animated so older saved tickers without the field still scroll.
  const isAnimated = config.animated !== false && config.content.length > 0;

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    const measure = () => {
      if (itemRef.current) {
        setItemWidth(itemRef.current.offsetWidth);
      }
    };
    measure();

    // Re-measure when fonts finish loading (offsetWidth before font swap is wrong)
    if ('fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [tickerContent, config.fontSize]);

  useEffect(() => {
    const handleResize = () => {
      if (itemRef.current) {
        setItemWidth(itemRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!config.visible || config.content.length === 0) {
    return null;
  }

  // Track translates from 0 to -itemWidth (one full copy worth) so the second
  // copy slides into the first copy's exact starting position — seamless loop.
  const speed = Math.max(config.speed, 1);
  const duration = itemWidth > 0 ? itemWidth / speed : 0;

  const containerStyle: React.CSSProperties = {
    background: config.backgroundColor,
    color: config.textColor,
    fontSize: `${config.fontSize}px`,
  };

  const trackStyle: React.CSSProperties = isAnimated && duration > 0
    ? {
        animationName: 'tickerScroll',
        animationDuration: `${duration}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }
    : { animation: 'none', transform: 'translateX(0)' };

  return (
    <div ref={containerRef} className="ticker-container" style={containerStyle}>
      <div className="ticker-label">
        <span>BREAKING</span>
      </div>
      <div className="ticker-content">
        <div ref={trackRef} className="ticker-text" style={trackStyle}>
          <span ref={itemRef} className="ticker-item">{tickerContent}</span>
          {isAnimated && (
            <span className="ticker-item" aria-hidden="true">{tickerContent}</span>
          )}
        </div>
      </div>
    </div>
  );
};
