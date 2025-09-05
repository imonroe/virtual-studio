import { useEffect, useRef, useState } from 'react';
import { RenderingEngine } from '@engine/RenderingEngine';
import { GradientBackground } from '@studio/backgrounds/GradientBackground';
import { ImageBackground } from '@studio/backgrounds/ImageBackground';
import { CSSGradientBackground } from '@studio/backgrounds/CSSGradientBackground';
import { CSSImageBackground } from '@studio/backgrounds/CSSImageBackground';
import { LowerThird } from '@studio/graphics/LowerThird';
import { Ticker } from '@studio/graphics/Ticker';
import { Logo } from '@studio/graphics/Logo';
import { ControlPanel } from '@controls/ControlPanel';
import { useKeyboardShortcuts } from '@services/shortcuts/KeyboardShortcuts';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig, ImageConfig } from '@/types/studio';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RenderingEngine | null>(null);
  const gradientBackgroundRef = useRef<GradientBackground | null>(null);
  const imageBackgroundRef = useRef<ImageBackground | null>(null);
  const [renderMode, setRenderMode] = useState<'webgl' | 'css' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const background = useStudioStore((state) => state.background);
  const clock = useStudioStore((state) => state.clock);
  const liveIndicator = useStudioStore((state) => state.liveIndicator);
  const lowerThird = useStudioStore((state) => state.lowerThird);
  const ticker = useStudioStore((state) => state.ticker);
  const logos = useStudioStore((state) => state.logos);

  // Initialize keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts();
  console.log('🎹 App: Keyboard shortcuts loaded:', shortcuts.length);

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
          if (webglContext) {
            const scene = webglContext.getScene();
            if (scene) {
              if (background.type === 'gradient') {
                // Create gradient background
                gradientBackgroundRef.current = new GradientBackground(background.config as GradientConfig);
                const mesh = gradientBackgroundRef.current.create();
                scene.add(mesh);
                console.log('WebGL gradient background added to scene', mesh);
              } else if (background.type === 'image') {
                // Create image background
                imageBackgroundRef.current = new ImageBackground(background.config as ImageConfig);
                try {
                  const mesh = await imageBackgroundRef.current.create();
                  scene.add(mesh);
                  console.log('WebGL image background added to scene', mesh);
                } catch (error) {
                  console.error('Failed to create image background:', error);
                }
              }
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
          if (imageBackgroundRef.current) {
            imageBackgroundRef.current.update(deltaTime);
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
      if (imageBackgroundRef.current) {
        imageBackgroundRef.current.dispose();
        imageBackgroundRef.current = null;
      }
    };
  }, []);

  // Update background when config changes
  useEffect(() => {
    if (gradientBackgroundRef.current && background.type === 'gradient') {
      gradientBackgroundRef.current.updateConfig(background.config as GradientConfig);
    } else if (imageBackgroundRef.current && background.type === 'image') {
      imageBackgroundRef.current.updateConfig(background.config as ImageConfig);
    }
  }, [background.config, background.type]);

  // Handle background type changes
  useEffect(() => {
    const switchBackgroundType = async () => {
      if (!engineRef.current) return;
      
      const webglContext = engineRef.current.getWebGLContext();
      if (!webglContext) return;
      
      const scene = webglContext.getScene();
      if (!scene) return;

      // Clean up existing backgrounds
      if (gradientBackgroundRef.current) {
        const mesh = gradientBackgroundRef.current.getMesh();
        if (mesh) scene.remove(mesh);
        gradientBackgroundRef.current.dispose();
        gradientBackgroundRef.current = null;
      }
      
      if (imageBackgroundRef.current) {
        const mesh = imageBackgroundRef.current.getMesh();
        if (mesh) scene.remove(mesh);
        imageBackgroundRef.current.dispose();
        imageBackgroundRef.current = null;
      }

      // TEMP DEBUG: Force clear all children from scene to reset WebGL state
      console.log('Scene children before clear:', scene.children.length);
      const childrenToRemove = [...scene.children];
      childrenToRemove.forEach(child => scene.remove(child));
      console.log('Scene children after clear:', scene.children.length);

      // Create new background based on type
      if (background.type === 'gradient') {
        gradientBackgroundRef.current = new GradientBackground(background.config as GradientConfig);
        const mesh = gradientBackgroundRef.current.create();
        scene.add(mesh);
        console.log('Switched to gradient background');
      } else if (background.type === 'image') {
        console.log('Using CSS image background instead of WebGL to avoid conflicts');
        // Skip WebGL image background creation - use CSS instead
      }
    };

    switchBackgroundType();
  }, [background.type]);

  // Update background visibility
  useEffect(() => {
    if (gradientBackgroundRef.current) {
      gradientBackgroundRef.current.setVisible(background.visible);
    }
    if (imageBackgroundRef.current) {
      imageBackgroundRef.current.setVisible(background.visible);
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
          
          {/* CSS Image Background - always use CSS for images to avoid WebGL conflicts */}
          {background.visible && background.type === 'image' && (
            <CSSImageBackground config={background.config as ImageConfig} visible={background.visible} />
          )}
          
          {/* WebGL Canvas */}
          <canvas
            ref={canvasRef}
            className="studio-canvas"
            width="1920"
            height="1080"
            style={{ 
              display: renderMode === 'webgl' && background.type !== 'image' ? 'block' : 'none',
              opacity: background.visible ? 1 : 0
            }}
          />

          <div className="studio-overlay">
            {clock.visible && (clock.showDate || clock.showTime) && (
              <div className="clock" style={{
                position: 'absolute',
                left: `${clock.position.x}px`,
                top: `${clock.position.y}px`,
                color: clock.style.color,
                fontSize: `${clock.style.fontSize}px`,
                fontFamily: clock.style.fontFamily,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                {clock.showDate && (
                  <div className="date" style={{ 
                    fontSize: `${clock.style.fontSize * 0.8}px`,
                    opacity: 0.9,
                    marginBottom: clock.showTime ? '4px' : '0'
                  }}>
                    {currentTime.toLocaleDateString([], {
                      timeZone: clock.timezone,
                      ...(clock.dateFormat === 'short' && { 
                        month: 'numeric', 
                        day: 'numeric', 
                        year: '2-digit' 
                      }),
                      ...(clock.dateFormat === 'medium' && { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      }),
                      ...(clock.dateFormat === 'long' && { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    })}
                  </div>
                )}
                {clock.showTime && (
                  <div className="time">
                    {currentTime.toLocaleTimeString([], {
                      timeZone: clock.timezone,
                      hour12: clock.format === '12h',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: clock.showSeconds ? '2-digit' : undefined
                    })}
                  </div>
                )}
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

            {/* Logos/Watermarks */}
            {logos.map((logo) => (
              <Logo key={logo.id} config={logo} />
            ))}
          </div>
        </div>
      </div>

      <ControlPanel />
    </div>
  );
}

export default App
