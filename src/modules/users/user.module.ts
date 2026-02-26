import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/User.entity";
import { UsersService } from "./user.service";
import { UsersRepository } from "./repositories/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}