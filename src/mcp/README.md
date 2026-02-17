# MCP (Model Context Protocol) Implementation

This directory contains a complete implementation of the Model Context Protocol (MCP) standard for the Avatar Creation Platform.

## Overview

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. This implementation makes the avatar platform LLM-native and compatible with all MCP-supporting applications.

## Architecture

```
src/mcp/
├── server/              # MCP server implementation
│   ├── handlers/        # Request handlers (resources, tools, prompts)
│   ├── transports/      # Transport layers (stdio, SSE, WebSocket)
│   ├── auth/            # Authentication and authorization
│   ├── config.ts        # Server configuration
│   └── index.ts         # Main server implementation
├── client/              # MCP client SDK
├── types/               # TypeScript type definitions
├── services/            # Business logic services
│   ├── avatar/          # Avatar creation service
│   ├── export/          # Export service
│   └── storage/         # Storage service
└── index.ts             # Main entry point
```

## Features

### Protocol Compliance
- ✅ Full MCP protocol specification (2024-11-05)
- ✅ Server capabilities negotiation
- ✅ Resource management
- ✅ Tool execution
- ✅ Prompt templates
- ✅ Error handling with standard error codes

### Transport Layers
- ✅ Stdio transport (for local integrations)
- ✅ HTTP with SSE (for web integrations)
- ⚠️  WebSocket (placeholder for future implementation)

### Resources
The server exposes the following resources:
- `avatar://templates` - Pre-built avatar templates
- `avatar://user/{userId}/avatars` - User's created avatars
- `avatar://assets/library` - Available assets (hair, clothing, etc.)
- `avatar://styles` - Supported avatar styles

### Tools
The server provides these tools:
- `create_avatar` - Create avatar from text description
- `edit_avatar` - Edit existing avatar
- `export_avatar` - Export to platform formats (Unity, Unreal, Web, etc.)
- `search_avatars` - Search through created avatars
- `apply_template` - Apply template with customizations

### Prompts
Pre-built prompt templates:
- `create_character` - Character with personality
- `professional_headshot` - Professional avatar
- `game_character` - Video game character

### Authentication & Security
- API key validation
- Permission-based access control (free, premium, pro tiers)
- Rate limiting support

## Usage

### Running the Server

#### Stdio Transport (CLI)
```bash
npm run compile
node build/src/mcp/index.js
```

#### With Custom Configuration
```typescript
import {MCPServer} from './mcp/server';
import {createStdioTransport} from './mcp/server/transports/stdio';

const server = new MCPServer({
  name: 'Avatar Platform',
  version: '1.0.0',
  apiKeys: ['your-api-key'],
  enableLogging: true,
});

await createStdioTransport(server);
```

### Using the Client SDK

```typescript
import {MCPClient} from './mcp/client';

// Connect to server
const client = new MCPClient({
  name: 'avatar-client',
  version: '1.0.0',
});

await client.connect();

// List available tools
const tools = await client.listTools();

// Create an avatar
const result = await client.callTool('create_avatar', {
  prompt: 'A cyberpunk detective with glowing eyes',
  style: 'stylized',
});

// Read resources
const templates = await client.readResource('avatar://templates');
```

### Claude Desktop Integration

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "avatar-platform": {
      "command": "node",
      "args": ["/path/to/build/src/mcp/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## Development

### Building
```bash
npm run compile
```

### Testing
```bash
npm test
```

### Code Style
```bash
npm run lint
npm run fix
```

## API Reference

### Resources API

#### List Resources
```typescript
// Returns all available resources
await client.listResources();
```

#### Read Resource
```typescript
// Read specific resource
await client.readResource('avatar://templates');
```

### Tools API

#### List Tools
```typescript
const tools = await client.listTools();
```

#### Call Tool
```typescript
const result = await client.callTool('create_avatar', {
  prompt: 'description',
  style: 'realistic',
  quality: 'high',
});
```

### Prompts API

#### List Prompts
```typescript
const prompts = await client.listPrompts();
```

#### Get Prompt
```typescript
const prompt = await client.getPrompt('create_character', {
  personality: 'brave warrior',
  setting: 'fantasy',
});
```

## Extension Points

### Adding New Tools
1. Define tool schema in `handlers/tools.ts`
2. Implement tool logic in service layer
3. Add to `listTools()` response
4. Handle in `callTool()` switch statement

### Adding New Resources
1. Define resource in `handlers/resources.ts`
2. Add to `listResources()` response
3. Handle in `readResource()` method

### Custom Transport
1. Create transport file in `transports/`
2. Implement transport-specific logic
3. Connect to server via `server.connect(transport)`

## License

Apache Version 2.0
