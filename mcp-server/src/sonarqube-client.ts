import axios, { AxiosInstance, AxiosError } from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import { logger } from "./utils/logger.js";

const execPromise = promisify(exec);

export interface ProjectMetrics {
  component: {
    key: string;
    name: string;
    measures: Array<{
      metric: string;
      value: string;
    }>;
  };
}

export interface QualityGateStatus {
  status: string;
  conditions?: Array<{
    status: string;
    metricKey: string;
    actualValue: string;
  }>;
}

export interface Issue {
  key: string;
  rule: string;
  severity: string;
  component: string;
  line?: number;
  message: string;
  type: string;
}

export interface SecurityHotspot {
  key: string;
  component: string;
  securityCategory: string;
  vulnerabilityProbability: string;
  status: string;
  line?: number;
  message: string;
}

export class SonarQubeClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      auth: {
        username: token,
        password: "",
      },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug({ url: config.url }, "SonarQube API request");
        return config;
      },
      (error) => {
        logger.error({ error }, "SonarQube API request error");
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          logger.error(
            {
              status: error.response.status,
              data: error.response.data,
              url: error.config?.url,
            },
            "SonarQube API error response"
          );
        } else {
          logger.error({ error: error.message }, "SonarQube API network error");
        }
        return Promise.reject(error);
      }
    );
  }

  async getProjectMetrics(projectKey: string): Promise<ProjectMetrics> {
    try {
      const response = await this.client.get("/api/measures/component", {
        params: {
          component: projectKey,
          metricKeys:
            "bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,ncloc,complexity,cognitive_complexity,violations",
        },
      });
      return response.data;
    } catch (error) {
      logger.error({ error, projectKey }, "Failed to get project metrics");
      throw new Error(
        `Failed to get metrics for project ${projectKey}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getQualityGateStatus(projectKey: string): Promise<QualityGateStatus> {
    try {
      const response = await this.client.get("/api/qualitygates/project_status", {
        params: { projectKey },
      });
      return response.data.projectStatus;
    } catch (error) {
      logger.error({ error, projectKey }, "Failed to get quality gate status");
      throw new Error(
        `Failed to get quality gate for project ${projectKey}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getIssues(projectKey: string, type: string): Promise<Issue[]> {
    try {
      const response = await this.client.get("/api/issues/search", {
        params: {
          componentKeys: projectKey,
          types: type,
          ps: 500, // Page size
          p: 1, // Page number
        },
      });
      return response.data.issues;
    } catch (error) {
      logger.error({ error, projectKey, type }, "Failed to get issues");
      throw new Error(
        `Failed to get issues for project ${projectKey}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getSecurityHotspots(projectKey: string): Promise<SecurityHotspot[]> {
    try {
      const response = await this.client.get("/api/hotspots/search", {
        params: {
          projectKey,
          ps: 500,
          p: 1,
        },
      });
      return response.data.hotspots || [];
    } catch (error) {
      logger.error({ error, projectKey }, "Failed to get security hotspots");
      // Security hotspots might not be available in all SonarQube editions
      logger.warn("Security hotspots may not be available in Community Edition");
      return [];
    }
  }

  async triggerAnalysis(projectKey: string): Promise<any> {
    try {
      // This endpoint checks the analysis status
      const response = await this.client.get("/api/ce/component", {
        params: { component: projectKey },
      });
      return response.data;
    } catch (error) {
      logger.error({ error, projectKey }, "Failed to trigger analysis");
      throw new Error(
        `Failed to trigger analysis for project ${projectKey}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async scanRepository(
    repoPath: string,
    projectKey: string
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      logger.info({ repoPath, projectKey }, "Starting sonar-scanner");

      const command = `sonar-scanner \
        -Dsonar.projectKey=${projectKey} \
        -Dsonar.sources=. \
        -Dsonar.host.url=${this.baseURL} \
        -Dsonar.projectBaseDir=${repoPath}`;

      const { stdout, stderr } = await execPromise(command, {
        cwd: repoPath,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      logger.info({ projectKey }, "Scan completed successfully");
      return {
        success: true,
        output: stdout,
      };
    } catch (error: any) {
      logger.error({ error, repoPath, projectKey }, "Scan failed");
      return {
        success: false,
        error: error.message,
        output: error.stdout,
      };
    }
  }

  async getProjectsList(): Promise<any[]> {
    try {
      const response = await this.client.get("/api/projects/search", {
        params: {
          ps: 100,
          p: 1,
        },
      });
      return response.data.components || [];
    } catch (error) {
      logger.error({ error }, "Failed to get projects list");
      throw new Error(
        `Failed to get projects list: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get("/api/system/status");
      return response.data.status === "UP";
    } catch (error) {
      logger.error({ error }, "Health check failed");
      return false;
    }
  }
}
