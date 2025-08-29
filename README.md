# Virtual Studio

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
