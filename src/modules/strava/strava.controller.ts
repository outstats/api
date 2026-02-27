import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, Res, UseGuards } from "@nestjs/common"
import { CurrentUser } from "src/common/decorators/CurrentUser.decorator"
import { User } from "../users/entities/User.entity"
import { ActivityStats } from "./repositories/strava-activity.repository"
import { JwtAuthGuard } from "src/common/guards/jwtAuth.guard"
import { StravaService } from "./strava.service"
import { StravaActivity } from "./entities/StravaActivities.entity"
import stravaConfig from "src/config/strava.config"
import { ConfigType } from "@nestjs/config"
import { StravaWebhookEvent } from "./types/strava.types"
import { Response } from "express"

@Controller('strava')
export class StravaController {
  constructor(
    private readonly stravaService: StravaService,
    @Inject(stravaConfig.KEY)
    private readonly config: ConfigType<typeof stravaConfig>
  ) {}


  // Route pour montrer à strava que notre URL webhook est fonctionnelle
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
    @Res() res: Response
  ) {
    const isValid = mode === 'subscribe' && verifyToken === this.config.webhookVerifyToken

    if (!isValid) {
      return res.status(403).json({ 
        error: 'Webhook verification failed',
        message: `Invalid token or mode. Got mode='${mode}', token='${verifyToken?.substring(0, 5)}...'`
      })
    }

    return res.status(200).json({ 'hub.challenge': challenge })
  }


  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  receiveWebhookEvent(@Body() event: StravaWebhookEvent): void {
    this.stravaService.handleWebhookEvent(event)
  }


  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser() user: User): Promise<ActivityStats> {
    return this.stravaService.getActivityStats(user.id)
  }


  @Get('activities')
  @UseGuards(JwtAuthGuard)
  getActivities(
    @CurrentUser() user: User,
    @Query('limit') limit = 30,
    @Query('offset') offset = 0
  ): Promise<StravaActivity[]> {
    return this.stravaService.getActivities(user.id, Number(limit), Number(offset))
  }
}