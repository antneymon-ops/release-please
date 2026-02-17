/**
 * Storage Service - Handles data storage and retrieval
 */

import {
  AvatarTemplate,
  AvatarStyle,
  AssetLibraryItem,
} from '../../types/resources';

export class StorageService {
  private templates: AvatarTemplate[] = [];
  private styles: AvatarStyle[] = [];
  private assets: AssetLibraryItem[] = [];

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Get all avatar templates
   */
  async getTemplates(): Promise<AvatarTemplate[]> {
    return this.templates;
  }

  /**
   * Get all available styles
   */
  async getStyles(): Promise<AvatarStyle[]> {
    return this.styles;
  }

  /**
   * Get asset library items
   */
  async getAssets(type?: string): Promise<AssetLibraryItem[]> {
    if (type) {
      return this.assets.filter(asset => asset.type === type);
    }
    return this.assets;
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<AvatarTemplate | undefined> {
    return this.templates.find(t => t.id === id);
  }

  private initializeDefaultData(): void {
    // Initialize default templates
    this.templates = [
      {
        id: 'template-professional',
        name: 'Professional Headshot',
        description: 'Clean, professional avatar for business use',
        style: 'realistic',
        thumbnailUrl: 'https://example.com/templates/professional-thumb.png',
        previewUrl: 'https://example.com/templates/professional.png',
        tags: ['business', 'professional', 'formal'],
      },
      {
        id: 'template-gaming',
        name: 'Gaming Character',
        description: 'Dynamic gaming character template',
        style: 'stylized',
        thumbnailUrl: 'https://example.com/templates/gaming-thumb.png',
        previewUrl: 'https://example.com/templates/gaming.png',
        tags: ['gaming', 'action', 'dynamic'],
      },
      {
        id: 'template-anime',
        name: 'Anime Style',
        description: 'Anime-style character template',
        style: 'anime',
        thumbnailUrl: 'https://example.com/templates/anime-thumb.png',
        previewUrl: 'https://example.com/templates/anime.png',
        tags: ['anime', 'manga', 'japanese'],
      },
    ];

    // Initialize default styles
    this.styles = [
      {
        id: 'style-realistic',
        name: 'Realistic',
        description: 'Photorealistic human avatars',
        examples: ['https://example.com/styles/realistic-1.png'],
      },
      {
        id: 'style-cartoon',
        name: 'Cartoon',
        description: 'Playful cartoon-style avatars',
        examples: ['https://example.com/styles/cartoon-1.png'],
      },
      {
        id: 'style-anime',
        name: 'Anime',
        description: 'Japanese anime-style characters',
        examples: ['https://example.com/styles/anime-1.png'],
      },
      {
        id: 'style-stylized',
        name: 'Stylized',
        description: 'Artistic stylized avatars',
        examples: ['https://example.com/styles/stylized-1.png'],
      },
    ];

    // Initialize default assets
    this.assets = [
      {
        id: 'hair-001',
        type: 'hair',
        name: 'Short Hair',
        description: 'Classic short hairstyle',
        thumbnailUrl: 'https://example.com/assets/hair-001.png',
        tags: ['short', 'classic', 'professional'],
      },
      {
        id: 'clothing-001',
        type: 'clothing',
        name: 'Business Suit',
        description: 'Professional business attire',
        thumbnailUrl: 'https://example.com/assets/clothing-001.png',
        tags: ['formal', 'business', 'professional'],
      },
    ];
  }
}
