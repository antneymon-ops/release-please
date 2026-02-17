/**
 * SSE (Server-Sent Events) Transport Implementation
 */

import {SSEServerTransport} from '@modelcontextprotocol/sdk/server/sse.js';
import {MCPServer} from '../index';

export function createSSETransport(
  server: MCPServer,
  messageEndpoint: string,
  response: any
): SSEServerTransport {
  const transport = new SSEServerTransport(messageEndpoint, response);
  server.log('info', 'MCP Server connected via SSE transport');
  return transport;
}

export async function setupSSERoute(
  app: any,
  server: MCPServer,
  ssePath = '/mcp/sse',
  messagePath = '/mcp/message'
): Promise<void> {
  app.get(ssePath, async (req: any, res: any) => {
    const transport = createSSETransport(server, messagePath, res);
    await server.connect(transport);
  });

  server.log('info', `SSE route configured at ${ssePath}`);
}
