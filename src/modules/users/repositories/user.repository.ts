import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/User.entity";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}


  findById(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'stravaToken', 
        'stravaProfile'
      ]
    })
  }


  findByStravaAthleteId(athleteId: number): Promise<User | null> {
    return this.repo.findOne({
      where: { stravaProfile: { athleteId } },
      relations: ['stravaProfile', 'stravaToken']
    })
  }


  save(user: User): Promise<User> {
    return this.repo.save(user)
  }


  create(partial: Partial<User>): User {
    return this.repo.create(partial)
  }
}