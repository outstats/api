import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport"
import jwtConfig from "src/config/jwt.config"
import type { ConfigType } from "@nestjs/config"
import { UsersService } from "src/modules/users/user.service"
import { User } from "src/modules/users/entities/User.entity"

export interface JwtPayload {
  sub: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret
    })
  }


  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException(`Invalid token or user not found`)
    }

    return user
  }
}