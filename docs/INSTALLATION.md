# Installation Guide

Detailed instructions for setting up the SonarQube MCP Server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
  - [Quick Start (Recommended)](#quick-start-recommended)
  - [Manual Installation](#manual-installation)
  - [Docker Only](#docker-only)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Docker** (20.10+)
   ```bash
   # Check Docker version
   docker --version
   
   # Install on Linux
   curl -fsSL https://get.docker.com | sh
   
   # Install on macOS
   brew install docker
   
   # Windows: Download from https://www.docker.com/products/docker-desktop
   ```

2. **Docker Compose** (2.0+)
   ```bash
   # Check version
   docker-compose --version
   
   # Usually included with Docker Desktop
   # On Linux, install separately if needed:
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Node.js** (18.0.0+)
   ```bash
   # Check Node version
   node --version
   
   # Install via nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   
   # Or install directly from https://nodejs.org/
   ```

4. **npm** (8.0+)
   ```bash
   # Check npm version
   npm --version
   
   # Update npm
   npm install -g npm@latest
   ```

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk Space | 10 GB | 20 GB |
| CPU | 2 cores | 4 cores |
| OS | Linux, macOS, Windows | Linux/macOS |

## Installation Methods

### Quick Start (Recommended)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone https://github.com/antneymon-ops/release-please.git
cd release-please

# 2. Run the setup script
./scripts/setup.sh

# 3. Follow the prompts to:
#    - Start SonarQube containers
#    - Install MCP server dependencies
#    - Build the MCP server

# 4. Generate SonarQube token
#    Open http://localhost:9000
#    Login: admin/admin
#    Go to: My Account > Security > Generate Tokens

# 5. Set the token
export SONARQUBE_TOKEN=your-token-here

# 6. Start MCP server
cd mcp-server
npm start
```

### Manual Installation

Step-by-step manual installation:

#### Step 1: Clone Repository

```bash
git clone https://github.com/antneymon-ops/release-please.git
cd release-please
```

#### Step 2: Start Database

```bash
# Start PostgreSQL container
docker-compose -f docker-compose.sonarqube.yml up -d postgres

# Wait for PostgreSQL to be ready (30 seconds)
sleep 30

# Verify PostgreSQL is running
docker-compose -f docker-compose.sonarqube.yml ps postgres
```

#### Step 3: Start SonarQube

```bash
# Start SonarQube container
docker-compose -f docker-compose.sonarqube.yml up -d sonarqube

# Watch logs
docker-compose -f docker-compose.sonarqube.yml logs -f sonarqube

# Wait for "SonarQube is operational" message (1-2 minutes)
# Press Ctrl+C to stop watching logs
```

#### Step 4: Install MCP Server Dependencies

```bash
cd mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify build
ls -la dist/
```

#### Step 5: Configure SonarQube

1. **Access SonarQube UI**:
   - Open: http://localhost:9000
   - Default login: `admin`
   - Default password: `admin`
   - You'll be prompted to change the password

2. **Generate Authentication Token**:
   - Click on your avatar (top right)
   - Select "My Account"
   - Go to "Security" tab
   - Under "Generate Tokens":
     - Name: `mcp-server`
     - Type: `User Token`
     - Expires in: `No expiration` (or choose duration)
   - Click "Generate"
   - **COPY THE TOKEN** - you won't see it again!

3. **Set Environment Variable**:
   ```bash
   # Temporary (current session only)
   export SONARQUBE_TOKEN=squ_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Permanent (add to ~/.bashrc or ~/.zshrc)
   echo 'export SONARQUBE_TOKEN=squ_xxxxxxxxxxxxxxxxxxxxxxxxxxxx' >> ~/.bashrc
   source ~/.bashrc
   ```

#### Step 6: Start MCP Server

```bash
# From mcp-server directory
cd mcp-server

# Set environment variables
export SONARQUBE_URL=http://localhost:9000
export SONARQUBE_TOKEN=your-token-here

# Start the server
npm start
```

### Docker Only

Run everything with Docker Compose:

```bash
# 1. Set environment variable
export SONARQUBE_TOKEN=your-token-here

# 2. Start all services
docker-compose -f docker-compose.sonarqube.yml up -d

# 3. View logs
docker-compose -f docker-compose.sonarqube.yml logs -f

# 4. Stop services
docker-compose -f docker-compose.sonarqube.yml down
```

**Note**: You still need to generate the token manually via the SonarQube UI first.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# SonarQube Configuration
SONARQUBE_URL=http://localhost:9000
SONARQUBE_TOKEN=your-token-here

# MCP Server Configuration
MCP_SERVER_PORT=3001
NODE_ENV=production
LOG_LEVEL=info
```

### Docker Compose Variables

Edit `docker-compose.sonarqube.yml` to customize:

```yaml
environment:
  # PostgreSQL
  - POSTGRES_USER=sonar
  - POSTGRES_PASSWORD=sonar  # Change in production!
  - POSTGRES_DB=sonarqube
  
  # SonarQube
  - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
  - SONAR_JDBC_URL=jdbc:postgresql://postgres:5432/sonarqube
  
  # MCP Server
  - SONARQUBE_URL=http://sonarqube:9000
  - SONARQUBE_TOKEN=${SONARQUBE_TOKEN}
```

### SonarQube Scanner

Install sonar-scanner globally (optional):

```bash
# macOS
brew install sonar-scanner

# Linux
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
unzip sonar-scanner-cli-5.0.1.3006-linux.zip
sudo mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner
sudo ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner

# Windows
# Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
# Add to PATH
```

## Verification

### Test SonarQube

```bash
# Check SonarQube status
curl http://localhost:9000/api/system/status

# Expected output:
# {"status":"UP"}
```

### Test MCP Server

```bash
# Check MCP server is running
ps aux | grep "node.*mcp-server"

# Test anti-pattern detection
cd mcp-server
node dist/index.js <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
EOF
```

### Test Docker Containers

```bash
# Check all containers are running
docker-compose -f docker-compose.sonarqube.yml ps

# Expected output:
# NAME               STATUS              PORTS
# sonarqube-mcp      Up                  0.0.0.0:9000->9000/tcp
# sonarqube-db       Up                  5432/tcp
# mcp-server         Up                  0.0.0.0:3001->3001/tcp

# Check container health
docker-compose -f docker-compose.sonarqube.yml ps | grep "healthy"
```

### Test Anti-Pattern Detection

```bash
# Analyze a file
cd /home/runner/work/release-please/release-please
node mcp-server/dist/index.js <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "detect_anti_patterns",
    "arguments": {
      "filePath": "src/manifest.ts"
    }
  }
}
EOF
```

## Troubleshooting

### SonarQube Won't Start

**Issue**: Container exits immediately

```bash
# Check logs
docker-compose -f docker-compose.sonarqube.yml logs sonarqube

# Common fixes:
# 1. Increase Docker memory limit (minimum 4GB)
# 2. Check port 9000 is not in use
sudo lsof -i :9000

# 3. Reset containers
docker-compose -f docker-compose.sonarqube.yml down -v
docker-compose -f docker-compose.sonarqube.yml up -d
```

### MCP Server Build Fails

**Issue**: TypeScript compilation errors

```bash
# Clean and rebuild
cd mcp-server
rm -rf dist node_modules
npm install
npm run build

# Check TypeScript version
npx tsc --version
# Should be 5.3.3 or higher
```

### Port Already in Use

**Issue**: Port 9000 or 3001 already in use

```bash
# Find process using the port
sudo lsof -i :9000
sudo lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.sonarqube.yml:
# ports:
#   - "9001:9000"  # Use 9001 instead
```

### Permission Denied

**Issue**: Cannot access Docker socket

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Test
docker ps
```

### PostgreSQL Connection Failed

**Issue**: SonarQube can't connect to PostgreSQL

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.sonarqube.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.sonarqube.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.sonarqube.yml restart postgres
```

## Next Steps

1. **Configure AI Clients**: See [MCP_CLIENT_SETUP.md](MCP_CLIENT_SETUP.md)
2. **Learn Anti-Patterns**: See [ANTI_PATTERN_GUIDE.md](ANTI_PATTERN_GUIDE.md)
3. **Explore API**: See [API.md](API.md)
4. **Run Your First Scan**: See [SONARQUBE_MCP_README.md](SONARQUBE_MCP_README.md#usage)

## Updating

### Update MCP Server

```bash
cd release-please
git pull origin main
cd mcp-server
npm install
npm run build
```

### Update Docker Images

```bash
# Pull latest images
docker-compose -f docker-compose.sonarqube.yml pull

# Restart services
docker-compose -f docker-compose.sonarqube.yml down
docker-compose -f docker-compose.sonarqube.yml up -d
```

## Uninstallation

```bash
# Stop and remove containers
docker-compose -f docker-compose.sonarqube.yml down -v

# Remove Docker images
docker rmi sonarqube:community postgres:15-alpine

# Remove MCP server
rm -rf mcp-server/node_modules mcp-server/dist

# Optional: Remove entire directory
cd ..
rm -rf release-please
```

## Additional Resources

- **SonarQube Documentation**: https://docs.sonarqube.org/
- **Docker Documentation**: https://docs.docker.com/
- **MCP Specification**: https://modelcontextprotocol.io/
- **Node.js Documentation**: https://nodejs.org/docs/

## Support

For issues and questions:
- GitHub Issues: https://github.com/antneymon-ops/release-please/issues
- Troubleshooting Guide: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
