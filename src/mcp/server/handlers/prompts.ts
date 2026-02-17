/**
 * Prompt Handlers for MCP Server
 */

import {MCPPrompt, MCPMessage} from '../../types/protocol';

export class PromptHandlers {
  /**
   * List all available prompts
   */
  async listPrompts(): Promise<{prompts: MCPPrompt[]}> {
    return {
      prompts: [
        {
          name: 'create_character',
          description: 'Create a character avatar with personality',
          arguments: [
            {
              name: 'personality',
              description: 'Character personality traits',
              required: true,
            },
            {
              name: 'setting',
              description: 'Story setting (sci-fi, fantasy, modern)',
              required: false,
            },
          ],
        },
        {
          name: 'professional_headshot',
          description: 'Create a professional headshot avatar',
          arguments: [
            {
              name: 'profession',
              description: "Person's profession",
              required: true,
            },
            {
              name: 'style',
              description: 'Formal or casual',
              required: false,
            },
          ],
        },
        {
          name: 'game_character',
          description: 'Create a video game character',
          arguments: [
            {
              name: 'role',
              description: 'Character role (hero, villain, NPC)',
              required: true,
            },
            {
              name: 'genre',
              description: 'Game genre',
              required: true,
            },
          ],
        },
      ],
    };
  }

  /**
   * Get a specific prompt
   */
  async getPrompt(
    name: string,
    args: Record<string, string>
  ): Promise<{messages: MCPMessage[]}> {
    switch (name) {
      case 'create_character':
        return this.getCreateCharacterPrompt(args);

      case 'professional_headshot':
        return this.getProfessionalHeadshotPrompt(args);

      case 'game_character':
        return this.getGameCharacterPrompt(args);

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  }

  private getCreateCharacterPrompt(
    args: Record<string, string>
  ): {messages: MCPMessage[]} {
    const setting = args.setting || 'modern';
    const personality = args.personality;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a ${setting} character avatar with the following personality: ${personality}. 

Include details about:
- Physical appearance that matches the personality
- Clothing style appropriate for ${setting} setting
- Distinctive features that make them memorable
- Color palette that reflects their traits`,
          },
        },
      ],
    };
  }

  private getProfessionalHeadshotPrompt(
    args: Record<string, string>
  ): {messages: MCPMessage[]} {
    const profession = args.profession;
    const style = args.style || 'formal';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a ${style} professional headshot avatar for a ${profession}.

Requirements:
- Professional appearance appropriate for ${profession}
- ${style === 'formal' ? 'Business attire (suit, professional dress)' : 'Business casual attire'}
- Neutral, confident expression
- Clean, simple background
- Photorealistic style`,
          },
        },
      ],
    };
  }

  private getGameCharacterPrompt(
    args: Record<string, string>
  ): {messages: MCPMessage[]} {
    const role = args.role;
    const genre = args.genre;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a ${genre} video game character for a ${role} role.

Design specifications:
- Character archetype: ${role}
- Genre: ${genre}
- Visual style matching ${genre} aesthetics
- Distinctive silhouette for gameplay recognition
- Appropriate armor/clothing for ${role} role
- Color scheme that supports character role
- Iconic features or accessories`,
          },
        },
      ],
    };
  }
}
