import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PlaneService } from "../plane/plane.service";

@Injectable()
export class TimerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planeService: PlaneService,
  ) {}

  async logTime(userEmail: string, ticketId: string, projectId: string, durationSeconds: number) {
    // Save to database
    const timeLog = await this.prisma.timeLog.create({
      data: {
        ticketId,
        projectId,
        durationSeconds,
        userEmail,
      },
    });

    // Send comment to Plane API
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const timeString = `${hours}h ${minutes}m`;
    const comment = `Logged ${timeString} of work.`;

    try {
      await this.planeService.addCommentToIssue(projectId, ticketId, comment);
    } catch (_error) {
      // We still return success if DB saved but Plane failed, or we can throw.
      // Let's throw for now to make sure the user knows it failed.
      throw new HttpException("Failed to sync with Plane API", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return timeLog;
  }
}
