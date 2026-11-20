import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PlaneService {
  private readonly logger = new Logger(PlaneService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly workspaceSlug: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>("PLANE_API_URL") || "https://api.plane.so";
    this.apiKey = this.configService.get<string>("PLANE_API_KEY") || "";
    this.workspaceSlug = this.configService.get<string>("PLANE_WORKSPACE_SLUG") || "";
  }

  private async fetchPlaneAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.apiKey || !this.workspaceSlug) {
      throw new HttpException("Plane API configuration missing", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const url = `${this.apiUrl}/api/v1/workspaces/${this.workspaceSlug}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Plane API Error: ${response.status} - ${errorText}`);
        if (response.status === 404 && endpoint.includes("/work-items/")) {
          return this.fetchPlaneAPI(endpoint.replace("/work-items/", "/issues/"), options);
        }
        throw new HttpException(`Plane API Error: ${response.statusText}`, response.status);
      }
      return await response.json();
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Fetch error: ${error.message}`);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWorkspaceMembers(): Promise<any[]> {
    if (!this.apiKey) return [];
    const data = await this.fetchPlaneAPI("/members/");
    return Array.isArray(data) ? data : data.results || [];
  }

  async getProjects(): Promise<any[]> {
    if (!this.apiKey) return [];
    const data = await this.fetchPlaneAPI("/projects/");
    return Array.isArray(data) ? data : data.results || [];
  }

  async getActiveTicketsForUser(userEmail: string): Promise<any[]> {
    if (!this.apiKey) {
      this.logger.warn("Plane API keys missing. Returning mock tickets for development.");
      return [
        { id: "mock-1", name: "Fix Login Bug", project: { id: "p1", name: "Yield Hub" } },
        { id: "mock-2", name: "Build Dashboard", project: { id: "p1", name: "Yield Hub" } },
      ];
    }

    const members = await this.getWorkspaceMembers();
    const planeUser = members.find((m: any) => {
      const email = m.member?.email || m.email;
      return email === userEmail;
    });

    if (!planeUser) {
      return [];
    }

    const userId = planeUser.member?.id || planeUser.id;
    const projects = await this.getProjects();

    let allTickets: any[] = [];

    for (const project of projects) {
      const projectId = project.id;
      try {
        const issuesData = await this.fetchPlaneAPI(
          `/projects/${projectId}/work-items/?assignees=${userId}`,
        );
        const issues = Array.isArray(issuesData) ? issuesData : issuesData.results || [];

        const activeIssues = issues.filter((issue: any) => {
          const stateGroup = issue.state_detail?.group || issue.state?.group;
          if (stateGroup) {
            return !["completed", "cancelled"].includes(stateGroup.toLowerCase());
          }
          return true;
        });

        allTickets = [...allTickets, ...activeIssues];
      } catch (err: any) {
        this.logger.warn(`Failed to fetch issues for project ${projectId}: ${err.message}`);
      }
    }

    return allTickets;
  }

  getStatus() {
    return {
      isConfigured: !!(this.apiKey && this.workspaceSlug),
      workspaceSlug: this.workspaceSlug,
      apiUrl: this.apiUrl,
    };
  }

  async getProjectIssues(projectId: string): Promise<any[]> {
    if (!this.apiKey) {
      this.logger.warn("Plane API keys missing. Returning fallback project issues.");
      return [
        {
          id: "mock-yld-1",
          name: "Refactor Dashboard UI",
          sequence_id: 42,
          priority: "high",
          state_detail: { name: "In Progress", group: "started" },
        },
        {
          id: "mock-yld-2",
          name: "Setup Neon DB Connection",
          sequence_id: 41,
          priority: "medium",
          state_detail: { name: "Todo", group: "unstarted" },
        },
        {
          id: "mock-yld-3",
          name: "Fix Floating Timer",
          sequence_id: 40,
          priority: "low",
          state_detail: { name: "Done", group: "completed" },
        },
      ];
    }

    try {
      const data = await this.fetchPlaneAPI(`/projects/${projectId}/work-items/`);
      return Array.isArray(data) ? data : data.results || [];
    } catch (err: any) {
      this.logger.warn(`Failed to fetch work-items for project ${projectId}: ${err.message}`);
      try {
        const fallbackData = await this.fetchPlaneAPI(`/projects/${projectId}/issues/`);
        return Array.isArray(fallbackData) ? fallbackData : fallbackData.results || [];
      } catch (innerErr: any) {
        this.logger.error(
          `Failed to fetch issues fallback for project ${projectId}: ${innerErr.message}`,
        );
        return [];
      }
    }
  }

  async createProjectIssue(
    projectId: string,
    issueData: { name: string; priority?: string; description?: string },
  ): Promise<any> {
    if (!this.apiKey) {
      return {
        id: `mock-${Date.now()}`,
        name: issueData.name,
        sequence_id: Math.floor(Math.random() * 100) + 50,
        priority: issueData.priority || "medium",
        state_detail: { name: "Todo", group: "unstarted" },
        created_at: new Date().toISOString(),
      };
    }

    return this.fetchPlaneAPI(`/projects/${projectId}/work-items/`, {
      method: "POST",
      body: JSON.stringify({
        name: issueData.name,
        priority: issueData.priority || "medium",
        description_html: issueData.description ? `<p>${issueData.description}</p>` : undefined,
      }),
    });
  }

  async addCommentToIssue(projectId: string, issueId: string, commentHtml: string): Promise<any> {
    if (!this.apiKey) return null;
    return this.fetchPlaneAPI(`/projects/${projectId}/issues/${issueId}/comments/`, {
      method: "POST",
      body: JSON.stringify({ html_content: commentHtml }),
    });
  }
}
