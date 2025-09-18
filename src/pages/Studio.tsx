import { useEffect, useRef, useState } from 'react';
import { RenderingEngine } from '@engine/RenderingEngine';
import { GradientBackground } from '@studio/backgrounds/GradientBackground';
import { SolidBackground } from '@studio/backgrounds/SolidBackground';
import { WavesBackground } from '@studio/backgrounds/WavesBackground';
import { NeuralNetworkBackground } from '@studio/backgrounds/NeuralNetworkBackground';
import { ImageBackground } from '@studio/backgrounds/ImageBackground';
import { CSSGradientBackground } from '@studio/backgrounds/CSSGradientBackground';
import { CSSSolidBackground } from '@studio/backgrounds/CSSSolidBackground';
import { CSSWavesBackground } from '@studio/backgrounds/CSSWavesBackground';
import { CSSNeuralNetworkBackground } from '@studio/backgrounds/CSSNeuralNetworkBackground';
import { CSSImageBackground } from '@studio/backgrounds/CSSImageBackground';
import { LowerThird } from '@studio/graphics/LowerThird';
import { Ticker } from '@studio/graphics/Ticker';
import { Logo } from '@studio/graphics/Logo';
import { ControlPanel } from '@controls/ControlPanel';
import { useKeyboardShortcuts } from '@services/shortcuts/KeyboardShortcuts';
import { useStudioStore } from '@services/state/studioStore';
import type { GradientConfig, SolidConfig, AnimatedConfig, ImageConfig } from '@/types/studio';
import './Studio.css';

export function Studio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RenderingEngine | null>(null);
  const gradientBackgroundRef = useRef<GradientBackground | null>(null);
  const solidBackgroundRef = useRef<SolidBackground | null>(null);
  const wavesBackgroundRef = useRef<WavesBackground | null>(null);
  const neuralBackgroundRef = useRef<NeuralNetworkBackground | null>(null);
  const imageBackgroundRef = useRef<ImageBackground | null>(null);

  const background = useStudioStore((state) => state.background);
  const clock = useStudioStore((state) => state.clock);
  const liveIndicator = useStudioStore((state) => state.liveIndicator);
  const lowerThird = useStudioStore((state) => state.lowerThird);
  const ticker = useStudioStore((state) => state.ticker);
  const logos = useStudioStore((state) => state.logos);

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
        
        if (mode === 'webgl') {
          const webglContext = engine.getWebGLContext();
          if (webglContext) {
            const scene = webglContext.getScene();
            if (scene) {
              // Skip WebGL background creation - use CSS backgrounds to avoid Mesh-related matrix errors
              /*
              if (background.type === 'gradient') {
                // Create gradient background (now using simple color material)
                console.log('🔍 DEBUG: Creating gradient background with simple material...');
                gradientBackgroundRef.current = new GradientBackground(background.config as GradientConfig);
                const mesh = gradientBackgroundRef.current.create();
                scene.add(mesh);
                console.log('🔍 DEBUG: Gradient background created and added to scene');
              } else if (background.type === 'solid') {
                // Create solid background
                solidBackgroundRef.current = new SolidBackground(background.config as SolidConfig);
                const mesh = solidBackgroundRef.current.create();
                scene.add(mesh);
              } else if (background.type === 'animated') {
                const animatedConfig = background.config as AnimatedConfig;
                if (animatedConfig.variant === 'neural') {
                  // Create neural network background
                  neuralBackgroundRef.current = new NeuralNetworkBackground(animatedConfig);
                  const group = neuralBackgroundRef.current.create();
                  scene.add(group);
                } else {
                  // Create waves background
                  wavesBackgroundRef.current = new WavesBackground(animatedConfig);
                  const mesh = wavesBackgroundRef.current.create();
                  scene.add(mesh);
                }
              } else if (background.type === 'image') {
                // Create image background
                imageBackgroundRef.current = new ImageBackground(background.config as ImageConfig);
                try {
                  const mesh = await imageBackgroundRef.current.create();
                  scene.add(mesh);
                } catch (error) {
                  console.error('Failed to create image background:', error);
                }
              }
              */
            }
          }
          // WebGL available but using CSS backgrounds
        } else {
          // Fallback to CSS backgrounds
        }

        // Set up render callback
        engine.onRender((deltaTime) => {
          // Only update backgrounds if they exist and have valid meshes/materials
          try {
            if (gradientBackgroundRef.current && gradientBackgroundRef.current.getMesh()) {
              gradientBackgroundRef.current.update(deltaTime);
            }
            if (solidBackgroundRef.current && solidBackgroundRef.current.getMesh()) {
              solidBackgroundRef.current.update(deltaTime);
            }
            if (wavesBackgroundRef.current && wavesBackgroundRef.current.getMesh()) {
              wavesBackgroundRef.current.update(deltaTime);
            }
            if (neuralBackgroundRef.current && neuralBackgroundRef.current.getGroup()) {
              neuralBackgroundRef.current.update(deltaTime);
            }
            if (imageBackgroundRef.current && imageBackgroundRef.current.getMesh()) {
              imageBackgroundRef.current.update(deltaTime);
            }
          } catch (error) {
            // Silently handle render errors during background switching
          }
        });

      } catch (error) {
        console.error('Failed to initialize rendering engine:', error);
        // Using CSS backgrounds as fallback
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
      if (solidBackgroundRef.current) {
        solidBackgroundRef.current.dispose();
        solidBackgroundRef.current = null;
      }
      if (wavesBackgroundRef.current) {
        wavesBackgroundRef.current.dispose();
        wavesBackgroundRef.current = null;
      }
      if (neuralBackgroundRef.current) {
        neuralBackgroundRef.current.dispose();
        neuralBackgroundRef.current = null;
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
    } else if (solidBackgroundRef.current && background.type === 'solid') {
      solidBackgroundRef.current.updateConfig(background.config as SolidConfig);
    } else if (background.type === 'animated') {
      const animatedConfig = background.config as AnimatedConfig;
      if (animatedConfig.variant === 'neural' && neuralBackgroundRef.current) {
        neuralBackgroundRef.current.updateConfig(animatedConfig);
      } else if (animatedConfig.variant === 'waves' && wavesBackgroundRef.current) {
        wavesBackgroundRef.current.updateConfig(animatedConfig);
      }
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

      // Clean up existing backgrounds more safely
      const backgroundsToCleanup = [
        { ref: gradientBackgroundRef, getMesh: (bg: any) => bg.getMesh() },
        { ref: solidBackgroundRef, getMesh: (bg: any) => bg.getMesh() },
        { ref: wavesBackgroundRef, getMesh: (bg: any) => bg.getMesh() },
        { ref: neuralBackgroundRef, getMesh: (bg: any) => bg.getGroup() },
        { ref: imageBackgroundRef, getMesh: (bg: any) => bg.getMesh() }
      ];

      // Remove from scene first, then dispose
      backgroundsToCleanup.forEach(({ ref, getMesh }) => {
        if (ref.current) {
          const object = getMesh(ref.current);
          if (object && object.parent === scene) {
            scene.remove(object);
          }
        }
      });

      // Dispose backgrounds after removal from scene
      backgroundsToCleanup.forEach(({ ref }) => {
        if (ref.current) {
          ref.current.dispose();
          ref.current = null;
        }
      });

      // Final cleanup - remove any remaining children
      const remainingChildren = [...scene.children];
      remainingChildren.forEach(child => scene.remove(child));

      // Create new background based on type
      if (background.type === 'gradient') {
        gradientBackgroundRef.current = new GradientBackground(background.config as GradientConfig);
        const mesh = gradientBackgroundRef.current.create();
        scene.add(mesh);
      } else if (background.type === 'solid') {
        solidBackgroundRef.current = new SolidBackground(background.config as SolidConfig);
        const mesh = solidBackgroundRef.current.create();
        scene.add(mesh);
      } else if (background.type === 'animated') {
        const animatedConfig = background.config as AnimatedConfig;
        if (animatedConfig.variant === 'neural') {
          neuralBackgroundRef.current = new NeuralNetworkBackground(animatedConfig);
          const group = neuralBackgroundRef.current.create();
          scene.add(group);
        } else {
          wavesBackgroundRef.current = new WavesBackground(animatedConfig);
          const mesh = wavesBackgroundRef.current.create();
          scene.add(mesh);
        }
      } else if (background.type === 'image') {
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
    if (solidBackgroundRef.current) {
      solidBackgroundRef.current.setVisible(background.visible);
    }
    if (wavesBackgroundRef.current) {
      wavesBackgroundRef.current.setVisible(background.visible);
    }
    if (neuralBackgroundRef.current) {
      neuralBackgroundRef.current.setVisible(background.visible);
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


  return (
    <div className="app">
      <div className="studio-container">
        <div className="studio-stage">
          {/* CSS Background - temporarily force display for testing */}
          {background.visible && background.type === 'gradient' && (
            <CSSGradientBackground config={background.config as GradientConfig} />
          )}
          
          {/* CSS Solid Background - use CSS for solid colors to avoid WebGL complexity */}
          {background.visible && background.type === 'solid' && (
            <CSSSolidBackground config={background.config as SolidConfig} />
          )}
          
          {/* CSS Animated Background - use CSS for animated backgrounds like gradients do */}
          {background.visible && background.type === 'animated' && background.config && (background.config as AnimatedConfig).variant === 'waves' && (
            <CSSWavesBackground config={background.config as AnimatedConfig} />
          )}
          
          {/* CSS Neural Network Background - fallback for neural networks */}
          {background.visible && background.type === 'animated' && background.config && (background.config as AnimatedConfig).variant === 'neural' && (
            <CSSNeuralNetworkBackground config={background.config as AnimatedConfig} />
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
              display: 'none', // Keep WebGL disabled for backgrounds - use CSS instead
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

