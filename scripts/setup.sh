#!/bin/bash

set -e

echo "🚀 Setting up SonarQube MCP Server..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Stop existing containers if running
echo "🛑 Stopping existing containers (if any)..."
docker-compose -f docker-compose.sonarqube.yml down 2>/dev/null || true
echo ""

# Start SonarQube with Docker Compose
echo "📦 Starting SonarQube services..."
docker-compose -f docker-compose.sonarqube.yml up -d postgres sonarqube

echo ""
echo "⏳ Waiting for SonarQube to be ready..."
echo "   This may take 1-2 minutes..."

# Wait for SonarQube to be ready
RETRY_COUNT=0
MAX_RETRIES=60

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl --output /dev/null --silent --head --fail http://localhost:9000/api/system/status; then
        STATUS=$(curl -s http://localhost:9000/api/system/status | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$STATUS" = "UP" ]; then
            echo ""
            echo "✅ SonarQube is up and running!"
            break
        fi
    fi
    printf "."
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo ""
    echo "❌ SonarQube failed to start within expected time"
    echo "   Check logs with: docker-compose -f docker-compose.sonarqube.yml logs"
    exit 1
fi

echo ""
echo "📦 Installing MCP Server dependencies..."
cd mcp-server
npm install

echo ""
echo "🔨 Building MCP Server..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Generate a SonarQube token:"
echo "   - Open http://localhost:9000 in your browser"
echo "   - Login with admin/admin (you'll be prompted to change password)"
echo "   - Go to: My Account > Security > Generate Tokens"
echo "   - Generate a token and copy it"
echo ""
echo "2. Set the token in your environment:"
echo "   export SONARQUBE_TOKEN=your-token-here"
echo ""
echo "3. Start the MCP server:"
echo "   cd mcp-server && npm start"
echo ""
echo "4. Or start everything with Docker Compose:"
echo "   docker-compose -f docker-compose.sonarqube.yml up -d"
echo ""
echo "🌐 SonarQube UI: http://localhost:9000"
echo "🔧 Default credentials: admin/admin"
echo ""
