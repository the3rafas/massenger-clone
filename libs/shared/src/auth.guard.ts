import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthGuard {
  constructor(private readonly config: ConfigService) {}

  async hasjwt(jwt: string) {
    console.log(`yes this function works${jwt}`);
  }
}
