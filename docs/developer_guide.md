# Virtual Studio Developer Guide

This guide provides comprehensive information for developers who want to contribute to Virtual Studio or extend its functionality.

## Development Environment Setup

### Prerequisites

1. **Node.js**: Version 18 or higher
   ```bash
   # Check your Node.js version
   node --version
   
   # Install using nvm (recommended)
   nvm install 18
   nvm use 18
   ```

2. **Package Manager**: npm, yarn, or pnpm
   ```bash
   # npm (comes with Node.js)
   npm --version
   
   # yarn (optional)
   npm install -g yarn
   
   # pnpm (optional, faster)
   npm install -g pnpm
   ```

3. **Git**: For version control
   ```bash
   git --version
   ```

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
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
   ```

4. **Verify setup**
   - Open http://localhost:3000
   - Check browser console for any errors
   - Verify WebGL is working (check for gradient backgrounds)

### Troubleshooting Setup Issues

If you encounter build errors during setup:

#### TypeScript Compilation Errors
```bash
# Common error: "Cannot import type declaration files"
# Solution: Ensure you're using correct import paths
# ❌ Wrong: import type { Config } from '@types/studio'
# ✅ Correct: import type { Config } from '@/types/studio'
```

#### Missing Dependencies
```bash
# If build fails with missing dependencies:
npm install --save-dev @types/node terser

# For development server issues:
npm run dev -- --host
```

#### Port Connection Issues
If `localhost:3000` refuses connection:
- Check if another process is using port 3000
- Try the network IP address shown in terminal output
- For WSL2: Access from Windows browser using `localhost:3000`

#### Clean Installation
If problems persist, try a fresh install:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build  # Verify build works
npm run dev    # Start development
```

## Project Architecture

### Core Technologies

- **React 19**: UI framework with concurrent rendering
- **TypeScript 5.8+**: Type safety and developer experience
- **Vite 7**: Build tool with hot module replacement
- **Three.js 0.179**: WebGL rendering and 3D graphics
- **Zustand 5**: State management with Immer for immutability
- **PostCSS**: CSS processing and optimization

### Module Structure

```
src/
├── engine/           # Core rendering system
├── studio/           # Visual components (backgrounds, graphics)  
├── controls/         # UI controls and panels
├── services/         # Business logic and utilities
├── animations/       # Animation system and easing
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

### Key Design Principles

1. **Performance First**: Every decision prioritizes 60fps rendering
2. **Code-based Visuals**: Minimal static assets, maximum procedural generation
3. **Modular Architecture**: Loosely coupled, highly cohesive components
4. **Type Safety**: Comprehensive TypeScript usage
5. **Progressive Enhancement**: WebGL-first with graceful CSS fallbacks

## Development Workflow

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We use conventional commits for automated changelog generation:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(backgrounds): add radial gradient support
fix(ticker): resolve text overflow on mobile
docs(api): update component prop documentation
```

## Coding Standards

### TypeScript Guidelines

1. **Strict Types**: Use strict TypeScript configuration
   ```typescript
   // Good
   interface BackgroundConfig {
     type: 'gradient' | 'image' | 'solid';
     visible: boolean;
   }

   // Avoid
   const config: any = { ... };
   ```

2. **Proper Interfaces**: Define clear interfaces for all data structures
   ```typescript
   // Component props
   interface LowerThirdProps {
     config: LowerThird;
     onAnimationComplete?: () => void;
   }

   // State interfaces
   interface StudioState {
     background: StudioBackground;
     // ... other properties
   }
   ```

3. **Generic Types**: Use generics for reusable components
   ```typescript
   interface Renderer<T = any> {
     initialize(config: T): Promise<void>;
     render(deltaTime: number): void;
   }
   ```

### React Patterns

1. **Functional Components**: Use function components with hooks
   ```typescript
   const LowerThird: React.FC<LowerThirdProps> = ({ config }) => {
     const [isVisible, setIsVisible] = useState(config.visible);
     
     // Component logic
     
     return <div className="lower-third">...</div>;
   };
   ```

2. **Custom Hooks**: Extract reusable logic
   ```typescript
   const useAnimation = (enabled: boolean) => {
     const [isAnimating, setIsAnimating] = useState(false);
     
     // Animation logic
     
     return { isAnimating, startAnimation, stopAnimation };
   };
   ```

3. **Prop Drilling Prevention**: Use context or state management
   ```typescript
   // Use Zustand store instead of prop drilling
   const background = useStudioStore((state) => state.background);
   ```

### CSS/Styling Guidelines

1. **CSS Modules**: Use scoped styles
   ```css
   /* LowerThird.module.css */
   .container {
     background: rgba(0, 0, 0, 0.8);
     backdrop-filter: blur(10px);
   }
   ```

2. **Performance-First CSS**: Use GPU-accelerated properties
   ```css
   /* Good - GPU accelerated */
   .animate {
     transform: translateX(100px);
     opacity: 0.5;
   }

   /* Avoid - causes reflow */
   .animate {
     left: 100px;
     display: none;
   }
   ```

3. **Responsive Design**: Mobile-first approach
   ```css
   .component {
     /* Mobile styles */
     font-size: 14px;
   }

   @media (min-width: 768px) {
     .component {
       /* Desktop styles */
       font-size: 16px;
     }
   }
   ```

### Performance Guidelines

1. **Memoization**: Use React.memo and useMemo strategically
   ```typescript
   const ExpensiveComponent = React.memo(({ data }) => {
     const processedData = useMemo(() => 
       expensiveOperation(data), [data]);
     
     return <div>{processedData}</div>;
   });
   ```

2. **WebGL Optimization**: Minimize draw calls and state changes
   ```typescript
   // Good - batch operations
   renderer.setRenderTarget(target);
   renderer.render(scene1, camera);
   renderer.render(scene2, camera);

   // Avoid - frequent context switching
   renderer.setRenderTarget(target1);
   renderer.render(scene1, camera);
   renderer.setRenderTarget(target2);
   renderer.render(scene2, camera);
   ```

3. **State Updates**: Use immer for complex state updates
   ```typescript
   const updateBackground = (updates: Partial<StudioBackground>) =>
     set((state) => {
       Object.assign(state.background, updates);
     });
   ```

## Component Development

### Creating New Components

1. **Component Structure**
   ```typescript
   // src/studio/graphics/NewComponent.tsx
   import React from 'react';
   import { useStudioStore } from '@services/state/studioStore';
   import './NewComponent.css';

   interface NewComponentProps {
     config: NewComponentConfig;
     onUpdate?: (config: NewComponentConfig) => void;
   }

   export const NewComponent: React.FC<NewComponentProps> = ({ 
     config, 
     onUpdate 
   }) => {
     // Component logic
     
     return (
       <div className="new-component">
         {/* JSX content */}
       </div>
     );
   };
   ```

2. **Add Type Definitions**
   ```typescript
   // src/types/studio.ts
   export interface NewComponentConfig {
     id: string;
     visible: boolean;
     // ... other properties
   }
   ```

3. **Create Control Panel**
   ```typescript
   // src/controls/panels/NewComponentControls.tsx
   export const NewComponentControls: React.FC = () => {
     const config = useStudioStore((state) => state.newComponent);
     const setConfig = useStudioStore((state) => state.setNewComponent);
     
     return (
       <div className="control-section">
         {/* Control inputs */}
       </div>
     );
   };
   ```

### WebGL/Three.js Components

1. **Renderer Pattern**
   ```typescript
   export class NewRenderer {
     private scene: THREE.Scene;
     private material: THREE.Material;
     private mesh: THREE.Mesh;

     constructor(config: RendererConfig) {
       this.scene = new THREE.Scene();
       // Initialize renderer
     }

     create(): THREE.Mesh {
       // Create geometry and materials
       return this.mesh;
     }

     update(deltaTime: number): void {
       // Update animation/properties
     }

     dispose(): void {
       // Clean up resources
       this.material?.dispose();
       this.mesh?.geometry?.dispose();
     }
   }
   ```

2. **GLSL Shaders**
   ```glsl
   // src/engine/webgl/shaders/new-effect.frag
   #version 300 es
   precision highp float;

   uniform float time;
   uniform vec2 resolution;

   out vec4 fragColor;

   void main() {
     vec2 uv = gl_FragCoord.xy / resolution.xy;
     // Shader logic
     fragColor = vec4(color, 1.0);
   }
   ```

## Testing

### Unit Testing Setup

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  const defaultConfig = {
    id: 'test',
    visible: true,
    // ... other properties
  };

  it('renders correctly', () => {
    render(<NewComponent config={defaultConfig} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles visibility toggle', () => {
    const { rerender } = render(<NewComponent config={defaultConfig} />);
    
    rerender(<NewComponent config={{ ...defaultConfig, visible: false }} />);
    // Test visibility change
  });
});
```

### Performance Testing

```typescript
// Performance test example
describe('Performance Tests', () => {
  it('maintains 60fps during animation', async () => {
    const startTime = performance.now();
    
    // Run animation for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const endTime = performance.now();
    const frametime = (endTime - startTime) / 60; // Expected 60 frames
    
    expect(frametime).toBeLessThan(16.67); // 16.67ms per frame = 60fps
  });
});
```

## Debugging

### Development Tools

1. **React DevTools**: Install browser extension for React debugging
2. **Redux DevTools**: Works with Zustand for state debugging  
3. **Three.js DevTools**: For WebGL scene inspection

### Common Debug Patterns

1. **State Debugging**
   ```typescript
   const useStudioStore = create<StudioState>()(
     subscribeWithSelector(
       devtools( // Enable Redux DevTools
         immer((set, get) => ({ ... })),
         { name: 'Virtual Studio Store' }
       )
     )
   );
   ```

2. **Performance Monitoring**
   ```typescript
   const usePerformanceMonitor = () => {
     useEffect(() => {
       const monitor = new PerformanceObserver((list) => {
         list.getEntries().forEach((entry) => {
           console.log(`${entry.name}: ${entry.duration}ms`);
         });
       });
       
       monitor.observe({ entryTypes: ['measure'] });
       return () => monitor.disconnect();
     }, []);
   };
   ```

3. **WebGL Debugging**
   ```typescript
   // Enable WebGL error checking in development
   if (process.env.NODE_ENV === 'development') {
     renderer.debug.checkShaderErrors = true;
     renderer.debug.onShaderError = (gl, program, vs, fs) => {
       console.error('Shader compilation error:', { vs, fs });
     };
   }
   ```

## Build and Deployment

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Build Configuration

The project uses Vite with the following optimizations:

1. **Code Splitting**: Automatic vendor chunking
2. **Tree Shaking**: Removes unused code
3. **Minification**: Terser for optimal compression
4. **Source Maps**: Available in production builds

### Performance Targets

- **Initial Load**: < 3 seconds
- **Time to Interactive**: < 5 seconds  
- **Frame Rate**: 60fps at 1080p
- **Memory Usage**: < 200MB
- **Bundle Size**: < 2MB gzipped

## API Reference

### Core Hooks

```typescript
// State management
const useStudioStore = (selector) => StudioState

// Animation system
const useSpringAnimation = (config) => SpringAnimation
const useEasing = (type) => EasingFunction

// Rendering
const useRenderer = (type) => Renderer
const useWebGL = () => WebGLRenderer | null
```

### Component Props

```typescript
// Background components
interface BackgroundProps {
  config: BackgroundConfig;
  visible: boolean;
}

// Graphics components  
interface GraphicsProps {
  config: GraphicsConfig;
  onAnimationComplete?: () => void;
}

// Control components
interface ControlProps {
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}
```

## Troubleshooting

### Common Issues

1. **WebGL Not Working**
   ```typescript
   // Check WebGL support
   const canvas = document.createElement('canvas');
   const gl = canvas.getContext('webgl2');
   if (!gl) {
     console.warn('WebGL2 not supported, falling back to CSS');
   }
   ```

2. **State Not Persisting**
   ```typescript
   // Check localStorage availability
   if (!localStorageService.isAvailable()) {
     console.warn('localStorage not available');
   }
   ```

3. **Performance Issues**
   ```typescript
   // Enable performance monitoring
   const stats = renderer.getStats();
   console.log('FPS:', stats.fps, 'Memory:', stats.memory);
   ```

### Getting Help

1. **Check Documentation**: Review all files in `/docs`
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Console Logs**: Check browser console for error messages
4. **Performance Tab**: Use browser dev tools for performance analysis

## Contributing Guidelines

### Before Submitting a PR

1. **Code Quality**
   - [ ] All TypeScript errors resolved
   - [ ] ESLint passes without warnings
   - [ ] Code follows established patterns
   - [ ] Performance targets maintained

2. **Testing**
   - [ ] Unit tests added for new features
   - [ ] Manual testing completed
   - [ ] Cross-browser compatibility verified
   - [ ] Mobile responsiveness tested

3. **Documentation**
   - [ ] JSDoc comments added for public APIs
   - [ ] README updated if needed
   - [ ] Type definitions updated
   - [ ] Changelog entry added

### Review Process

1. **Automated Checks**: CI will run lint, type-check, and tests
2. **Code Review**: Maintainer will review code quality and architecture  
3. **Manual Testing**: Changes will be tested in actual streaming scenarios
4. **Documentation Review**: Ensure all documentation is accurate and complete

Thank you for contributing to Virtual Studio! 🎥✨