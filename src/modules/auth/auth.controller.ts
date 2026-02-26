import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import type { Response } from "express"
import { StravaCallbackDto } from "../strava/dto/stravaCallback.dto"
import { JwtAuthGuard } from "src/common/guards/jwtAuth.guard"
import { User } from "../users/entities/User.entity"
import { CurrentUser } from "src/common/decorators/CurrentUser.decorator"

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}


  @Get('strava')
  redirectToStrava(@Res() res: Response): void {
    const url = this.authService.getStravaAuthorizationUrl()
    res.redirect(url)
  }


  @Get('strava/callback') 
  async stravaCallback(@Query() query: StravaCallbackDto) {
    if (query.error) {
      throw new BadRequestException(`Strava authorization refused: ${query.error}`)
    }

    if (!query.code) {
      throw new BadRequestException(`No code oauth in strava callback`)
    }

    const { accessToken, user } = await this.authService.handleStravaCallback(query.code)

    return {
      accessToken,
      user: {
        id: user.id,   
        createdAt: user.createdAt,

        strava: {
          stravaAthleteId: user.stravaProfile.athleteId,
          stravaFirstName: user.stravaProfile.firstName,
          stravaLastName: user.stravaProfile.lastName,
          stravaSummit: user.stravaProfile.summit,
          stravaCity: user.stravaProfile.city,
          stravaState: user.stravaProfile.state,
          stravaCountry: user.stravaProfile.country,
          stravaProfilePicture: user.stravaProfile.profilePicture,
          stravaCreatedAt: user.stravaProfile.athleteCreatedAt, 
        }
      }
    }
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: User): Promise<void> {
    await this.authService.logout(user.id)
  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,   
      createdAt: user.createdAt,

      strava: {
        stravaAthleteId: user.stravaProfile.athleteId,
        stravaFirstName: user.stravaProfile.firstName,
        stravaLastName: user.stravaProfile.lastName,
        stravaSummit: user.stravaProfile.summit,
        stravaCity: user.stravaProfile.city,
        stravaState: user.stravaProfile.state,
        stravaCountry: user.stravaProfile.country,
        stravaProfilePicture: user.stravaProfile.profilePicture,
        stravaCreatedAt: user.stravaProfile.athleteCreatedAt, 
      }
    }
  }
}