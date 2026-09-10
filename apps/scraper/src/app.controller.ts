import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { AppService } from "./app.service.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("scrape")
  async scrape(@Query("url") url: string) {
    if (!url) {
      throw new BadRequestException("URL query parameter is required");
    }
    return this.appService.scrape(url);
  }

  @Get("metadata")
  async getMetadata(@Query("url") url: string) {
    if (!url) {
      throw new BadRequestException("URL query parameter is required");
    }
    return this.appService.getMetadata(url);
  }
}
