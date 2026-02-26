import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StravaToken } from "./entities/StravaToken.entity";
import { ConfigModule } from "@nestjs/config";
import stravaConfig from "src/config/strava.config";
import { StravaService } from "./strava.service";
import { StravaTokenRepository } from "./repositories/strava-token.repository";
import { StravaProfileRepository } from "./repositories/strava-profile.repository";
import { StravaProfile } from "./entities/StravaProfile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([StravaToken, StravaProfile]),
    ConfigModule.forFeature(stravaConfig)
  ],
  providers: [StravaService, StravaTokenRepository, StravaProfileRepository],
  exports: [StravaService, StravaProfileRepository]
})

export class StravaModule {}