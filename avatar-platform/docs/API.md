# Avatar Platform API Reference

## Core Classes

### AvatarPlatform

Main class for interacting with the avatar platform.

#### Constructor

```typescript
constructor(configPath?: string)
```

**Parameters:**
- `configPath` (optional): Path to custom configuration file

**Example:**
```typescript
import { AvatarPlatform } from 'release-please-avatar-platform';

const platform = new AvatarPlatform('./custom-config.json');
await platform.initialize();
```

#### Methods

##### `initialize(): Promise<void>`

Initialize the platform and all subsystems.

**Returns:** Promise<void>

**Throws:** Error if platform is disabled or initialization fails

**Example:**
```typescript
await platform.initialize();
```

---

##### `generateAvatar(request: GenerateAvatarRequest): Promise<Avatar>`

Generate a new avatar using AI.

**Parameters:**
- `request`: Generation request configuration

**Returns:** Promise<Avatar>

**Example:**
```typescript
const avatar = await platform.generateAvatar({
  source: {
    type: 'photo',
    data: {
      imageUrl: 'https://example.com/photo.jpg',
      facingDirection: 'front'
    }
  },
  style: 'realistic',
  options: {
    quality: 'professional',
    targetPlatforms: ['unity', 'unreal'],
    includeAnimations: true,
    customPrompt: 'Make the character look confident'
  }
});
```

---

##### `exportAvatar(request: ExportRequest): Promise<ExportResult[]>`

Export an avatar to one or more platforms.

**Parameters:**
- `request`: Export request with avatar ID and target platforms

**Returns:** Promise<ExportResult[]>

**Example:**
```typescript
const results = await platform.exportAvatar({
  avatarId: 'avatar-123',
  platforms: ['unity', 'unreal', 'vrchat', 'roblox'],
  options: {
    quality: 'ultra',
    includeAnimations: true,
    includeMaterials: true,
    optimizeForWeb: false
  }
});

results.forEach(result => {
  console.log(`${result.platform}: ${result.url} (${result.fileSize} bytes)`);
});
```

---

##### `getUserProfile(userId: string): Promise<UserProfile>`

Get user profile including gamification data.

**Parameters:**
- `userId`: User identifier

**Returns:** Promise<UserProfile>

**Example:**
```typescript
const profile = await platform.getUserProfile('user-123');
console.log(`${profile.displayName} - Level ${profile.level} (${profile.xp} XP)`);
console.log(`Achievements: ${profile.achievements.join(', ')}`);
```

---

##### `getGalleryItems(page?: number, limit?: number): Promise<GalleryItem[]>`

Get items from the community gallery.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Returns:** Promise<GalleryItem[]>

**Example:**
```typescript
const items = await platform.getGalleryItems(1, 10);
items.forEach(item => {
  console.log(`${item.avatar.name} by ${item.creator.username}`);
  console.log(`Likes: ${item.stats.likes}, Views: ${item.stats.views}`);
});
```

---

##### `createCollaborationSession(avatarId: string, participants: string[]): Promise<CollaborationSession>`

Create a real-time collaboration session.

**Parameters:**
- `avatarId`: Avatar to collaborate on
- `participants`: Array of user IDs

**Returns:** Promise<CollaborationSession>

**Example:**
```typescript
const session = await platform.createCollaborationSession(
  'avatar-123',
  ['user-1', 'user-2', 'user-3']
);

console.log(`Session ${session.id} started at ${session.startTime}`);
```

---

##### `getUserAnalytics(userId: string, start: Date, end: Date): Promise<UserAnalytics>`

Get analytics for a user over a time period.

**Parameters:**
- `userId`: User identifier
- `start`: Start date
- `end`: End date

**Returns:** Promise<UserAnalytics>

**Example:**
```typescript
const analytics = await platform.getUserAnalytics(
  'user-123',
  new Date('2026-01-01'),
  new Date('2026-02-01')
);

console.log(`Avatars created: ${analytics.metrics.avatarsCreated}`);
console.log(`Time spent: ${analytics.metrics.timeSpent / 3600} hours`);
console.log(`Exports: ${analytics.metrics.exportsCompleted}`);
```

---

##### `awardAchievement(userId: string, achievementId: string): Promise<void>`

Award an achievement to a user.

**Parameters:**
- `userId`: User identifier
- `achievementId`: Achievement identifier

**Returns:** Promise<void>

**Example:**
```typescript
await platform.awardAchievement('user-123', 'first_avatar');
await platform.awardAchievement('user-123', 'speed_creator');
```

---

##### `getExportPlatforms(): string[]`

Get list of supported export platform IDs.

**Returns:** string[]

**Example:**
```typescript
const platforms = platform.getExportPlatforms();
console.log(`Supported platforms: ${platforms.join(', ')}`);
// Output: unity, unreal, vrchat, roblox, ...
```

---

##### `getConfig(): Readonly<AvatarPlatformConfig>`

Get the platform configuration.

**Returns:** Readonly<AvatarPlatformConfig>

**Example:**
```typescript
const config = platform.getConfig();
console.log(`AI Provider: ${config.features.ai.provider}`);
console.log(`Gamification enabled: ${config.features.gamification.enabled}`);
```

---

## Helper Functions

### `createAvatarPlatform(configPath?: string): Promise<AvatarPlatform>`

Create and initialize an avatar platform instance.

**Parameters:**
- `configPath` (optional): Path to custom configuration file

**Returns:** Promise<AvatarPlatform>

**Example:**
```typescript
import { createAvatarPlatform } from 'release-please-avatar-platform';

const platform = await createAvatarPlatform();
// Platform is already initialized and ready to use
```

---

## Type Definitions

### AvatarStyle

```typescript
type AvatarStyle = 
  | 'realistic'
  | 'anime'
  | 'cartoon'
  | 'stylized'
  | 'low-poly'
  | 'voxel'
  | 'pixel-art';
```

### GenerateAvatarRequest

```typescript
interface GenerateAvatarRequest {
  source: GenerationSource;
  style: AvatarStyle;
  options: GenerationOptions;
}
```

### GenerationSource

```typescript
interface GenerationSource {
  type: 'photo' | 'description' | 'template' | 'random';
  data: string | PhotoData | TemplateData;
}
```

### PhotoData

```typescript
interface PhotoData {
  imageUrl: string;
  facingDirection?: 'front' | 'side' | 'three-quarter';
}
```

### GenerationOptions

```typescript
interface GenerationOptions {
  quality: 'draft' | 'standard' | 'professional' | 'ultra';
  targetPlatforms: string[];
  includeAnimations: boolean;
  customPrompt?: string;
}
```

### Avatar

```typescript
interface Avatar {
  id: string;
  userId: string;
  name: string;
  style: AvatarStyle;
  created: Date;
  updated: Date;
  metadata: AvatarMetadata;
  assets: AvatarAssets;
}
```

### ExportRequest

```typescript
interface ExportRequest {
  avatarId: string;
  platforms: string[];
  options: ExportOptions;
}
```

### ExportOptions

```typescript
interface ExportOptions {
  quality: 'draft' | 'standard' | 'professional' | 'ultra';
  includeAnimations: boolean;
  includeMaterials: boolean;
  optimizeForWeb: boolean;
  customSettings?: Record<string, any>;
}
```

### ExportResult

```typescript
interface ExportResult {
  platform: string;
  format: string;
  url: string;
  fileSize: number;
  metadata: Record<string, any>;
}
```

### UserProfile

```typescript
interface UserProfile {
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
```

### GalleryItem

```typescript
interface GalleryItem {
  avatar: Avatar;
  creator: UserProfile;
  stats: GalleryStats;
}
```

### CollaborationSession

```typescript
interface CollaborationSession {
  id: string;
  avatarId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  changes: Change[];
}
```

### UserAnalytics

```typescript
interface UserAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  metrics: UserMetrics;
}
```

---

## Configuration

### Platform Configuration Schema

The platform is configured via `config/platform-config.json`:

```json
{
  "enabled": true,
  "version": "1.0.0",
  "features": {
    "gamification": {
      "enabled": true,
      "achievements": true,
      "levels": true,
      "streaks": true
    },
    "social": {
      "enabled": true,
      "gallery": true,
      "marketplace": true
    },
    "ai": {
      "enabled": true,
      "provider": "openai"
    }
  },
  "tiers": {
    "free": {
      "name": "Free",
      "price": 0,
      "limits": {
        "avatarsPerMonth": 10,
        "storage": "1GB"
      }
    }
  }
}
```

See the [configuration schema](../schemas/platform-config.schema.json) for full details.

---

## Error Handling

All methods may throw errors. Always use try-catch:

```typescript
try {
  const avatar = await platform.generateAvatar(request);
} catch (error) {
  if (error.message.includes('disabled')) {
    console.error('Feature is disabled in configuration');
  } else {
    console.error('Generation failed:', error);
  }
}
```

Common errors:

- `"Avatar platform is disabled in configuration"` - Platform not enabled
- `"Avatar platform not initialized"` - Call `initialize()` first
- `"AI features are disabled"` - AI features not enabled in config
- `"Social features are disabled"` - Social features not enabled in config
- `"Unsupported export platform"` - Invalid platform ID

---

## Best Practices

1. **Always initialize**: Call `initialize()` before using the platform
2. **Handle errors**: Wrap API calls in try-catch blocks
3. **Use typed interfaces**: Leverage TypeScript types for better IDE support
4. **Check configuration**: Verify features are enabled before using them
5. **Batch exports**: Export to multiple platforms in a single call
6. **Cache profiles**: Cache user profiles to reduce API calls
7. **Monitor analytics**: Regularly check user analytics for insights

---

## Examples

See the [examples directory](../examples) for complete working examples:

- `basic-generation.ts` - Basic avatar generation
- `batch-export.ts` - Export to multiple platforms
- `collaboration.ts` - Real-time collaboration
- `gamification.ts` - Achievements and leveling
- `analytics.ts` - User analytics and insights

---

## Support

For issues and questions:

- GitHub Issues: https://github.com/antneymon-ops/release-please/issues
- Documentation: https://github.com/antneymon-ops/release-please/avatar-platform/docs
- API Reference: This document
