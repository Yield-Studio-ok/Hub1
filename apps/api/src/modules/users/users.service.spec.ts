import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../../prisma/prisma.service";
import { NotFoundException, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));

const mockUser = {
  id: "user-id",
  email: "test@example.com",
  password: "hashedPassword",
  name: "Test User",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should successfully create a user", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const dto = { email: "test@example.com", password: "password123" };
      const result = await service.create(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          password: "hashedPassword",
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw ConflictException if user already exists", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const dto = { email: "test@example.com", password: "password123" };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe("findOne", () => {
    it("should return a user if found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne("user-id");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-id" } });
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundException if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne("non-existent-id")).rejects.toThrow(NotFoundException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "non-existent-id" } });
    });
  });

  describe("update", () => {
    it("should successfully update a user", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, name: "Updated Name" });

      const dto = { name: "Updated Name" };
      const result = await service.update("user-id", dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-id" } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-id" },
        data: dto,
      });
      expect(result.name).toEqual("Updated Name");
    });

    it("should hash password if password is provided in update", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, password: "hashedPassword" });

      const dto = { password: "newPassword123" };
      await service.update("user-id", dto);

      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-id" },
        data: { password: "hashedPassword" },
      });
    });

    it("should throw NotFoundException if user to update is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.update("non-existent-id", {})).rejects.toThrow(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should successfully remove a user", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove("user-id");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-id" } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "user-id" } });
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundException if user to remove is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.remove("non-existent-id")).rejects.toThrow(NotFoundException);
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
