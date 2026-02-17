/**
 * API Key Authentication
 */

export class ApiKeyAuth {
  private validApiKeys: Set<string> = new Set();

  constructor(apiKeys?: string[]) {
    if (apiKeys) {
      apiKeys.forEach(key => this.validApiKeys.add(key));
    } else {
      // Default API key for testing
      this.validApiKeys.add('test-api-key-123');
    }
  }

  /**
   * Validate an API key
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    return this.validApiKeys.has(apiKey);
  }

  /**
   * Add a new API key
   */
  addApiKey(apiKey: string): void {
    this.validApiKeys.add(apiKey);
  }

  /**
   * Remove an API key
   */
  removeApiKey(apiKey: string): void {
    this.validApiKeys.delete(apiKey);
  }
}
