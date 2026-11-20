import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { PlaneService } from "./plane.service";

describe("PlaneService", () => {
  let service: PlaneService;
  let configService: ConfigService;

  const mockConfig = {
    PLANE_API_URL: "https://api.plane.so",
    PLANE_API_KEY: "plane_api_test_key",
    PLANE_WORKSPACE_SLUG: "yield-studio-ok",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaneService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => mockConfig[key as keyof typeof mockConfig]),
          },
        },
      ],
    }).compile();

    service = module.get<PlaneService>(PlaneService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getStatus", () => {
    it("should return configured status when api key and slug are present", () => {
      const status = service.getStatus();
      expect(status.isConfigured).toBe(true);
      expect(status.workspaceSlug).toBe("yield-studio-ok");
    });
  });

  describe("getProjectIssues", () => {
    it("should fetch issues for a project", async () => {
      const mockIssues = [
        {
          id: "issue-1",
          name: "Issue 1",
          sequence_id: 10,
          priority: "high",
          state_detail: { name: "In Progress" },
        },
      ];

      jest.spyOn(service as any, "fetchPlaneAPI").mockResolvedValue(mockIssues);

      const result = await service.getProjectIssues("417c3e00-7395-4c5f-924b-ef9f4a0824ce");
      expect(result).toEqual(mockIssues);
    });

    it("should return fallback issues if API key is not configured", async () => {
      jest.spyOn(configService, "get").mockReturnValue("");
      const unconfiguredService = new PlaneService(configService);

      const result = await unconfiguredService.getProjectIssues("proj-1");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("name");
    });
  });

  describe("createProjectIssue", () => {
    it("should create an issue via fetchPlaneAPI", async () => {
      const newIssue = { id: "issue-new", name: "New Issue", priority: "medium" };
      jest.spyOn(service as any, "fetchPlaneAPI").mockResolvedValue(newIssue);

      const result = await service.createProjectIssue("417c3e00-7395-4c5f-924b-ef9f4a0824ce", {
        name: "New Issue",
        priority: "medium",
        description: "Test description",
      });

      expect(result).toEqual(newIssue);
    });
  });
});
