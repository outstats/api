import { BadRequestException, Injectable } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt'
import { StravaService } from "../strava/strava.service"
import { UsersService } from "../users/user.service"
import { User } from "../users/entities/User.entity"

@Injectable()
export class AuthService {
  constructor(
    private readonly stravaService: StravaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}


  getStravaAuthorizationUrl(scope?: string): string {
    return this.stravaService.getAuthorizationUrl(scope)
  }


  async handleStravaCallback(code: string): Promise<{ accessToken: string; user: User }> {
    const tokenResponse = await this.stravaService.getTokens(code)

    if (!tokenResponse.athlete) {
      throw new BadRequestException(`Missing athlete profile in strava token res`)
    }

    let user = await this.usersService.findByStravaAthleteId(tokenResponse.athlete.id)

    if (!user) {
      user = await this.usersService.create()
    }

    await this.stravaService.upsertProfile(user, tokenResponse.athlete)
    await this.stravaService.saveTokens(user.id, tokenResponse)

    const fullUser = await this.usersService.findById(user.id)
    const accessToken = this.jwtService.sign({ sub: user.id })

    await this.stravaService.initialSyncIfNeeded(user.id)

    return { accessToken, user: fullUser! }
  }


  async logout(userId: number): Promise<void> {
    await this.stravaService.revokeToken(userId)
  }
}