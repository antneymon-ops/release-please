import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SonarQubeClient } from "./sonarqube-client.js";
import { AntiPatternDetector } from "./anti-pattern-detector.js";
import { logger } from "./utils/logger.js";

const SONARQUBE_URL = process.env.SONARQUBE_URL || "http://localhost:9000";
const SONARQUBE_TOKEN = process.env.SONARQUBE_TOKEN || "";

class SonarQubeMCPServer {
  private server: Server;
  private sonarClient: SonarQubeClient;
  private antiPatternDetector: AntiPatternDetector;

  constructor() {
    this.server = new Server(
      {
        name: "sonarqube-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.sonarClient = new SonarQubeClient(SONARQUBE_URL, SONARQUBE_TOKEN);
    this.antiPatternDetector = new AntiPatternDetector();

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();
    this.setupErrorHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "analyze_project",
            description: "Run SonarQube analysis on a project and get metrics",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "SonarQube project key",
                },
              },
              required: ["projectKey"],
            },
          },
          {
            name: "detect_anti_patterns",
            description: "Detect anti-patterns and code smells in a file",
            inputSchema: {
              type: "object",
              properties: {
                filePath: {
                  type: "string",
                  description: "Path to file to analyze",
                },
              },
              required: ["filePath"],
            },
          },
          {
            name: "check_quality_gate",
            description: "Check if project passes quality gate requirements",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "SonarQube project key",
                },
              },
              required: ["projectKey"],
            },
          },
          {
            name: "get_code_smells",
            description: "Get all code smells detected in a project",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "SonarQube project key",
                },
              },
              required: ["projectKey"],
            },
          },
          {
            name: "get_security_hotspots",
            description: "Get security vulnerabilities and hotspots in a project",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "SonarQube project key",
                },
              },
              required: ["projectKey"],
            },
          },
          {
            name: "scan_repository",
            description: "Trigger a full repository scan with SonarQube scanner",
            inputSchema: {
              type: "object",
              properties: {
                repoPath: {
                  type: "string",
                  description: "Path to repository to scan",
                },
                projectKey: {
                  type: "string",
                  description: "Project key for SonarQube",
                },
              },
              required: ["repoPath", "projectKey"],
            },
          },
          {
            name: "get_issues",
            description: "Get issues of specific type (BUG, VULNERABILITY, CODE_SMELL)",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "SonarQube project key",
                },
                issueType: {
                  type: "string",
                  enum: ["BUG", "VULNERABILITY", "CODE_SMELL"],
                  description: "Type of issues to retrieve",
                },
              },
              required: ["projectKey", "issueType"],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "analyze_project":
            return await this.analyzeProject(args.projectKey as string);

          case "detect_anti_patterns":
            return await this.detectAntiPatterns(args.filePath as string);

          case "check_quality_gate":
            return await this.checkQualityGate(args.projectKey as string);

          case "get_code_smells":
            return await this.getCodeSmells(args.projectKey as string);

          case "get_security_hotspots":
            return await this.getSecurityHotspots(args.projectKey as string);

          case "scan_repository":
            return await this.scanRepository(
              args.repoPath as string,
              args.projectKey as string
            );

          case "get_issues":
            return await this.getIssues(
              args.projectKey as string,
              args.issueType as string
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error({ error, tool: name }, "Tool execution failed");
        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "sonarqube://metrics/all",
            name: "Project Metrics",
            mimeType: "application/json",
            description: "All project metrics from SonarQube",
          },
          {
            uri: "sonarqube://issues/all",
            name: "All Issues",
            mimeType: "application/json",
            description: "All issues detected in the project",
          },
          {
            uri: "sonarqube://anti-patterns/report",
            name: "Anti-Pattern Report",
            mimeType: "text/markdown",
            description: "Comprehensive anti-pattern analysis report",
          },
        ],
      };
    });

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        if (uri === "sonarqube://metrics/all") {
          // This would need a project key - for now return placeholder
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(
                  {
                    message: "Specify a project key to get metrics",
                    example: "Use analyze_project tool with projectKey",
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        if (uri === "sonarqube://anti-patterns/report") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: "# Anti-Pattern Report\n\nUse the `detect_anti_patterns` tool to analyze specific files.",
              },
            ],
          };
        }

        throw new Error(`Unknown resource URI: ${uri}`);
      } catch (error) {
        logger.error({ error, uri }, "Resource read failed");
        throw error;
      }
    });
  }

  private setupPromptHandlers() {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: "code_review",
            description: "Comprehensive code review with anti-pattern detection",
            arguments: [
              {
                name: "filePath",
                description: "Path to file to review",
                required: true,
              },
            ],
          },
          {
            name: "security_audit",
            description: "Security vulnerability assessment for a project",
            arguments: [
              {
                name: "projectKey",
                description: "SonarQube project key",
                required: true,
              },
            ],
          },
          {
            name: "refactoring_suggestions",
            description: "Get refactoring recommendations for a file",
            arguments: [
              {
                name: "filePath",
                description: "Path to file to analyze",
                required: true,
              },
            ],
          },
        ],
      };
    });
  }

  private setupErrorHandlers() {
    this.server.onerror = (error) => {
      logger.error({ error }, "Server error");
    };

    process.on("SIGINT", async () => {
      await this.stop();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await this.stop();
      process.exit(0);
    });
  }

  private async analyzeProject(projectKey: string) {
    logger.info({ projectKey }, "Analyzing project");
    const metrics = await this.sonarClient.getProjectMetrics(projectKey);

    return {
      content: [
        {
          type: "text",
          text: `# Project Analysis: ${projectKey}\n\n${JSON.stringify(metrics, null, 2)}`,
        },
      ],
    };
  }

  private async detectAntiPatterns(filePath: string) {
    logger.info({ filePath }, "Detecting anti-patterns");
    const antiPatterns = await this.antiPatternDetector.analyze(filePath);

    const report = this.formatAntiPatternReport(antiPatterns);

    return {
      content: [
        {
          type: "text",
          text: report,
        },
      ],
    };
  }

  private formatAntiPatternReport(antiPatterns: any[]): string {
    if (antiPatterns.length === 0) {
      return "✅ No anti-patterns detected!";
    }

    let report = `# Anti-Patterns Detected: ${antiPatterns.length}\n\n`;

    const bySeverity = {
      CRITICAL: antiPatterns.filter((p) => p.severity === "CRITICAL"),
      HIGH: antiPatterns.filter((p) => p.severity === "HIGH"),
      MEDIUM: antiPatterns.filter((p) => p.severity === "MEDIUM"),
      LOW: antiPatterns.filter((p) => p.severity === "LOW"),
    };

    for (const [severity, patterns] of Object.entries(bySeverity)) {
      if (patterns.length > 0) {
        report += `## ${severity} Severity (${patterns.length})\n\n`;
        for (const pattern of patterns) {
          report += `### ${pattern.name}\n`;
          report += `**Location:** ${pattern.location.file}`;
          if (pattern.location.line) {
            report += `:${pattern.location.line}`;
          }
          report += `\n`;
          report += `**Description:** ${pattern.description}\n`;
          report += `**Recommendation:** ${pattern.recommendation}\n\n`;
        }
      }
    }

    return report;
  }

  private async checkQualityGate(projectKey: string) {
    logger.info({ projectKey }, "Checking quality gate");
    const qualityGate = await this.sonarClient.getQualityGateStatus(projectKey);

    const status = qualityGate.status === "OK" ? "✅ PASSED" : "❌ FAILED";

    return {
      content: [
        {
          type: "text",
          text: `# Quality Gate Status: ${status}\n\n${JSON.stringify(qualityGate, null, 2)}`,
        },
      ],
    };
  }

  private async getCodeSmells(projectKey: string) {
    logger.info({ projectKey }, "Getting code smells");
    const smells = await this.sonarClient.getIssues(projectKey, "CODE_SMELL");

    return {
      content: [
        {
          type: "text",
          text: `# Code Smells Found: ${smells.length}\n\n${JSON.stringify(smells.slice(0, 10), null, 2)}\n\n${smells.length > 10 ? `... and ${smells.length - 10} more` : ""}`,
        },
      ],
    };
  }

  private async getSecurityHotspots(projectKey: string) {
    logger.info({ projectKey }, "Getting security hotspots");
    const hotspots = await this.sonarClient.getSecurityHotspots(projectKey);

    return {
      content: [
        {
          type: "text",
          text: `# Security Hotspots: ${hotspots.length}\n\n${JSON.stringify(hotspots, null, 2)}`,
        },
      ],
    };
  }

  private async getIssues(projectKey: string, issueType: string) {
    logger.info({ projectKey, issueType }, "Getting issues");
    const issues = await this.sonarClient.getIssues(projectKey, issueType);

    return {
      content: [
        {
          type: "text",
          text: `# ${issueType} Issues: ${issues.length}\n\n${JSON.stringify(issues.slice(0, 10), null, 2)}\n\n${issues.length > 10 ? `... and ${issues.length - 10} more` : ""}`,
        },
      ],
    };
  }

  private async scanRepository(repoPath: string, projectKey: string) {
    logger.info({ repoPath, projectKey }, "Scanning repository");
    const result = await this.sonarClient.scanRepository(repoPath, projectKey);

    return {
      content: [
        {
          type: "text",
          text: `# Repository Scan ${result.success ? "✅ Completed" : "❌ Failed"}\n\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info("SonarQube MCP Server started on stdio");
  }

  async stop() {
    logger.info("Stopping SonarQube MCP Server");
    await this.server.close();
  }
}

// Start the server
const server = new SonarQubeMCPServer();
server.start().catch((error) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});
