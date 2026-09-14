import { Controller, Get, Param } from "@nestjs/common";
import { NeonService } from "./neon.service";

// Assuming there's a guard to protect this endpoint, but for now we keep it open or use a dummy guard if none exists.
@Controller("neon")
export class NeonController {
  constructor(private readonly neonService: NeonService) {}

  @Get("projects/:projectId/consumption")
  async getConsumption(@Param("projectId") projectId: string) {
    return this.neonService.getProjectConsumption(projectId);
  }
}
