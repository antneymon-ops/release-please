# Troubleshooting Guide

Common issues and their solutions when working with the SonarQube MCP Server.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Docker Issues](#docker-issues)
- [SonarQube Issues](#sonarqube-issues)
- [MCP Server Issues](#mcp-server-issues)
- [Client Connection Issues](#client-connection-issues)
- [Analysis Issues](#analysis-issues)
- [Performance Issues](#performance-issues)
- [Getting Help](#getting-help)

## Installation Issues

### Node.js Version Error

**Problem**: "Error: This package requires Node.js 18.0.0 or higher"

**Solution**:
```bash
# Check current version
node --version

# Install Node 18 using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
# Visit: https://nodejs.org/
```

---

### npm install Fails

**Problem**: "npm ERR! code EACCES"

**Solution**:
```bash
# Option 1: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Retry installation
cd mcp-server
npm install
```

---

### TypeScript Compilation Errors

**Problem**: "error TS2307: Cannot find module '@modelcontextprotocol/sdk'"

**Solution**:
```bash
cd mcp-server

# Clean everything
rm -rf node_modules package-lock.json dist

# Reinstall
npm install

# Rebuild
npm run build

# Verify
ls -la dist/index.js
```

---

## Docker Issues

### Docker Not Running

**Problem**: "Cannot connect to the Docker daemon"

**Solution**:
```bash
# macOS
open -a Docker

# Linux - start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Windows
# Start Docker Desktop from Start menu

# Verify Docker is running
docker ps
```

---

### Port Already in Use

**Problem**: "Bind for 0.0.0.0:9000 failed: port is already allocated"

**Solution**:
```bash
# Find process using port 9000
sudo lsof -i :9000
# or on Linux
sudo netstat -tulpn | grep 9000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.sonarqube.yml
# Edit the file and change:
ports:
  - "9001:9000"  # Use 9001 instead

# Then update SONARQUBE_URL
export SONARQUBE_URL=http://localhost:9001
```

---

### Docker Compose Command Not Found

**Problem**: "docker-compose: command not found"

**Solution**:
```bash
# Try with docker compose (v2 syntax)
docker compose -f docker-compose.sonarqube.yml up -d

# Or install Docker Compose v1
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

---

### Container Keeps Restarting

**Problem**: SonarQube container exits immediately

**Solution**:
```bash
# Check logs
docker-compose -f docker-compose.sonarqube.yml logs sonarqube

# Common causes:

# 1. Not enough memory (needs 4GB minimum)
# Increase Docker memory:
# Docker Desktop → Settings → Resources → Memory → Set to 6GB

# 2. Elasticsearch bootstrap checks
# Already disabled in docker-compose.yml with:
# SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true

# 3. Database not ready
# Wait longer for PostgreSQL to start
docker-compose -f docker-compose.sonarqube.yml up -d postgres
sleep 30
docker-compose -f docker-compose.sonarqube.yml up -d sonarqube

# 4. Volume permissions
docker-compose -f docker-compose.sonarqube.yml down -v
docker-compose -f docker-compose.sonarqube.yml up -d
```

---

### Permission Denied on Volumes

**Problem**: "Permission denied" errors in container logs

**Solution**:
```bash
# Linux: Fix volume permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended for production)
sudo docker-compose -f docker-compose.sonarqube.yml up -d

# macOS/Windows: Usually not an issue
# If problem persists, check Docker Desktop file sharing settings
```

---

## SonarQube Issues

### Cannot Access SonarQube UI

**Problem**: http://localhost:9000 not loading

**Solutions**:

1. **Check if SonarQube is running**:
   ```bash
   docker ps | grep sonarqube
   
   # Should show:
   # sonarqube-mcp   Up   0.0.0.0:9000->9000/tcp
   ```

2. **Check health status**:
   ```bash
   curl http://localhost:9000/api/system/status
   
   # Should return: {"status":"UP"}
   ```

3. **Wait for startup** (1-2 minutes first time):
   ```bash
   docker-compose -f docker-compose.sonarqube.yml logs -f sonarqube
   
   # Wait for:
   # "SonarQube is operational"
   ```

4. **Check firewall**:
   ```bash
   # Allow port 9000
   sudo ufw allow 9000
   ```

---

### Cannot Login to SonarQube

**Problem**: "Authentication failed" or "Invalid credentials"

**Solutions**:

1. **Use default credentials** (first login):
   - Username: `admin`
   - Password: `admin`
   - You'll be forced to change password

2. **Reset admin password**:
   ```bash
   # Stop SonarQube
   docker-compose -f docker-compose.sonarqube.yml stop sonarqube
   
   # Connect to database
   docker-compose -f docker-compose.sonarqube.yml exec postgres psql -U sonar -d sonarqube
   
   # Reset password (inside psql)
   UPDATE users SET crypted_password='$2a$12$uCkkXmhW5ThVK8mpBvnXOOJRLd64LJeHTeCkSuB3lfaR2N0AYBaSi', salt='k9x9eN127/3GDLjK6f+5Lw==', hash_method='BCRYPT' WHERE login='admin';
   \q
   
   # Start SonarQube
   docker-compose -f docker-compose.sonarqube.yml start sonarqube
   
   # Now login with admin/admin
   ```

3. **Browser cache issue**:
   - Clear browser cache
   - Try incognito/private mode
   - Try different browser

---

### Token Generation Fails

**Problem**: "Failed to generate token"

**Solutions**:

1. **Check user permissions**:
   - You must be logged in
   - Account must have proper permissions
   - Try with admin account

2. **Token name already exists**:
   - Use a different token name
   - Or revoke existing token first

3. **API limitation**:
   - Check SonarQube edition (Community has limitations)
   - Some features require commercial edition

---

### Project Not Found

**Problem**: "Project 'my-project' not found"

**Solutions**:

1. **Create project in SonarQube**:
   - Login to http://localhost:9000
   - Click "+" → "Create Project"
   - Set project key: `my-project`
   - Generate token for scanning

2. **Check project key**:
   - Project key is case-sensitive
   - Use exact key from SonarQube

3. **Run initial scan**:
   ```bash
   sonar-scanner \
     -Dsonar.projectKey=my-project \
     -Dsonar.sources=. \
     -Dsonar.host.url=http://localhost:9000 \
     -Dsonar.login=your-token
   ```

---

## MCP Server Issues

### MCP Server Won't Start

**Problem**: "Error: Cannot find module" or startup errors

**Solutions**:

1. **Check build**:
   ```bash
   cd mcp-server
   
   # Verify dist folder exists
   ls -la dist/
   
   # Rebuild if missing
   npm run build
   ```

2. **Check dependencies**:
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   npm run build
   ```

3. **Check environment variables**:
   ```bash
   # Verify required variables are set
   echo $SONARQUBE_URL
   echo $SONARQUBE_TOKEN
   
   # Set if missing
   export SONARQUBE_URL=http://localhost:9000
   export SONARQUBE_TOKEN=your-token
   ```

4. **Check Node version**:
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

---

### SONARQUBE_TOKEN Not Set

**Problem**: "SONARQUBE_TOKEN is not set or empty"

**Solutions**:

1. **Set environment variable**:
   ```bash
   # Temporary (current session)
   export SONARQUBE_TOKEN=squ_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Permanent
   echo 'export SONARQUBE_TOKEN=squ_xxxx' >> ~/.bashrc
   source ~/.bashrc
   ```

2. **Pass to Docker**:
   ```bash
   # Edit docker-compose.sonarqube.yml
   environment:
     - SONARQUBE_TOKEN=your-actual-token
   ```

3. **Use .env file**:
   ```bash
   # Create .env in project root
   echo "SONARQUBE_TOKEN=your-token" > .env
   
   # Docker Compose will load it automatically
   ```

---

### MCP Server Crashes

**Problem**: Server exits unexpectedly

**Solutions**:

1. **Check logs**:
   ```bash
   # If running directly
   node mcp-server/dist/index.js 2>&1 | tee mcp-server.log
   
   # If in Docker
   docker-compose -f docker-compose.sonarqube.yml logs mcp-server
   ```

2. **Enable debug logging**:
   ```bash
   export LOG_LEVEL=debug
   node mcp-server/dist/index.js
   ```

3. **Check SonarQube connection**:
   ```bash
   curl -u $SONARQUBE_TOKEN: http://localhost:9000/api/system/status
   ```

4. **Memory issues**:
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" node mcp-server/dist/index.js
   ```

---

## Client Connection Issues

### Client Can't Find MCP Server

**Problem**: "MCP server not connected" in AI client

**Solutions**:

1. **Use absolute paths**:
   ```json
   {
     "command": "node",
     "args": ["/absolute/path/to/release-please/mcp-server/dist/index.js"]
   }
   ```

2. **Verify server runs standalone**:
   ```bash
   node /absolute/path/to/mcp-server/dist/index.js <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   
   # Should output list of tools
   ```

3. **Check file permissions**:
   ```bash
   chmod +x mcp-server/dist/index.js
   ```

4. **Restart client**:
   - Completely quit and restart the AI client
   - Don't just reload/refresh

---

### Environment Variables Not Available

**Problem**: Token or URL not being passed to MCP server

**Solutions**:

1. **Launch client from terminal**:
   ```bash
   # Set variables in terminal
   export SONARQUBE_TOKEN=your-token
   export SONARQUBE_URL=http://localhost:9000
   
   # Launch client from same terminal
   code .      # VS Code
   cursor .    # Cursor
   zed .       # Zed
   ```

2. **Hardcode in config** (for testing only):
   ```json
   {
     "env": {
       "SONARQUBE_TOKEN": "squ_actual_token_here",
       "SONARQUBE_URL": "http://localhost:9000"
     }
   }
   ```

3. **Use system environment**:
   ```bash
   # macOS/Linux: Add to shell profile
   echo 'export SONARQUBE_TOKEN=your-token' >> ~/.bashrc
   
   # Windows: Set user environment variable
   setx SONARQUBE_TOKEN "your-token"
   ```

---

### MCP Protocol Errors

**Problem**: "Protocol error" or "Invalid JSON-RPC"

**Solutions**:

1. **Update MCP SDK**:
   ```bash
   cd mcp-server
   npm update @modelcontextprotocol/sdk
   npm run build
   ```

2. **Check client version**:
   - Ensure client supports MCP protocol
   - Update to latest client version

3. **Test with simple request**:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
     node mcp-server/dist/index.js
   ```

---

## Analysis Issues

### File Not Found Error

**Problem**: "ENOENT: no such file or directory"

**Solutions**:

1. **Use absolute paths**:
   ```bash
   # Get absolute path
   realpath src/manifest.ts
   
   # Use that path
   /home/user/project/src/manifest.ts
   ```

2. **Check file exists**:
   ```bash
   ls -la /path/to/file.ts
   ```

3. **Check permissions**:
   ```bash
   chmod 644 /path/to/file.ts
   ```

---

### No Anti-Patterns Detected

**Problem**: Analysis returns "No anti-patterns detected" but you expect some

**Solutions**:

1. **Check file content**:
   - Ensure file is not empty
   - Verify it contains actual code

2. **Lower thresholds** (for testing):
   ```typescript
   // Edit mcp-server/src/config/rules.ts
   {
     id: "long-method",
     thresholds: {
       maxLines: 30  // Changed from 50
     }
   }
   ```

3. **Check file type**:
   - Anti-pattern detector expects TypeScript/JavaScript
   - Other languages may not be fully supported

---

### SonarQube Scan Fails

**Problem**: "sonar-scanner: command not found"

**Solutions**:

1. **Install sonar-scanner**:
   ```bash
   # macOS
   brew install sonar-scanner
   
   # Linux
   wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
   unzip sonar-scanner-cli-5.0.1.3006-linux.zip
   sudo mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner
   sudo ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/
   ```

2. **Use Docker scanner**:
   ```bash
   docker run --rm \
     -v $(pwd):/usr/src \
     -e SONAR_HOST_URL=http://host.docker.internal:9000 \
     -e SONAR_LOGIN=your-token \
     sonarsource/sonar-scanner-cli \
     -Dsonar.projectKey=my-project
   ```

---

## Performance Issues

### Slow Analysis

**Problem**: Analysis takes too long

**Solutions**:

1. **Increase memory**:
   ```bash
   # For Docker
   # Docker Desktop → Settings → Resources → Memory → 6GB
   
   # For Node.js
   NODE_OPTIONS="--max-old-space-size=4096" node mcp-server/dist/index.js
   ```

2. **Reduce scope**:
   - Analyze specific files instead of entire project
   - Use `.sonarignore` to exclude files

3. **Check network**:
   - Ensure SonarQube server is local
   - Check network latency if remote

---

### High Memory Usage

**Problem**: MCP server using too much RAM

**Solutions**:

1. **Limit cache**:
   ```typescript
   // Add memory limits in code
   process.env.NODE_OPTIONS = '--max-old-space-size=2048';
   ```

2. **Restart periodically**:
   - Long-running servers may accumulate memory
   - Set up automatic restarts

3. **Profile memory**:
   ```bash
   node --inspect mcp-server/dist/index.js
   # Open chrome://inspect to analyze
   ```

---

## Getting Help

### Collect Diagnostic Information

```bash
# System information
uname -a
node --version
npm --version
docker --version
docker-compose --version

# Service status
docker ps
curl http://localhost:9000/api/system/status

# MCP server test
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  node mcp-server/dist/index.js

# Logs
docker-compose -f docker-compose.sonarqube.yml logs --tail=50
```

### Check Documentation

- **Installation**: [INSTALLATION.md](INSTALLATION.md)
- **Client Setup**: [MCP_CLIENT_SETUP.md](MCP_CLIENT_SETUP.md)
- **API Reference**: [API.md](API.md)
- **Anti-Patterns**: [ANTI_PATTERN_GUIDE.md](ANTI_PATTERN_GUIDE.md)

### Report an Issue

Include this information:

1. **Environment**:
   - OS and version
   - Node.js version
   - Docker version
   - AI client and version

2. **Steps to reproduce**

3. **Expected vs actual behavior**

4. **Logs and error messages**

5. **Configuration files** (remove sensitive data)

### Community Resources

- **GitHub Issues**: https://github.com/antneymon-ops/release-please/issues
- **SonarQube Documentation**: https://docs.sonarqube.org/
- **MCP Specification**: https://modelcontextprotocol.io/
- **Docker Documentation**: https://docs.docker.com/

---

## Quick Fixes

### Complete Reset

If all else fails, start fresh:

```bash
# Stop everything
docker-compose -f docker-compose.sonarqube.yml down -v

# Clean MCP server
cd mcp-server
rm -rf node_modules dist package-lock.json

# Reinstall
npm install
npm run build

# Start services
cd ..
docker-compose -f docker-compose.sonarqube.yml up -d postgres
sleep 30
docker-compose -f docker-compose.sonarqube.yml up -d sonarqube
sleep 60

# Generate new token at http://localhost:9000
# Set token
export SONARQUBE_TOKEN=new-token

# Test
node mcp-server/dist/index.js <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Health Check Script

```bash
#!/bin/bash
# Save as health-check.sh

echo "=== System Check ==="
echo "Node: $(node --version)"
echo "Docker: $(docker --version)"
echo ""

echo "=== Service Status ==="
docker ps | grep -E "(sonarqube|postgres|mcp-server)"
echo ""

echo "=== SonarQube Health ==="
curl -s http://localhost:9000/api/system/status | grep status
echo ""

echo "=== MCP Server Test ==="
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  node mcp-server/dist/index.js | head -20
echo ""

echo "=== Environment ==="
echo "SONARQUBE_URL: $SONARQUBE_URL"
echo "SONARQUBE_TOKEN: ${SONARQUBE_TOKEN:0:10}..."
```

Run with: `bash health-check.sh`

---

## Still Having Issues?

If you're still experiencing problems:

1. **Search existing issues**: Check if others have the same problem
2. **Read the docs**: Complete documentation in `docs/` directory
3. **Ask for help**: Create a detailed GitHub issue
4. **Provide context**: Include logs, config, and steps to reproduce

Remember: Most issues are configuration-related and can be solved by:
- Using absolute paths
- Setting environment variables correctly
- Ensuring services are running
- Waiting for services to fully start
