import { Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/CurrentUser.decorator";
import { User } from "../users/entities/User.entity";
import { ActivityStats } from "./repositories/strava-activity.repository";
import { JwtAuthGuard } from "src/common/guards/jwtAuth.guard";
import { StravaService } from "./strava.service";
import { StravaActivity } from "./entities/StravaActivities.entity";

@Controller('strava')
@UseGuards(JwtAuthGuard)
export class StravaController {
  constructor(
    private readonly stravaService: StravaService
  ) {}


  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async sync(@CurrentUser() user: User): Promise<{ synced: number }> {
    return this.stravaService.syncActivities(user.id)
  }


  @Get('stats')
  getStats(@CurrentUser() user: User): Promise<ActivityStats> {
    return this.stravaService.getActivityStats(user.id)
  }


  @Get('activities')
  getActivities(
    @CurrentUser() user: User,
    @Query('limit') limit = 30,
    @Query('offset') offset = 0
  ): Promise<StravaActivity[]> {
    return this.stravaService.getActivities(user.id, Number(limit), Number(offset))
  }
}