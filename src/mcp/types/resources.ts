/**
 * Resource Types for Avatar Platform
 */

export interface AvatarTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  thumbnailUrl: string;
  previewUrl: string;
  tags: string[];
}

export interface UserAvatar {
  id: string;
  userId: string;
  name: string;
  description: string;
  style: string;
  previewUrl: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface AssetLibraryItem {
  id: string;
  type: 'hair' | 'clothing' | 'accessory' | 'face' | 'body';
  name: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  examples: string[];
}
