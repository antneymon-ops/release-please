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
 * Basic tests for Avatar Platform
 * 
 * Tests core functionality including:
 * - Configuration loading
 * - Platform initialization
 * - Feature availability checks
 */

import * as assert from 'assert';
import {AvatarPlatform, createAvatarPlatform} from '../src';

describe('AvatarPlatform', () => {
  describe('configuration', () => {
    it('should load configuration successfully', () => {
      const platform = new AvatarPlatform();
      const config = platform.getConfig();
      
      assert.strictEqual(typeof config, 'object');
      assert.strictEqual(config.enabled, true);
      assert.strictEqual(config.version, '1.0.0');
    });

    it('should have all required feature flags', () => {
      const platform = new AvatarPlatform();
      const config = platform.getConfig();
      
      assert.ok(config.features.gamification);
      assert.ok(config.features.social);
      assert.ok(config.features.ai);
      assert.ok(config.features.professional);
      assert.ok(config.features.mobile);
      assert.ok(config.features.analytics);
    });

    it('should have all subscription tiers defined', () => {
      const platform = new AvatarPlatform();
      const config = platform.getConfig();
      
      assert.ok(config.tiers.free);
      assert.ok(config.tiers.premium);
      assert.ok(config.tiers.pro);
      assert.ok(config.tiers.enterprise);
    });

    it('should have 15+ export platforms', () => {
      const platform = new AvatarPlatform();
      const config = platform.getConfig();
      
      assert.ok(config.exportPlatforms.length >= 15);
      
      // Check for key platforms
      const platformIds = config.exportPlatforms.map(p => p.id);
      assert.ok(platformIds.includes('unity'));
      assert.ok(platformIds.includes('unreal'));
      assert.ok(platformIds.includes('vrchat'));
      assert.ok(platformIds.includes('roblox'));
    });

    it('should have gamification configuration', () => {
      const platform = new AvatarPlatform();
      const config = platform.getConfig();
      
      assert.ok(config.gamification.achievements.length > 0);
      assert.ok(config.gamification.levels.length > 0);
      assert.ok(config.gamification.streaks);
    });
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const platform = new AvatarPlatform();
      await platform.initialize();
      
      // Should not throw
      assert.ok(true);
    });

    it('should initialize with createAvatarPlatform helper', async () => {
      const platform = await createAvatarPlatform();
      
      // Should be initialized and ready
      assert.ok(platform);
      assert.strictEqual(typeof platform.getConfig, 'function');
    });

    it('should throw error when using uninitialized platform', async () => {
      const platform = new AvatarPlatform();
      
      // Try to use platform without initializing
      try {
        await platform.generateAvatar({
          source: {type: 'random', data: ''},
          style: 'realistic',
          options: {
            quality: 'standard',
            targetPlatforms: ['unity'],
            includeAnimations: false,
          },
        });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('not initialized'));
      }
    });
  });

  describe('export platforms', () => {
    it('should return list of export platforms', () => {
      const platform = new AvatarPlatform();
      const platforms = platform.getExportPlatforms();
      
      assert.ok(Array.isArray(platforms));
      assert.ok(platforms.length >= 15);
      assert.ok(platforms.includes('unity'));
      assert.ok(platforms.includes('unreal'));
    });
  });

  describe('avatar generation', () => {
    it('should generate avatar with valid request', async () => {
      const platform = await createAvatarPlatform();
      
      const avatar = await platform.generateAvatar({
        source: {type: 'random', data: ''},
        style: 'realistic',
        options: {
          quality: 'standard',
          targetPlatforms: ['unity'],
          includeAnimations: false,
        },
      });
      
      assert.ok(avatar.id);
      assert.strictEqual(avatar.style, 'realistic');
      assert.ok(avatar.created instanceof Date);
      assert.ok(avatar.metadata);
      assert.ok(avatar.assets);
    });

    it('should throw error when AI features disabled', async () => {
      const platform = new AvatarPlatform();
      
      // Manually set AI disabled for testing
      const config = platform.getConfig();
      (config.features.ai as any).enabled = false;
      
      await platform.initialize();
      
      try {
        await platform.generateAvatar({
          source: {type: 'random', data: ''},
          style: 'realistic',
          options: {
            quality: 'standard',
            targetPlatforms: ['unity'],
            includeAnimations: false,
          },
        });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('AI features are disabled'));
      }
    });
  });

  describe('export', () => {
    it('should export avatar to multiple platforms', async () => {
      const platform = await createAvatarPlatform();
      
      const avatar = await platform.generateAvatar({
        source: {type: 'random', data: ''},
        style: 'realistic',
        options: {
          quality: 'standard',
          targetPlatforms: ['unity'],
          includeAnimations: false,
        },
      });
      
      const results = await platform.exportAvatar({
        avatarId: avatar.id,
        platforms: ['unity', 'unreal', 'vrchat'],
        options: {
          quality: 'standard',
          includeAnimations: false,
          includeMaterials: true,
          optimizeForWeb: false,
        },
      });
      
      assert.strictEqual(results.length, 3);
      assert.ok(results.every(r => r.platform));
      assert.ok(results.every(r => r.format));
      assert.ok(results.every(r => r.url));
    });

    it('should throw error for unsupported platform', async () => {
      const platform = await createAvatarPlatform();
      
      try {
        await platform.exportAvatar({
          avatarId: 'test-avatar',
          platforms: ['invalid-platform'],
          options: {
            quality: 'standard',
            includeAnimations: false,
            includeMaterials: true,
            optimizeForWeb: false,
          },
        });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('Unsupported export platform'));
      }
    });
  });

  describe('user profiles', () => {
    it('should get user profile', async () => {
      const platform = await createAvatarPlatform();
      
      const profile = await platform.getUserProfile('test-user');
      
      assert.strictEqual(profile.id, 'test-user');
      assert.ok(profile.username);
      assert.ok(typeof profile.level === 'number');
      assert.ok(typeof profile.xp === 'number');
      assert.ok(Array.isArray(profile.achievements));
    });
  });

  describe('achievements', () => {
    it('should award achievement to user', async () => {
      const platform = await createAvatarPlatform();
      
      // Should not throw
      await platform.awardAchievement('test-user', 'first_avatar');
      assert.ok(true);
    });

    it('should throw error for invalid achievement', async () => {
      const platform = await createAvatarPlatform();
      
      try {
        await platform.awardAchievement('test-user', 'invalid-achievement');
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('Achievement not found'));
      }
    });
  });

  describe('collaboration', () => {
    it('should create collaboration session', async () => {
      const platform = await createAvatarPlatform();
      
      const session = await platform.createCollaborationSession(
        'test-avatar',
        ['user1', 'user2']
      );
      
      assert.ok(session.id);
      assert.strictEqual(session.avatarId, 'test-avatar');
      assert.deepStrictEqual(session.participants, ['user1', 'user2']);
      assert.ok(session.startTime instanceof Date);
      assert.ok(Array.isArray(session.changes));
    });
  });

  describe('analytics', () => {
    it('should get user analytics', async () => {
      const platform = await createAvatarPlatform();
      
      const start = new Date('2026-01-01');
      const end = new Date('2026-02-01');
      
      const analytics = await platform.getUserAnalytics('test-user', start, end);
      
      assert.strictEqual(analytics.userId, 'test-user');
      assert.deepStrictEqual(analytics.period.start, start);
      assert.deepStrictEqual(analytics.period.end, end);
      assert.ok(analytics.metrics);
      assert.ok(typeof analytics.metrics.avatarsCreated === 'number');
      assert.ok(typeof analytics.metrics.timeSpent === 'number');
    });
  });
});
