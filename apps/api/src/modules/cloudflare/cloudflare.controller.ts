import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CloudflareService } from "./cloudflare.service";

@ApiTags("Cloudflare")
@Controller("cloudflare")
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Get("health")
  @ApiOperation({ summary: "Check Cloudflare API health and credentials" })
  @ApiResponse({ status: 200, description: "Cloudflare connection is healthy" })
  @ApiResponse({ status: 500, description: "Cloudflare connection failed" })
  async checkHealth() {
    const health = await this.cloudflareService.checkHealth();

    if (health.status === "error") {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Cloudflare health check failed",
          details: health.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Cloudflare API connection is healthy",
      data: health.zone,
    };
  }
}
