import { Test, TestingModule } from "@nestjs/testing";
import { NeonController } from "./neon.controller";
import { NeonService } from "./neon.service";

describe("NeonController", () => {
  let controller: NeonController;
  let service: NeonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeonController],
      providers: [
        {
          provide: NeonService,
          useValue: {
            getProjectConsumption: jest.fn().mockResolvedValue({
              project: {
                consumption: {
                  data_storage_bytes_hour: 1024,
                  compute_time_seconds: 3600,
                },
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<NeonController>(NeonController);
    service = module.get<NeonService>(NeonService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getConsumption", () => {
    it("should return consumption data", async () => {
      const result = await controller.getConsumption("test-id");
      expect(result).toEqual({
        project: {
          consumption: {
            data_storage_bytes_hour: 1024,
            compute_time_seconds: 3600,
          },
        },
      });
      expect(service.getProjectConsumption).toHaveBeenCalledWith("test-id");
    });
  });
});
