# Virtual Studio

A high-performance, browser-based broadcast graphics application designed for content creators, streamers, and video producers. Virtual Studio provides professional-quality overlay graphics that work seamlessly with OBS Studio and other streaming software. test

## Features

### 🎨 Dynamic Backgrounds
- **Procedural Gradients**: Code-generated animated gradients using WebGL shaders
- **Image Backgrounds**: Support for custom background images with positioning controls
- **CSS Fallback**: Automatic fallback to CSS-based rendering for broader compatibility
- **Real-time Switching**: Instant background changes without performance impact

### 📺 Broadcast Graphics
- **Lower Thirds**: Customizable name and title overlays with multiple animation styles
- **Ticker Tape**: Scrolling news ticker with customizable content and speed
- **Date/Time Overlay**: Flexible real-time display with options for date-only, time-only, or combined display with timezone support
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
=======
A browser-based broadcast graphics application that creates professional-quality backgrounds and overlays for content creators, streamers, and broadcasters.

## ✨ Features

- **Real-time Rendering**: 60fps performance at 1080p resolution
- **Customizable Backgrounds**: Procedural gradients, particle effects, and image backgrounds
- **Professional Graphics**: Lower thirds, live indicators, clocks, and ticker tapes
- **OBS Integration**: Optimized for browser source capture with transparent backgrounds
- **Live Editing**: Real-time control panel for instant updates during streaming
- **Keyboard Shortcuts**: Quick toggles and preset switching
- **Responsive Design**: Works across different screen sizes and devices

## 🚀 Quick Start with Docker

### Production Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd virtual-studio
```

2. Start the application:
```bash
docker-compose up -d
```

3. Open your browser to `http://localhost:8080`

### Development Mode

For development with hot reload:
```bash
docker-compose --profile development up
```

The development server will be available at `http://localhost:3000`

## 📦 Manual Installation

### Prerequisites

- Node.js 20+
- npm or pnpm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🎥 OBS Studio Integration

### Adding as Browser Source

1. In OBS Studio, add a new **Browser Source**
2. Set the URL to: `http://localhost:8080` (or your deployed URL)
3. Set dimensions to `1920x1080` for full HD
4. Enable **Shutdown source when not visible** for better performance
5. Enable **Refresh browser when scene becomes active** if needed

### Recommended Settings

- **Width**: 1920
- **Height**: 1080
- **FPS**: 60 (if your system supports it)
- **Custom CSS**: Leave empty (styling is handled by the app)

### Chroma Key Setup

For green screen compositing:
1. Set background to a solid green color in the app
2. Add a **Chroma Key** filter to the browser source in OBS
3. Adjust similarity and smoothness as needed

## 🎛️ Usage Guide

### Control Panel

The control panel provides real-time editing of all visual elements:

#### Background Controls
- **Type**: Choose between gradient, image, or solid color backgrounds
- **Colors**: Customize gradient colors and directions
- **Animation**: Control particle effects and movement
- **Visibility**: Toggle background on/off

#### Lower Third Graphics
- **Text**: Set name, title, and subtitle
- **Styling**: Font selection, colors, and sizing
- **Animation**: Entry/exit animations
- **Position**: Drag to reposition or use precise coordinates

#### Live Elements
- **Clock**: Digital time display with timezone support
- **Live Indicator**: Customizable "LIVE" or "ON AIR" indicator
- **Ticker**: Scrolling text for news feeds or announcements

#### Presets
- **Save**: Store current configuration as a preset
- **Load**: Quickly switch between saved configurations
- **Export/Import**: Share presets between installations

### Keyboard Shortcuts

- `Spacebar`: Toggle background visibility
- `1-9`: Load preset by number
- `L`: Toggle lower third
- `C`: Toggle clock
- `T`: Toggle ticker
- `Ctrl+S`: Save current preset
- `Esc`: Hide all overlays

## 🛠️ Docker Commands

### Production
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose build

# Restart services
docker-compose restart
```

### Development
```bash
# Start development environment
docker-compose --profile development up

# Stop development environment
docker-compose --profile development down
```

### Direct Docker Usage
```bash
# Build production image
docker build -t virtual-studio:latest .

# Run container
docker run -p 8080:80 virtual-studio:latest

# Access container shell
docker exec -it virtual-studio sh
```

## ⚙️ Configuration

### Environment Variables

- `NODE_ENV`: Set to `production` for optimized builds
- `TZ`: Timezone for clock display (defaults to UTC)

### Resource Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 512MB
- GPU: WebGL-compatible graphics

**Recommended**:
- CPU: 4+ cores
- RAM: 1GB+
- GPU: Dedicated graphics card with WebGL 2.0 support

## 📁 Project Structure

```
/src
├── engine/          # Rendering engine (WebGL, Canvas2D, CSS)
├── studio/          # Studio components (backgrounds, graphics)
├── controls/        # Control panel UI
├── services/        # State management and business logic
├── animations/      # Animation systems
└── types/           # TypeScript type definitions
```

## 🔧 Development

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite with Hot Module Replacement
- **Graphics**: Three.js for WebGL rendering
- **State**: Zustand with Immer
- **Styling**: CSS Modules with CSS-in-JS

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Testing

Currently no test framework is configured. Tests can be added with Vitest.

## 🚨 Troubleshooting

### Performance Issues

1. **Check WebGL Support**: Ensure your browser supports WebGL 2.0
2. **Reduce Quality**: Lower particle count in background settings
3. **Close Other Tabs**: Free up system resources
4. **Update Drivers**: Ensure graphics drivers are current

### OBS Integration Issues

1. **Refresh Browser Source**: Right-click source → Refresh
2. **Check URL**: Ensure the application is running and accessible
3. **Disable Hardware Acceleration**: In browser source properties
4. **Adjust Dimensions**: Match your canvas resolution

### Common Errors

**Build Errors**: Check Node.js version (requires 20+)
**Port Conflicts**: Change port in docker-compose.yml if 8080 is in use
**Memory Issues**: Increase Docker memory allocation

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the project documentation
