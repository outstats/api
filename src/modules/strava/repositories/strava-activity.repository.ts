import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StravaActivity } from "../entities/StravaActivities.entity";
import { Repository } from "typeorm";
import { StravaActivityCategory } from "../types/strava.types";

export interface ActivityStats {
  totalDistanceKm: number
  byCategory: Record<StravaActivityCategory, number>
}

@Injectable()
export class StravaActivityRepository {
  constructor(
    @InjectRepository(StravaActivity)
    private readonly repo: Repository<StravaActivity>
  ) {}


  async upsertMany(activities: Partial<StravaActivity>[]): Promise<void> {
    if (!activities.length) return

    await this.repo
      .createQueryBuilder()
      .insert()
      .into(StravaActivity)
      .values(activities)
      .orUpdate(
        [
          'name', 'type', 'category',
          'distance', 'moving_time', 'elapsed_time', 'total_elevation_gain', 'average_speed', 'max_speed',
          'pr_count', 'kudos_count', 'comment_count', 'athlete_count',
          'workout_type', 'start_date_local', 'timezone'
        ],
        [ 'strava_id' ]
      )
      .execute()
  }


  async findLatestStravaId(userId: number): Promise<string | null> {
    const result = await this.repo.findOne({
      where: { user: { id: userId } },
      order: { startDateLocal: 'DESC' },
      select: ['stravaId']
    })
    
    return result?.stravaId ?? null
  }


  async getStats(userId: number): Promise<ActivityStats> {
    const rows: { 
      category: StravaActivityCategory
      total: string 
    }[] = await this.repo
      .createQueryBuilder('a')
      .select('a.category', 'category')
      .addSelect('SUM(a.distance)', 'total')
      .where('a.user_id = :userId', { userId })
      .groupBy('a.category')
      .getRawMany()

    const byCategory = Object.values(StravaActivityCategory).reduce(
      (acc, cat) => ({ ...acc, [cat]: 0 }),
      {} as Record<StravaActivityCategory, number>
    )

    let totalMeters = 0

    for (const row of rows) {
      const meters = parseFloat(row.total) || 0
      byCategory[row.category] = Math.round((meters / 1000) * 100) / 100
      totalMeters += meters
    }

    return {
      totalDistanceKm: Math.round((totalMeters / 1000) * 100) / 100,
      byCategory
    }
  }


  findByUserId(userId: number, limit: number = 30, offset: number = 0): Promise<StravaActivity[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { startDateLocal: 'DESC' },
      take: limit,
      skip: offset
    })
  }


  countByUserId(userId: number): Promise<number> {
    return this.repo.count({ where: { user: { id: userId } } })
  }


  create(partial: Partial<StravaActivity>): StravaActivity {
    return this.repo.create(partial)
  }
}