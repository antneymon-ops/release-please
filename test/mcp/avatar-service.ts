/**
 * Avatar Service Tests
 */

import {describe, it, beforeEach} from 'mocha';
import {expect} from 'chai';
import {AvatarService} from '../../src/mcp/services/avatar/avatar-service';

describe('AvatarService', () => {
  let avatarService: AvatarService;

  beforeEach(() => {
    avatarService = new AvatarService();
  });

  describe('createAvatar', () => {
    it('should create an avatar from a prompt', async () => {
      const result = await avatarService.createAvatar({
        prompt: 'A cyberpunk detective',
        style: 'stylized',
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('previewUrl');
      expect(result).to.have.property('status', 'completed');
      expect(result.id).to.include('avatar-');
    });

    it('should create avatar with default style', async () => {
      const result = await avatarService.createAvatar({
        prompt: 'A simple character',
      });

      expect(result.status).to.equal('completed');
    });
  });

  describe('searchAvatars', () => {
    it('should search avatars by query', async () => {
      // Create some avatars first
      await avatarService.createAvatar({
        prompt: 'A warrior character',
        style: 'realistic',
      });
      await avatarService.createAvatar({
        prompt: 'A mage character',
        style: 'cartoon',
      });

      const results = await avatarService.searchAvatars('warrior');
      expect(results.length).to.be.greaterThan(0);
    });

    it('should filter by style', async () => {
      await avatarService.createAvatar({
        prompt: 'Test avatar 1',
        style: 'realistic',
      });
      await avatarService.createAvatar({
        prompt: 'Test avatar 2',
        style: 'cartoon',
      });

      const results = await avatarService.searchAvatars('', {
        style: 'realistic',
      });

      results.forEach(avatar => {
        expect(avatar.style).to.equal('realistic');
      });
    });
  });
});
