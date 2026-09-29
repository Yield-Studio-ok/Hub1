import { Test, TestingModule } from "@nestjs/testing";
import { TeamService } from "./team.service";
import { PrismaService } from "../../prisma/prisma.service";
import { NotFoundException, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword123"),
}));

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

describe("TeamService", () => {
  let service: TeamService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return a list of team members with expected fields", async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockMember]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual([mockMember]);
    });
  });

  describe("create", () => {
    it("should create a new team member with provisional hashed password", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockMember);

      const dto = {
        email: "jane@yieldstudio.io",
        name: "Jane Doe",
        role: "admin",
        status: "active",
        avatar: "https://example.com/avatar.jpg",
      };

      const result = await service.create(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          name: dto.name,
          role: dto.role,
          status: dto.status,
          avatar: dto.avatar,
          password: "hashedPassword123",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockMember);
    });

    it("should use default role and status if not provided", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockMember,
        role: "user",
        status: "active",
      });

      const dto = {
        email: "newmember@yieldstudio.io",
      };

      await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "newmember@yieldstudio.io",
            role: "user",
            status: "active",
            password: "hashedPassword123",
          }),
        }),
      );
    });

    it("should throw ConflictException if member with email already exists", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockMember);

      const dto = {
        email: "jane@yieldstudio.io",
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a team member role, status or name", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockMember);
      const updatedMember = {
        ...mockMember,
        name: "Jane Updated",
        role: "member",
        status: "offline",
      };
      mockPrismaService.user.update.mockResolvedValue(updatedMember);

      const dto = {
        name: "Jane Updated",
        role: "member",
        status: "offline",
      };

      const result = await service.update("member-123", dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "member-123" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "member-123" },
        data: {
          name: "Jane Updated",
          role: "member",
          status: "offline",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updatedMember);
    });

    it("should throw NotFoundException if member to update is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update("non-existent-id", { status: "pending" })).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should delete a team member by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockMember);
      mockPrismaService.user.delete.mockResolvedValue(mockMember);

      const result = await service.remove("member-123");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "member-123" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "member-123" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockMember);
    });

    it("should throw NotFoundException if member to remove is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove("non-existent-id")).rejects.toThrow(NotFoundException);
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
