import { Module } from "@nestjs/common";
import { NeonService } from "./neon.service";
import { NeonController } from "./neon.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [NeonController],
  providers: [NeonService],
  exports: [NeonService],
})
export class NeonModule {}
