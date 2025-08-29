# Development Environment Setup

This document describes how to set up the development environment for Virtual Studio using Docker and code-server for browser-based development.

## Quick Start with Docker Development Environment

### Prerequisites
- Docker and Docker Compose installed
- Your SSH keys configured in `~/.ssh/` for git access

### Starting the Development Environment

```bash
# Start both the app and code-server
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Access Points
- **Virtual Studio App**: http://localhost:3000
- **Code-server (VS Code in browser)**: http://localhost:8443
  - Default password: `virtualstudio123` (can be changed via `CODE_SERVER_PASSWORD` env var)

### Stopping the Environment
```bash
docker-compose -f docker-compose.dev.yml down
```

## Code-server Features

The development environment includes:

### Pre-installed Tools
- Node.js 20
- npm
- Git
- VS Code extensions optimized for React/TypeScript/WebGL development

### SSH Integration
- Your `~/.ssh` directory is mounted for git access
- Your `.gitconfig` is mounted for git user settings

### Claude Code Integration
- Claude Code CLI is automatically installed in the container
- Your `~/.claude` directory is mounted to preserve your Claude Code settings and customizations
- Claude Code commands are available in the integrated terminal

### Persistent Data
- **VS Code extensions and settings**: Stored in `./.code-server/` directory (locally persisted)
- **Claude Code configuration**: Your `~/.claude` directory mounted with read/write access
- **Workspace data**: Project files mounted from your local directory
- **SSH configuration**: Your `~/.ssh` directory mounted read-only for git access
- **Git configuration**: Your `~/.gitconfig` mounted for user settings

All VS Code extensions, settings, and customizations are stored locally in the `.code-server/` directory, ensuring they persist between container restarts and are backed up with your project files.

**Important**: The following files are committed to version control for team consistency:
- `.code-server/data/User/settings.json` - Shared user settings
- `.code-server/data/User/keybindings.json` - Shared keyboard shortcuts

All other code-server data (logs, temporary files, etc.) are gitignored.

## Recommended VS Code Extensions

The `.vscode/extensions.json` includes recommended extensions for:

### Core Development
- **TypeScript & JavaScript**: Enhanced TypeScript support and debugging
- **React**: JSX/TSX support, snippets, and refactoring tools
- **ESLint/Prettier**: Code quality and formatting

### WebGL/Three.js Development
- **Shader support**: GLSL syntax highlighting and linting
- **WebGL tools**: Enhanced debugging for WebGL applications

### DevOps & Docker
- **Docker support**: Container management and debugging
- **Remote containers**: Development inside containers

### Productivity Tools
- **GitLens**: Enhanced git integration
- **Todo highlighting**: Track TODO comments
- **Color tools**: Color picker and highlighting for CSS/graphics work

## VS Code Configuration

The workspace includes optimized settings for:

### Path Aliases
Configured to work with the project's TypeScript path mapping:
- `@/` → `./src/`
- `@engine/` → `./src/engine/`
- `@studio/` → `./src/studio/`
- `@controls/` → `./src/controls/`
- `@services/` → `./src/services/`
- `@types/` → `./src/types/`

### File Associations
- `.vert`, `.frag`, `.glsl` files are recognized as GLSL shaders
- Enhanced shader syntax highlighting and validation

### Debug Configuration
Pre-configured launch configurations for:
- Chrome debugging against localhost:3000
- Firefox debugging
- Node.js debugging for Vite dev server
- Compound configurations for full-stack debugging

## Development Workflow

### 1. Start Development Environment
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Access Code-server
Navigate to http://localhost:8443 and log in with the password.

**Important**: Code-server will automatically open with the repository root (`/workspace`) as the active workspace. You should see all your project files immediately available in the file explorer, including:
- Source code in `src/`
- Configuration files (`package.json`, `vite.config.ts`, etc.)
- Documentation and README files
- The `.vscode/` directory with project settings

If you need to explicitly open the workspace, you can use File > Open Workspace and select `virtual-studio.code-workspace`.

### 3. Development Tasks
Use VS Code's integrated terminal or the Command Palette tasks:

- **Start Dev Server**: `Ctrl+Shift+P` → "Tasks: Run Task" → "npm: dev"
- **Build Project**: `Ctrl+Shift+P` → "Tasks: Run Task" → "npm: build"
- **Lint Code**: `Ctrl+Shift+P` → "Tasks: Run Task" → "npm: lint"
- **TypeScript Check**: `Ctrl+Shift+P` → "Tasks: Run Task" → "TypeScript: Check All"

### 3.1. Claude Code Usage
In the integrated terminal, you can use Claude Code commands:

```bash
# Use Claude Code for development assistance
claude "help me implement a new particle effect"

# Use Claude Code to review code changes
claude "review my latest changes"

# Use Claude Code for debugging
claude "help debug this WebGL issue"
```

Your Claude Code settings and customizations from `~/.claude` are available in the container.

### 4. Debugging
- Set breakpoints in your TypeScript/React code
- Use `F5` to launch the "Launch Chrome against localhost:3000" configuration
- Debug both client-side React code and build processes

### 5. Hot Reload
Changes to source files will automatically trigger hot reload in the browser.

## Environment Variables

### Code-server Configuration
- `CODE_SERVER_PASSWORD`: Set password for code-server access (default: virtualstudio123)

### Development Server Configuration
- `CHOKIDAR_USEPOLLING=true`: Enables file watching in containers
- `WATCHPACK_POLLING=true`: Enhanced file watching for Webpack/Vite

## Troubleshooting

### Workspace Not Opening Correctly
If code-server doesn't show the project files:
1. Check that you're accessing http://localhost:8443 (not a different port)
2. After logging in, use File > Open Folder and navigate to `/workspace`
3. Alternatively, use File > Open Workspace and select `virtual-studio.code-workspace`

### File Watching Issues
If hot reload isn't working:
```bash
# Restart with polling enabled
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### Permission Issues
If you encounter permission issues with SSH or git:
```bash
# Check SSH permissions in the container
docker exec -it virtual-studio-code-server ls -la /home/coder/.ssh/
```

### Performance Issues
The development container includes resource limits. If performance is poor, you can adjust them in `docker-compose.dev.yml`.

## Local Development (Alternative)

If you prefer local development without Docker:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In separate terminal - start linting
npm run lint
```

Then use your local VS Code installation with the recommended extensions.