import { User } from "src/modules/users/entities/User.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('strava_profiles')
export class StravaProfile {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  athleteId: number

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  country: string

  @Column({ nullable: true })
  sex: string

  @Column({ nullable: true })
  summit: boolean

  @Column({ nullable: true })
  profilePicture: string

  @Column({ type: 'datetime', nullable: true })
  activitiesSyncedAt: Date | null

  @Column({ nullable: true })
  athleteCreatedAt: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => User, u => u.stravaProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}