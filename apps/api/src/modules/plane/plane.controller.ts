import { Controller, Get, UseGuards, Request } from "@nestjs/common";
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

  @Get("projects")
  @ApiOperation({ summary: "Obtener los proyectos de Plane" })
  async getProjects(@Request() _req: { user: AuthUser }) {
    const projects = await this.planeService.getProjects();
    return {
      success: true,
      data: projects,
    };
  }

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
}
