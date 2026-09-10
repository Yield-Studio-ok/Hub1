import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CloudflareService } from "./cloudflare.service";
import { CloudflareController } from "./cloudflare.controller";

@Module({
  imports: [ConfigModule],
  controllers: [CloudflareController],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
