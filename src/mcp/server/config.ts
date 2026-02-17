/**
 * MCP Server Configuration
 */

export interface MCPServerConfig {
  name: string;
  version: string;
  apiKeys?: string[];
  enableLogging?: boolean;
  port?: number;
}

export const defaultConfig: MCPServerConfig = {
  name: 'Avatar Creation Platform',
  version: '1.0.0',
  enableLogging: true,
  port: 3000,
};
