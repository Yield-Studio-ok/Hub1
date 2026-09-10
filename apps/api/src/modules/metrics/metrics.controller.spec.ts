import { Test, TestingModule } from "@nestjs/testing";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

describe("MetricsController", () => {
  let controller: MetricsController;
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            getDashboardMetrics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    service = module.get<MetricsService>(MetricsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getMetrics", () => {
    it("should return the formatted metrics dashboard", async () => {
      const mockMetrics = {
        totalUsers: 15,
        newUsersLast7Days: 3,
        usersPerDay: [],
      };

      jest.spyOn(service, "getDashboardMetrics").mockResolvedValue(mockMetrics);

      const result = await controller.getMetrics();

      expect(service.getDashboardMetrics).toHaveBeenCalled();
      expect(result).toEqual(mockMetrics);
    });
  });
});
