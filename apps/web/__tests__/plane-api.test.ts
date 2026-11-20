import { fetchPlaneStatus, fetchProjectIssues, createProjectIssue } from "../lib/api/plane";
import * as apiModule from "../lib/api";

jest.mock("../lib/api", () => ({
  apiFetch: jest.fn(),
  ApiError: class ApiError extends Error {},
}));

describe("Plane API client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchPlaneStatus calls /api/plane/status", async () => {
    const mockStatus = { isConfigured: true, workspaceSlug: "yield-studio-ok" };
    (apiModule.apiFetch as jest.Mock).mockResolvedValue({ success: true, data: mockStatus });

    const status = await fetchPlaneStatus("test-token");
    expect(status).toEqual(mockStatus);
    expect(apiModule.apiFetch).toHaveBeenCalledWith("/api/plane/status", { token: "test-token" });
  });

  it("fetchProjectIssues calls /api/plane/projects/:id/issues", async () => {
    const mockIssues = [{ id: "iss-1", name: "Issue 1", sequence_id: 12 }];
    (apiModule.apiFetch as jest.Mock).mockResolvedValue({ success: true, data: mockIssues });

    const issues = await fetchProjectIssues("proj-1", "test-token");
    expect(issues).toEqual(mockIssues);
    expect(apiModule.apiFetch).toHaveBeenCalledWith("/api/plane/projects/proj-1/issues", {
      token: "test-token",
    });
  });

  it("createProjectIssue posts to /api/plane/projects/:id/issues", async () => {
    const newIssue = { id: "iss-2", name: "New Ticket" };
    (apiModule.apiFetch as jest.Mock).mockResolvedValue({ success: true, data: newIssue });

    const payload = { name: "New Ticket", priority: "high", description: "Hello" };
    const issue = await createProjectIssue("proj-1", payload, "test-token");
    expect(issue).toEqual(newIssue);
    expect(apiModule.apiFetch).toHaveBeenCalledWith("/api/plane/projects/proj-1/issues", {
      method: "POST",
      body: JSON.stringify(payload),
      token: "test-token",
    });
  });
});
