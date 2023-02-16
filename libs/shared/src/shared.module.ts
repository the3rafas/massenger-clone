import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DatabaseModule } from 'libs/_common/database/database.module';
import { JwtGuard } from './jwt-auth.guard';
import { SharedService } from './shared.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  providers: [SharedService, JwtGuard],
  exports: [SharedService, JwtGuard],
})
export class SharedModule {
  static regesterRmqClient(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (config: ConfigService) => {
          const USER = config.get('RABBITMQ_USER');
          const PASSWORD = config.get('RABBITMQ_PASS');
          const HOST = config.get('RABBITMQ_HOST');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              noAck: false,
              queue,
              queueOptions: {
                durable: false,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
