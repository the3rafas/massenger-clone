import { SharedService } from '@app/shared';
import { JwtGuard } from '@app/shared/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices/ctx-host';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices/decorators';
import { AuthService } from './auth.service';
import { CreatUserDto } from './user/dtos/create-user.dto';
import { LogInDto } from './user/dtos/login-user.gto';
import { UserService } from './user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'delete' })
  async delete(@Ctx() context: RmqContext) {
    console.log('got it1');

    this.sharedService.acknowledgeMessage(context);
    return this.userService.delete();
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  @UseGuards(JwtGuard)
  async getUser(@Ctx() context: RmqContext, @Payload() req: Request) {
    console.log('got it1');

    this.sharedService.acknowledgeMessage(context);
    return this.userService.getAll();
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext, @Payload() logInInfo: LogInDto) {
    this.sharedService.acknowledgeMessage(context);
    return this.userService.login(logInInfo);
  }

  @MessagePattern({ cmd: 'regester' })
  async regester(
    @Ctx() context: RmqContext,
    @Payload() userInfo: CreatUserDto,
  ) {
    console.log('got it');

    this.sharedService.acknowledgeMessage(context);
    return this.userService.regester(userInfo);
    // return { user: 'heshamsssssssss/' };
  }
}
