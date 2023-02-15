import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configServ = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configServ.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice(sharedService.getRmgOptions(queue));

  app.startAllMicroservices();
}
bootstrap();
