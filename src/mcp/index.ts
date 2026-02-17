/**
 * MCP Server Entry Point
 * Starts MCP server with stdio transport
 */

import {MCPServer} from './server/index';
import {createStdioTransport} from './server/transports/stdio';

async function main() {
  const server = new MCPServer({
    name: 'Avatar Creation Platform',
    version: '1.0.0',
    enableLogging: true,
  });

  server.log('info', 'Starting MCP Server...');

  // Connect via stdio transport
  await createStdioTransport(server);

  server.log('info', 'MCP Server is running');
}

// Handle errors
process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
if (require.main === module) {
  main().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export {MCPServer};
export * from './types/protocol';
export * from './types/resources';
export * from './types/tools';
export {MCPClient} from './client/index';
