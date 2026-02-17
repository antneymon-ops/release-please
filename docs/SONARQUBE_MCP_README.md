# SonarQube MCP Server

A comprehensive SonarQube Model Context Protocol (MCP) Server with built-in anti-pattern detection for AI coding assistants.

## 🎯 Overview

This MCP server integrates SonarQube code quality analysis with popular AI coding assistants (Claude Desktop, VS Code Copilot, Cursor, Windsurf, Zed, Gemini CLI), providing:

- **Real-time Code Quality Analysis**: Get instant feedback on code quality metrics
- **Anti-Pattern Detection**: Custom rules to detect common coding anti-patterns
- **Security Vulnerability Scanning**: Identify security hotspots and vulnerabilities
- **Quality Gate Enforcement**: Ensure code meets quality standards before deployment
- **Multi-Client Support**: Works with 6+ AI coding assistants

## ✨ Features

### Code Quality Tools
- **Project Analysis**: Get comprehensive metrics (bugs, vulnerabilities, code smells)
- **Quality Gates**: Check if project passes quality requirements
- **Issue Detection**: Find bugs, vulnerabilities, and code smells
- **Security Scanning**: Identify security hotspots
- **Repository Scanning**: Trigger full repository analysis

### Anti-Pattern Detection
- **God Objects**: Classes with too many responsibilities
- **Long Methods**: Methods exceeding 50 lines
- **Magic Numbers**: Unexplained numeric literals
- **Duplicate Code**: Repeated code blocks
- **Complex Conditionals**: Overly complex if statements
- **Long Parameter Lists**: Functions with 5+ parameters
- **Deep Nesting**: Excessive indentation levels
- **Circular Dependencies**: Potential circular imports

### Supported AI Clients
1. **Claude Desktop** - Anthropic's desktop app
2. **VS Code Copilot** - GitHub Copilot integration
3. **Cursor** - AI-first code editor
4. **Windsurf** - Next-gen coding assistant
5. **Zed** - High-performance editor
6. **Gemini CLI** - Google's Gemini command-line tool

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** (for SonarQube)
- **Node.js** 18+ (for MCP server)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/antneymon-ops/release-please.git
cd release-please

# Run setup script
./scripts/setup.sh
```

The setup script will:
1. Start SonarQube and PostgreSQL containers
2. Install MCP server dependencies
3. Build the TypeScript code
4. Provide instructions for token generation

### Configuration

1. **Generate SonarQube Token**:
   - Open http://localhost:9000
   - Login with `admin/admin` (change password when prompted)
   - Navigate to: My Account → Security → Generate Tokens
   - Copy the generated token

2. **Set Environment Variable**:
   ```bash
   export SONARQUBE_TOKEN=your-token-here
   ```

3. **Start MCP Server**:
   ```bash
   cd mcp-server
   npm start
   ```

## 📖 Usage

### With Docker Compose (Recommended)

```bash
# Start all services
docker-compose -f docker-compose.sonarqube.yml up -d

# Check logs
docker-compose -f docker-compose.sonarqube.yml logs -f mcp-server

# Stop services
docker-compose -f docker-compose.sonarqube.yml down
```

### Standalone MCP Server

```bash
# Set environment
export SONARQUBE_URL=http://localhost:9000
export SONARQUBE_TOKEN=your-token

# Start server
cd mcp-server
npm start
```

### Available Tools

The MCP server provides these tools:

#### 1. analyze_project
Get comprehensive project metrics.

```typescript
{
  "name": "analyze_project",
  "arguments": {
    "projectKey": "my-project"
  }
}
```

#### 2. detect_anti_patterns
Analyze a file for anti-patterns and code smells.

```typescript
{
  "name": "detect_anti_patterns",
  "arguments": {
    "filePath": "/path/to/file.ts"
  }
}
```

#### 3. check_quality_gate
Verify if project passes quality gate.

```typescript
{
  "name": "check_quality_gate",
  "arguments": {
    "projectKey": "my-project"
  }
}
```

#### 4. get_code_smells
Retrieve all code smells in project.

```typescript
{
  "name": "get_code_smells",
  "arguments": {
    "projectKey": "my-project"
  }
}
```

#### 5. get_security_hotspots
Find security vulnerabilities.

```typescript
{
  "name": "get_security_hotspots",
  "arguments": {
    "projectKey": "my-project"
  }
}
```

#### 6. scan_repository
Trigger full repository scan.

```typescript
{
  "name": "scan_repository",
  "arguments": {
    "repoPath": "/path/to/repo",
    "projectKey": "my-project"
  }
}
```

## 🔌 Client Integration

### Claude Desktop

1. Copy configuration:
   ```bash
   cp clients/claude/claude-config.json ~/.config/claude/config.json
   ```

2. Update paths in config
3. Restart Claude Desktop

See: [MCP_CLIENT_SETUP.md](docs/MCP_CLIENT_SETUP.md#claude-desktop)

### VS Code Copilot

1. Copy to workspace:
   ```bash
   cp clients/vscode/settings.json .vscode/settings.json
   ```

2. Set `SONARQUBE_TOKEN` environment variable
3. Reload VS Code

See: [MCP_CLIENT_SETUP.md](docs/MCP_CLIENT_SETUP.md#vs-code-copilot)

### Cursor

1. Copy configuration:
   ```bash
   cp clients/cursor/mcp.json .cursor/mcp.json
   ```

2. Restart Cursor

See: [MCP_CLIENT_SETUP.md](docs/MCP_CLIENT_SETUP.md#cursor)

### Other Clients

See [MCP_CLIENT_SETUP.md](docs/MCP_CLIENT_SETUP.md) for:
- Windsurf
- Zed Editor
- Gemini CLI

## 📊 Anti-Pattern Report

A comprehensive anti-pattern analysis has been performed on this repository. See:
- [docs/code-quality/anti-patterns-report.md](docs/code-quality/anti-patterns-report.md)

### Key Findings

**Critical Issues:**
- 2 God Objects identified (`manifest.ts`, `github.ts`)
- Multiple long methods (100+ lines)

**Recommendations:**
- Split large classes into focused modules
- Extract magic numbers to constants
- Reduce method complexity

## 📚 Documentation

- **[Installation Guide](docs/INSTALLATION.md)**: Detailed setup instructions
- **[Client Setup](docs/MCP_CLIENT_SETUP.md)**: Configure all AI clients
- **[Anti-Pattern Guide](docs/ANTI_PATTERN_GUIDE.md)**: Understanding detection rules
- **[API Reference](docs/API.md)**: MCP server API documentation
- **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Common issues and solutions

## 🏗️ Architecture

```
┌─────────────────┐
│   AI Clients    │  (Claude, VS Code, Cursor, etc.)
└────────┬────────┘
         │ stdio/MCP Protocol
┌────────▼────────┐
│   MCP Server    │  (TypeScript/Node.js)
├─────────────────┤
│ - Tool Handlers │
│ - Resources     │
│ - Prompts       │
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│   SonarQube     │  (Docker Container)
├─────────────────┤
│  - Analysis     │
│  - Quality Gates│
│  - Metrics      │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │  (Docker Container)
└─────────────────┘
```

## 🛠️ Development

### Build MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

### Watch Mode

```bash
npm run watch
```

### Clean Build

```bash
npm run clean
npm run build
```

## 🧪 Testing

```bash
# Test anti-pattern detection
node dist/index.js <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "detect_anti_patterns",
    "arguments": {
      "filePath": "/path/to/file.ts"
    }
  }
}
EOF
```

## 🔒 Security

- **Token Storage**: Store SonarQube tokens securely
- **Network**: Use HTTPS in production
- **Docker**: Keep images updated
- **Scanning**: Run security scans regularly

## 📈 Metrics & Quality Gates

### Default Quality Gate
- New Coverage: ≥ 80%
- Duplicated Lines: ≤ 3%
- Maintainability Rating: A
- Reliability Rating: A
- Security Rating: A

### Custom Gates
Configure in: `mcp-server/src/config/quality-gates.ts`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Apache-2.0 License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- **SonarQube**: Open-source code quality platform
- **Model Context Protocol**: Anthropic's MCP specification
- **Release Please**: Google's release automation tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/antneymon-ops/release-please/issues)
- **Documentation**: [docs/](docs/)
- **Troubleshooting**: [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## 🗺️ Roadmap

- [ ] Additional language support
- [ ] Custom rule configuration UI
- [ ] Real-time analysis dashboard
- [ ] Integration with more AI clients
- [ ] GitHub Actions integration
- [ ] GitLab CI/CD integration

---

**Made with ❤️ for better code quality**
