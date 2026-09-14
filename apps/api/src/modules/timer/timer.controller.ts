import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { TimerService } from "./timer.service";
import { AuthUser } from "../auth/auth.types";

@ApiTags("Timer")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("api/timer")
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post("log")
  @ApiOperation({ summary: "Log time tracked for a ticket" })
  async logTime(
    @Request() req: { user: AuthUser },
    @Body() body: { ticketId: string; projectId: string; durationSeconds: number },
  ) {
    const result = await this.timerService.logTime(
      req.user.email,
      body.ticketId,
      body.projectId,
      body.durationSeconds,
    );
    return {
      success: true,
      data: result,
    };
  }
}
