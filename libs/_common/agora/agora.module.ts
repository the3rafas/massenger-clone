import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraResolver } from './agora.resolver';
import { PubSub } from '../graphql/graphql.pubsub';
import { PusherModule } from '../pusher/pusher.module';
import { AgoraNotificationEvents } from './agora.notification-events';
import { PusherService } from '../pusher/pusher.service';
import { IAgoraPusherServiceToken } from './interfaces/agora-pusher-service.interface';
import { IAgoraAppointmentServiceToken } from './interfaces/agora-appointment-service.interface';
import { IAgoraAppointmentMessageServiceToken } from './interfaces/agora-appointment-message-service.interface';
import { AgoraTransformer } from './agora.transformer';
import { AgoraAppointmentService } from './deps/agora-appointment.service';
import { AgoraAppointmentMessageService } from './deps/agora-appointment-message.service';
import { HelperModule } from '../utils/helper.module';
import { AgoraSubscriptionResolver } from './agora-subscriptions.resolver';

@Module({
  imports: [PusherModule, HelperModule],
  providers: [
    PubSub,
    AgoraService,
    AgoraResolver,
    AgoraNotificationEvents,
    AgoraTransformer,
    AgoraSubscriptionResolver,
    { useExisting: PusherService, provide: IAgoraPusherServiceToken },
    { useClass: AgoraAppointmentService, provide: IAgoraAppointmentServiceToken },
    { useClass: AgoraAppointmentMessageService, provide: IAgoraAppointmentMessageServiceToken }
  ]
})
export class AgoraModule {}
