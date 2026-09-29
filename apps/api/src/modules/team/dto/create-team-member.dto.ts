import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTeamMemberDto {
  @ApiProperty({ example: "member@yieldstudio.io" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "admin" })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: "active", enum: ["active", "offline", "pending"] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: "temporaryPassword123" })
  @IsString()
  @IsOptional()
  password?: string;
}
