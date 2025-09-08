# Virtual Studio

Professional broadcast graphics for content creators. A browser-based application that creates customizable backgrounds and overlays optimized for OBS Studio integration.

## Features

- **Real-time Rendering**: 60fps performance at 1080p with WebGL acceleration
- **Dynamic Backgrounds**: Procedural gradients, particle effects, and custom images
- **Broadcast Graphics**: Lower thirds, live indicators, date/time displays, and ticker tapes
- **Live Controls**: Real-time editing without interrupting your stream
- **Keyboard Shortcuts**: Quick toggles and preset switching
- **OBS Optimized**: Transparent backgrounds and browser source compatibility

## Quick Start

### Docker (Recommended)

1. **Production deployment:**
   ```bash
   git clone <repository-url>
   cd virtual-studio
   docker-compose up -d
   ```
   Access at `http://localhost:8080`

2. **Development with hot reload:**
   ```bash
   docker-compose --profile development up
   ```
   Access at `http://localhost:3000`

### Manual Installation

**Requirements:** Node.js 20+

```bash
# Install and run
npm install
npm run dev

# Build for production
npm run build
```

## OBS Studio Integration

1. Add **Browser Source** in OBS
2. Set URL to `http://localhost:8080`
3. Set dimensions to **1920x1080**
4. Enable **"Shutdown source when not visible"** for performance
5. Optional: Enable **"Refresh browser when scene becomes active"**

## Usage

### Control Panel
- **Backgrounds**: Gradients, images, particles with real-time animation controls
- **Lower Thirds**: Name/title overlays with customizable fonts and animations
- **Date/Time**: Flexible display options with timezone support
- **Live Elements**: Animated indicators and scrolling tickers
- **Presets**: Save/load complete configurations

### Keyboard Shortcuts
- `0-4`: Toggle studio elements
- `Tab`: Toggle control panel
- `p`: Preview mode
- `Esc`: Hide all overlays

## Technology Stack

- **React 18** + TypeScript
- **Three.js** for WebGL rendering
- **Zustand** state management
- **Vite** build system
- **CSS Modules** styling

## Docker Commands

```bash
# Production
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose build              # Rebuild

# Development
docker-compose --profile development up    # Start dev mode
docker-compose --profile development down  # Stop dev mode
```

## Project Structure

```
src/
├── engine/       # WebGL rendering and Canvas fallbacks
├── studio/       # Graphics components (backgrounds, overlays)
├── controls/     # Control panel UI
├── services/     # State management and storage
└── types/        # TypeScript definitions
```

## Browser Support

- **Chrome/Edge**: 88+ (recommended for WebGL performance)
- **Firefox**: 85+
- **Safari**: 14+

WebGL 2.0 required for optimal performance. Automatic CSS fallback available.

## Performance Tips

- Use Chrome or Edge for best WebGL performance
- Close unnecessary browser tabs
- Ensure adequate system memory (4GB+ recommended)
- Reduce quality settings if experiencing frame drops

## License

MIT License - see LICENSE file for details.