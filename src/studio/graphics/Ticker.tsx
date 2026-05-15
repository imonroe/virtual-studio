import React, { useLayoutEffect, useRef } from 'react';
import type { Ticker as TickerType } from '@/types/studio';
import './Ticker.css';

interface TickerProps {
  config: TickerType;
}

export const Ticker: React.FC<TickerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);

  const tickerContent = config.content.join(' • ');
  const isAnimated = config.animated && config.content.length > 0;

  // Drive the scroll with the Web Animations API directly. CSS keyframe +
  // inline-style approaches were unreliable here — element.animate() pins the
  // keyframes to the element at known pixel offsets and doesn't depend on CSS
  // custom properties, percentage transforms, or React style diffing.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const item = itemRef.current;
    // When config.visible flips false → true, React unmounts and remounts the
    // inner DOM, giving us fresh refs. config.visible is in the dep list so
    // this effect re-runs and attaches the animation to the new track.
    if (!track || !item) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const start = () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
      if (!isAnimated || prefersReducedMotion) {
        // Static render: text stays in place. Reduced-motion users still see
        // the headlines, just without continuous scroll.
        track.style.transform = 'translateX(0)';
        return;
      }
      const itemWidth = item.offsetWidth;
      if (itemWidth === 0) return;

      const speed = Math.max(config.speed, 1);
      animationRef.current = track.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(-${itemWidth}px)` },
        ],
        {
          duration: (itemWidth / speed) * 1000,
          iterations: Infinity,
          easing: 'linear',
        }
      );
    };

    start();

    // Re-measure once fonts have actually loaded — offsetWidth before font
    // swap returns a fallback-font width that throws off the loop distance.
    if ('fonts' in document) {
      document.fonts.ready.then(start).catch(() => {});
    }

    // ResizeObserver covers window resize, container reflow, and any other
    // size change to the measured item in one path.
    const ro = new ResizeObserver(start);
    ro.observe(item);

    return () => {
      ro.disconnect();
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [isAnimated, tickerContent, config.fontSize, config.speed, config.visible]);

  if (!config.visible || config.content.length === 0) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    background: config.backgroundColor,
    color: config.textColor,
    fontSize: `${config.fontSize}px`,
  };

  return (
    <div ref={containerRef} className="ticker-container" style={containerStyle}>
      <div className="ticker-label">
        <span>BREAKING</span>
      </div>
      <div className="ticker-content">
        <div ref={trackRef} className="ticker-text">
          <span ref={itemRef} className="ticker-item">{tickerContent}</span>
          {isAnimated && (
            <span className="ticker-item" aria-hidden="true">{tickerContent}</span>
          )}
        </div>
      </div>
    </div>
  );
};
