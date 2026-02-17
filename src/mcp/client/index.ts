/**
 * MCP Client SDK
 */

import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  MCPTool,
  MCPResource,
  MCPPrompt,
  MCPToolResponse,
} from '../types/protocol';

export interface MCPClientConfig {
  name: string;
  version: string;
  command?: string;
  args?: string[];
}

export class MCPClient {
  private client: Client;
  private transport?: StdioClientTransport;
  private connected = false;

  constructor(private config: MCPClientConfig) {
    this.client = new Client(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          roots: {listChanged: true},
          sampling: {},
        },
      }
    );
  }

  /**
   * Connect to MCP server
   */
  async connect(): Promise<void> {
    if (this.connected) {
      throw new Error('Already connected');
    }

    const command = this.config.command || 'node';
    const args = this.config.args || ['build/src/mcp/server/index.js'];

    this.transport = new StdioClientTransport({
      command,
      args,
    });

    await this.client.connect(this.transport);
    this.connected = true;
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.client.close();
    this.connected = false;
  }

  /**
   * List available tools
   */
  async listTools(): Promise<MCPTool[]> {
    this.ensureConnected();
    const response = await this.client.listTools();
    return response.tools as MCPTool[];
  }

  /**
   * Call a tool
   */
  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResponse> {
    this.ensureConnected();
    const response = await this.client.callTool({name, arguments: args});
    return response as MCPToolResponse;
  }

  /**
   * List available resources
   */
  async listResources(): Promise<MCPResource[]> {
    this.ensureConnected();
    const response = await this.client.listResources();
    return response.resources as MCPResource[];
  }

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<string> {
    this.ensureConnected();
    const response = await this.client.readResource({uri});
    const content = response.contents[0];
    if (content && 'text' in content) {
      return content.text || '';
    }
    return '';
  }

  /**
   * List available prompts
   */
  async listPrompts(): Promise<MCPPrompt[]> {
    this.ensureConnected();
    const response = await this.client.listPrompts();
    return response.prompts as MCPPrompt[];
  }

  /**
   * Get a specific prompt
   */
  async getPrompt(
    name: string,
    args: Record<string, string>
  ): Promise<{messages: any[]}> {
    this.ensureConnected();
    const response = await this.client.getPrompt({name, arguments: args});
    return {messages: response.messages || []};
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Client not connected. Call connect() first.');
    }
  }
}
