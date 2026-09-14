import { Test, TestingModule } from "@nestjs/testing";
import { NeonService } from "./neon.service";
import { ConfigService } from "@nestjs/config";

describe("NeonService", () => {
  let service: NeonService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NeonService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("test-api-key"),
          },
        },
      ],
    }).compile();

    service = module.get<NeonService>(NeonService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getProjectConsumption", () => {
    it("should fetch consumption data successfully", async () => {
      const mockResponse = {
        project: {
          consumption: {
            data_storage_bytes_hour: 1024,
            compute_time_seconds: 3600,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const projectId = "test-project-id";
      const result = await service.getProjectConsumption(projectId);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://console.neon.tech/api/v2/projects/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer test-api-key`,
            "Content-Type": "application/json",
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      const projectId = "invalid-id";
      await expect(service.getProjectConsumption(projectId)).rejects.toThrow(
        "Failed to fetch Neon project consumption: Not Found",
      );
    });

    it("should throw an error if API key is missing", async () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);

      const projectId = "test-id";
      await expect(service.getProjectConsumption(projectId)).rejects.toThrow(
        "NEON_API_KEY is not defined",
      );
    });
  });
});
