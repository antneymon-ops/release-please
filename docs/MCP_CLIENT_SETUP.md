# MCP Client Setup Guide

Complete setup instructions for integrating the SonarQube MCP Server with popular AI coding assistants.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Claude Desktop](#claude-desktop)
- [VS Code Copilot](#vs-code-copilot)
- [Cursor](#cursor)
- [Windsurf](#windsurf)
- [Zed Editor](#zed-editor)
- [Gemini CLI](#gemini-cli)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Overview

The SonarQube MCP Server uses the Model Context Protocol (MCP) to communicate with AI assistants via stdio (standard input/output). Each client has a slightly different configuration method.

## Prerequisites

Before configuring any client:

1. **SonarQube MCP Server is installed and running**:
   ```bash
   # Verify server is built
   ls -la mcp-server/dist/index.js
   
   # Verify SonarQube is running
   curl http://localhost:9000/api/system/status
   ```

2. **SONARQUBE_TOKEN environment variable is set**:
   ```bash
   echo $SONARQUBE_TOKEN
   # Should output your token
   ```

3. **Know the absolute path to your MCP server**:
   ```bash
   pwd
   # Example: /home/user/release-please
   ```

## Claude Desktop

### Installation

Claude Desktop supports MCP servers natively through configuration files.

#### macOS

1. **Locate configuration file**:
   ```bash
   # Create directory if it doesn't exist
   mkdir -p ~/Library/Application\ Support/Claude
   ```

2. **Copy configuration**:
   ```bash
   cp clients/claude/claude-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Edit configuration**:
   ```bash
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

4. **Update paths**:
   ```json
   {
     "mcpServers": {
       "sonarqube": {
         "command": "node",
         "args": ["/absolute/path/to/release-please/mcp-server/dist/index.js"],
         "env": {
           "SONARQUBE_URL": "http://localhost:9000",
           "SONARQUBE_TOKEN": "your-token-here"
         }
       }
     }
   }
   ```

#### Linux

1. **Locate configuration directory**:
   ```bash
   mkdir -p ~/.config/claude
   ```

2. **Copy and edit configuration**:
   ```bash
   cp clients/claude/claude-config.json ~/.config/claude/config.json
   nano ~/.config/claude/config.json
   ```

3. **Update with absolute paths**

#### Windows

1. **Configuration location**:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Use Windows paths**:
   ```json
   {
     "mcpServers": {
       "sonarqube": {
         "command": "node",
         "args": ["C:\\Users\\YourName\\release-please\\mcp-server\\dist\\index.js"],
         "env": {
           "SONARQUBE_URL": "http://localhost:9000",
           "SONARQUBE_TOKEN": "your-token-here"
         }
       }
     }
   }
   ```

### Verification

1. **Restart Claude Desktop**

2. **Check MCP server connection**:
   - Look for "Connected" indicator in Claude
   - Try asking: "Can you analyze this project with SonarQube?"

3. **Test a tool**:
   ```
   Use the detect_anti_patterns tool to analyze src/manifest.ts
   ```

---

## VS Code Copilot

GitHub Copilot in VS Code supports MCP through workspace settings.

### Installation

1. **Ensure you have GitHub Copilot extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "GitHub Copilot"
   - Install if not already installed

2. **Copy configuration to workspace**:
   ```bash
   mkdir -p .vscode
   cp clients/vscode/settings.json .vscode/settings.json
   ```

3. **Edit `.vscode/settings.json`**:
   ```json
   {
     "github.copilot.advanced": {
       "mcp": {
         "servers": {
           "sonarqube": {
             "command": "node",
             "args": ["./mcp-server/dist/index.js"],
             "env": {
               "SONARQUBE_URL": "http://localhost:9000",
               "SONARQUBE_TOKEN": "${env:SONARQUBE_TOKEN}"
             }
           }
         }
       }
     }
   }
   ```

4. **Set environment variable**:
   
   **macOS/Linux**:
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export SONARQUBE_TOKEN=your-token-here
   
   # Launch VS Code from terminal to inherit environment
   code .
   ```

   **Windows**:
   ```powershell
   # Set user environment variable
   [System.Environment]::SetEnvironmentVariable('SONARQUBE_TOKEN', 'your-token', 'User')
   
   # Restart VS Code
   ```

### Verification

1. **Reload VS Code**:
   - Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows/Linux)
   - Type "Reload Window"
   - Press Enter

2. **Check Copilot Chat**:
   - Open Copilot Chat panel
   - Ask: "List available MCP tools"

3. **Test analysis**:
   ```
   @copilot Can you check the quality gate for this project?
   ```

---

## Cursor

Cursor has built-in MCP support through `.cursor/mcp.json` configuration.

### Installation

1. **Create Cursor configuration**:
   ```bash
   mkdir -p .cursor
   cp clients/cursor/mcp.json .cursor/mcp.json
   ```

2. **Edit `.cursor/mcp.json`**:
   ```json
   {
     "mcpServers": {
       "sonarqube": {
         "command": "node",
         "args": ["./mcp-server/dist/index.js"],
         "env": {
           "SONARQUBE_URL": "http://localhost:9000",
           "SONARQUBE_TOKEN": "${env:SONARQUBE_TOKEN}"
         }
       }
     }
   }
   ```

3. **Set environment variable**:
   ```bash
   export SONARQUBE_TOKEN=your-token-here
   
   # Launch Cursor from terminal
   cursor .
   ```

### Verification

1. **Restart Cursor**

2. **Check MCP status**:
   - Open Settings (Cmd+,)
   - Search for "MCP"
   - Should show "SonarQube" server connected

3. **Test in chat**:
   ```
   Use the detect_anti_patterns tool to find code smells in this file
   ```

---

## Windsurf

Windsurf supports MCP through its configuration file.

### Installation

1. **Copy configuration**:
   ```bash
   cp clients/windsurf/windsurf-config.json windsurf.config.json
   ```

2. **Edit `windsurf.config.json`**:
   ```json
   {
     "mcp": {
       "servers": [
         {
           "name": "sonarqube",
           "command": "node ./mcp-server/dist/index.js",
           "protocol": "stdio",
           "env": {
             "SONARQUBE_URL": "http://localhost:9000",
             "SONARQUBE_TOKEN": "${SONARQUBE_TOKEN}"
           }
         }
       ]
     }
   }
   ```

3. **Set environment variable** (same as above)

### Verification

1. **Restart Windsurf**

2. **Check MCP panel**:
   - Should show "SonarQube MCP Server" as connected

3. **Test functionality**:
   ```
   Analyze code quality metrics for this project
   ```

---

## Zed Editor

Zed supports MCP through `.zed/mcp-servers.json`.

### Installation

1. **Create Zed configuration**:
   ```bash
   mkdir -p .zed
   cp clients/zed/mcp-servers.json .zed/mcp-servers.json
   ```

2. **Edit `.zed/mcp-servers.json`**:
   ```json
   {
     "servers": {
       "sonarqube": {
         "command": ["node", "./mcp-server/dist/index.js"],
         "env": {
           "SONARQUBE_URL": "http://localhost:9000",
           "SONARQUBE_TOKEN": "${SONARQUBE_TOKEN}"
         }
       }
     }
   }
   ```

3. **Set environment variable**:
   ```bash
   export SONARQUBE_TOKEN=your-token-here
   zed .
   ```

### Verification

1. **Check Extensions panel** in Zed

2. **Look for MCP indicator** (usually bottom-right)

3. **Test in assistant**:
   ```
   Show me security hotspots in this codebase
   ```

---

## Gemini CLI

Gemini CLI integration uses a wrapper script.

### Installation

1. **Ensure Gemini CLI is installed**:
   ```bash
   # Install Gemini CLI (if not already installed)
   npm install -g @google/generative-ai-cli
   # or
   pip install google-generativeai
   ```

2. **Make script executable**:
   ```bash
   chmod +x clients/gemini/gemini-mcp.sh
   ```

3. **Set environment variables**:
   ```bash
   export SONARQUBE_URL=http://localhost:9000
   export SONARQUBE_TOKEN=your-token-here
   ```

### Usage

```bash
# Run Gemini with MCP server
./clients/gemini/gemini-mcp.sh

# The script will:
# 1. Start MCP server in background
# 2. Launch Gemini CLI with MCP context
# 3. Clean up when you exit
```

### Verification

```bash
# In Gemini CLI, try:
> List available tools from SonarQube

> Analyze anti-patterns in src/manifest.ts

> Check quality gate status
```

---

## Verification

### Common Verification Steps

For all clients, you can verify MCP integration by:

1. **Check MCP server is running**:
   ```bash
   ps aux | grep "node.*mcp-server"
   ```

2. **Test stdio communication**:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node mcp-server/dist/index.js
   ```

3. **Check logs**:
   ```bash
   # If running MCP server separately
   tail -f mcp-server/logs/*.log
   ```

### Test Prompts

Try these prompts in any connected client:

```
1. "List all available SonarQube tools"
2. "Analyze code quality for this project"
3. "Detect anti-patterns in the current file"
4. "Show me security vulnerabilities"
5. "Check if this project passes quality gates"
```

---

## Troubleshooting

### MCP Server Not Connecting

**Problem**: Client shows "MCP server not connected"

**Solutions**:
1. Check MCP server path is absolute:
   ```bash
   # Get absolute path
   cd /path/to/release-please/mcp-server
   pwd
   # Use this full path in config
   ```

2. Verify server runs standalone:
   ```bash
   node /absolute/path/to/mcp-server/dist/index.js
   # Should start without errors
   ```

3. Check environment variables:
   ```bash
   echo $SONARQUBE_TOKEN
   # Should output your token
   ```

### Permission Denied

**Problem**: "EACCES: permission denied"

**Solution**:
```bash
# Make sure files are executable
chmod +x mcp-server/dist/index.js
chmod +x scripts/*.sh
chmod +x clients/gemini/*.sh
```

### Token Not Found

**Problem**: "SONARQUBE_TOKEN is not set"

**Solutions**:

1. **Set in shell profile**:
   ```bash
   echo 'export SONARQUBE_TOKEN=your-token' >> ~/.bashrc
   source ~/.bashrc
   ```

2. **Set in client config** (hardcode for testing):
   ```json
   "env": {
     "SONARQUBE_TOKEN": "squ_actual_token_here"
   }
   ```

3. **Launch client from terminal** (inherits environment):
   ```bash
   export SONARQUBE_TOKEN=your-token
   code .  # VS Code
   cursor .  # Cursor
   zed .  # Zed
   ```

### Wrong Node Version

**Problem**: "Unsupported Node.js version"

**Solution**:
```bash
# Check Node version
node --version
# Should be v18.0.0 or higher

# Update Node
nvm install 18
nvm use 18
```

### SonarQube Connection Failed

**Problem**: "Cannot connect to SonarQube"

**Solutions**:

1. **Check SonarQube is running**:
   ```bash
   curl http://localhost:9000/api/system/status
   ```

2. **Check firewall**:
   ```bash
   # Allow port 9000
   sudo ufw allow 9000
   ```

3. **Use correct URL**:
   - If in Docker: `http://sonarqube:9000`
   - If local: `http://localhost:9000`
   - If remote: `http://your-server:9000`

### Client-Specific Issues

#### Claude Desktop

- **Config not loading**: Ensure file is named exactly `claude_desktop_config.json`
- **Path issues**: Use absolute paths, avoid `~` or `./`

#### VS Code

- **Copilot not available**: Ensure GitHub Copilot extension is installed and activated
- **Settings not applied**: Reload window (Cmd/Ctrl+Shift+P → "Reload Window")

#### Cursor

- **MCP not enabled**: Check Cursor settings → Features → Enable MCP
- **Config ignored**: Restart Cursor completely

#### Windsurf

- **Server not starting**: Check `windsurf.log` for errors
- **Protocol error**: Ensure `"protocol": "stdio"` is set

#### Zed

- **Config location**: Must be in `.zed/mcp-servers.json` in project root
- **Command format**: Use array format: `["node", "path"]`

## Best Practices

1. **Use environment variables** for sensitive data:
   ```json
   "env": {
     "SONARQUBE_TOKEN": "${env:SONARQUBE_TOKEN}"
   }
   ```

2. **Use relative paths** when possible:
   ```json
   "args": ["./mcp-server/dist/index.js"]
   ```

3. **Test server independently** before client integration:
   ```bash
   node mcp-server/dist/index.js <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

4. **Keep logs enabled** during setup:
   ```bash
   export LOG_LEVEL=debug
   ```

5. **Document your setup** for team members

## Next Steps

- **Learn about Anti-Patterns**: [ANTI_PATTERN_GUIDE.md](ANTI_PATTERN_GUIDE.md)
- **Explore API**: [API.md](API.md)
- **Get help**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Additional Resources

- **MCP Documentation**: https://modelcontextprotocol.io/
- **Claude Desktop**: https://claude.ai/desktop
- **GitHub Copilot**: https://github.com/features/copilot
- **Cursor**: https://cursor.sh/
- **Windsurf**: https://windsurf.ai/
- **Zed**: https://zed.dev/
