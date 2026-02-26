import { User } from "src/modules/users/entities/User.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('strava_tokens')
export class StravaToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  accessToken: string

  @Column({ type: 'text' })
  refreshToken: string

  @Column({ nullable: true })
  expiresAt: number

  @Column({ nullable: true })
  tokenType: string

  @Column({ nullable: true })
  scope: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(
    () => User, 
    u => u.stravaToken, 
    { onDelete: 'CASCADE' }
  )
  @JoinColumn()
  user: User
}