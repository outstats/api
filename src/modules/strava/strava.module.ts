import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StravaToken } from "./entities/StravaToken.entity";
import { ConfigModule } from "@nestjs/config";
import stravaConfig from "src/config/strava.config";
import { StravaService } from "./strava.service";
import { StravaTokenRepository } from "./repositories/strava-token.repository";
import { StravaProfileRepository } from "./repositories/strava-profile.repository";
import { StravaProfile } from "./entities/StravaProfile.entity";
import { StravaActivity } from "./entities/StravaActivities.entity";
import { StravaController } from "./strava.controller";
import { StravaActivityRepository } from "./repositories/strava-activity.repository";
import { UsersModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([StravaToken, StravaProfile, StravaActivity]),
    ConfigModule.forFeature(stravaConfig),
    UsersModule
  ],
  controllers: [StravaController],
  providers: [StravaService, StravaTokenRepository, StravaProfileRepository, StravaActivityRepository],
  exports: [StravaService, StravaProfileRepository]
})

export class StravaModule {}