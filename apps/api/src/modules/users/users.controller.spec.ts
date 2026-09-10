import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

const mockUser = {
  id: "user-id",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call usersService.create and return the result", async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      const dto = { email: "test@example.com", password: "password123" };

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe("findAll", () => {
    it("should call usersService.findAll and return the result", async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe("findOne", () => {
    it("should call usersService.findOne and return the result", async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne("user-id");

      expect(service.findOne).toHaveBeenCalledWith("user-id");
      expect(result).toEqual(mockUser);
    });
  });

  describe("update", () => {
    it("should call usersService.update and return the result", async () => {
      const updatedUser = { ...mockUser, name: "Updated" };
      mockUsersService.update.mockResolvedValue(updatedUser);
      const dto = { name: "Updated" };

      const result = await controller.update("user-id", dto);

      expect(service.update).toHaveBeenCalledWith("user-id", dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove", () => {
    it("should call usersService.remove and return the result", async () => {
      mockUsersService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove("user-id");

      expect(service.remove).toHaveBeenCalledWith("user-id");
      expect(result).toEqual(mockUser);
    });
  });
});
