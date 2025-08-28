import React, { useEffect, useRef, useState } from 'react';
import { RenderingEngine } from '@engine/RenderingEngine';
import { WebGLRenderer } from '@engine/webgl/WebGLRenderer';
import { GradientBackground } from '@studio/backgrounds/GradientBackground';
import { CSSGradientBackground } from '@studio/backgrounds/CSSGradientBackground';
import { LowerThird } from '@studio/graphics/LowerThird';
import { Ticker } from '@studio/graphics/Ticker';
import { ControlPanel } from '@controls/ControlPanel';
import { useKeyboardShortcuts } from '@services/shortcuts/KeyboardShortcuts';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig } from '@types/studio';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RenderingEngine | null>(null);
  const gradientBackgroundRef = useRef<GradientBackground | null>(null);
  const [renderMode, setRenderMode] = useState<'webgl' | 'css' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const background = useStudioStore((state) => state.background);
  const clock = useStudioStore((state) => state.clock);
  const liveIndicator = useStudioStore((state) => state.liveIndicator);
  const lowerThird = useStudioStore((state) => state.lowerThird);
  const ticker = useStudioStore((state) => state.ticker);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    const initEngine = async () => {
      if (!canvasRef.current) return;

      try {
        // Create rendering engine
        const engine = new RenderingEngine({
          preferredMode: 'webgl',
          autoStart: true,
          targetFPS: 60
        });

        await engine.initialize(canvasRef.current);
        engineRef.current = engine;

        const mode = engine.getMode();
        console.log('Engine initialized with mode:', mode);
        
        if (mode === 'webgl') {
          const webglContext = engine.getWebGLContext();
          if (webglContext && background.type === 'gradient') {
            const scene = webglContext.getScene();
            if (scene) {
              // Create gradient background
              gradientBackgroundRef.current = new GradientBackground(background.config as GradientConfig);
              const mesh = gradientBackgroundRef.current.create();
              scene.add(mesh);
              console.log('WebGL gradient background added to scene', mesh);
            }
          }
          setRenderMode('webgl');
        } else {
          setRenderMode('css');
          console.log('Using CSS fallback mode');
        }

        // Set up render callback
        engine.onRender((deltaTime) => {
          if (gradientBackgroundRef.current) {
            gradientBackgroundRef.current.update(deltaTime);
          }
        });

        setIsInitialized(true);
        console.log('Rendering engine initialized successfully', { mode, isInitialized: true });
      } catch (error) {
        console.error('Failed to initialize rendering engine:', error);
        setRenderMode('css');
      }
    };

    initEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
      if (gradientBackgroundRef.current) {
        gradientBackgroundRef.current.dispose();
        gradientBackgroundRef.current = null;
      }
    };
  }, []);

  // Update gradient when config changes
  useEffect(() => {
    if (gradientBackgroundRef.current && background.type === 'gradient') {
      gradientBackgroundRef.current.updateConfig(background.config as GradientConfig);
    }
  }, [background.config]);

  // Update background visibility
  useEffect(() => {
    if (gradientBackgroundRef.current) {
      gradientBackgroundRef.current.setVisible(background.visible);
    }
  }, [background.visible]);

  // Update clock every second
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debug logging (reduced frequency)
  if (Math.random() < 0.01) {
    console.log('Render state:', { 
      renderMode, 
      backgroundVisible: background.visible, 
      backgroundType: background.type,
      isInitialized 
    });
  }

  return (
    <div className="app">
      <div className="studio-container">
        <div className="studio-stage">
          {/* CSS Background - temporarily force display for testing */}
          {background.visible && background.type === 'gradient' && (
            <CSSGradientBackground config={background.config as GradientConfig} />
          )}
          
          {/* WebGL Canvas */}
          <canvas
            ref={canvasRef}
            className="studio-canvas"
            width="1920"
            height="1080"
            style={{ 
              display: renderMode === 'webgl' ? 'block' : 'none',
              opacity: background.visible ? 1 : 0
            }}
          />

          <div className="studio-overlay">
            {clock.visible && (
              <div className="clock" style={{
                position: 'absolute',
                left: `${clock.position.x}px`,
                top: `${clock.position.y}px`,
                color: clock.style.color,
                fontSize: `${clock.style.fontSize}px`,
                fontFamily: clock.style.fontFamily
              }}>
                {currentTime.toLocaleTimeString([], {
                  hour12: clock.format === '12h',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: clock.showSeconds ? '2-digit' : undefined
                })}
              </div>
            )}

            {liveIndicator.visible && (
              <div className={`live-indicator ${liveIndicator.blinking ? 'blinking' : ''}`} style={{
                position: 'absolute',
                left: `${liveIndicator.position.x}px`,
                top: `${liveIndicator.position.y}px`,
                color: liveIndicator.color
              }}>
                <span className="live-dot"></span>
                {liveIndicator.text}
              </div>
            )}

            {/* Lower Third */}
            {lowerThird && <LowerThird config={lowerThird} />}

            {/* Ticker */}
            {ticker && <Ticker config={ticker} />}
          </div>
        </div>
      </div>

      <ControlPanel />
    </div>
  );
}

export default App
