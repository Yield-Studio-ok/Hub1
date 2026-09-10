import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Cloudflare from "cloudflare";

@Injectable()
export class CloudflareService {
  private readonly client: Cloudflare;
  private readonly zoneId: string;

  constructor(private readonly configService: ConfigService) {
    const apiToken = this.configService.get<string>("CLOUDFLARE_API_TOKEN");
    const zoneId = this.configService.get<string>("CLOUDFLARE_ZONE_ID");

    if (!apiToken) {
      throw new InternalServerErrorException("CLOUDFLARE_API_TOKEN is not configured.");
    }

    if (!zoneId) {
      throw new InternalServerErrorException("CLOUDFLARE_ZONE_ID is not configured.");
    }

    this.zoneId = zoneId;
    this.client = new Cloudflare({ apiToken });
  }

  /**
   * Health check method that attempts to retrieve zone information
   * to validate that the provided token and zone ID are correct.
   */
  async checkHealth(): Promise<{ status: "ok" | "error"; zone?: any; error?: string }> {
    try {
      // List zones or get specific zone to validate token
      const response = await this.client.zones.get({ zone_id: this.zoneId });

      return {
        status: "ok",
        zone: {
          id: response.id,
          name: response.name,
          status: response.status,
        },
      };
    } catch (error: any) {
      return {
        status: "error",
        error: error.message || "Failed to communicate with Cloudflare API",
      };
    }
  }

  // Example method for future expansion
  async getZoneDetails() {
    return this.client.zones.get({ zone_id: this.zoneId });
  }

  /**
   * Creates a subdomain DNS record.
   * Uses 'A' record if target is an IP address, otherwise 'CNAME'.
   *
   * Idempotency: Returns true if the subdomain already exists.
   */
  async createSubdomain(name: string, target: string): Promise<boolean> {
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const recordType = isIp ? "A" : "CNAME";

    try {
      await this.client.dns.records.create({
        zone_id: this.zoneId,
        name,
        content: target,
        type: recordType,
        proxied: true,
        ttl: 1, // 1 is 'automatic' in Cloudflare
      } as any);
      return true;
    } catch (error: any) {
      // Check if error indicates that the record already exists (Cloudflare DNS error code 81057)
      const isAlreadyExistsError =
        error?.errors?.some((err: any) => err.code === 81057) ||
        error?.message?.toLowerCase().includes("already exists");

      if (isAlreadyExistsError) {
        return true;
      }

      throw new InternalServerErrorException(
        `Failed to create subdomain: ${error.message || "Unknown error"}`,
      );
    }
  }
}
