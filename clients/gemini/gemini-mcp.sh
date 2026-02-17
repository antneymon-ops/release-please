#!/bin/bash
# Gemini CLI with MCP Server integration

set -e

export SONARQUBE_URL="${SONARQUBE_URL:-http://localhost:9000}"
export SONARQUBE_TOKEN="${SONARQUBE_TOKEN}"

if [ -z "$SONARQUBE_TOKEN" ]; then
  echo "Error: SONARQUBE_TOKEN environment variable is not set"
  echo "Please set it with: export SONARQUBE_TOKEN=your-token"
  exit 1
fi

# Start MCP server in background
echo "Starting SonarQube MCP Server..."
node ./mcp-server/dist/index.js &
MCP_PID=$!

echo "MCP Server started with PID: $MCP_PID"

# Cleanup function
cleanup() {
  echo "Stopping MCP Server..."
  kill $MCP_PID 2>/dev/null || true
  wait $MCP_PID 2>/dev/null || true
  echo "MCP Server stopped"
}

# Register cleanup on script exit
trap cleanup EXIT INT TERM

# Use Gemini CLI with MCP context
echo "Starting Gemini CLI with SonarQube context..."
gemini chat \
  --mcp-server "stdio://localhost:3001" \
  --context "Use SonarQube MCP server for code quality analysis and anti-pattern detection"
