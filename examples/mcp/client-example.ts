/**
 * Example: MCP Client Usage
 *
 * This example demonstrates how to use the MCP client to interact
 * with the Avatar Creation Platform.
 */

import {MCPClient} from '../../src/mcp/client/index';

async function main() {
  // Create and connect client
  const client = new MCPClient({
    name: 'example-client',
    version: '1.0.0',
    command: 'node',
    args: ['build/src/mcp/index.js'],
  });

  console.log('Connecting to MCP server...');
  await client.connect();
  console.log('Connected!\n');

  // List available tools
  console.log('=== Available Tools ===');
  const tools = await client.listTools();
  tools.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
  console.log('');

  // List available resources
  console.log('=== Available Resources ===');
  const resources = await client.listResources();
  resources.forEach(resource => {
    console.log(`- ${resource.name} (${resource.uri})`);
    console.log(`  ${resource.description}`);
  });
  console.log('');

  // Read templates resource
  console.log('=== Avatar Templates ===');
  const templatesJson = await client.readResource('avatar://templates');
  const templates = JSON.parse(templatesJson);
  console.log(`Found ${templates.length} templates:`);
  templates.forEach((t: any) => {
    console.log(`- ${t.name}: ${t.description}`);
  });
  console.log('');

  // Create an avatar using a tool
  console.log('=== Creating Avatar ===');
  const createResult = await client.callTool('create_avatar', {
    prompt: 'A brave warrior with glowing armor',
    style: 'stylized',
    quality: 'high',
  });
  console.log(createResult.content[0]?.text);
  console.log('');

  // List available prompts
  console.log('=== Available Prompts ===');
  const prompts = await client.listPrompts();
  prompts.forEach(prompt => {
    console.log(`- ${prompt.name}: ${prompt.description}`);
  });
  console.log('');

  // Get a specific prompt
  console.log('=== Using Prompt Template ===');
  const prompt = await client.getPrompt('create_character', {
    personality: 'brave and loyal',
    setting: 'fantasy',
  });
  console.log('Generated prompt:');
  console.log(prompt.messages[0].content.text);
  console.log('');

  // Disconnect
  await client.disconnect();
  console.log('Disconnected from MCP server');
}

// Run example
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
