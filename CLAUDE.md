# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Virtual Studio is a browser-based broadcast graphics application that creates customizable backgrounds and overlays for content creators. It integrates with OBS as a browser source and emphasizes real-time performance at 60fps.

## Commands

### Development
- `npm run dev` - Start development server with hot reload at http://localhost:3000
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Testing
No test runner is currently configured. Tests would need to be added with Vitest or similar.

### Docker Commands

#### Production Deployment
- `docker-compose up -d` - Start production container on port 8080
- `docker-compose down` - Stop and remove container
- `docker-compose build` - Rebuild image after code changes
- `docker-compose logs -f` - View container logs
- `docker-compose restart` - Restart container

#### Development with Docker
- `docker-compose --profile development up` - Start development container with hot reload
- `docker-compose --profile development down` - Stop development container

#### Direct Docker Commands
- `docker build -t virtual-studio:latest .` - Build production image
- `docker run -p 8080:80 virtual-studio:latest` - Run production container
- `docker exec -it virtual-studio sh` - Access container shell

## Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with Hot Module Replacement
- **State Management**: Zustand with Immer for immutable updates
- **3D Graphics**: Three.js for WebGL rendering
- **Styling**: CSS Modules with CSS-in-JS for dynamic styles
- **Shader Support**: GLSL shaders via vite-plugin-glsl

### Project Structure
- `/src/engine/` - Rendering engine with WebGL/Canvas2D/CSS renderers
- `/src/studio/` - Studio components (backgrounds, graphics, overlays)
- `/src/controls/` - Control panel UI and input components  
- `/src/services/` - Business logic (state, storage, shortcuts)
- `/src/animations/` - Animation systems (springs, easings, timeline)
- `/src/types/` - TypeScript type definitions

### Path Aliases
The project uses TypeScript path aliases configured in both `tsconfig.app.json` and `vite.config.ts`:
- `@/` → `./src/`
- `@engine/` → `./src/engine/`
- `@studio/` → `./src/studio/`
- `@controls/` → `./src/controls/`
- `@services/` → `./src/services/`
- `@types/` → `./src/types/`

### Rendering Architecture
The app uses a multi-layer rendering approach:
1. **WebGL Layer** (Three.js) - Complex backgrounds, particles, 3D effects
2. **CSS Layer** - UI overlays, simple animations, fallback rendering
3. **Canvas2D Layer** - Text rendering, fallback for WebGL

The `RenderingEngine` class manages renderer selection and fallback logic, preferring WebGL but gracefully degrading to CSS when needed.

### State Management
Zustand store (`studioStore.ts`) manages:
- Background configuration (gradient/image types)
- Graphics elements (lower thirds, tickers)
- Overlays (clock, live indicator)
- Presets and themes
- Auto-save to localStorage

### Key Features
- **Procedural Backgrounds**: Gradient and particle effects generated via shaders
- **Lower Thirds**: Animated text overlays with customizable styling
- **Live Graphics**: Clock display, live indicator, ticker tape
- **Keyboard Shortcuts**: Quick toggles for visibility and presets
- **OBS Integration**: Optimized for browser source capture

## Important Notes

### Type Imports
When importing types, use the actual module path instead of the @types alias:
```typescript
// Wrong
import type { StudioConfig } from '@types/studio';

// Correct  
import type { StudioConfig } from '@/types/studio';
```

### Build Issues
The project currently has TypeScript compilation errors that need resolution:
- Import paths for type definitions need correction
- Some unused imports need cleanup
- Missing type definitions for ImageConfig

### Performance Considerations
- Target 60fps rendering at 1080p resolution
- Use RequestAnimationFrame for smooth animations
- Implement object pooling for frequently created/destroyed objects
- Monitor memory usage to prevent leaks during long streaming sessions

### WebGL/Three.js Notes
- Shaders are imported as strings via vite-plugin-glsl
- Scene cleanup is critical - dispose of geometries, materials, and textures
- Use adaptive quality based on performance metrics