import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StravaToken } from "../entities/StravaToken.entity";
import { Repository } from "typeorm";

@Injectable()
export class StravaTokenRepository {
  constructor(
    @InjectRepository(StravaToken)
    private readonly repo: Repository<StravaToken>
  ) {}


  findByUserId(userId: number): Promise<StravaToken | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    })
  }


  save(token: StravaToken): Promise<StravaToken> {
    return this.repo.save(token)
  }


  create(partial: Partial<StravaToken>): StravaToken {
    return this.repo.create(partial)
  }

  
  remove(token: StravaToken): Promise<StravaToken> {
    return this.repo.remove(token);
  }
}