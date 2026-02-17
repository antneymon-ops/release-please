/**
 * Stdio Transport Implementation
 */

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {MCPServer} from '../index';

export async function createStdioTransport(server: MCPServer): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  server.log('info', 'MCP Server connected via stdio transport');
}
