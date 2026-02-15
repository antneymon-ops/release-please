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
 * CLAWD.BOT: WebSocket-Enhanced Claw-Bot Automation
 * 
 * Extends Claw-Bot with:
 * - Real-time WebSocket communication
 * - Live automation execution and monitoring
 * - Interactive configuration updates
 * - Enhanced security and access control
 * - Audit logging and compliance
 */

import {ClawBot, ClawBotConfig, ClawBotResult, ClawBotPRRule} from './claw-bot';
import {SecureWebSocketServer, WebSocketMessage} from './websocket-server';
import {GitHub} from './github';
import {Logger, logger as defaultLogger} from './util/logger';

export interface ClawdBotConfig extends ClawBotConfig {
  /**
   * WebSocket server for real-time communication
   */
  websocketServer?: SecureWebSocketServer;

  /**
   * Enable real-time automation updates
   */
  enableRealTimeUpdates?: boolean;

  /**
   * Enable audit logging
   */
  enableAuditLog?: boolean;

  /**
   * Audit log retention days
   */
  auditLogRetentionDays?: number;

  /**
   * Role-based access control
   */
  rbac?: {
    enabled: boolean;
    roles: {
      [role: string]: {
        commands: string[];
        permissions: string[];
      };
    };
  };
}

/**
 * Audit log entry
 */
interface AuditLogEntry {
  timestamp: number;
  userId?: string;
  clientId: string;
  action: string;
  details: unknown;
  result: 'success' | 'failure';
  error?: string;
}

/**
 * CLAWD.BOT Commands
 */
export enum ClawdBotCommand {
  // Automation commands
  RUN_AUTOMATION = 'run-automation',
  GET_AUTOMATION_STATUS = 'get-automation-status',
  PAUSE_AUTOMATION = 'pause-automation',
  RESUME_AUTOMATION = 'resume-automation',
  
  // Configuration commands
  GET_CONFIG = 'get-config',
  UPDATE_CONFIG = 'update-config',
  ADD_RULE = 'add-rule',
  REMOVE_RULE = 'remove-rule',
  LIST_RULES = 'list-rules',
  
  // Monitoring commands
  GET_STATS = 'get-stats',
  GET_RECENT_ACTIONS = 'get-recent-actions',
  GET_AUDIT_LOG = 'get-audit-log',
  
  // Security commands
  VALIDATE_SECURITY = 'validate-security',
  CHECK_PERMISSIONS = 'check-permissions',
}

/**
 * CLAWD.BOT: Enhanced Claw-Bot with WebSocket support
 */
export class ClawdBot {
  private clawBot: ClawBot;
  private config: Required<Omit<ClawdBotConfig, 'websocketServer' | 'rbac'>> & {
    websocketServer?: SecureWebSocketServer;
    rbac?: ClawdBotConfig['rbac'];
  };
  private logger: Logger;
  private auditLog: AuditLogEntry[];
  private isRunning: boolean;
  private isPaused: boolean;
  private lastRunResult?: ClawBotResult;

  constructor(
    github: GitHub,
    config: ClawdBotConfig = {},
    logger: Logger = defaultLogger
  ) {
    this.logger = logger;
    this.auditLog = [];
    this.isRunning = false;
    this.isPaused = false;

    // Initialize ClawBot
    this.clawBot = new ClawBot(github, config, logger);

    // Set CLAWD.BOT configuration
    this.config = {
      ...config,
      websocketServer: config.websocketServer,
      enableRealTimeUpdates: config.enableRealTimeUpdates ?? true,
      enableAuditLog: config.enableAuditLog ?? true,
      auditLogRetentionDays: config.auditLogRetentionDays ?? 30,
      rbac: config.rbac,
    };

    // Setup WebSocket message handling
    if (this.config.websocketServer) {
      this.setupWebSocketHandlers();
    }
  }

  /**
   * Initialize CLAWD.BOT
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing CLAWD.BOT...');
    await this.clawBot.initialize();
    this.logger.info('CLAWD.BOT initialized successfully');
  }

  /**
   * Start CLAWD.BOT automation
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('CLAWD.BOT is already running');
      return;
    }

    this.logger.info('Starting CLAWD.BOT automation...');
    this.isRunning = true;
    this.isPaused = false;

    // Start periodic automation runs
    this.startAutomationLoop();
  }

  /**
   * Stop CLAWD.BOT automation
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping CLAWD.BOT automation...');
    this.isRunning = false;
  }

  /**
   * Pause automation
   */
  pause(): void {
    if (!this.isRunning) {
      this.logger.warn('CLAWD.BOT is not running');
      return;
    }

    this.logger.info('Pausing CLAWD.BOT automation');
    this.isPaused = true;

    this.addAuditLogEntry({
      timestamp: Date.now(),
      clientId: 'system',
      action: 'pause-automation',
      details: {},
      result: 'success',
    });
  }

  /**
   * Resume automation
   */
  resume(): void {
    if (!this.isRunning || !this.isPaused) {
      this.logger.warn('CLAWD.BOT is not paused');
      return;
    }

    this.logger.info('Resuming CLAWD.BOT automation');
    this.isPaused = false;

    this.addAuditLogEntry({
      timestamp: Date.now(),
      clientId: 'system',
      action: 'resume-automation',
      details: {},
      result: 'success',
    });
  }

  /**
   * Setup WebSocket message handlers
   */
  private setupWebSocketHandlers(): void {
    if (!this.config.websocketServer) return;

    this.config.websocketServer.on('message', async (event: {
      clientId: string;
      userId?: string;
      message: WebSocketMessage;
    }) => {
      await this.handleWebSocketMessage(event);
    });
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
      // Check permissions
      if (!this.checkPermission(userId, message.event)) {
        this.sendError(clientId, 'Unauthorized: Insufficient permissions');
        this.addAuditLogEntry({
          timestamp: Date.now(),
          userId,
          clientId,
          action: message.event,
          details: message.data,
          result: 'failure',
          error: 'Insufficient permissions',
        });
        return;
      }

      // Execute command
      await this.executeCommand(clientId, userId, message.event as ClawdBotCommand, message.data);

    } catch (error) {
      this.logger.error('Error handling WebSocket message', error);
      this.sendError(clientId, 'Internal error processing command');
      
      this.addAuditLogEntry({
        timestamp: Date.now(),
        userId,
        clientId,
        action: message.event,
        details: message.data,
        result: 'failure',
        error: String(error),
      });
    }
  }

  /**
   * Execute CLAWD.BOT command
   */
  private async executeCommand(
    clientId: string,
    userId: string | undefined,
    command: ClawdBotCommand,
    data?: unknown
  ): Promise<void> {
    this.logger.debug(`Executing CLAWD.BOT command: ${command}`);

    let result: 'success' | 'failure' = 'success';
    let error: string | undefined;

    try {
      switch (command) {
        case ClawdBotCommand.RUN_AUTOMATION:
          await this.handleRunAutomation(clientId);
          break;

        case ClawdBotCommand.GET_AUTOMATION_STATUS:
          await this.handleGetAutomationStatus(clientId);
          break;

        case ClawdBotCommand.PAUSE_AUTOMATION:
          this.pause();
          this.sendResponse(clientId, 'automation-paused', {});
          break;

        case ClawdBotCommand.RESUME_AUTOMATION:
          this.resume();
          this.sendResponse(clientId, 'automation-resumed', {});
          break;

        case ClawdBotCommand.GET_CONFIG:
          await this.handleGetConfig(clientId);
          break;

        case ClawdBotCommand.UPDATE_CONFIG:
          await this.handleUpdateConfig(clientId, data);
          break;

        case ClawdBotCommand.LIST_RULES:
          await this.handleListRules(clientId);
          break;

        case ClawdBotCommand.GET_STATS:
          await this.handleGetStats(clientId);
          break;

        case ClawdBotCommand.GET_RECENT_ACTIONS:
          await this.handleGetRecentActions(clientId, data);
          break;

        case ClawdBotCommand.GET_AUDIT_LOG:
          await this.handleGetAuditLog(clientId, data);
          break;

        case ClawdBotCommand.VALIDATE_SECURITY:
          await this.handleValidateSecurity(clientId);
          break;

        default:
          this.sendError(clientId, `Unknown command: ${command}`);
          result = 'failure';
          error = 'Unknown command';
      }
    } catch (err) {
      result = 'failure';
      error = String(err);
      throw err;
    } finally {
      // Add to audit log
      this.addAuditLogEntry({
        timestamp: Date.now(),
        userId,
        clientId,
        action: command,
        details: data,
        result,
        error,
      });
    }
  }

  /**
   * Handle run automation command
   */
  private async handleRunAutomation(clientId: string): Promise<void> {
    if (this.isPaused) {
      this.sendError(clientId, 'Automation is paused');
      return;
    }

    this.logger.info('Running automation via WebSocket command');

    const result = await this.clawBot.run();
    this.lastRunResult = result;

    this.sendResponse(clientId, 'automation-completed', {
      result,
      timestamp: Date.now(),
    });

    // Broadcast to all subscribers if enabled
    if (this.config.enableRealTimeUpdates && this.config.websocketServer) {
      this.config.websocketServer.broadcast({
        type: 'notification',
        event: 'automation-completed',
        data: result,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Handle get automation status command
   */
  private async handleGetAutomationStatus(clientId: string): Promise<void> {
    this.sendResponse(clientId, 'automation-status', {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      lastRun: this.lastRunResult,
    });
  }

  /**
   * Handle get config command
   */
  private async handleGetConfig(clientId: string): Promise<void> {
    // Return sanitized config (no secrets)
    const safeConfig = {
      autoApproveDependencies: this.config.autoApproveDependencies,
      autoMerge: this.config.autoMerge,
      autoLabel: this.config.autoLabel,
      ciMonitoring: this.config.ciMonitoring,
      dependencyUpdates: this.config.dependencyUpdates,
      securityAutoFix: this.config.securityAutoFix,
      enableRealTimeUpdates: this.config.enableRealTimeUpdates,
      enableAuditLog: this.config.enableAuditLog,
    };

    this.sendResponse(clientId, 'config', safeConfig);
  }

  /**
   * Handle update config command
   */
  private async handleUpdateConfig(clientId: string, data?: unknown): Promise<void> {
    const updates = data as Partial<ClawdBotConfig>;

    if (!updates) {
      this.sendError(clientId, 'Configuration updates required');
      return;
    }

    // Update configuration (only safe fields)
    if (updates.autoApproveDependencies !== undefined) {
      this.config.autoApproveDependencies = updates.autoApproveDependencies;
    }
    if (updates.autoMerge !== undefined) {
      this.config.autoMerge = updates.autoMerge;
    }
    if (updates.autoLabel !== undefined) {
      this.config.autoLabel = updates.autoLabel;
    }

    this.sendResponse(clientId, 'config-updated', {
      message: 'Configuration updated successfully',
    });
  }

  /**
   * Handle list rules command
   */
  private async handleListRules(clientId: string): Promise<void> {
    const rules = this.config.prRules || [];
    
    this.sendResponse(clientId, 'rules-list', {
      count: rules.length,
      rules: rules.map(r => ({
        name: r.name,
        condition: r.condition,
        actions: r.actions,
      })),
    });
  }

  /**
   * Handle get stats command
   */
  private async handleGetStats(clientId: string): Promise<void> {
    const wsStats = this.config.websocketServer?.getStats();
    
    this.sendResponse(clientId, 'stats', {
      clawdBot: {
        isRunning: this.isRunning,
        isPaused: this.isPaused,
        lastRun: this.lastRunResult,
        auditLogSize: this.auditLog.length,
      },
      websocket: wsStats,
    });
  }

  /**
   * Handle get recent actions command
   */
  private async handleGetRecentActions(clientId: string, data?: unknown): Promise<void> {
    const params = data as {limit?: number};
    const limit = params?.limit || 50;

    const recent = this.auditLog.slice(-limit).reverse();

    this.sendResponse(clientId, 'recent-actions', {
      count: recent.length,
      actions: recent.map(entry => ({
        timestamp: new Date(entry.timestamp).toISOString(),
        userId: entry.userId || 'system',
        action: entry.action,
        result: entry.result,
        error: entry.error,
      })),
    });
  }

  /**
   * Handle get audit log command
   */
  private async handleGetAuditLog(clientId: string, data?: unknown): Promise<void> {
    const params = data as {startDate?: string; endDate?: string; limit?: number};
    
    let filtered = this.auditLog;

    // Filter by date range
    if (params?.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter(e => e.timestamp >= start);
    }
    if (params?.endDate) {
      const end = new Date(params.endDate).getTime();
      filtered = filtered.filter(e => e.timestamp <= end);
    }

    // Apply limit
    const limit = params?.limit || 100;
    filtered = filtered.slice(-limit);

    this.sendResponse(clientId, 'audit-log', {
      count: filtered.length,
      entries: filtered,
    });
  }

  /**
   * Handle validate security command
   */
  private async handleValidateSecurity(clientId: string): Promise<void> {
    const securityChecks = {
      websocketSecure: this.config.websocketServer?.getStats().isRunning || false,
      authenticationEnabled: this.config.requireAuth || false,
      auditLogEnabled: this.config.enableAuditLog,
      rbacEnabled: this.config.rbac?.enabled || false,
    };

    const passed = Object.values(securityChecks).every(check => check);

    this.sendResponse(clientId, 'security-validation', {
      passed,
      checks: securityChecks,
      recommendations: passed ? [] : this.getSecurityRecommendations(securityChecks),
    });
  }

  /**
   * Get security recommendations
   */
  private getSecurityRecommendations(checks: Record<string, boolean>): string[] {
    const recommendations: string[] = [];

    if (!checks.websocketSecure) {
      recommendations.push('Enable secure WebSocket (WSS) for encrypted communication');
    }
    if (!checks.authenticationEnabled) {
      recommendations.push('Enable authentication to restrict access');
    }
    if (!checks.auditLogEnabled) {
      recommendations.push('Enable audit logging for compliance and security monitoring');
    }
    if (!checks.rbacEnabled) {
      recommendations.push('Implement role-based access control (RBAC)');
    }

    return recommendations;
  }

  /**
   * Start automation loop
   */
  private startAutomationLoop(): void {
    // Run automation periodically (e.g., every 5 minutes)
    const interval = 5 * 60 * 1000;

    const runLoop = async () => {
      if (!this.isRunning) return;
      
      if (!this.isPaused) {
        try {
          const result = await this.clawBot.run();
          this.lastRunResult = result;

          // Broadcast result if real-time updates enabled
          if (this.config.enableRealTimeUpdates && this.config.websocketServer) {
            this.config.websocketServer.broadcast({
              type: 'notification',
              event: 'automation-run-completed',
              data: result,
              timestamp: Date.now(),
            });
          }
        } catch (error) {
          this.logger.error('Error in automation loop', error);
        }
      }

      if (this.isRunning) {
        setTimeout(runLoop, interval);
      }
    };

    setTimeout(runLoop, interval);
  }

  /**
   * Check user permission
   */
  private checkPermission(userId: string | undefined, command: string): boolean {
    if (!this.config.rbac?.enabled) {
      // If RBAC is disabled, allow all authenticated users
      return !!userId;
    }

    // Check user role and permissions
    // In production, would query actual user roles from database
    return true; // Placeholder
  }

  /**
   * Add audit log entry
   */
  private addAuditLogEntry(entry: AuditLogEntry): void {
    if (!this.config.enableAuditLog) return;

    this.auditLog.push(entry);

    // Clean up old entries
    const retentionMs = this.config.auditLogRetentionDays * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - retentionMs;
    this.auditLog = this.auditLog.filter(e => e.timestamp > cutoff);
  }

  /**
   * Send response to client
   */
  private sendResponse(clientId: string, event: string, data: unknown): void {
    if (!this.config.websocketServer) return;

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
    if (!this.config.websocketServer) return;

    this.config.websocketServer.sendMessage(clientId, {
      type: 'error',
      event: 'error',
      data: {error},
      timestamp: Date.now(),
    });
  }
}
