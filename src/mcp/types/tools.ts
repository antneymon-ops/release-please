/**
 * Tool Types for Avatar Creation
 */

export interface CreateAvatarArgs {
  prompt: string;
  style?: 'realistic' | 'cartoon' | 'anime' | 'stylized';
  quality?: 'draft' | 'standard' | 'high' | 'ultra';
}

export interface EditAvatarArgs {
  avatarId: string;
  modifications: {
    prompt?: string;
    style?: string;
    adjustments?: Record<string, unknown>;
  };
}

export interface ExportAvatarArgs {
  avatarId: string;
  platform: 'unity' | 'unreal' | 'web' | 'blender' | 'vrchat';
  quality?: 'draft' | 'standard' | 'high' | 'ultra';
}

export interface SearchAvatarsArgs {
  query: string;
  filters?: {
    style?: string;
    tags?: string[];
    userId?: string;
  };
  limit?: number;
  offset?: number;
}

export interface ApplyTemplateArgs {
  templateId: string;
  customizations?: Record<string, unknown>;
}

export interface AvatarResult {
  id: string;
  previewUrl: string;
  downloadUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  message?: string;
}
