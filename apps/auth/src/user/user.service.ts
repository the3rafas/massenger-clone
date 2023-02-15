import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'libs/_common/database/database-repository.enum';
import { IRepository } from 'libs/_common/database/repository.interface';
import { CreatUserDto } from './dtos/create-user.dto';
import { LogInDto } from './dtos/login-user.gto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
  ) {}

  async delete() {
    const users = await this.userRepo.findAll();
    users.forEach(async (e) => await e.destroy());
  }
  async getAll() {
    return await this.userRepo.findAll();
  }
  async regester(input: CreatUserDto): Promise<User> {
    return await this.userRepo.createOne(input);
  }
  async login(input: LogInDto) {
    const user = await this.userRepo.findOne({ userName: input.userName });
    if (user) {
      if (user.password === input.password) {
        return {
          jwt: 'jwt',
          user,
        };
        throw new Error('errrrrrr');
      }
    }
    throw new Error('unAutherize');
  }
}
