/**
 * Gamification Example
 *
 * This example demonstrates:
 * 1. User profile management
 * 2. Achievement system
 * 3. Level progression
 * 4. Streak tracking
 */

import {createAvatarPlatform} from '../src';

async function main() {
  const platform = await createAvatarPlatform();

  console.log('=== Gamification Example ===\n');

  // Get user profile
  console.log('Getting user profile...');
  const profile = await platform.getUserProfile('user-123');
  console.log(`User: ${profile.displayName}`);
  console.log(`Level: ${profile.level}`);
  console.log(`XP: ${profile.xp}`);
  console.log(`Achievements: ${profile.achievements.length}`);
  console.log(`Followers: ${profile.followers}`);

  // Award multiple achievements
  console.log('\nAwarding achievements...');
  const achievementsToAward = [
    'first_avatar',
    'speed_creator',
    'style_pioneer',
  ];

  for (const achievementId of achievementsToAward) {
    await platform.awardAchievement('user-123', achievementId);
    console.log(`✓ Awarded: ${achievementId}`);
  }

  // Get configuration to show achievement details
  const config = platform.getConfig();
  console.log('\nAvailable Achievements:');
  config.gamification.achievements.forEach(achievement => {
    console.log(`  ${achievement.icon} ${achievement.name}`);
    console.log(`     ${achievement.description}`);
    console.log(`     XP: ${achievement.xp}`);
  });

  // Show level progression
  console.log('\nLevel Progression:');
  config.gamification.levels.forEach(level => {
    console.log(`  Level ${level.level}: ${level.name}`);
    console.log(`     XP Range: ${level.minXP} - ${level.maxXP || '∞'}`);
  });

  // Show streak rewards
  console.log('\nStreak Rewards:');
  const streakRewards = config.gamification.streaks.daily.rewards;
  Object.entries(streakRewards).forEach(([days, reward]) => {
    console.log(`  ${days} days: ${reward.type} = ${reward.value}`);
  });
}

main().catch(console.error);
