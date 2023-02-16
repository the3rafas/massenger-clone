import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { CreatUserDto } from 'apps/auth/src/user/dtos/create-user.dto';
import { LogInDto } from 'apps/auth/src/user/dtos/login-user.gto';
import { CreatMessageDto } from 'apps/presence/src/message/dto/craete-message.dto';
// import { Request as req } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
  ) {}

  @Get('auth')
  async getUser(@Req() req) {
    return this.authService.send(
      { cmd: 'getAllUsers' },
      { req: req.headers['authorization'] },
    );
  }

  @Post('auth/regester')
  regester(@Body() input: CreatUserDto) {
    return this.authService.send({ cmd: 'regester' }, input);
  }

  @Post('auth/login')
  login(@Body() input: LogInDto) {
    return this.authService.send({ cmd: 'login' }, input);
  }

  @Get('delete')
  delete() {
    return this.authService.send({ cmd: 'delete' }, {});
  }

  // #########################################################################################################

  @Get('presence')
  getMessage(@Req() req) {
    return this.presenceService.send(
      { cmd: 'get-Message' },
      { req: req.headers['authorization'] },
    );
  }

  @Post('presence/create')
  getMessages(@Body() input: CreatMessageDto, @Req() req) {
    return this.presenceService.send(
      { cmd: 'create-Message' },
      { req: req.headers['authorization'], input },
    );
  }
}
