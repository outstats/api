import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./repositories/user.repository";
import { User } from "./entities/User.entity";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}


  findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id)
  }


  findByStravaAthleteId(athleteId: number): Promise<User | null> {
    return this.usersRepository.findByStravaAthleteId(athleteId)
  }


  async create(): Promise<User> {
    const user = this.usersRepository.create({})
    return this.usersRepository.save(user)
  }
}