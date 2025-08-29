# Virtual Studio

A high-performance, browser-based broadcast graphics application designed for content creators, streamers, and video producers. Virtual Studio provides professional-quality overlay graphics that work seamlessly with OBS Studio and other streaming software.

## Features

### 🎨 Dynamic Backgrounds
- **Procedural Gradients**: Code-generated animated gradients using WebGL shaders
- **Image Backgrounds**: Support for custom background images with positioning controls
- **CSS Fallback**: Automatic fallback to CSS-based rendering for broader compatibility
- **Real-time Switching**: Instant background changes without performance impact

### 📺 Broadcast Graphics
- **Lower Thirds**: Customizable name and title overlays with multiple animation styles
- **Ticker Tape**: Scrolling news ticker with customizable content and speed
- **Live Clock**: Real-time clock display with timezone support and custom formatting
- **Live Indicator**: Animated "LIVE" indicator with blinking effects

### 🎛️ Real-time Controls
- **Live Editing**: Modify all elements while streaming without interruption
- **Preset Management**: Save and load complete studio configurations
- **Keyboard Shortcuts**: Quick toggles for all visual elements
- **Responsive Interface**: Works on desktop and mobile devices

### ⚡ Performance Optimized
- **60fps Target**: Consistent frame rate at 1080p resolution
- **WebGL Acceleration**: GPU-accelerated rendering with automatic fallback
- **Adaptive Quality**: Dynamic quality adjustment based on system performance
- **Memory Efficient**: Optimized for extended streaming sessions

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Rendering**: WebGL (Three.js) + Canvas 2D fallback + CSS animations
- **State Management**: Zustand with Immer for immutable updates
- **Build Tool**: Vite with hot module replacement
- **Styling**: CSS Modules with PostCSS
- **Persistence**: LocalStorage for settings and presets

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd virtual-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or  
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Usage with OBS Studio

1. Add a **Browser Source** in OBS
2. Set URL to your Virtual Studio instance (e.g., `http://localhost:3000`)
3. Set dimensions to match your target resolution (1920x1080 recommended)
4. Enable **Shutdown source when not visible** for better performance
5. Optionally enable **Refresh browser when scene becomes active**

### Recommended OBS Settings
- **Width**: 1920
- **Height**: 1080  
- **FPS**: 60 (if your system supports it)
- **Custom CSS**: Not needed - styling is built-in

## Project Structure

```
src/
├── engine/              # Rendering engine and WebGL implementation
│   ├── webgl/          # WebGL renderer and Three.js integration
│   ├── canvas/         # Canvas 2D fallback renderer
│   └── compositor/     # Layer composition system
├── studio/             # Studio graphics components
│   ├── backgrounds/    # Background generators (gradient, image, etc.)
│   ├── graphics/       # Overlay graphics (lower thirds, ticker, etc.)
│   ├── overlays/       # UI overlays (clock, indicators)
│   └── templates/      # Pre-built design templates
├── controls/           # Control panel and UI components
│   ├── panels/         # Individual control panels
│   ├── inputs/         # Custom input components
│   └── preview/        # Preview system
├── services/           # Business logic and utilities
│   ├── state/          # Zustand store and state management
│   ├── storage/        # LocalStorage persistence
│   ├── shortcuts/      # Keyboard shortcuts
│   └── export/         # Export functionality
├── animations/         # Animation system
│   ├── springs/        # Spring physics animations
│   ├── easings/        # Easing functions
│   └── timeline/       # Timeline control
└── types/              # TypeScript type definitions
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Concepts

#### Rendering Architecture
The application uses a multi-layer rendering approach:
1. **WebGL Layer**: High-performance backgrounds and effects using Three.js
2. **CSS Layer**: UI elements and fallback graphics
3. **Canvas Layer**: Text rendering and 2D graphics (when needed)

#### State Management
- **Zustand Store**: Centralized state with automatic persistence
- **Immer Integration**: Immutable state updates for predictable behavior
- **Subscription System**: Selective state subscriptions for performance

#### Performance Optimization
- **RequestAnimationFrame**: Smooth 60fps rendering loop
- **Object Pooling**: Reuse of frequently created objects
- **Layer Caching**: Avoid unnecessary re-renders
- **Quality Adaptation**: Dynamic quality scaling based on performance

## Configuration

### Environment Variables
Create a `.env` file for custom configuration:

```env
VITE_DEFAULT_FPS=60
VITE_ENABLE_WEBGL=true
VITE_ENABLE_PERFORMANCE_MONITOR=false
```

### Path Aliases
The project uses TypeScript path aliases for clean imports:

- `@engine/*` - Rendering engine components
- `@studio/*` - Studio graphics and backgrounds  
- `@controls/*` - UI controls and panels
- `@services/*` - Business logic services
- `@animations/*` - Animation system
- `@utils/*` - Utility functions
- `@types/*` - Type definitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the existing code style
4. Add tests for new functionality
5. Run the linter: `npm run lint`
6. Commit with a descriptive message
7. Push to your fork and submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use the established component patterns
- Ensure all code passes ESLint

## Browser Support

- **Chrome**: 88+ (recommended)
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

WebGL 2.0 support is required for optimal performance. The application will automatically fall back to CSS rendering if WebGL is unavailable.

## Performance Guidelines

### For Best Performance
- Use Chrome or Edge for WebGL acceleration
- Close unnecessary browser tabs
- Ensure adequate system memory (4GB+ recommended)
- Use hardware acceleration when available
- Run at native resolution when possible

### Troubleshooting Performance
- Try reducing quality settings in the control panel
- Switch to 30fps if 60fps is unstable
- Disable advanced effects if needed
- Check browser console for performance warnings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Documentation

- [Product Requirements](docs/product_requirements.md) - Detailed feature specifications
- [Implementation Plan](docs/implementation_plan.md) - Technical architecture and development roadmap  
- [Style Guide](docs/style_guide.md) - Design system and UI guidelines

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation in the `/docs` folder
- Review the code comments for implementation details
