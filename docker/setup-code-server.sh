#!/bin/bash
set -e

echo "Setting up code-server development environment..."

# Set clean PATH
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Update package list and install dependencies
echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y curl git wget

# Install Node.js 20
echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Set proper permissions for SSH
echo "Setting up SSH permissions..."
if [ -d "/home/coder/.ssh" ]; then
    sudo chown -R coder:coder /home/coder/.ssh
    chmod 700 /home/coder/.ssh
    chmod 600 /home/coder/.ssh/* 2>/dev/null || true
fi

# Set proper permissions for Claude directory
echo "Setting up Claude directory..."
if [ -d "/home/coder/.claude" ]; then
    sudo chown -R coder:coder /home/coder/.claude
fi

# Set up code-server directories and permissions
echo "Setting up code-server directories..."
sudo mkdir -p /home/coder/.local/share/code-server/extensions
sudo mkdir -p /home/coder/.local/share/code-server/logs
sudo mkdir -p /home/coder/.local/share/code-server/User
sudo mkdir -p /home/coder/.vscode-server
sudo chown -R coder:coder /home/coder/.local/share/code-server
sudo chown -R coder:coder /home/coder/.vscode-server

# Ensure extensions.json exists in the correct location
if [ ! -f "/home/coder/.local/share/code-server/extensions/extensions.json" ]; then
    echo "Creating extensions.json..."
    echo "[]" > /home/coder/.local/share/code-server/extensions/extensions.json
    chown coder:coder /home/coder/.local/share/code-server/extensions/extensions.json
fi

# Ensure User settings exist with basic configuration
if [ ! -f "/home/coder/.local/share/code-server/User/settings.json" ]; then
    echo '{"window.autoDetectColorScheme": true}' > /home/coder/.local/share/code-server/User/settings.json
fi

# Create a workspace state to ensure code-server opens the correct folder
mkdir -p /home/coder/.local/share/code-server/User/workspaceStorage
echo "Setting default workspace to /workspace"

# Install Claude Code CLI (simplified approach)
echo "Setting up Claude Code CLI..."
CLAUDE_BIN_DIR="/home/coder/.local/bin"
mkdir -p "$CLAUDE_BIN_DIR"

# Add to PATH for this session and future sessions
export PATH="$CLAUDE_BIN_DIR:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/coder/.bashrc

# Try to install Claude Code (optional - will continue if it fails)
if ! command -v claude >/dev/null 2>&1; then
    echo "Attempting to install Claude Code CLI..."
    if curl -fsSL https://claude.ai/install.sh | bash; then
        echo "Claude Code CLI installed successfully"
    else
        echo "Claude Code CLI installation failed, but continuing..."
        # Create a placeholder script so the command exists
        cat > "$CLAUDE_BIN_DIR/claude" << 'EOF'
#!/bin/bash
echo "Claude Code CLI not available in this container. Please install manually or use from host system."
EOF
        chmod +x "$CLAUDE_BIN_DIR/claude"
    fi
fi

echo "Starting code-server..."
# Start code-server with explicit workspace configuration
exec code-server --bind-addr 0.0.0.0:8080 --disable-telemetry --auth password /workspace