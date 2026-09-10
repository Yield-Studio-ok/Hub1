import { Controller, Get } from "@nestjs/common";
import { MetricsService, DashboardMetrics } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(): Promise<DashboardMetrics> {
    return this.metricsService.getDashboardMetrics();
  }
}
