/**
 * Resource Handlers for MCP Server
 */

import {MCPResource, MCPResourceContent} from '../../types/protocol';
import {StorageService} from '../../services/storage/storage-service';
import {AvatarService} from '../../services/avatar/avatar-service';

export class ResourceHandlers {
  constructor(
    private storageService: StorageService,
    private avatarService: AvatarService
  ) {}

  /**
   * List all available resources
   */
  async listResources(): Promise<{resources: MCPResource[]}> {
    return {
      resources: [
        {
          uri: 'avatar://templates',
          name: 'Avatar Templates',
          description: 'Pre-built avatar templates',
          mimeType: 'application/json',
        },
        {
          uri: 'avatar://user/{userId}/avatars',
          name: 'User Avatars',
          description: "User's created avatars",
          mimeType: 'application/json',
        },
        {
          uri: 'avatar://assets/library',
          name: 'Asset Library',
          description: 'Available assets (hair, clothing, etc.)',
          mimeType: 'application/json',
        },
        {
          uri: 'avatar://styles',
          name: 'Available Styles',
          description: 'Supported avatar styles',
          mimeType: 'application/json',
        },
      ],
    };
  }

  /**
   * Read a specific resource
   */
  async readResource(uri: string): Promise<{contents: MCPResourceContent[]}> {
    if (uri === 'avatar://templates') {
      const templates = await this.storageService.getTemplates();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(templates, null, 2),
          },
        ],
      };
    }

    if (uri === 'avatar://styles') {
      const styles = await this.storageService.getStyles();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(styles, null, 2),
          },
        ],
      };
    }

    if (uri === 'avatar://assets/library') {
      const assets = await this.storageService.getAssets();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(assets, null, 2),
          },
        ],
      };
    }

    // Handle user avatars resource
    const userAvatarsMatch = uri.match(/^avatar:\/\/user\/([^/]+)\/avatars$/);
    if (userAvatarsMatch) {
      const userId = userAvatarsMatch[1];
      const avatars = await this.avatarService.getUserAvatars(userId);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(avatars, null, 2),
          },
        ],
      };
    }

    throw new Error(`Resource not found: ${uri}`);
  }
}
