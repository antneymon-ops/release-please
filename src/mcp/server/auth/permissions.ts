/**
 * Permission Management
 */

export interface User {
  id: string;
  tier: 'free' | 'premium' | 'pro';
}

export class Permissions {
  private toolPermissions: Record<string, string[]> = {
    create_avatar: ['free', 'premium', 'pro'],
    edit_avatar: ['free', 'premium', 'pro'],
    search_avatars: ['free', 'premium', 'pro'],
    export_avatar: ['premium', 'pro'],
    apply_template: ['free', 'premium', 'pro'],
    batch_export: ['pro'],
  };

  /**
   * Check if user has permission to use a tool
   */
  hasPermission(tool: string, user: User): boolean {
    const requiredTiers = this.toolPermissions[tool];

    if (!requiredTiers) {
      // Tool not found, allow by default (or could throw error)
      return true;
    }

    return requiredTiers.includes(user.tier);
  }

  /**
   * Get required tier for a tool
   */
  getRequiredTier(tool: string): string | null {
    const tiers = this.toolPermissions[tool];
    return tiers ? tiers[0] : null;
  }

  /**
   * Throw error if user lacks permission
   */
  requirePermission(tool: string, user: User): void {
    if (!this.hasPermission(tool, user)) {
      const requiredTier = this.getRequiredTier(tool);
      throw new Error(
        `${tool} requires ${requiredTier} tier or higher. Current tier: ${user.tier}`
      );
    }
  }
}
