import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TeamService } from "./team.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("team")
@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: "Get all team members" })
  @ApiResponse({ status: 200, description: "Return all team members." })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a team member by ID" })
  @ApiResponse({ status: 200, description: "Return the team member." })
  @ApiResponse({ status: 404, description: "Team member not found." })
  findOne(@Param("id") id: string) {
    return this.teamService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create or invite a new team member" })
  @ApiResponse({
    status: 201,
    description: "The team member has been successfully created.",
  })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists.",
  })
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamService.create(createTeamMemberDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a team member" })
  @ApiResponse({
    status: 200,
    description: "The team member has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Team member not found." })
  update(@Param("id") id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamService.update(id, updateTeamMemberDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a team member" })
  @ApiResponse({
    status: 200,
    description: "The team member has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Team member not found." })
  remove(@Param("id") id: string) {
    return this.teamService.remove(id);
  }
}
