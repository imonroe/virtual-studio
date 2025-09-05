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

### CapRover Deployment

The application can be deployed to CapRover using the included `captain-definition` file.

#### Setup Process
1. Connect repository to CapRover app
2. CapRover uses Node.js template deployment automatically
3. Build process runs during startup: `npm run build && node server.cjs`
4. Application serves on dynamic PORT assigned by CapRover

#### Key Configuration Files
- `captain-definition` - Uses Node.js template (`"templateId": "node/20"`)
- `server.cjs` - Express.js server for SPA routing and static file serving
- Modified `package.json` - Build dependencies moved to production for CapRover compatibility

#### Deployment Command Flow
1. `npm install --production` (installs all dependencies including build tools)
2. Copy source files
3. `npm start` → `npm run build && node server.cjs`
4. Express server serves built React app from `/dist` directory

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
- Logo/watermark system (branding graphics)
- Overlays (clock, live indicator)
- Presets and themes
- Auto-save to localStorage

### Key Features
- **Procedural Backgrounds**: Gradient and particle effects generated via shaders
- **Lower Thirds**: Animated text overlays with customizable styling
- **Logo/Watermark System**: User-uploadable graphics with positioning and sizing controls
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

### Build Issues - RESOLVED ✅
~~The project currently has TypeScript compilation errors that need resolution~~:
- ✅ **Fixed**: Import paths for type definitions corrected (`@types/studio` → `@/types/studio`)
- ✅ **Fixed**: Unused imports cleaned up and proper TypeScript types implemented
- ✅ **Fixed**: Missing type definitions added for all components

**Latest Status (August 30, 2025)**: Build system working perfectly. TypeScript compilation passes with no errors. Only minor linting warnings remain (8 problems, down from 27).

### Performance Considerations
- Target 60fps rendering at 1080p resolution
- Use RequestAnimationFrame for smooth animations
- Implement object pooling for frequently created/destroyed objects
- Monitor memory usage to prevent leaks during long streaming sessions

### WebGL/Three.js Notes
- Shaders are imported as strings via vite-plugin-glsl
- Scene cleanup is critical - dispose of geometries, materials, and textures
- Use adaptive quality based on performance metrics

## React Hooks and Event Handling

### Keyboard Shortcuts Debugging (September 5, 2025)

**Problem**: Keyboard shortcuts not responding (GitHub Issue #9)
**Root Cause**: Multiple event listeners and missing visual feedback

**Solution Process**:
1. **Added comprehensive logging** to trace event flow
2. **Fixed duplicate listeners** - Only initialize `useKeyboardShortcuts()` in App.tsx, not ControlPanel
3. **Added visual notifications** - Real-time feedback when shortcuts activate
4. **Enhanced TypeScript interfaces** - Better type safety for event handling

**Key Lessons**:
- **Single Hook Initialization**: React hooks with document-level event listeners should only be called once
- **Visual Feedback Critical**: Invisible actions like keyboard shortcuts need immediate user confirmation
- **Event Parameter Passing**: Allow shortcut actions to receive the original KeyboardEvent for advanced handling
- **Systematic Debugging**: Use logging and visual cues to identify where complex event flows break down

**Keyboard Shortcuts Fixed**:
- `0-4`: Toggle various studio elements
- `Tab`: Toggle Control Panel  
- `p`: Toggle Preview Mode
- `Escape`: Hide All Overlays

### Live Indicator Positioning Bug Fix (September 5, 2025)

**Problem**: Live indicator positioning sliders only allowed movement to ~50% of canvas (GitHub Issue #8)
**Root Cause**: Hardcoded slider maximums (X: 400px, Y: 200px) instead of using actual stage dimensions

**Solution Process**:
1. **Identified stage vs viewport distinction** - `.studio-stage` uses responsive CSS with `aspect-ratio: 16/9` and dynamic sizing
2. **Implemented dynamic dimension detection** - Uses `document.querySelector('.studio-stage').getBoundingClientRect()` to get actual rendered size
3. **Added responsive positioning limits** - Calculates max X/Y based on stage dimensions minus element size
4. **Added window resize handling** - Updates limits automatically when viewport changes

**Key Lessons**:
- **Stage vs Viewport**: Positioning should be relative to the actual rendered stage element, not browser viewport
- **Dynamic Sizing**: The `.studio-stage` element size changes based on viewport due to CSS `max-width: min(calc(100vh * 16/9), calc(100vw - 360px - 40px))`
- **Element Size Compensation**: Must subtract estimated element dimensions from limits to prevent overflow
- **Responsive Design**: Controls must adapt to actual rendered dimensions for proper user experience

**Technical Implementation**:
- **Before**: `max="400"` (fixed) → **After**: `max={limits.liveIndicator.maxX}` (dynamic)
- **Stage Detection**: Real-time DOM measurement with cleanup on unmount
- **Element Estimation**: Live indicator ~80px wide, ~30px tall for positioning calculations

## Build System Troubleshooting

### Common Build Issues

#### TypeScript Compilation Errors
If you encounter import path errors like `Cannot import type declaration files`, check for:
- **Wrong import paths**: Use `@/types/studio` not `@types/studio`
- **Missing type imports**: Ensure all required types are imported in files that use them
- **Path alias configuration**: Verify `tsconfig.app.json` and `vite.config.ts` have matching aliases

#### Vite Configuration Issues
Common `vite.config.ts` problems:
- **Node.js compatibility**: Use `fileURLToPath(new URL('./src', import.meta.url))` instead of `path.resolve(__dirname, './src')`
- **Missing dependencies**: Install `@types/node` for Node.js types
- **Invalid plugin options**: Check plugin documentation for valid configuration options

#### Build Dependencies
Required dependencies that may be missing:
```bash
npm install --save-dev @types/node terser
```

#### Quick Fix Commands
If build is broken, try these in order:
```bash
# 1. Install missing dependencies
npm install

# 2. Check for TypeScript errors
npm run build

# 3. Check for linting issues
npm run lint

# 4. Start development server
npm run dev
```

### Development Server Issues
If `npm run dev` connection is refused:
- Try with host binding: `npm run dev -- --host`
- Check firewall settings
- Use network IP address shown in terminal output
- For WSL2 users: Access from Windows browser using `localhost:3000`

### CapRover Deployment Troubleshooting

#### Build Failures
**Problem**: `sh: tsc: not found` during build
- **Cause**: Build dependencies in devDependencies, CapRover uses `--production`
- **Solution**: Move build tools (typescript, vite, @vitejs/plugin-react) to dependencies

**Problem**: `Cannot read file '/usr/src/app/tsconfig.json'`
- **Cause**: Build running before source files copied (postinstall timing issue)
- **Solution**: Remove postinstall script, use `"start": "npm run build && node server.cjs"`

#### Runtime Issues
**Problem**: 50x errors after successful build
- **Cause**: Server using ES modules in container environment
- **Solution**: Use CommonJS server (`server.cjs` with `require()` statements)

**Problem**: "index.html not found" error
- **Cause**: Build not running or dist directory missing
- **Solution**: Ensure build runs in start command: `npm run build && node server.cjs`

**Problem**: 502 errors (server not responding)
- **Cause**: Port binding issues or server startup failures
- **Solution**: 
  - Parse PORT as integer: `parseInt(process.env.PORT) || 3000`
  - Bind to all interfaces: `app.listen(PORT, '0.0.0.0')`
  - Add startup delay: `setTimeout(() => { app.listen(...) }, 1000)`

#### Package.json Configuration for CapRover
```json
{
  "scripts": {
    "start": "npm run build && node server.cjs"
  },
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "~5.8.3",
    "vite": "^7.1.2",
    "@vitejs/plugin-react": "^5.0.0"
  }
}
```

#### Captain Definition Best Practices
- Use Node.js template: `{"schemaVersion": 2, "templateId": "node/20"}`
- Avoid custom Dockerfiles for simple React apps
- Let CapRover handle port configuration automatically

## Linting and Code Quality

### Systematic Linting Fix Approach
When addressing linting issues, use this proven methodology:

1. **Automated fixes first**: Run `npm run lint -- --fix` to handle simple formatting
2. **Fix by priority tiers**:
   - **Tier 1**: Core files (App.tsx, engine files, localStorage.ts)
   - **Tier 2**: Feature components (background/graphics components)
   - **Tier 3**: Utility files (KeyboardShortcuts.tsx)
3. **Test after each tier**: Run `npm run build` to verify changes don't break compilation
4. **Common TypeScript fixes**:
   - Replace `any` types with proper interfaces
   - Add missing imports for type definitions
   - Use proper type assertions: `e.target.value as 'option1' | 'option2'`
   - Handle unused parameters with underscore prefix: `_ctx`, `_deltaTime`

### Runtime Testing Methodology
For comprehensive runtime verification without browser automation:
1. **Build verification**: Ensure `npm run build` completes successfully
2. **Server check**: Verify development server responds (HTTP 200 on localhost:3000)  
3. **Component analysis**: Check all major components import and export correctly
4. **State management**: Verify Zustand store and localStorage integration
5. **CSS verification**: Confirm styles load and follow design system

**Result**: Reduced from 27 linting problems (22 errors, 5 warnings) to 8 problems (6 errors, 2 warnings) - 70% improvement.

## Feature Implementation Lessons

### Logo/Watermark System Implementation (August 30, 2025)

**Key Lessons Learned:**

#### Store Architecture Patterns
- **Follow existing patterns**: The codebase uses direct state properties, not nested config objects
- **Wrong approach**: `state.config.branding.logos` (creates duplicate properties)
- **Correct approach**: `state.logos: LogoConfig[]` (matches existing pattern)
- **State integration**: New features should extend the existing Zustand store structure, not create separate sub-stores

#### CSS Variable Usage
- **Critical issue**: CSS variables like `var(--text-primary)` don't exist in this project
- **Symptom**: White-on-white text in dropdowns due to undefined variables
- **Solution**: Examine existing CSS files (e.g., `ControlPanel.css`) to understand the actual color scheme
- **Color mappings discovered**:
  - Text primary: `#fff`
  - Text secondary: `#ccc`  
  - Background primary: `#2a2a2a`
  - Background secondary: `#2a2a2a`
  - Border color: `#444`
  - Accent color: `#646cff`
  - Error color: `#dc2626`

#### File Structure Best Practices
- **Service organization**: Create dedicated service folders (e.g., `/src/services/branding/`)
- **Type definitions**: Centralize new types in `/src/types/` with descriptive filenames
- **Component structure**: Place graphics components in `/src/studio/graphics/`
- **Control panels**: Use CSS Modules pattern for styling (`.module.css` files)

#### Image Processing Implementation
- **LocalStorage storage**: Use base64 data URLs for consistency with existing background images
- **File validation**: Implement comprehensive validation (file size, type, dimensions)
- **Error handling**: Provide clear user feedback for upload failures
- **Memory management**: Consider compression for large images to avoid localStorage limits

#### Development Workflow
- **Build verification**: Always run `npm run build` after major changes
- **Incremental testing**: Fix one component at a time, test after each fix
- **CSS debugging**: Use browser dev tools to verify variable resolution
- **State debugging**: Use Zustand devtools for state management verification