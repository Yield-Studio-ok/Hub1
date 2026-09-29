import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

const mockMember = {
  id: "member-123",
  name: "Jane Doe",
  email: "jane@yieldstudio.io",
  role: "admin",
  status: "active",
  avatar: "https://example.com/avatar.jpg",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("TeamController", () => {
  let controller: TeamController;
  let service: TeamService;

  const mockTeamService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all team members", async () => {
      mockTeamService.findAll.mockResolvedValue([mockMember]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockMember]);
    });
  });

  describe("create", () => {
    it("should create or invite a team member", async () => {
      mockTeamService.create.mockResolvedValue(mockMember);
      const dto = {
        email: "jane@yieldstudio.io",
        name: "Jane Doe",
        role: "admin",
        status: "active",
        avatar: "https://example.com/avatar.jpg",
      };

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMember);
    });
  });

  describe("update", () => {
    it("should update a team member by id", async () => {
      const updatedMember = { ...mockMember, role: "member", status: "offline" };
      mockTeamService.update.mockResolvedValue(updatedMember);
      const dto = { role: "member", status: "offline" };

      const result = await controller.update("member-123", dto);

      expect(service.update).toHaveBeenCalledWith("member-123", dto);
      expect(result).toEqual(updatedMember);
    });
  });

  describe("remove", () => {
    it("should remove a team member by id", async () => {
      mockTeamService.remove.mockResolvedValue(mockMember);

      const result = await controller.remove("member-123");

      expect(service.remove).toHaveBeenCalledWith("member-123");
      expect(result).toEqual(mockMember);
    });
  });
});
