import { Test, TestingModule } from "@nestjs/testing";
import { InfraController } from "./infra.controller";
import { InfraService } from "./infra.service";

describe("InfraController", () => {
  let controller: InfraController;
  let service: InfraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfraController],
      providers: [
        {
          provide: InfraService,
          useValue: {
            getVpsStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InfraController>(InfraController);
    service = module.get<InfraService>(InfraService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return VPS status", async () => {
    const mockStatus = {
      cpuUsage: 45.2,
      freeRam: 2048,
      topProcesses: [
        { name: "node", cpu: 10.5, mem: 5.2 },
        { name: "docker", cpu: 2.1, mem: 1.1 },
      ],
    };

    jest.spyOn(service, "getVpsStatus").mockResolvedValue(mockStatus);

    const result = await controller.getVpsStatus();
    expect(result).toEqual(mockStatus);
    expect(service.getVpsStatus).toHaveBeenCalledTimes(1);
  });
});
