/**
 * Tool Handlers for MCP Server
 */

import {CallToolResult} from '@modelcontextprotocol/sdk/types.js';
import {MCPTool} from '../../types/protocol';
import {
  CreateAvatarArgs,
  EditAvatarArgs,
  ExportAvatarArgs,
  SearchAvatarsArgs,
  ApplyTemplateArgs,
} from '../../types/tools';
import {AvatarService} from '../../services/avatar/avatar-service';
import {ExportService} from '../../services/export/export-service';
import {StorageService} from '../../services/storage/storage-service';

export class ToolHandlers {
  constructor(
    private avatarService: AvatarService,
    private exportService: ExportService,
    private storageService: StorageService
  ) {}

  /**
   * List all available tools
   */
  async listTools(): Promise<{tools: MCPTool[]}> {
    return {
      tools: [
        {
          name: 'create_avatar',
          description: 'Create a new avatar from a text description',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Description of the avatar to create',
              },
              style: {
                type: 'string',
                enum: ['realistic', 'cartoon', 'anime', 'stylized'],
                description: 'Avatar style',
              },
              quality: {
                type: 'string',
                enum: ['draft', 'standard', 'high', 'ultra'],
                description: 'Quality level',
              },
            },
            required: ['prompt'],
          },
        },
        {
          name: 'edit_avatar',
          description: 'Edit an existing avatar',
          inputSchema: {
            type: 'object',
            properties: {
              avatarId: {
                type: 'string',
                description: 'ID of avatar to edit',
              },
              modifications: {
                type: 'object',
                description: 'Modifications to apply',
              },
            },
            required: ['avatarId', 'modifications'],
          },
        },
        {
          name: 'export_avatar',
          description: 'Export avatar to specific platform format',
          inputSchema: {
            type: 'object',
            properties: {
              avatarId: {type: 'string'},
              platform: {
                type: 'string',
                enum: ['unity', 'unreal', 'web', 'blender', 'vrchat'],
              },
              quality: {
                type: 'string',
                enum: ['draft', 'standard', 'high', 'ultra'],
              },
            },
            required: ['avatarId', 'platform'],
          },
        },
        {
          name: 'search_avatars',
          description: 'Search through created avatars',
          inputSchema: {
            type: 'object',
            properties: {
              query: {type: 'string'},
              filters: {type: 'object'},
            },
          },
        },
        {
          name: 'apply_template',
          description: 'Apply a template to create avatar quickly',
          inputSchema: {
            type: 'object',
            properties: {
              templateId: {type: 'string'},
              customizations: {type: 'object'},
            },
            required: ['templateId'],
          },
        },
      ],
    };
  }

  /**
   * Execute a tool call
   */
  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<CallToolResult> {
    switch (name) {
      case 'create_avatar':
        return this.createAvatar(args as unknown as CreateAvatarArgs);

      case 'edit_avatar':
        return this.editAvatar(args as unknown as EditAvatarArgs);

      case 'export_avatar':
        return this.exportAvatar(args as unknown as ExportAvatarArgs);

      case 'search_avatars':
        return this.searchAvatars(args as unknown as SearchAvatarsArgs);

      case 'apply_template':
        return this.applyTemplate(args as unknown as ApplyTemplateArgs);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async createAvatar(args: CreateAvatarArgs): Promise<CallToolResult> {
    const result = await this.avatarService.createAvatar(args);
    return {
      content: [
        {
          type: 'text',
          text: `Created avatar: ${result.id}\nPreview: ${result.previewUrl}\nStatus: ${result.status}\n${result.message}`,
        },
      ],
    };
  }

  private async editAvatar(args: EditAvatarArgs): Promise<CallToolResult> {
    const result = await this.avatarService.editAvatar(args);
    return {
      content: [
        {
          type: 'text',
          text: `Updated avatar: ${result.id}\nPreview: ${result.previewUrl}\nStatus: ${result.status}\n${result.message}`,
        },
      ],
    };
  }

  private async exportAvatar(args: ExportAvatarArgs): Promise<CallToolResult> {
    const result = await this.exportService.exportAvatar(args);
    return {
      content: [
        {
          type: 'text',
          text: `Exported to ${result.platform} (${result.format})\nDownload: ${result.downloadUrl}\nQuality: ${result.quality}\nEstimated size: ${result.size}`,
        },
      ],
    };
  }

  private async searchAvatars(
    args: SearchAvatarsArgs
  ): Promise<CallToolResult> {
    const results = await this.avatarService.searchAvatars(
      args.query,
      args.filters
    );
    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} avatar(s):\n${JSON.stringify(
            results,
            null,
            2
          )}`,
        },
      ],
    };
  }

  private async applyTemplate(
    args: ApplyTemplateArgs
  ): Promise<CallToolResult> {
    const template = await this.storageService.getTemplateById(args.templateId);

    if (!template) {
      throw new Error(`Template not found: ${args.templateId}`);
    }

    // Create avatar using template as base
    const createArgs: CreateAvatarArgs = {
      prompt: `${template.description}${
        args.customizations
          ? ` with customizations: ${JSON.stringify(args.customizations)}`
          : ''
      }`,
      style: template.style as CreateAvatarArgs['style'],
    };

    const result = await this.avatarService.createAvatar(createArgs);

    return {
      content: [
        {
          type: 'text',
          text: `Applied template "${template.name}"\nCreated avatar: ${result.id}\nPreview: ${result.previewUrl}`,
        },
      ],
    };
  }
}
