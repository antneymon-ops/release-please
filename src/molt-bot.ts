// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * MoltBot: Real-time PR Monitoring and Management Bot
 * 
 * Provides WebSocket-based real-time monitoring of:
 * - Pull request events
 * - CI/CD status updates
 * - Review comments and approvals
 * - Merge status and conflicts
 * - Release automation status
 */

import {SecureWebSocketServer, WebSocketMessage} from './websocket-server';
import {GitHub} from './github';
import {Manifest} from './manifest';
import {Logger, logger as defaultLogger} from './util/logger';

export interface MoltBotConfig {
  /**
   * GitHub instance for API calls
   */
  github: GitHub;

  /**
   * Optional manifest for release management
   */
  manifest?: Manifest;

  /**
   * WebSocket server instance
   */
  websocketServer: SecureWebSocketServer;

  /**
   * Polling interval for GitHub events (milliseconds)
   */
  pollingInterval?: number;

  /**
   * Enable real-time notifications
   */
  enableNotifications?: boolean;

  /**
   * Commands that require admin role
   */
  adminCommands?: string[];
}

/**
 * MoltBot event types
 */
export enum MoltBotEventType {
  PR_OPENED = 'pr.opened',
  PR_UPDATED = 'pr.updated',
  PR_CLOSED = 'pr.closed',
  PR_MERGED = 'pr.merged',
  PR_REVIEW_REQUESTED = 'pr.review_requested',
  PR_REVIEW_SUBMITTED = 'pr.review_submitted',
  PR_APPROVED = 'pr.approved',
  PR_CHANGES_REQUESTED = 'pr.changes_requested',
  CI_STARTED = 'ci.started',
  CI_COMPLETED = 'ci.completed',
  CI_FAILED = 'ci.failed',
  RELEASE_CREATED = 'release.created',
  RELEASE_PUBLISHED = 'release.published',
  STATUS_QUERY = 'status.query',
  COMMAND_EXECUTED = 'command.executed',
}

/**
 * MoltBot commands
 */
export enum MoltBotCommand {
  // Query commands
  LIST_PRS = 'list-prs',
  GET_PR = 'get-pr',
  GET_STATUS = 'get-status',
  GET_RELEASES = 'get-releases',
  
  // Action commands (admin only)
  APPROVE_PR = 'approve-pr',
  MERGE_PR = 'merge-pr',
  CLOSE_PR = 'close-pr',
  LABEL_PR = 'label-pr',
  ASSIGN_REVIEWER = 'assign-reviewer',
  
  // Automation commands
  TRIGGER_RELEASE = 'trigger-release',
  RUN_AUTOMATION = 'run-automation',
  
  // System commands
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  PING = 'ping',
}

/**
 * Subscription types
 */
interface Subscription {
  clientId: string;
  events: Set<MoltBotEventType>;
  filters?: {
    prNumbers?: number[];
    labels?: string[];
    authors?: string[];
  };
}

/**
 * MoltBot: Real-time GitHub automation bot
 */
export class MoltBot {
  private config: Required<Omit<MoltBotConfig, 'manifest'>> & {manifest?: Manifest};
  private logger: Logger;
  private subscriptions: Map<string, Subscription>;
  private pollingTimer?: NodeJS.Timeout;
  private lastPollTimestamp: number;
  private isRunning: boolean;

  constructor(config: MoltBotConfig, logger: Logger = defaultLogger) {
    this.logger = logger;
    this.subscriptions = new Map();
    this.lastPollTimestamp = Date.now();
    this.isRunning = false;

    this.config = {
      github: config.github,
      manifest: config.manifest,
      websocketServer: config.websocketServer,
      pollingInterval: config.pollingInterval ?? 30000, // 30 seconds
      enableNotifications: config.enableNotifications ?? true,
      adminCommands: config.adminCommands ?? [
        MoltBotCommand.APPROVE_PR,
        MoltBotCommand.MERGE_PR,
        MoltBotCommand.CLOSE_PR,
        MoltBotCommand.TRIGGER_RELEASE,
      ],
    };
  }

  /**
   * Start MoltBot
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('MoltBot is already running');
      return;
    }

    this.logger.info('Starting MoltBot...');

    // Listen to WebSocket messages
    this.config.websocketServer.on('message', this.handleWebSocketMessage.bind(this));

    // Start polling for GitHub events
    if (this.config.enableNotifications) {
      this.startPolling();
    }

    this.isRunning = true;
    this.logger.info('MoltBot started successfully');
  }

  /**
   * Stop MoltBot
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping MoltBot...');

    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = undefined;
    }

    this.subscriptions.clear();
    this.isRunning = false;
  }

  /**
   * Handle WebSocket message
   */
  private async handleWebSocketMessage(event: {
    clientId: string;
    userId?: string;
    message: WebSocketMessage;
  }): Promise<void> {
    const {clientId, userId, message} = event;

    try {
      // Parse command
      const command = message.event as MoltBotCommand;

      // Check if command requires admin privileges
      if (this.config.adminCommands.includes(command)) {
        if (!userId || !this.isAdmin(userId)) {
          this.sendError(clientId, 'Unauthorized: Admin privileges required');
          return;
        }
      }

      // Execute command
      await this.executeCommand(clientId, command, message.data);

    } catch (error) {
      this.logger.error('Error handling WebSocket message', error);
      this.sendError(clientId, 'Internal error processing command');
    }
  }

  /**
   * Execute a MoltBot command
   */
  private async executeCommand(
    clientId: string,
    command: MoltBotCommand,
    data?: unknown
  ): Promise<void> {
    this.logger.debug(`Executing command: ${command}`, data);

    switch (command) {
      case MoltBotCommand.PING:
        this.sendResponse(clientId, 'pong', {timestamp: Date.now()});
        break;

      case MoltBotCommand.LIST_PRS:
        await this.handleListPRs(clientId, data);
        break;

      case MoltBotCommand.GET_PR:
        await this.handleGetPR(clientId, data);
        break;

      case MoltBotCommand.GET_STATUS:
        await this.handleGetStatus(clientId);
        break;

      case MoltBotCommand.APPROVE_PR:
        await this.handleApprovePR(clientId, data);
        break;

      case MoltBotCommand.MERGE_PR:
        await this.handleMergePR(clientId, data);
        break;

      case MoltBotCommand.LABEL_PR:
        await this.handleLabelPR(clientId, data);
        break;

      case MoltBotCommand.SUBSCRIBE:
        await this.handleSubscribe(clientId, data);
        break;

      case MoltBotCommand.UNSUBSCRIBE:
        await this.handleUnsubscribe(clientId, data);
        break;

      default:
        this.sendError(clientId, `Unknown command: ${command}`);
    }
  }

  /**
   * Handle list PRs command
   */
  private async handleListPRs(clientId: string, data?: unknown): Promise<void> {
    try {
      const params = data as {state?: 'open' | 'closed' | 'all'; limit?: number};
      const state = params?.state || 'open';
      const limit = params?.limit || 20;

      this.logger.info(`Fetching ${state} PRs (limit: ${limit})`);

      const prs: any[] = [];
      let count = 0;

      for await (const pr of this.config.github.pullRequestIterator(
        this.config.github.repository.defaultBranch,
        state.toUpperCase() as 'OPEN' | 'CLOSED' | 'MERGED',
        limit
      )) {
        prs.push({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          author: pr.author?.login,
          createdAt: pr.createdAt,
          updatedAt: pr.updatedAt,
          labels: pr.labels?.nodes?.map((l: any) => l.name) || [],
        });
        count++;
        if (count >= limit) break;
      }

      this.sendResponse(clientId, 'prs-list', {
        state,
        count: prs.length,
        prs,
      });
    } catch (error) {
      this.logger.error('Error fetching PRs', error);
      this.sendError(clientId, 'Failed to fetch pull requests');
    }
  }

  /**
   * Handle get PR command
   */
  private async handleGetPR(clientId: string, data?: unknown): Promise<void> {
    try {
      const params = data as {prNumber: number};
      if (!params?.prNumber) {
        this.sendError(clientId, 'PR number required');
        return;
      }

      // In a full implementation, would fetch PR details from GitHub
      this.sendResponse(clientId, 'pr-details', {
        prNumber: params.prNumber,
        message: 'PR details would be fetched from GitHub API',
      });
    } catch (error) {
      this.logger.error('Error fetching PR', error);
      this.sendError(clientId, 'Failed to fetch PR details');
    }
  }

  /**
   * Handle get status command
   */
  private async handleGetStatus(clientId: string): Promise<void> {
    const wsStats = this.config.websocketServer.getStats();
    
    this.sendResponse(clientId, 'status', {
      moltBot: {
        running: this.isRunning,
        subscriptions: this.subscriptions.size,
        lastPoll: new Date(this.lastPollTimestamp).toISOString(),
      },
      websocket: wsStats,
      github: {
        repository: `${this.config.github.repository.owner}/${this.config.github.repository.repo}`,
        defaultBranch: this.config.github.repository.defaultBranch,
      },
    });
  }

  /**
   * Handle approve PR command (admin only)
   */
  private async handleApprovePR(clientId: string, data?: unknown): Promise<void> {
    try {
      const params = data as {prNumber: number; comment?: string};
      if (!params?.prNumber) {
        this.sendError(clientId, 'PR number required');
        return;
      }

      this.logger.info(`Approving PR #${params.prNumber}`);

      // In full implementation, would call GitHub API to approve PR
      this.sendResponse(clientId, 'pr-approved', {
        prNumber: params.prNumber,
        message: 'PR approval would be submitted via GitHub API',
      });

      // Broadcast notification
      this.broadcastEvent(MoltBotEventType.PR_APPROVED, {
        prNumber: params.prNumber,
      });
    } catch (error) {
      this.logger.error('Error approving PR', error);
      this.sendError(clientId, 'Failed to approve PR');
    }
  }

  /**
   * Handle merge PR command (admin only)
   */
  private async handleMergePR(clientId: string, data?: unknown): Promise<void> {
    try {
      const params = data as {prNumber: number; method?: 'merge' | 'squash' | 'rebase'};
      if (!params?.prNumber) {
        this.sendError(clientId, 'PR number required');
        return;
      }

      this.logger.info(`Merging PR #${params.prNumber}`);

      // In full implementation, would call GitHub API to merge PR
      this.sendResponse(clientId, 'pr-merged', {
        prNumber: params.prNumber,
        method: params.method || 'squash',
        message: 'PR merge would be executed via GitHub API',
      });

      // Broadcast notification
      this.broadcastEvent(MoltBotEventType.PR_MERGED, {
        prNumber: params.prNumber,
      });
    } catch (error) {
      this.logger.error('Error merging PR', error);
      this.sendError(clientId, 'Failed to merge PR');
    }
  }

  /**
   * Handle label PR command
   */
  private async handleLabelPR(clientId: string, data?: unknown): Promise<void> {
    try {
      const params = data as {prNumber: number; labels: string[]};
      if (!params?.prNumber || !params?.labels) {
        this.sendError(clientId, 'PR number and labels required');
        return;
      }

      this.logger.info(`Adding labels to PR #${params.prNumber}:`, params.labels);

      await this.config.github.addIssueLabels(params.labels, params.prNumber);

      this.sendResponse(clientId, 'pr-labeled', {
        prNumber: params.prNumber,
        labels: params.labels,
      });
    } catch (error) {
      this.logger.error('Error labeling PR', error);
      this.sendError(clientId, 'Failed to add labels');
    }
  }

  /**
   * Handle subscribe command
   */
  private async handleSubscribe(clientId: string, data?: unknown): Promise<void> {
    const params = data as {events: string[]; filters?: any};
    
    if (!params?.events || params.events.length === 0) {
      this.sendError(clientId, 'Event types required for subscription');
      return;
    }

    const subscription: Subscription = {
      clientId,
      events: new Set(params.events as MoltBotEventType[]),
      filters: params.filters,
    };

    this.subscriptions.set(clientId, subscription);

    this.sendResponse(clientId, 'subscribed', {
      events: Array.from(subscription.events),
      filters: subscription.filters,
    });

    this.logger.info(`Client ${clientId} subscribed to ${subscription.events.size} events`);
  }

  /**
   * Handle unsubscribe command
   */
  private async handleUnsubscribe(clientId: string, data?: unknown): Promise<void> {
    const params = data as {events?: string[]};

    if (!params?.events) {
      // Unsubscribe from all
      this.subscriptions.delete(clientId);
      this.sendResponse(clientId, 'unsubscribed', {message: 'Unsubscribed from all events'});
    } else {
      // Unsubscribe from specific events
      const subscription = this.subscriptions.get(clientId);
      if (subscription) {
        for (const event of params.events) {
          subscription.events.delete(event as MoltBotEventType);
        }
      }
      this.sendResponse(clientId, 'unsubscribed', {events: params.events});
    }
  }

  /**
   * Start polling for GitHub events
   */
  private startPolling(): void {
    this.pollingTimer = setInterval(async () => {
      await this.pollGitHubEvents();
    }, this.config.pollingInterval);
  }

  /**
   * Poll GitHub for new events
   */
  private async pollGitHubEvents(): Promise<void> {
    try {
      // In a full implementation, would:
      // 1. Fetch recent events from GitHub API
      // 2. Compare with last poll timestamp
      // 3. Broadcast new events to subscribed clients

      this.lastPollTimestamp = Date.now();
    } catch (error) {
      this.logger.error('Error polling GitHub events', error);
    }
  }

  /**
   * Broadcast event to subscribed clients
   */
  private broadcastEvent(eventType: MoltBotEventType, data: unknown): void {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.events.has(eventType)) {
        this.config.websocketServer.sendMessage(subscription.clientId, {
          type: 'notification',
          event: eventType,
          data,
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   * Send response to client
   */
  private sendResponse(clientId: string, event: string, data: unknown): void {
    this.config.websocketServer.sendMessage(clientId, {
      type: 'response',
      event,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Send error to client
   */
  private sendError(clientId: string, error: string): void {
    this.config.websocketServer.sendMessage(clientId, {
      type: 'error',
      event: 'error',
      data: {error},
      timestamp: Date.now(),
    });
  }

  /**
   * Check if user has admin privileges
   */
  private isAdmin(userId: string): boolean {
    // In production, would check against actual user roles/permissions
    // For now, placeholder implementation
    return userId.includes('admin') || userId.includes('owner');
  }

  /**
   * Get MoltBot statistics
   */
  getStats(): {
    isRunning: boolean;
    subscriptions: number;
    lastPoll: string;
  } {
    return {
      isRunning: this.isRunning,
      subscriptions: this.subscriptions.size,
      lastPoll: new Date(this.lastPollTimestamp).toISOString(),
    };
  }
}
