import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service.js";
import puppeteer from "puppeteer";
import { vi } from "vitest";

vi.mock("puppeteer");

describe("AppService", () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getMetadata", () => {
    it("should extract og tags successfully", async () => {
      const mockPage = {
        goto: vi.fn().mockResolvedValue(true),
        evaluate: vi.fn().mockResolvedValue({
          title: "Test Title",
          description: "Test Description",
          image: "https://test.com/image.png",
        }),
      };
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn().mockResolvedValue(true),
      };
      vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);

      const url = "https://example.com";
      const result = await service.getMetadata(url);

      expect(puppeteer.launch).toHaveBeenCalled();
      expect(mockBrowser.newPage).toHaveBeenCalled();
      expect(mockPage.goto).toHaveBeenCalledWith(url, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();

      expect(result).toEqual({
        title: "Test Title",
        description: "Test Description",
        image: "https://test.com/image.png",
        url: "https://example.com",
      });
    });

    it("should return null values on navigation failure (graceful degradation)", async () => {
      const mockPage = {
        goto: vi.fn().mockRejectedValue(new Error("Navigation timeout")),
      };
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn().mockResolvedValue(true),
      };
      vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);

      const url = "https://example.com";
      const result = await service.getMetadata(url);

      expect(mockPage.goto).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();

      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
        url: "https://example.com",
        error: "Navigation timeout",
      });
    });
  });
});
