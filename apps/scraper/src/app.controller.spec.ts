import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { BadRequestException } from "@nestjs/common";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: vitest.fn().mockReturnValue("Scraper service is running!"),
            scrape: vitest.fn(),
            getMetadata: vitest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe("root", () => {
    it('should return "Scraper service is running!"', () => {
      expect(appController.getHello()).toBe("Scraper service is running!");
    });
  });

  describe("metadata", () => {
    it("should throw BadRequestException if url is not provided", async () => {
      await expect(appController.getMetadata("")).rejects.toThrow(BadRequestException);
    });

    it("should call appService.getMetadata with the provided url", async () => {
      const url = "https://example.com";
      const mockResult = {
        title: "Example",
        description: "An example domain",
        image: "https://example.com/image.png",
        url,
      };
      vitest.mocked(appService.getMetadata).mockResolvedValue(mockResult);

      const result = await appController.getMetadata(url);

      expect(appService.getMetadata).toHaveBeenCalledWith(url);
      expect(result).toEqual(mockResult);
    });
  });
});
