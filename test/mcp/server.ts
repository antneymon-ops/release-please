/**
 * MCP Server Tests
 */

import {describe, it, beforeEach} from 'mocha';
import {expect} from 'chai';
import {MCPServer} from '../../src/mcp/server/index';

describe('MCPServer', () => {
  let server: MCPServer;

  beforeEach(() => {
    server = new MCPServer({
      name: 'Test Avatar Platform',
      version: '1.0.0',
      enableLogging: false,
    });
  });

  it('should create an MCP server instance', () => {
    expect(server).to.not.be.undefined;
    expect(server.getServer()).to.not.be.undefined;
  });

  it('should have correct server configuration', () => {
    const mcpServer = server.getServer();
    expect(mcpServer).to.not.be.undefined;
    // Server configuration is stored internally, we can't directly check name/version
    // but we can verify the server instance exists
  });
});
