import { IsOptional, IsString } from "class-validator";

export class StravaCallbackDto {
  @IsString()
  @IsOptional()
  code?: string

  @IsString()
  @IsOptional()
  error?: string
  
  @IsString()
  @IsOptional()
  scope?: string

  @IsString()
  @IsOptional()
  state?: string
}