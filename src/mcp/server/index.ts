/**
 * MCP Server Implementation
 * Implements Model Context Protocol (2024-11-05)
 */

import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {MCPServerConfig, defaultConfig} from './config';
import {ResourceHandlers} from './handlers/resources';
import {ToolHandlers} from './handlers/tools';
import {PromptHandlers} from './handlers/prompts';
import {AvatarService} from '../services/avatar/avatar-service';
import {ExportService} from '../services/export/export-service';
import {StorageService} from '../services/storage/storage-service';
import {ApiKeyAuth} from './auth/apiKey';
import {Permissions, User} from './auth/permissions';

export class MCPServer {
  private server: Server;
  private config: MCPServerConfig;
  private resourceHandlers: ResourceHandlers;
  private toolHandlers: ToolHandlers;
  private promptHandlers: PromptHandlers;
  private apiKeyAuth: ApiKeyAuth;
  private permissions: Permissions;
  private avatarService: AvatarService;
  private exportService: ExportService;
  private storageService: StorageService;

  constructor(config?: Partial<MCPServerConfig>) {
    this.config = {...defaultConfig, ...config};

    // Initialize services
    this.avatarService = new AvatarService();
    this.exportService = new ExportService();
    this.storageService = new StorageService();

    // Initialize handlers
    this.resourceHandlers = new ResourceHandlers(
      this.storageService,
      this.avatarService
    );
    this.toolHandlers = new ToolHandlers(
      this.avatarService,
      this.exportService,
      this.storageService
    );
    this.promptHandlers = new PromptHandlers();

    // Initialize authentication
    this.apiKeyAuth = new ApiKeyAuth(this.config.apiKeys);
    this.permissions = new Permissions();

    // Initialize MCP server
    this.server = new Server(
      {
        name: this.config.name,
        version: this.config.version,
      },
      {
        capabilities: {
          resources: {subscribe: true},
          tools: {listChanged: true},
          prompts: {listChanged: true},
          logging: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Resources handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return this.resourceHandlers.listResources();
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      return this.resourceHandlers.readResource(request.params.uri);
    });

    // Tools handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return this.toolHandlers.listTools();
    });

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request, extra) => {
        const {name, arguments: args} = request.params;

        // For now, use a default user for testing
        // In production, extract user from auth context
        const user: User = {id: 'default-user', tier: 'premium'};

        // Check permissions
        this.permissions.requirePermission(name, user);

        return this.toolHandlers.callTool(name, args || {});
      }
    );

    // Prompts handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return this.promptHandlers.listPrompts();
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async request => {
      const {name, arguments: args} = request.params;
      return this.promptHandlers.getPrompt(name, args || {});
    });
  }

  /**
   * Get the underlying MCP Server instance
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Connect to a transport
   */
  async connect(transport: any): Promise<void> {
    await this.server.connect(transport);
  }

  /**
   * Log a message (if logging is enabled)
   */
  log(level: string, message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    }
  }
}
