import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@user.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsOptional()
  name?: string;
}
