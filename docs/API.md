# API Reference

Complete API documentation for the SonarQube MCP Server.

## Table of Contents

- [Overview](#overview)
- [Protocol](#protocol)
- [Authentication](#authentication)
- [Tools](#tools)
- [Resources](#resources)
- [Prompts](#prompts)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

The SonarQube MCP Server implements the Model Context Protocol (MCP) to provide code quality analysis tools to AI assistants.

**Base Protocol**: stdio (Standard Input/Output)  
**Format**: JSON-RPC 2.0  
**Transport**: MCP SDK

## Protocol

### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": {
    // method-specific parameters
  }
}
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    // method-specific result
  }
}
```

### Error Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Error description"
  }
}
```

## Authentication

Authentication is handled via environment variables:

```bash
export SONARQUBE_URL=http://localhost:9000
export SONARQUBE_TOKEN=your-token-here
```

The MCP server authenticates with SonarQube using HTTP Basic Auth with the token as the username.

## Tools

### List Tools

Get all available tools.

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "analyze_project",
        "description": "Run SonarQube analysis on a project and get metrics",
        "inputSchema": {
          "type": "object",
          "properties": {
            "projectKey": {
              "type": "string",
              "description": "SonarQube project key"
            }
          },
          "required": ["projectKey"]
        }
      }
      // ... more tools
    ]
  }
}
```

---

### analyze_project

Get comprehensive metrics for a SonarQube project.

**Method**: `tools/call`  
**Tool Name**: `analyze_project`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | SonarQube project key |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "analyze_project",
    "arguments": {
      "projectKey": "my-project"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Project Analysis: my-project\n\n{\n  \"component\": {\n    \"key\": \"my-project\",\n    \"measures\": [\n      {\"metric\": \"bugs\", \"value\": \"5\"},\n      {\"metric\": \"vulnerabilities\", \"value\": \"2\"},\n      {\"metric\": \"code_smells\", \"value\": \"123\"}\n    ]\n  }\n}"
      }
    ]
  }
}
```

**Metrics Returned**:
- `bugs`: Number of bugs
- `vulnerabilities`: Number of vulnerabilities
- `code_smells`: Number of code smells
- `coverage`: Test coverage percentage
- `duplicated_lines_density`: Percentage of duplicated lines
- `ncloc`: Number of lines of code
- `complexity`: Cyclomatic complexity
- `cognitive_complexity`: Cognitive complexity
- `violations`: Total violations

---

### detect_anti_patterns

Analyze a file for anti-patterns and code smells.

**Method**: `tools/call`  
**Tool Name**: `detect_anti_patterns`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | Absolute path to file to analyze |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "detect_anti_patterns",
    "arguments": {
      "filePath": "/path/to/file.ts"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Anti-Patterns Detected: 3\n\n## CRITICAL Severity (1)\n\n### God Object\n**Location:** /path/to/file.ts:1\n**Description:** Class has 25 methods (threshold: 20).\n**Recommendation:** Apply Single Responsibility Principle..."
      }
    ]
  }
}
```

**Anti-Patterns Detected**:
- God Object
- Long Method
- Magic Numbers
- Duplicate Code
- Complex Conditionals
- Long Parameter Lists
- Deep Nesting
- Circular Dependencies

---

### check_quality_gate

Check if a project passes its quality gate requirements.

**Method**: `tools/call`  
**Tool Name**: `check_quality_gate`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | SonarQube project key |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "check_quality_gate",
    "arguments": {
      "projectKey": "my-project"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Quality Gate Status: ✅ PASSED\n\n{\n  \"status\": \"OK\",\n  \"conditions\": [\n    {\"status\": \"OK\", \"metricKey\": \"new_coverage\", \"actualValue\": \"85.5\"},\n    {\"status\": \"OK\", \"metricKey\": \"new_duplicated_lines_density\", \"actualValue\": \"2.1\"}\n  ]\n}"
      }
    ]
  }
}
```

**Status Values**:
- `OK`: Quality gate passed
- `ERROR`: Quality gate failed
- `WARN`: Quality gate passed with warnings

---

### get_code_smells

Retrieve all code smells detected in a project.

**Method**: `tools/call`  
**Tool Name**: `get_code_smells`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | SonarQube project key |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_code_smells",
    "arguments": {
      "projectKey": "my-project"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Code Smells Found: 123\n\n[\n  {\n    \"key\": \"issue-key-1\",\n    \"rule\": \"typescript:S1541\",\n    \"severity\": \"MAJOR\",\n    \"component\": \"my-project:src/file.ts\",\n    \"line\": 42,\n    \"message\": \"This function has too many lines\"\n  }\n]"
      }
    ]
  }
}
```

**Note**: Returns first 10 issues. Use SonarQube API directly for pagination.

---

### get_security_hotspots

Get security vulnerabilities and hotspots in a project.

**Method**: `tools/call`  
**Tool Name**: `get_security_hotspots`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | SonarQube project key |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_security_hotspots",
    "arguments": {
      "projectKey": "my-project"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Security Hotspots: 5\n\n[\n  {\n    \"key\": \"hotspot-1\",\n    \"component\": \"my-project:src/auth.ts\",\n    \"securityCategory\": \"weak-cryptography\",\n    \"vulnerabilityProbability\": \"HIGH\",\n    \"status\": \"TO_REVIEW\",\n    \"line\": 15\n  }\n]"
      }
    ]
  }
}
```

**Note**: Security hotspots may not be available in SonarQube Community Edition.

---

### scan_repository

Trigger a full repository scan with sonar-scanner.

**Method**: `tools/call`  
**Tool Name**: `scan_repository`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| repoPath | string | Yes | Absolute path to repository |
| projectKey | string | Yes | Project key for SonarQube |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "scan_repository",
    "arguments": {
      "repoPath": "/path/to/repo",
      "projectKey": "my-project"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Repository Scan ✅ Completed\n\n{\n  \"success\": true,\n  \"output\": \"INFO: Scanner configuration file...\\nINFO: Project key: my-project\\n...\"\n}"
      }
    ]
  }
}
```

**Requirements**:
- `sonar-scanner` must be installed
- Repository must be accessible
- SonarQube must be reachable

---

### get_issues

Get issues of specific type from a project.

**Method**: `tools/call`  
**Tool Name**: `get_issues`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | SonarQube project key |
| issueType | string | Yes | Type: BUG, VULNERABILITY, or CODE_SMELL |

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_issues",
    "arguments": {
      "projectKey": "my-project",
      "issueType": "BUG"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# BUG Issues: 5\n\n[\n  {\n    \"key\": \"bug-1\",\n    \"rule\": \"typescript:S2589\",\n    \"severity\": \"CRITICAL\",\n    \"component\": \"my-project:src/bug.ts\",\n    \"line\": 10,\n    \"message\": \"Condition is always true\",\n    \"type\": \"BUG\"\n  }\n]"
      }
    ]
  }
}
```

## Resources

### List Resources

Get available resources.

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list"
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "sonarqube://metrics/all",
        "name": "Project Metrics",
        "mimeType": "application/json",
        "description": "All project metrics from SonarQube"
      },
      {
        "uri": "sonarqube://issues/all",
        "name": "All Issues",
        "mimeType": "application/json"
      },
      {
        "uri": "sonarqube://anti-patterns/report",
        "name": "Anti-Pattern Report",
        "mimeType": "text/markdown"
      }
    ]
  }
}
```

### Read Resource

Read a specific resource.

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "sonarqube://anti-patterns/report"
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "contents": [
      {
        "uri": "sonarqube://anti-patterns/report",
        "mimeType": "text/markdown",
        "text": "# Anti-Pattern Report\n\nUse the `detect_anti_patterns` tool..."
      }
    ]
  }
}
```

## Prompts

### List Prompts

Get available prompt templates.

**Request**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list"
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "description": "Comprehensive code review with anti-pattern detection",
        "arguments": [
          {
            "name": "filePath",
            "description": "Path to file to review",
            "required": true
          }
        ]
      },
      {
        "name": "security_audit",
        "description": "Security vulnerability assessment for a project"
      },
      {
        "name": "refactoring_suggestions",
        "description": "Get refactoring recommendations for a file"
      }
    ]
  }
}
```

## Error Handling

### Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32600 | Invalid Request | JSON-RPC request is invalid |
| -32601 | Method not found | Method doesn't exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Server internal error |
| -32700 | Parse error | Invalid JSON |

### Error Response Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params: projectKey is required"
  }
}
```

### Common Errors

#### File Not Found
```json
{
  "error": {
    "code": -32603,
    "message": "Failed to analyze /path/to/file.ts: ENOENT: no such file or directory"
  }
}
```

#### SonarQube Connection Failed
```json
{
  "error": {
    "code": -32603,
    "message": "Failed to get metrics for project my-project: connect ECONNREFUSED 127.0.0.1:9000"
  }
}
```

#### Authentication Failed
```json
{
  "error": {
    "code": -32603,
    "message": "SonarQube API error response: 401 Unauthorized"
  }
}
```

## Examples

### Example 1: Full Project Analysis Workflow

```bash
# 1. List available tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  node mcp-server/dist/index.js

# 2. Analyze project metrics
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"analyze_project","arguments":{"projectKey":"my-project"}}}' | \
  node mcp-server/dist/index.js

# 3. Check quality gate
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_quality_gate","arguments":{"projectKey":"my-project"}}}' | \
  node mcp-server/dist/index.js

# 4. Get code smells
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_code_smells","arguments":{"projectKey":"my-project"}}}' | \
  node mcp-server/dist/index.js
```

### Example 2: File-Level Analysis

```bash
# Detect anti-patterns in a file
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"detect_anti_patterns","arguments":{"filePath":"/path/to/src/manifest.ts"}}}' | \
  node mcp-server/dist/index.js
```

### Example 3: Security Audit

```bash
# Get security hotspots
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_security_hotspots","arguments":{"projectKey":"my-project"}}}' | \
  node mcp-server/dist/index.js

# Get vulnerability issues
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_issues","arguments":{"projectKey":"my-project","issueType":"VULNERABILITY"}}}' | \
  node mcp-server/dist/index.js
```

### Example 4: Programmatic Usage (TypeScript)

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function analyzeProject(projectKey: string) {
  const request = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'analyze_project',
      arguments: { projectKey }
    }
  });

  const { stdout } = await execPromise(
    `echo '${request}' | node mcp-server/dist/index.js`
  );

  return JSON.parse(stdout);
}

// Usage
const result = await analyzeProject('my-project');
console.log(result.result.content[0].text);
```

## Rate Limiting

The MCP server itself has no rate limiting, but SonarQube API has limits:

- **SonarQube Community Edition**: ~10 requests/second recommended
- **Commercial Editions**: Higher limits available

## Best Practices

1. **Cache Results**: Store analysis results to avoid repeated calls
2. **Batch Operations**: Group related operations when possible
3. **Handle Errors**: Always check for error responses
4. **Set Timeouts**: Some operations (scan_repository) can take time
5. **Monitor Logs**: Check MCP server logs for issues
6. **Version Compatibility**: Ensure SonarQube and MCP server versions are compatible

## Changelog

### v1.0.0 (2026-02-17)
- Initial release
- Support for all core tools
- Anti-pattern detection
- Multi-client support

## Support

For API questions:
- **Documentation**: [SONARQUBE_MCP_README.md](SONARQUBE_MCP_README.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Issues**: [GitHub Issues](https://github.com/antneymon-ops/release-please/issues)

## References

- **MCP Specification**: https://modelcontextprotocol.io/
- **SonarQube API**: https://docs.sonarqube.org/latest/extend/web-api/
- **JSON-RPC 2.0**: https://www.jsonrpc.org/specification
