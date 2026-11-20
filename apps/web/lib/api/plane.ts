import { apiFetch } from "../api";

export interface PlaneStatus {
  isConfigured: boolean;
  workspaceSlug: string;
  apiUrl: string;
}

export interface PlaneIssue {
  id: string;
  name: string;
  sequence_id?: number;
  priority?: string;
  description_stripped?: string;
  state_detail?: {
    name?: string;
    group?: string;
  };
  state?: {
    name?: string;
    group?: string;
  };
  created_at?: string;
  archived_at?: string | null;
}

export async function fetchPlaneStatus(token?: string): Promise<PlaneStatus> {
  const res = await apiFetch<{ success: boolean; data: PlaneStatus }>("/api/plane/status", {
    token,
  });
  return res.data;
}

export async function fetchProjectIssues(projectId: string, token?: string): Promise<PlaneIssue[]> {
  const res = await apiFetch<{ success: boolean; data: PlaneIssue[] }>(
    `/api/plane/projects/${projectId}/issues`,
    { token },
  );
  return res.data || [];
}

export async function createProjectIssue(
  projectId: string,
  data: { name: string; priority?: string; description?: string },
  token?: string,
): Promise<PlaneIssue> {
  const res = await apiFetch<{ success: boolean; data: PlaneIssue }>(
    `/api/plane/projects/${projectId}/issues`,
    {
      method: "POST",
      body: JSON.stringify(data),
      token,
    },
  );
  return res.data;
}
