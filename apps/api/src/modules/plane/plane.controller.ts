import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { PlaneService } from "./plane.service";
import { AuthUser } from "../auth/auth.types";

@ApiTags("Plane")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("api/plane")
export class PlaneController {
  constructor(private readonly planeService: PlaneService) {}

  @Get("tickets")
  @ApiOperation({ summary: "Obtener los issues activos asignados al usuario en Plane" })
  async getTickets(@Request() req: { user: AuthUser }) {
    const userEmail = req.user.email;
    const tickets = await this.planeService.getActiveTicketsForUser(userEmail);
    return {
      success: true,
      data: tickets,
    };
  }

  @Post("worklog")
  @ApiOperation({ summary: "Registrar tiempo trabajado en un issue de Plane" })
  async logWork(
    @Request() req: { user: AuthUser },
    @Body() body: { ticketId: string; projectId: string; durationSeconds: number },
  ) {
    // Stub implementation to be handled later
    return {
      success: true,
      message: "Worklog received",
      data: body,
    };
  }
}
