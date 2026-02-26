import { User } from "src/modules/users/entities/User.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StravaActivityCategory, StravaActivityType } from "../types/strava.types";

export function toStravaActivityCategory(type: string): StravaActivityCategory {
  const runTypes = ['Run', 'TrailRun', 'VirtualRun']
  const walkTypes = ['Hike', 'Walk']
  const rideTypes = ['Ride', 'VirtualRide', 'EBikeRide', 'EMountainBikeRide', 'MountainBikeRide', 'GravelRide']

  if (runTypes.includes(type)) return StravaActivityCategory.Run
  if (walkTypes.includes(type)) return StravaActivityCategory.Walk
  if (rideTypes.includes(type)) return StravaActivityCategory.Ride
  return StravaActivityCategory.Other
}

@Entity()
export class StravaActivity {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column({ type: 'bigint' })
  stravaId: string

  @Column()
  name: string

  @Column({ default: 'other' })
  type: StravaActivityType

  @Column({ type: 'enum', enum: StravaActivityCategory, default: StravaActivityCategory.Other })
  category: StravaActivityCategory

  @Column({ type: 'float', default: 0 })
  distance: number

  @Column({ default: 0 })
  movingTime: number

  @Column({ default: 0 })
  elapsedTime: number

  @Column({ type: 'float', nullable: true })
  totalElevationGain: number | null

  @Column({ type: 'float', nullable: true })
  averageSpeed: number | null

  @Column({ type: 'float', nullable: true })
  maxSpeed: number | null

  @Column({ default: 0 })
  prCount: number

  @Column({ default: 0 })
  kudosCount: number

  @Column({ default: 0 })
  commentCount: number

  @Column({ default: 0 })
  athleteCount: number

  @Column({ default: 0 })
  photoCount: number

  @Column({ default: false })
  workoutType: number

  @Column({ nullable: true })
  startDateLocal: string
  
  @Column({ nullable: true })
  timezone: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (u) => u.stravaActivities, { onDelete: 'CASCADE' })
  user: User
}