import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NeonService {
  private readonly baseUrl = "https://console.neon.tech/api/v2";

  constructor(private readonly configService: ConfigService) {}

  async getProjectConsumption(projectId: string): Promise<any> {
    const apiKey = this.configService.get<string>("NEON_API_KEY");

    if (!apiKey) {
      throw new InternalServerErrorException("NEON_API_KEY is not defined");
    }

    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Failed to fetch Neon project consumption: ${response.statusText}`,
      );
    }

    return response.json();
  }
}
