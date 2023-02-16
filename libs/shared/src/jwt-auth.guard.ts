import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'apps/auth/src/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Repositories } from 'libs/_common/database/database-repository.enum';
import { IRepository } from 'libs/_common/database/repository.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private readonly config: ConfigService,
  ) {}

  getAuthToken(req: {}): string {
    if (req) {
      return req[0].req.split(' ')[1];
    }
    return null;
  }

  async getUserFromReqHeaders(req: {}): Promise<User> {
    let token = this.getAuthToken(req);
    if (!token) return null;
    let { sub } = jwt.verify(token, this.config.get('JWT_SECRET'));
    const user = await this.userRepo.findOne({ id: sub });
    return user ? (user.toJSON() as User) : null;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgs();

    const user = await this.getUserFromReqHeaders(ctx);
    context['user'] = user;

    if (user) {
      context['user'] = user;
      return true;
    }
    throw new Error('unAutherized');
  }
}
