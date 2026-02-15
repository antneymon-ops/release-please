# WebSocket Server & Bot Systems

## Overview

This document describes the WebSocket-based real-time automation infrastructure including:

1. **Secure WebSocket Server** - Enterprise-grade WebSocket communication
2. **MoltBot** - Real-time PR monitoring and management
3. **CLAWD.BOT** - Enhanced Claw-Bot with WebSocket support

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│         (Dashboard, CLI, Mobile Apps, Webhooks)             │
└──────────────────┬──────────────────────────────────────────┘
                   │ WSS (Secure WebSocket)
                   │ Authentication + Encryption
┌──────────────────▼──────────────────────────────────────────┐
│          Secure WebSocket Server                             │
│  • JWT Authentication  • Rate Limiting                       │
│  • Input Validation    • Connection Management              │
│  • DDoS Protection    • Audit Logging                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼────────┐
│    MoltBot     │   │   CLAWD.BOT     │
│                │   │                 │
│ • PR Monitor   │   │ • Automation    │
│ • Commands     │   │ • Config Mgmt   │
│ • Events       │   │ • RBAC          │
│ • Status       │   │ • Audit Log     │
└────────┬───────┘   └────────┬────────┘
         │                    │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   GitHub API       │
         │  • Pull Requests   │
         │  • Issues          │
         │  • Workflows       │
         └────────────────────┘
```

## Security Features

### 🔐 Authentication

- **JWT Token-based Authentication**
  - Token validation on connection
  - Automatic session expiration
  - Refresh token support

```typescript
// Connect with authentication
const ws = new WebSocket('wss://example.com/ws');
ws.send(JSON.stringify({
  type: 'command',
  event: 'authenticate',
  token: 'your-jwt-token'
}));
```

### 🛡️ Protection Mechanisms

1. **Rate Limiting**
   - Per-connection message limits (default: 60/minute)
   - Automatic throttling
   - Temporary suspension for violations

2. **Input Validation**
   - JSON schema validation
   - XSS prevention
   - SQL injection protection
   - Command injection blocking

3. **Connection Management**
   - Max connections per IP (default: 5)
   - Session timeout (default: 60 minutes)
   - Automatic cleanup of stale connections

4. **Encryption**
   - WSS (WebSocket Secure) support
   - TLS 1.3 recommended
   - Certificate-based authentication

### 🔍 Audit Logging

All actions are logged with:
- Timestamp
- User ID
- Client ID
- Action type
- Result (success/failure)
- Error details (if applicable)

## WebSocket Message Protocol

### Message Structure

```typescript
interface WebSocketMessage {
  type: 'command' | 'status' | 'notification' | 'response' | 'error';
  event: string;
  data?: unknown;
  id?: string;
  timestamp?: number;
  token?: string;
}
```

### Message Types

1. **command** - Client request for action
2. **status** - Status query or update
3. **notification** - Server-initiated event
4. **response** - Response to command
5. **error** - Error message

## MoltBot

Real-time PR monitoring and management bot.

### Features

- 📊 **Real-time PR Monitoring**
- 🔔 **Event Notifications**
- ⚡ **Interactive Commands**
- 📈 **Status Queries**
- 🎯 **Event Subscriptions**

### Commands

#### Query Commands

```javascript
// List open PRs
ws.send(JSON.stringify({
  type: 'command',
  event: 'list-prs',
  data: {
    state: 'open',
    limit: 20
  }
}));

// Get PR details
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-pr',
  data: {
    prNumber: 123
  }
}));

// Get status
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-status'
}));
```

#### Action Commands (Admin Only)

```javascript
// Approve PR
ws.send(JSON.stringify({
  type: 'command',
  event: 'approve-pr',
  data: {
    prNumber: 123,
    comment: 'LGTM!'
  }
}));

// Merge PR
ws.send(JSON.stringify({
  type: 'command',
  event: 'merge-pr',
  data: {
    prNumber: 123,
    method: 'squash'
  }
}));

// Add labels
ws.send(JSON.stringify({
  type: 'command',
  event: 'label-pr',
  data: {
    prNumber: 123,
    labels: ['approved', 'ready-to-merge']
  }
}));
```

#### Subscription Commands

```javascript
// Subscribe to events
ws.send(JSON.stringify({
  type: 'command',
  event: 'subscribe',
  data: {
    events: [
      'pr.opened',
      'pr.merged',
      'pr.approved',
      'ci.failed'
    ],
    filters: {
      labels: ['important'],
      authors: ['dependabot']
    }
  }
}));
```

### Event Types

- `pr.opened` - New PR created
- `pr.updated` - PR updated
- `pr.closed` - PR closed
- `pr.merged` - PR merged
- `pr.review_requested` - Review requested
- `pr.review_submitted` - Review submitted
- `pr.approved` - PR approved
- `pr.changes_requested` - Changes requested
- `ci.started` - CI started
- `ci.completed` - CI completed
- `ci.failed` - CI failed
- `release.created` - Release created
- `release.published` - Release published

## CLAWD.BOT

WebSocket-enhanced Claw-Bot with advanced automation.

### Features

- 🤖 **Automated Workflow Execution**
- 🎛️ **Real-time Configuration**
- 📊 **Live Status Monitoring**
- 🔐 **Role-Based Access Control**
- 📝 **Comprehensive Audit Logging**

### Commands

#### Automation Commands

```javascript
// Run automation
ws.send(JSON.stringify({
  type: 'command',
  event: 'run-automation'
}));

// Get automation status
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-automation-status'
}));

// Pause automation
ws.send(JSON.stringify({
  type: 'command',
  event: 'pause-automation'
}));

// Resume automation
ws.send(JSON.stringify({
  type: 'command',
  event: 'resume-automation'
}));
```

#### Configuration Commands

```javascript
// Get configuration
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-config'
}));

// Update configuration
ws.send(JSON.stringify({
  type: 'command',
  event: 'update-config',
  data: {
    autoApproveDependencies: true,
    autoMerge: true
  }
}));

// List rules
ws.send(JSON.stringify({
  type: 'command',
  event: 'list-rules'
}));
```

#### Monitoring Commands

```javascript
// Get statistics
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-stats'
}));

// Get recent actions
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-recent-actions',
  data: {
    limit: 50
  }
}));

// Get audit log
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-audit-log',
  data: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    limit: 100
  }
}));
```

#### Security Commands

```javascript
// Validate security
ws.send(JSON.stringify({
  type: 'command',
  event: 'validate-security'
}));

// Check permissions
ws.send(JSON.stringify({
  type: 'command',
  event: 'check-permissions',
  data: {
    action: 'merge-pr'
  }
}));
```

## Configuration

### WebSocket Server

```typescript
const wsServer = new SecureWebSocketServer({
  port: 8080,
  secure: true,
  certPath: '/path/to/cert.pem',
  keyPath: '/path/to/key.pem',
  jwtSecret: 'your-secret-key',
  rateLimitPerMinute: 60,
  maxConnectionsPerIP: 5,
  allowedOrigins: ['https://example.com'],
  requireAuth: true,
  sessionTimeout: 60
});

await wsServer.start();
```

### MoltBot

```typescript
const moltBot = new MoltBot({
  github: githubClient,
  manifest: manifestClient,
  websocketServer: wsServer,
  pollingInterval: 30000,
  enableNotifications: true,
  adminCommands: ['approve-pr', 'merge-pr']
});

await moltBot.start();
```

### CLAWD.BOT

```typescript
const clawdBot = new ClawdBot(githubClient, {
  websocketServer: wsServer,
  enableRealTimeUpdates: true,
  enableAuditLog: true,
  auditLogRetentionDays: 30,
  autoApproveDependencies: true,
  autoMerge: true,
  autoLabel: true,
  rbac: {
    enabled: true,
    roles: {
      admin: {
        commands: ['*'],
        permissions: ['*']
      },
      developer: {
        commands: ['get-status', 'list-prs'],
        permissions: ['read']
      }
    }
  }
});

await clawdBot.initialize();
await clawdBot.start();
```

## Security Best Practices

### 1. Use Secure WebSockets (WSS)

Always use `wss://` in production:

```typescript
{
  secure: true,
  certPath: '/etc/ssl/certs/server.crt',
  keyPath: '/etc/ssl/private/server.key'
}
```

### 2. Implement Strong Authentication

Use JWT tokens with proper expiration:

```typescript
{
  jwtSecret: process.env.JWT_SECRET, // Use environment variables
  requireAuth: true,
  sessionTimeout: 60 // minutes
}
```

### 3. Enable Rate Limiting

Prevent abuse with rate limits:

```typescript
{
  rateLimitPerMinute: 60,
  maxConnectionsPerIP: 5
}
```

### 4. Validate Origins

Restrict connections to trusted origins:

```typescript
{
  allowedOrigins: [
    'https://dashboard.example.com',
    'https://app.example.com'
  ]
}
```

### 5. Enable Audit Logging

Track all actions for compliance:

```typescript
{
  enableAuditLog: true,
  auditLogRetentionDays: 90
}
```

### 6. Use RBAC

Implement role-based access control:

```typescript
{
  rbac: {
    enabled: true,
    roles: {
      admin: {commands: ['*'], permissions: ['*']},
      user: {commands: ['get-status'], permissions: ['read']}
    }
  }
}
```

## Monitoring & Alerts

### Health Checks

```javascript
// Check server health
ws.send(JSON.stringify({
  type: 'command',
  event: 'ping'
}));

// Response: { type: 'response', event: 'pong', timestamp: ... }
```

### Statistics

```javascript
// Get server stats
const stats = wsServer.getStats();
// {
//   isRunning: true,
//   totalConnections: 15,
//   authenticatedConnections: 12,
//   uniqueIPs: 8
// }
```

### Audit Trail

```javascript
// Query audit log
ws.send(JSON.stringify({
  type: 'command',
  event: 'get-audit-log',
  data: {
    startDate: '2024-01-01',
    limit: 100
  }
}));
```

## Error Handling

### Client-Side

```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  if (event.code === 1008) {
    console.error('Unauthorized - check authentication');
  } else if (event.code === 1013) {
    console.error('Rate limit exceeded');
  }
};
```

### Server Responses

```json
{
  "type": "error",
  "event": "error",
  "data": {
    "error": "Rate limit exceeded"
  },
  "timestamp": 1234567890
}
```

## Troubleshooting

### Connection Issues

1. **Cannot connect**
   - Check firewall rules
   - Verify certificate validity (for WSS)
   - Ensure port is open

2. **Authentication fails**
   - Verify JWT token format
   - Check token expiration
   - Validate token secret

3. **Rate limit exceeded**
   - Reduce message frequency
   - Implement client-side throttling
   - Request rate limit increase

### Command Failures

1. **Unauthorized errors**
   - Verify user role/permissions
   - Check RBAC configuration
   - Review audit log

2. **Command timeout**
   - Increase session timeout
   - Check network latency
   - Verify server load

## API Reference

### SecureWebSocketServer

```typescript
class SecureWebSocketServer {
  constructor(config: WebSocketServerConfig, logger?: Logger)
  async start(): Promise<void>
  async stop(): Promise<void>
  sendMessage(clientId: string, message: WebSocketMessage): void
  broadcast(message: WebSocketMessage, filter?: Function): void
  getStats(): ServerStats
}
```

### MoltBot

```typescript
class MoltBot {
  constructor(config: MoltBotConfig, logger?: Logger)
  async start(): Promise<void>
  async stop(): Promise<void>
  getStats(): MoltBotStats
}
```

### ClawdBot

```typescript
class ClawdBot {
  constructor(github: GitHub, config: ClawdBotConfig, logger?: Logger)
  async initialize(): Promise<void>
  async start(): Promise<void>
  async stop(): Promise<void>
  pause(): void
  resume(): void
}
```

## Examples

See `examples/websocket/` directory for complete examples:
- `client.js` - WebSocket client implementation
- `server.js` - Server setup
- `dashboard.html` - Web dashboard example
- `automation.js` - Automation configuration

## Support

- Issues: [GitHub Issues](https://github.com/googleapis/release-please/issues)
- Discussions: [GitHub Discussions](https://github.com/googleapis/release-please/discussions)
- Security: See SECURITY.md

## License

Apache License 2.0
