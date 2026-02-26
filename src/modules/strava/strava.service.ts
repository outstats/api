import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import type { ConfigType } from "@nestjs/config"
import { StravaTokenRepository } from "./repositories/strava-token.repository"
import { StravaAthleteProfile, StravaTokenResponse } from "./types/strava.types"
import { StravaToken } from "./entities/StravaToken.entity"
import stravaConfig from "src/config/strava.config"
import axios from "axios"
import { StravaProfileRepository } from "./repositories/strava-profile.repository"
import { User } from "../users/entities/User.entity"
import { StravaProfile } from "./entities/StravaProfile.entity"

const REFRESH_MARGIN_SECONDS = 5 * 60

@Injectable()
export class StravaService {
  private readonly logger = new Logger(StravaService.name)

  constructor(
    @Inject(stravaConfig.KEY)
    private readonly config: ConfigType<typeof stravaConfig>,
    private readonly stravaTokenRepository: StravaTokenRepository,
    private readonly stravaProfileRepository: StravaProfileRepository
  ) {}


  async upsertProfile(user: User, athlete: StravaAthleteProfile): Promise<StravaProfile> {
    let profile = await this.stravaProfileRepository.findByUserId(user.id)

    if (!profile) {
      profile = this.stravaProfileRepository.create({
        athleteId: athlete.id,
        user: { id: user.id } as any
      })
    }

    profile.firstName = athlete.firstname
    profile.lastName = athlete.lastname
    profile.city = athlete.city
    profile.state = athlete.state
    profile.country = athlete.country
    profile.sex = athlete.sex
    profile.summit = athlete.summit
    profile.profilePicture = athlete.profile
    profile.athleteCreatedAt = athlete.created_at

    return this.stravaProfileRepository.save(profile)
  }


  getAuthorizationUrl(scope = 'read,activity:read_all'): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId!,
      redirect_uri: this.config.redirectUri!,
      response_type: 'code',
      approval_prompt: 'auto',
      scope
    })

    return `${this.config.authorizeUrl}?${params.toString()}`
  }


  async getTokens(code: string): Promise<StravaTokenResponse> {
    try {
      const { data } = await axios.post<StravaTokenResponse>(this.config.tokenUrl, {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code'
      })
      return data

    } catch (e) {
      this.logger.error(`Error during strava echange code`, e?.response?.data)
      throw new UnauthorizedException(`Invalid or expired strava code`)
    }
  }


  async saveTokens(
    userId: number,
    data: Omit<StravaTokenResponse, 'athlete'>
  ): Promise<StravaToken> {
    let token = await this.stravaTokenRepository.findByUserId(userId)

    if (!token) {
      token = this.stravaTokenRepository.create({ user: { id: userId } as any })
    }

    token.accessToken = data.access_token
    token.refreshToken = data.refresh_token
    token.expiresAt = data.expires_at
    token.tokenType = data.token_type

    return this.stravaTokenRepository.save(token)
  }


  isTokenExpired(token: StravaToken): boolean {
    const nowInSeconds = Math.floor(Date.now() / 1000)
    return Number(token.expiresAt) < nowInSeconds + REFRESH_MARGIN_SECONDS
  }


  async refreshAccessToken(token: StravaToken): Promise<StravaToken> {
    this.logger.log(`Refresh strava token for user id=${token.user.id}`)

    try {
      const { data } = await axios.post<StravaTokenResponse>(this.config.tokenUrl, {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: token.refreshToken,
        grant_type: 'refresh_token'
      })

      token.accessToken = data.access_token
      token.refreshToken = data.refresh_token
      token.expiresAt = data.expires_at

      return this.stravaTokenRepository.save(token)

    } catch (e) {
      this.logger.error(`Error during strava token refresh`, e?.response?.data)
      throw new UnauthorizedException(`Failed to refresh strava token`)
    }
  }


  async getValidToken(userId: number): Promise<StravaToken> {
    const token = await this.stravaTokenRepository.findByUserId(userId)
    
    if (!token) {
      throw new UnauthorizedException(`No token found for user id=${userId}`)
    }

    if (this.isTokenExpired(token)) {
      return this.refreshAccessToken(token)
    }

    return token
  }


  async revokeToken(userId: number): Promise<void> {
    const token = await this.stravaTokenRepository.findByUserId(userId)
    if (!token) return

    try {
      await axios.post(this.config.deauthorizeUrl, null, {
        params: { access_token: token.accessToken }
      })

    } catch (e) {
      this.logger.warn(`Strava deauthorize failed: `, e.message)
    }
  }


  async getAthleteProfile(userId: number): Promise<StravaAthleteProfile> {
    const token = await this.getValidToken(userId)

    const { data } = await axios.get<StravaAthleteProfile>(
      `${this.config.apiBaseUrl}/athlete`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    )

    return data
  }
}