FROM node:20-alpine

# Install sonar-scanner
RUN apk add --no-cache \
    openjdk17-jre \
    wget \
    unzip \
    && wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip \
    && unzip sonar-scanner-cli-5.0.1.3006-linux.zip \
    && mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner \
    && ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner \
    && rm sonar-scanner-cli-5.0.1.3006-linux.zip

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (includes patched MCP SDK v1.25.2+ with security fixes)
RUN npm ci --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Expose MCP server port (if needed for HTTP transport)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "process.exit(0)"

# Run the MCP server
CMD ["npm", "start"]
