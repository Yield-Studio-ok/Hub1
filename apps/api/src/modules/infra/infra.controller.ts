import { Controller, Get } from "@nestjs/common";
import { InfraService } from "./infra.service";

@Controller("infra")
export class InfraController {
  constructor(private readonly infraService: InfraService) {}

  @Get("vps-status")
  async getVpsStatus() {
    return this.infraService.getVpsStatus();
  }
}
