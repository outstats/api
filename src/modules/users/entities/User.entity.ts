import { CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StravaToken } from "src/modules/strava/entities/StravaToken.entity";
import { StravaProfile } from "src/modules/strava/entities/StravaProfile.entity";
import { StravaActivity } from "src/modules/strava/entities/StravaActivities.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => StravaToken, s => s.user, { cascade: true })
  stravaToken: StravaToken

  @OneToOne(() => StravaProfile, s => s.user, { cascade: true })
  stravaProfile: StravaProfile

  @OneToMany(() => StravaActivity, a => a.user, { cascade: true })
  stravaActivities: StravaActivity[]
}