Virtual Studio is a React-based web application that creates real-time broadcast graphics for
content creators, designed as an OBS browser source. The application provides a comprehensive
broadcast overlay system with high-performance rendering capabilities.

Core Architecture:

- Frontend Framework: React 18 with TypeScript, built using Vite
- State Management: Zustand with Immer for immutable state updates
- Rendering: Multi-layer hybrid approach using WebGL (Three.js), Canvas2D, and CSS
- Performance Target: 60fps at 1080p resolution

Key Features:

1. Dynamic Backgrounds: Procedural gradients, image overlays, and particle systems with WebGL/CSS
   fallback rendering
2. Live Graphics: Lower thirds with animation, scrolling ticker tape, live indicator with
   blinking, and customizable clock display
3. Real-time Controls: Side control panel for live configuration of all elements
4. Preset System: Save/load complete studio configurations
5. Keyboard Shortcuts: Quick toggles for all visual elements
6. Auto-persistence: Settings automatically saved to localStorage

Technical Implementation:

- Rendering Engine: Adaptive WebGL-first with graceful CSS fallback for compatibility
- GLSL Shaders: Custom vertex/fragment shaders for gradient and particle effects
- State Architecture: Centralized Zustand store with auto-save and preset management
- Path Aliases: TypeScript module resolution for clean imports (@engine/, @studio/, etc.)

Deployment Ready:

- Docker support with production and development profiles
- Nginx configuration for optimal browser source performance
- Hot reload development environment

The application is specifically optimized for broadcast environments, with particular attention to
consistent frame rates, memory management, and seamless integration with streaming software like
OBS Studio.

Important file locations:

- ./docs <-- documentation directory
- ./docs/implementation_plan.md <-- The implementation plan
- ./docs/product_requirements.md <-- The product requirements document
- ./docs/style_guide.md <-- The style guide, which should include all important visual styling information
