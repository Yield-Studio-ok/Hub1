import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { CloudflareService } from "./cloudflare.service";
import { InternalServerErrorException } from "@nestjs/common";

describe("CloudflareService", () => {
  let service: CloudflareService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudflareService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "CLOUDFLARE_API_TOKEN") return "test-token";
              if (key === "CLOUDFLARE_ZONE_ID") return "test-zone-id";
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CloudflareService>(CloudflareService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should check health correctly", async () => {
    // Mock the internal client
    const getZoneSpy = jest.fn().mockResolvedValue({
      id: "test-zone-id",
      name: "example.com",
      status: "active",
    });

    (service as any).client = {
      zones: {
        get: getZoneSpy,
      },
    };

    const health = await service.checkHealth();
    expect(health.status).toBe("ok");
    expect(health.zone?.id).toBe("test-zone-id");
    expect(health.zone?.name).toBe("example.com");
    expect(getZoneSpy).toHaveBeenCalledWith({ zone_id: "test-zone-id" });
  });

  it("should return error on health check failure", async () => {
    const getZoneSpy = jest.fn().mockRejectedValue(new Error("API Error"));

    (service as any).client = {
      zones: {
        get: getZoneSpy,
      },
    };

    const health = await service.checkHealth();
    expect(health.status).toBe("error");
    expect(health.error).toBe("API Error");
  });

  describe("createSubdomain", () => {
    it("should create an A record if target is an IP address", async () => {
      const createRecordSpy = jest.fn().mockResolvedValue({});
      (service as any).client = {
        dns: {
          records: {
            create: createRecordSpy,
          },
        },
      };

      const result = await service.createSubdomain("test1", "192.168.1.1");
      expect(result).toBe(true);
      expect(createRecordSpy).toHaveBeenCalledWith({
        zone_id: "test-zone-id",
        name: "test1",
        content: "192.168.1.1",
        type: "A",
        proxied: true,
        ttl: 1,
      });
    });

    it("should create a CNAME record if target is a domain", async () => {
      const createRecordSpy = jest.fn().mockResolvedValue({});
      (service as any).client = {
        dns: {
          records: {
            create: createRecordSpy,
          },
        },
      };

      const result = await service.createSubdomain("test2", "example.com");
      expect(result).toBe(true);
      expect(createRecordSpy).toHaveBeenCalledWith({
        zone_id: "test-zone-id",
        name: "test2",
        content: "example.com",
        type: "CNAME",
        proxied: true,
        ttl: 1,
      });
    });

    it("should handle error gracefully and return true if record already exists (code 81057)", async () => {
      const createRecordSpy = jest.fn().mockRejectedValue({
        errors: [{ code: 81057 }],
      });
      (service as any).client = {
        dns: {
          records: {
            create: createRecordSpy,
          },
        },
      };

      const result = await service.createSubdomain("test3", "example.com");
      expect(result).toBe(true);
    });

    it("should handle error gracefully and return true if message contains 'already exists'", async () => {
      const createRecordSpy = jest.fn().mockRejectedValue({
        message: "DNS record already exists",
      });
      (service as any).client = {
        dns: {
          records: {
            create: createRecordSpy,
          },
        },
      };

      const result = await service.createSubdomain("test4", "example.com");
      expect(result).toBe(true);
    });

    it("should throw InternalServerErrorException for other errors", async () => {
      const createRecordSpy = jest.fn().mockRejectedValue({
        message: "Some unknown API error",
      });
      (service as any).client = {
        dns: {
          records: {
            create: createRecordSpy,
          },
        },
      };

      await expect(service.createSubdomain("test5", "example.com")).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

describe("CloudflareService Error Handling", () => {
  it("should throw error if API token is missing", async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CloudflareService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === "CLOUDFLARE_ZONE_ID") return "test-zone-id";
                return null;
              }),
            },
          },
        ],
      }).compile();
      module.get<CloudflareService>(CloudflareService);
      fail("Should have thrown an exception");
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect((e as any).message).toBe("CLOUDFLARE_API_TOKEN is not configured.");
    }
  });

  it("should throw error if Zone ID is missing", async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CloudflareService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === "CLOUDFLARE_API_TOKEN") return "test-token";
                return null;
              }),
            },
          },
        ],
      }).compile();
      module.get<CloudflareService>(CloudflareService);
      fail("Should have thrown an exception");
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect((e as any).message).toBe("CLOUDFLARE_ZONE_ID is not configured.");
    }
  });
});
