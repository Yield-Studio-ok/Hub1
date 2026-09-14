import { Module } from "@nestjs/common";
import { TimerController } from "./timer.controller";
import { TimerService } from "./timer.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { PlaneModule } from "../plane/plane.module";

@Module({
  imports: [PrismaModule, PlaneModule],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService],
})
export class TimerModule {}
