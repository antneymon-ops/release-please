/**
 * Basic Avatar Generation Example
 *
 * This example demonstrates how to:
 * 1. Initialize the avatar platform
 * 2. Generate an avatar from a photo
 * 3. Export to multiple platforms
 */

import {createAvatarPlatform} from '../src';

async function main() {
  console.log('Initializing Avatar Platform...');

  // Create and initialize platform
  const platform = await createAvatarPlatform();

  console.log('Platform initialized successfully!');

  // Generate avatar from photo
  console.log('\nGenerating avatar from photo...');
  const avatar = await platform.generateAvatar({
    source: {
      type: 'photo',
      data: {
        imageUrl: 'https://example.com/photo.jpg',
        facingDirection: 'front',
      },
    },
    style: 'realistic',
    options: {
      quality: 'professional',
      targetPlatforms: ['unity', 'unreal'],
      includeAnimations: true,
      customPrompt: 'Make the character look confident and approachable',
    },
  });

  console.log(`Avatar generated: ${avatar.id}`);
  console.log(`Style: ${avatar.style}`);
  console.log(`Created: ${avatar.created}`);

  // Export to multiple platforms
  console.log('\nExporting avatar to platforms...');
  const exportResults = await platform.exportAvatar({
    avatarId: avatar.id,
    platforms: ['unity', 'unreal', 'vrchat', 'roblox'],
    options: {
      quality: 'professional',
      includeAnimations: true,
      includeMaterials: true,
      optimizeForWeb: false,
    },
  });

  console.log('\nExport Results:');
  exportResults.forEach(result => {
    console.log(`  ${result.platform}:`);
    console.log(`    Format: ${result.format}`);
    console.log(`    URL: ${result.url}`);
    console.log(`    Size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
  });

  // Award achievement
  console.log('\nAwarding achievement...');
  await platform.awardAchievement('user-123', 'first_avatar');

  console.log('Done!');
}

main().catch(console.error);
