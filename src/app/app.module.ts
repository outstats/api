import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import databaseConfig from 'src/config/database.config'
import { User } from 'src/modules/users/entities/User.entity'
import { StravaToken } from 'src/modules/strava/entities/StravaToken.entity'
import { AuthModule } from 'src/modules/auth/auth.module'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { StravaProfile } from 'src/modules/strava/entities/StravaProfile.entity'
import { StravaActivity } from 'src/modules/strava/entities/StravaActivities.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        type: 'mariadb',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.name,
        entities: [User, StravaToken, StravaProfile, StravaActivity],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy()
      })
    }),

    AuthModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}