/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Avatar Platform Type Definitions
 *
 * Core types for the avatar creation platform module
 */

export interface AvatarPlatformConfig {
  enabled: boolean;
  version: string;
  features: PlatformFeatures;
  tiers: SubscriptionTiers;
  exportPlatforms: ExportPlatform[];
  gamification: GamificationConfig;
  performance: PerformanceConfig;
  security: SecurityConfig;
}

export interface PlatformFeatures {
  gamification: FeatureGamification;
  social: FeatureSocial;
  ai: FeatureAI;
  professional: FeatureProfessional;
  mobile: FeatureMobile;
  analytics: FeatureAnalytics;
}

export interface FeatureGamification {
  enabled: boolean;
  achievements: boolean;
  levels: boolean;
  streaks: boolean;
  challenges: boolean;
  leaderboards: boolean;
}

export interface FeatureSocial {
  enabled: boolean;
  gallery: boolean;
  comments: boolean;
  likes: boolean;
  follows: boolean;
  marketplace: boolean;
  collaboration: boolean;
}

export interface FeatureAI {
  enabled: boolean;
  photoToAvatar: boolean;
  styleMixing: boolean;
  moodBased: boolean;
  storyToAvatar: boolean;
  ageProgression: boolean;
  autoEnhancement: boolean;
  provider: 'openai' | 'anthropic' | 'custom';
}

export interface FeatureProfessional {
  enabled: boolean;
  teamWorkspaces: boolean;
  versionControl: boolean;
  approvalWorkflows: boolean;
  pipelineIntegration: boolean;
  customBranding: boolean;
}

export interface FeatureMobile {
  enabled: boolean;
  pwa: boolean;
  nativeApps: boolean;
  arPreview: boolean;
  offlineSync: boolean;
}

export interface FeatureAnalytics {
  enabled: boolean;
  userMetrics: boolean;
  performanceInsights: boolean;
  engagementTracking: boolean;
}

export interface SubscriptionTiers {
  free: SubscriptionTier;
  premium: SubscriptionTier;
  pro: SubscriptionTier;
  enterprise: SubscriptionTier;
}

export interface SubscriptionTier {
  name: string;
  price: number | 'custom';
  currency?: string;
  billingPeriod?: string;
  limits: TierLimits;
  features: Record<string, boolean | string>;
}

export interface TierLimits {
  avatarsPerMonth: number | 'unlimited';
  storage: string;
  collaborators: number | 'unlimited';
  exports: string[] | 'all';
}

export interface ExportPlatform {
  id: string;
  name: string;
  formats: string[];
  features: string[];
}

export interface GamificationConfig {
  achievements: Achievement[];
  levels: Level[];
  streaks: StreakConfig;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon?: string;
}

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number | null;
}

export interface StreakConfig {
  daily: {
    enabled: boolean;
    rewards: Record<string, StreakReward>;
  };
}

export interface StreakReward {
  type: string;
  value: string | number;
}

export interface PerformanceConfig {
  targets: {
    avatarGeneration: string;
    previewLatency: string;
    exportTime: string;
    uptime: string;
  };
  qualityModes: Record<string, QualityMode>;
}

export interface QualityMode {
  speed: string;
  quality: string;
  premiumOnly?: boolean;
}

export interface SecurityConfig {
  authentication: {
    providers: string[];
    twoFactorAuth: boolean;
  };
  privacy: {
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    endToEndEncryption: boolean;
    dataExportEnabled: boolean;
  };
}

// Avatar Creation Types

export interface Avatar {
  id: string;
  userId: string;
  name: string;
  style: AvatarStyle;
  created: Date;
  updated: Date;
  metadata: AvatarMetadata;
  assets: AvatarAssets;
}

export type AvatarStyle =
  | 'realistic'
  | 'anime'
  | 'cartoon'
  | 'stylized'
  | 'low-poly'
  | 'voxel'
  | 'pixel-art';

export interface AvatarMetadata {
  version: string;
  tags: string[];
  description?: string;
  visibility: 'private' | 'unlisted' | 'public';
  likes: number;
  views: number;
}

export interface AvatarAssets {
  model: string; // URL to 3D model
  textures: string[];
  materials: string[];
  animations?: string[];
  thumbnail: string;
}

// Generation Types

export interface GenerateAvatarRequest {
  source: GenerationSource;
  style: AvatarStyle;
  options: GenerationOptions;
}

export interface GenerationSource {
  type: 'photo' | 'description' | 'template' | 'random';
  data: string | PhotoData | TemplateData;
}

export interface PhotoData {
  imageUrl: string;
  facingDirection?: 'front' | 'side' | 'three-quarter';
}

export interface TemplateData {
  templateId: string;
  customizations: Record<string, any>;
}

export interface GenerationOptions {
  quality: 'draft' | 'standard' | 'professional' | 'ultra';
  targetPlatforms: string[];
  includeAnimations: boolean;
  customPrompt?: string;
}

// Export Types

export interface ExportRequest {
  avatarId: string;
  platforms: string[];
  options: ExportOptions;
}

export interface ExportOptions {
  quality: 'draft' | 'standard' | 'professional' | 'ultra';
  includeAnimations: boolean;
  includeMaterials: boolean;
  optimizeForWeb: boolean;
  customSettings?: Record<string, any>;
}

export interface ExportResult {
  platform: string;
  format: string;
  url: string;
  fileSize: number;
  metadata: Record<string, any>;
}

// Social Types

export interface GalleryItem {
  avatar: Avatar;
  creator: UserProfile;
  stats: GalleryStats;
}

export interface GalleryStats {
  likes: number;
  views: number;
  comments: number;
  shares: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  achievements: string[];
  followers: number;
  following: number;
}

// Collaboration Types

export interface CollaborationSession {
  id: string;
  avatarId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  changes: Change[];
}

export interface Change {
  userId: string;
  timestamp: Date;
  type: string;
  data: any;
}

// Analytics Types

export interface UserAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  metrics: UserMetrics;
}

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

export interface UserMetrics {
  avatarsCreated: number;
  timeSpent: number; // seconds
  exportsCompleted: number;
  collaborations: number;
  communityEngagement: CommunityMetrics;
}

export interface CommunityMetrics {
  likes: number;
  comments: number;
  shares: number;
  followers: number;
}
