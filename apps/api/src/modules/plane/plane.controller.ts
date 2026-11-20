import { Controller, Get, Post, Param, Body, UseGuards, Request } from "@nestjs/common";
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

  @Get("status")
  @ApiOperation({ summary: "Obtener estado de configuración de Plane" })
  getStatus() {
    const status = this.planeService.getStatus();
    return {
      success: true,
      data: status,
    };
  }

  @Get("projects/:projectId/issues")
  @ApiOperation({ summary: "Obtener las tareas de un proyecto en Plane" })
  async getProjectIssues(@Param("projectId") projectId: string) {
    const issues = await this.planeService.getProjectIssues(projectId);
    return {
      success: true,
      data: issues,
    };
  }

  @Post("projects/:projectId/issues")
  @ApiOperation({ summary: "Crear una tarea en un proyecto de Plane" })
  async createProjectIssue(
    @Param("projectId") projectId: string,
    @Body() body: { name: string; priority?: string; description?: string },
  ) {
    const issue = await this.planeService.createProjectIssue(projectId, body);
    return {
      success: true,
      data: issue,
    };
  }
}
