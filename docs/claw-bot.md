# Claw-Bot: Comprehensive Automation System

Claw-Bot is an intelligent automation system for release-please that fully automates your release workflow, PR management, dependency updates, and more.

## 🎯 Overview

Claw-Bot provides:

- **Automated PR Management**: Auto-approve, auto-label, and auto-merge pull requests based on customizable rules
- **Intelligent Labeling**: Automatically labels PRs based on title patterns, file changes, and content analysis
- **Dependency Management**: Automatically approves and merges dependency updates from trusted sources
- **CI/CD Monitoring**: Monitors workflows and automatically retries failed jobs
- **Security Automation**: Detects and auto-fixes security vulnerabilities
- **Custom Rules Engine**: Define complex automation rules with conditions and actions
- **Multi-channel Notifications**: Get updates via Slack, email, or other channels

## 🚀 Quick Start

### 1. Create Configuration File

Create a `.claw-bot.json` file in your repository root:

```json
{
  "autoApproveDependencies": true,
  "autoMerge": true,
  "autoLabel": true,
  "ciMonitoring": true,
  "securityAutoFix": true
}
```

### 2. Add GitHub Actions Workflow

The workflow is automatically included at `.github/workflows/claw-bot.yaml`.

### 3. Configure Permissions

Ensure your GitHub Actions workflow has the necessary permissions:

```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
  checks: read
```

## 📋 Configuration Options

### Basic Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoApproveDependencies` | boolean | `false` | Auto-approve dependency update PRs |
| `autoMerge` | boolean | `false` | Auto-merge PRs when all checks pass |
| `autoLabel` | boolean | `true` | Auto-label PRs based on content |
| `ciMonitoring` | boolean | `true` | Monitor and retry failed CI jobs |
| `maxRetries` | number | `2` | Max retry attempts for failed jobs |
| `dependencyUpdates` | boolean | `false` | Create dependency update PRs |
| `securityAutoFix` | boolean | `true` | Auto-fix security vulnerabilities |

### Required Checks

Specify which status checks must pass before auto-merge:

```json
{
  "requiredChecks": [
    "build",
    "test",
    "lint",
    "security-scan"
  ]
}
```

### Notifications

Configure notification channels:

```json
{
  "notifications": {
    "slack": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "email": ["team@example.com"]
  }
}
```

## 🎨 Custom PR Rules

Define custom automation rules with conditions and actions.

### Rule Structure

```json
{
  "prRules": [
    {
      "name": "Rule name",
      "condition": {
        "titlePattern": "regex pattern",
        "labelsInclude": ["label1"],
        "labelsExclude": ["label2"],
        "filesPattern": "regex pattern",
        "author": "github-username"
      },
      "actions": {
        "addLabels": ["label"],
        "requestReviewers": ["username"],
        "autoApprove": true,
        "autoMerge": true,
        "comment": "Message"
      }
    }
  ]
}
```

### Example Rules

#### Auto-approve documentation changes

```json
{
  "name": "Auto-approve documentation",
  "condition": {
    "filesPattern": "\\.(md|txt)$",
    "labelsInclude": ["documentation"]
  },
  "actions": {
    "autoApprove": true,
    "addLabels": ["auto-approved"]
  }
}
```

#### Request security review

```json
{
  "name": "Security review required",
  "condition": {
    "filesPattern": "auth|security|permission",
    "titlePattern": "auth|security"
  },
  "actions": {
    "requestReviewers": ["security-team"],
    "addLabels": ["security-review-required"],
    "comment": "🔒 This PR requires security team review."
  }
}
```

#### Auto-merge dependency updates

```json
{
  "name": "Auto-merge dependabot",
  "condition": {
    "author": "dependabot",
    "labelsInclude": ["dependencies"]
  },
  "actions": {
    "autoApprove": true,
    "autoMerge": true,
    "addLabels": ["auto-merged"]
  }
}
```

## 🏷️ Automatic Labeling

Claw-Bot automatically adds labels based on:

### Conventional Commit Prefixes

- `feat:` → `type: feature`
- `fix:` → `type: bug`
- `docs:` → `type: docs`
- `chore:` → `type: chore`
- `perf:` → `type: performance`
- `test:` → `testing`

### File Patterns

- `*.test.*`, `*.spec.*` → `testing`
- `package.json`, `package-lock.json` → `dependencies`
- `*.md`, `README`, `CHANGELOG` → `documentation`
- `.github/workflows/*` → `ci/cd`

### Breaking Changes

- `!:` in title → `breaking-change`, `priority: critical`

## 🔧 Advanced Features

### Dependency Update Schedule

Configure when to check for dependency updates (cron format):

```json
{
  "dependencyCheckSchedule": "0 0 * * 1"
}
```

Examples:
- `0 0 * * 1` - Weekly on Monday at midnight
- `0 0 * * *` - Daily at midnight
- `0 */6 * * *` - Every 6 hours

### CI/CD Monitoring

Claw-Bot monitors workflow runs and can:
- Auto-retry failed jobs (up to `maxRetries` times)
- Comment on PRs with failure details
- Notify teams of persistent failures

### Security Automation

When `securityAutoFix` is enabled, Claw-Bot:
- Scans for known vulnerabilities
- Auto-creates PRs with security patches
- Prioritizes security updates
- Notifies security team

## 📊 Reporting

Claw-Bot generates reports showing:
- PRs processed
- PRs approved/merged
- Labels added
- CI jobs retried
- Security fixes applied
- Errors encountered

Reports are available:
- In GitHub Actions workflow summaries
- Via configured notification channels
- In workflow logs

## 🔐 Security Considerations

### Required Permissions

Claw-Bot requires these GitHub permissions:
- `contents: write` - To create branches and commits
- `pull-requests: write` - To manage PRs
- `issues: write` - To add labels and comments
- `checks: read` - To monitor CI status

### Best Practices

1. **Use Branch Protection**: Require reviews for critical branches
2. **Limit Auto-merge**: Only enable for low-risk changes
3. **Review Rules Regularly**: Audit automation rules periodically
4. **Monitor Notifications**: Stay informed of automation actions
5. **Test Configuration**: Start with conservative settings

### Trusted Sources

Only auto-approve/merge from trusted sources:
- Dependabot (GitHub's official bot)
- Renovate (configured properly)
- Your own automation tools
- Verified team members

## 🎯 Use Cases

### Scenario 1: Fast-moving Team

```json
{
  "autoApproveDependencies": true,
  "autoMerge": true,
  "autoLabel": true,
  "ciMonitoring": true,
  "maxRetries": 3
}
```

### Scenario 2: Security-focused

```json
{
  "autoApproveDependencies": false,
  "autoMerge": false,
  "autoLabel": true,
  "securityAutoFix": true,
  "prRules": [
    {
      "name": "Security review",
      "condition": {
        "filesPattern": "auth|security|crypto"
      },
      "actions": {
        "requestReviewers": ["security-team"],
        "addLabels": ["security-review-required"]
      }
    }
  ]
}
```

### Scenario 3: Documentation-heavy

```json
{
  "autoLabel": true,
  "prRules": [
    {
      "name": "Auto-approve docs",
      "condition": {
        "filesPattern": "\\.(md|txt|rst)$"
      },
      "actions": {
        "autoApprove": true,
        "autoMerge": true
      }
    }
  ]
}
```

## 🐛 Troubleshooting

### Claw-Bot not running

1. Check workflow permissions
2. Verify `.claw-bot.json` is valid JSON
3. Check GitHub Actions logs
4. Ensure triggers are configured

### Auto-merge not working

1. Verify `autoMerge: true` in config
2. Check required status checks pass
3. Ensure PR is approved
4. Review branch protection rules

### Labels not applying

1. Check label names exist in repository
2. Verify pattern matching in config
3. Review workflow logs for errors

## 📚 API Reference

### ClawBot Class

```typescript
import {ClawBot} from 'release-please';

const bot = new ClawBot(github, config);
await bot.initialize(manifestOptions);
const result = await bot.run();
```

### Configuration Type

```typescript
interface ClawBotConfig {
  autoApproveDependencies?: boolean;
  autoMerge?: boolean;
  requiredChecks?: string[];
  autoLabel?: boolean;
  ciMonitoring?: boolean;
  maxRetries?: number;
  dependencyUpdates?: boolean;
  dependencyCheckSchedule?: string;
  securityAutoFix?: boolean;
  notifications?: {
    slack?: string;
    email?: string[];
  };
  prRules?: ClawBotPRRule[];
}
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Read the [Contributing Guide](../CONTRIBUTING.md)
2. Follow the code style
3. Add tests for new features
4. Update documentation

## 📄 License

Apache License 2.0 - see [LICENSE](../LICENSE)

## 🆘 Support

- [GitHub Issues](https://github.com/googleapis/release-please/issues)
- [Documentation](https://github.com/googleapis/release-please#readme)
- [Discussions](https://github.com/googleapis/release-please/discussions)
