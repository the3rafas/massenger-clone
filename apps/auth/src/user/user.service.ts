import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'libs/_common/database/database-repository.enum';
import { IRepository } from 'libs/_common/database/repository.interface';
import { Op } from 'sequelize';
import { CreatUserDto } from './dtos/create-user.dto';
import { LogInDto } from './dtos/login-user.gto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private readonly config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async delete() {
    const users = await this.userRepo.findAll();
    users.forEach(async (e) => await e.destroy());
  }

  async getAll() {
    return await this.userRepo.findAll();
  }

  async regester(input: CreatUserDto): Promise<User> {
    const user = await this.userRepo.findOne({
      [Op.or]: { userName: input.userName, email: input.email },
    });
    if (user) throw new Error('userName or password already exist');

    return await this.userRepo.createOne(input);
  }

  async login(input: LogInDto) {
    const user = await this.userRepo.findOne({ userName: input.userName });

    if (user) {
      if (user.password === input.password) {
        return {
          jwt: jwt.sign(
            {
              userName: user.userName,
              sub: user.id,
            },
            this.config.get('JWT_SECRET'),
          ),
          user,
        };
        throw new Error('errrrrrr');
      }
    }

    throw new Error('unAutherize');
  }
}
