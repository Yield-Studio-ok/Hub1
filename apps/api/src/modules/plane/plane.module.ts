import { Module } from "@nestjs/common";
import { PlaneService } from "./plane.service";
import { PlaneController } from "./plane.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [PlaneService],
  controllers: [PlaneController],
  exports: [PlaneService],
})
export class PlaneModule {}
