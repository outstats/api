import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StravaProfile } from "../entities/StravaProfile.entity";

@Injectable()
export class StravaProfileRepository {
  constructor(
    @InjectRepository(StravaProfile)
    private readonly repo: Repository<StravaProfile>
  ) {}


  findByAthleteId(athleteId: number): Promise<StravaProfile | null> {
    return this.repo.findOne({
      where: { athleteId },
      relations: ['user']
    })
  }


  findByUserId(userId: number): Promise<StravaProfile | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    })
  }


  save(profile: StravaProfile): Promise<StravaProfile> {
    return this.repo.save(profile)
  }


  create(partial: Partial<StravaProfile>): StravaProfile {
    return this.repo.create(partial)
  }


  async markActivitiesSynced(userId: number): Promise<void> {
    await this.repo.update(
      { user: { id: userId } },
      { activitiesSyncedAt: new Date() }
    )
  }


  async hasBeenSynced(userId: number): Promise<boolean> {
    const profile = await this.repo
      .createQueryBuilder('profile')
      .select('profile.activitiesSyncedAt')
      .where('profile.user.id = :userId', { userId })
      .getOne()

    return profile?.activitiesSyncedAt !== null && profile?.activitiesSyncedAt !== undefined
  }
}