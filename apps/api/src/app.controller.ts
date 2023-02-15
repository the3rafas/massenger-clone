import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { CreatUserDto } from 'apps/auth/src/user/dtos/create-user.dto';
import { LogInDto } from 'apps/auth/src/user/dtos/login-user.gto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
  ) {}

  @Get('auth')
  getUser() {
    return this.authService.send({ cmd: 'getAllUsers' }, {});
  }

  // 123

  @Get('presence')
  getMessage() {
    try {
      return this.presenceService.send({ cmd: 'get-Message' }, {});
    } catch (error) {
      console.log(error);
    }
  }

  @Post('presence')
  getMessages() {
    return this.presenceService.send({ cmd: 'get-Messages' }, {});
  }

  @Post('regester')
  regester(@Body() input: CreatUserDto) {
    console.log('hi');

    return this.authService.send({ cmd: 'regester' }, input);
  }

  @Post('login')
  login(@Body() input: LogInDto) {
    return this.authService.send({ cmd: 'login' }, input);
  }

  @Get('delete')
  delete() {
    return this.authService.send({ cmd: 'delete' }, {});
  }
}
