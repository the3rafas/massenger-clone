import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';
import { userInfo } from 'os';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SharedModule.regesterRmqClient(
      'AUTH_SERVICE',
      process.env.RABBITMQ_AUTH_QUEUE,
    ),
    SharedModule.regesterRmqClient(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
