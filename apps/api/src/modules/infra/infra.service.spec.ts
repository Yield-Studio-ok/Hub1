import { Test, TestingModule } from "@nestjs/testing";
import { InfraService } from "./infra.service";
import * as si from "systeminformation";

jest.mock("systeminformation");

describe("InfraService", () => {
  let service: InfraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfraService],
    }).compile();

    service = module.get<InfraService>(InfraService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get VPS status with CPU, RAM and top 5 processes", async () => {
    const mockCurrentLoad = { currentLoad: 35.5 };
    const mockMem = { free: 4294967296 }; // 4GB
    const mockProcesses = {
      list: [
        { name: "process1", cpu: 15, mem: 5 },
        { name: "process2", cpu: 12, mem: 4 },
        { name: "process3", cpu: 10, mem: 3 },
        { name: "process4", cpu: 8, mem: 2 },
        { name: "process5", cpu: 5, mem: 1 },
        { name: "process6", cpu: 2, mem: 0.5 },
      ],
    };

    (si.currentLoad as jest.Mock).mockResolvedValue(mockCurrentLoad);
    (si.mem as jest.Mock).mockResolvedValue(mockMem);
    (si.processes as jest.Mock).mockResolvedValue(mockProcesses);

    const result = await service.getVpsStatus();

    expect(si.currentLoad).toHaveBeenCalled();
    expect(si.mem).toHaveBeenCalled();
    expect(si.processes).toHaveBeenCalled();

    expect(result).toEqual({
      cpuUsage: 35.5,
      freeRam: 4096, // in MB
      topProcesses: [
        { name: "process1", cpu: 15, mem: 5 },
        { name: "process2", cpu: 12, mem: 4 },
        { name: "process3", cpu: 10, mem: 3 },
        { name: "process4", cpu: 8, mem: 2 },
        { name: "process5", cpu: 5, mem: 1 },
      ],
    });
  });
});
