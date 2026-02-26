import { Module } from "@nestjs/common"
import { ConfigModule, ConfigType } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { StravaModule } from "../strava/strava.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { UsersModule } from "../users/user.module"
import jwtConfig from "src/config/jwt.config"

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: config.expiresIn as any }
      })
    }),
    StravaModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export class AuthModule {}