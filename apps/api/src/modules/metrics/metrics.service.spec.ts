import { Test, TestingModule } from "@nestjs/testing";
import { MetricsService } from "./metrics.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("MetricsService", () => {
  let service: MetricsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getDashboardMetrics", () => {
    it("should return correct payload format", async () => {
      // Mock prisma count
      // For total users
      jest.spyOn(prisma.user, "count").mockResolvedValueOnce(100);
      // For new users in last 7 days
      jest.spyOn(prisma.user, "count").mockResolvedValueOnce(15);

      const result = await service.getDashboardMetrics();

      expect(prisma.user.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalUsers: 100,
        newUsersLast7Days: 15,
      });
    });
  });
});
