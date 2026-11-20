import { Test, TestingModule } from "@nestjs/testing";
import { PlaneController } from "./plane.controller";
import { PlaneService } from "./plane.service";
import { AuthGuard } from "../auth/auth.guard";
import { ExecutionContext } from "@nestjs/common";

describe("PlaneController", () => {
  let controller: PlaneController;
  let service: PlaneService;

  const mockPlaneService = {
    getProjects: jest.fn(),
    getActiveTicketsForUser: jest.fn(),
    getStatus: jest.fn(),
    getProjectIssues: jest.fn(),
    createProjectIssue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaneController],
      providers: [
        {
          provide: PlaneService,
          useValue: mockPlaneService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { email: "test@example.com" };
          return true;
        },
      })
      .compile();

    controller = module.get<PlaneController>(PlaneController);
    service = module.get<PlaneService>(PlaneService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getProjects", () => {
    it("should return a list of projects", async () => {
      const mockProjects = [{ id: "p1", name: "Project 1" }];
      mockPlaneService.getProjects.mockResolvedValue(mockProjects);

      const req = { user: { email: "test@example.com" } };
      const result = await controller.getProjects(req as any);

      expect(result).toEqual({
        success: true,
        data: mockProjects,
      });
      expect(service.getProjects).toHaveBeenCalled();
    });
  });

  describe("getTickets", () => {
    it("should return a list of tickets for the user", async () => {
      const mockTickets = [{ id: "t1", name: "Ticket 1" }];
      mockPlaneService.getActiveTicketsForUser.mockResolvedValue(mockTickets);

      const req = { user: { email: "test@example.com" } };
      const result = await controller.getTickets(req as any);

      expect(result).toEqual({
        success: true,
        data: mockTickets,
      });
      expect(service.getActiveTicketsForUser).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("getStatus", () => {
    it("should return the plane configuration status", () => {
      const mockStatus = {
        isConfigured: true,
        workspaceSlug: "yield-studio-ok",
        apiUrl: "https://api.plane.so",
      };
      mockPlaneService.getStatus.mockReturnValue(mockStatus);

      const result = controller.getStatus();
      expect(result).toEqual({ success: true, data: mockStatus });
      expect(mockPlaneService.getStatus).toHaveBeenCalled();
    });
  });

  describe("getProjectIssues", () => {
    it("should return project issues", async () => {
      const mockIssues = [{ id: "issue-1", name: "Issue 1" }];
      mockPlaneService.getProjectIssues.mockResolvedValue(mockIssues);

      const result = await controller.getProjectIssues("proj-1");
      expect(result).toEqual({ success: true, data: mockIssues });
      expect(mockPlaneService.getProjectIssues).toHaveBeenCalledWith("proj-1");
    });
  });

  describe("createProjectIssue", () => {
    it("should create a project issue", async () => {
      const newIssue = { id: "issue-new", name: "New Issue" };
      mockPlaneService.createProjectIssue.mockResolvedValue(newIssue);

      const result = await controller.createProjectIssue("proj-1", {
        name: "New Issue",
        priority: "high",
        description: "Test description",
      });

      expect(result).toEqual({ success: true, data: newIssue });
      expect(mockPlaneService.createProjectIssue).toHaveBeenCalledWith("proj-1", {
        name: "New Issue",
        priority: "high",
        description: "Test description",
      });
    });
  });
});
