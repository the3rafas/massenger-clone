import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);

  const configServ = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configServ.get('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice(sharedService.getRmgOptions(queue));

  app.startAllMicroservices();
}
bootstrap();
