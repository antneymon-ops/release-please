/**
 * Collaboration Example
 * 
 * This example demonstrates:
 * 1. Creating collaboration sessions
 * 2. Real-time co-creation
 * 3. Change tracking
 */

import { createAvatarPlatform } from '../src';

async function main() {
  const platform = await createAvatarPlatform();
  
  console.log('=== Collaboration Example ===\n');
  
  // Check if collaboration is enabled
  const config = platform.getConfig();
  if (!config.features.social.collaboration) {
    console.error('Collaboration features are disabled!');
    return;
  }
  
  // Create an avatar first
  console.log('Creating avatar...');
  const avatar = await platform.generateAvatar({
    source: {
      type: 'random',
      data: ''
    },
    style: 'realistic',
    options: {
      quality: 'standard',
      targetPlatforms: ['unity'],
      includeAnimations: false
    }
  });
  
  console.log(`Avatar created: ${avatar.id}`);
  
  // Create collaboration session
  console.log('\nCreating collaboration session...');
  const participants = [
    'user-alice',
    'user-bob',
    'user-charlie'
  ];
  
  const session = await platform.createCollaborationSession(
    avatar.id,
    participants
  );
  
  console.log(`Session ID: ${session.id}`);
  console.log(`Avatar: ${session.avatarId}`);
  console.log(`Participants: ${session.participants.join(', ')}`);
  console.log(`Started: ${session.startTime}`);
  
  // Simulate some changes
  console.log('\nSimulating collaborative changes...');
  console.log('In a real implementation, these would be:');
  console.log('  - Real-time cursor tracking');
  console.log('  - WebSocket-based sync');
  console.log('  - Voice/video chat integration');
  console.log('  - Change history with undo/redo');
  console.log('  - @mentions and comments');
  
  // Show collaboration features
  console.log('\nCollaboration Features:');
  console.log('  ✓ Co-creation sessions (2+ people create together)');
  console.log('  ✓ Team workspaces with shared assets');
  console.log('  ✓ Comments and annotations on avatars');
  console.log('  ✓ @mentions in collaborative editing');
  console.log('  ✓ Video/voice chat integration during editing');
  console.log('  ✓ Real-time cursor tracking');
  console.log('  ✓ Change history and version control');
  
  console.log('\nSession active. In a real app, this would continue until:');
  console.log('  - All participants leave');
  console.log('  - Session is explicitly ended');
  console.log('  - Session timeout is reached');
}

main().catch(console.error);
