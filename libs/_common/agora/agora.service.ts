import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import {
  AgoraChangeStatusResponse,
  AgoraRequestReplyResponse,
  GenerateAgoraTokenResponse
} from './agora.type';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from '../graphql/graphql-context.type';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { wrapEntityWithGqlRes } from '../graphql/graphql-response.type';
import { AgoraNotificationEvents } from './agora.notification-events';
import { privilegeExpiredTsConfig, agoraUid1, agoraUid2, agoraUniqueId } from './agora.config';
import { AgoraAppointmentStatusEnum, MediaStatusEnum } from './agora.enum';
import { GenerateAgoraTokenInput } from './inputs/generate-agora-token.input';
import { AgoraRequestReplyInput } from './inputs/agora-request-reply.input';
import { AgoraChangeStatusInput } from './inputs/agora-change-status.input';
import { AgoraTransformer } from './agora.transformer';
import {
  IAgoraAppointmentService,
  IAgoraAppointmentServiceToken
} from './interfaces/agora-appointment-service.interface';
import {
  IAgoraAppointmentMessageService,
  IAgoraAppointmentMessageServiceToken
} from './interfaces/agora-appointment-message-service.interface';
import { AgoraAppointment } from './interfaces/appointment.interface';
import { AgoraAppointmentMessage } from './interfaces/appointment-message.interface';
import { ErrorCodeEnum } from '../exceptions/error-code.enum';

@Injectable()
export class AgoraService {
  constructor(
    private readonly config: ConfigService,
    private readonly agoraTransformer: AgoraTransformer,
    private readonly agoraNotificationEvents: AgoraNotificationEvents,
    @Inject(IAgoraAppointmentServiceToken)
    private readonly appointmentService: IAgoraAppointmentService,
    @Inject(IAgoraAppointmentMessageServiceToken)
    private readonly appointmentMessageService: IAgoraAppointmentMessageService,
    @Inject('PUB_SUB') private readonly pubSub: RedisPubSub,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  private appID = this.config.get('AGORA_APP_ID');
  private appCertificate = this.config.get('AGORA_APP_CERTIFICATE');
  private role = RtcRole.PUBLISHER;

  public async generateAgoraToken(
    input: GenerateAgoraTokenInput
  ): Promise<GenerateAgoraTokenResponse> {
    try {
      const appointment = await this.appointmentService.validAppointmentToCurrentUser(
        input.appointmentId,
        [AgoraAppointmentStatusEnum.IN_PROGRESS]
      );

      const privilegeExpiredTs = privilegeExpiredTsConfig(appointment.appointmentDurationInSec),
        uid = agoraUid1(),
        otherUid = agoraUid2(),
        uniqueId = agoraUniqueId();

      const publisherToken = this.generateTokenForUser(appointment, uid, privilegeExpiredTs),
        customerToken = this.generateTokenForUser(appointment, otherUid, privilegeExpiredTs);

      const { toUser, fromUser } = this.extractToAndFromUsers(appointment);

      const message = await this.appointmentMessageService.createAppointmentMessageMedia({
        toUser,
        fromUser,
        appointment,
        mediaType: input.mediaType,
        preGeneratedCallId: input.preGeneratedCallId,
        otherUid,
        uid,
        uniqueId
      });

      const generateTokenTransformer = this.agoraTransformer.agoraGenerateTokenResTransformer({
          appointment,
          customerToken,
          publisherToken,
          fromUser,
          mediaType: input.mediaType,
          message,
          otherUid,
          preGeneratedCallId: input.preGeneratedCallId,
          uid,
          uniqueId
        }),
        publisherResponse = generateTokenTransformer.publisherRes,
        customerResponse = generateTokenTransformer.customerRes;

      await this.pubSub.publish(NotificationTypeEnum.AGORA_ACCESS_TOKEN_GENERATED, {
        res: wrapEntityWithGqlRes(customerResponse),
        otherUserId: toUser.id
      });
      await this.agoraNotificationEvents.notifyAgoraAccessToken(
        input,
        appointment,
        customerResponse
      );

      return publisherResponse;
    } catch (error) {
      throw new BaseHttpException(error.status || 500, error.message);
    }
  }

  private generateTokenForUser(
    appointment: AgoraAppointment,
    uid: number,
    privilegeExpiredTs: number
  ) {
    return RtcTokenBuilder.buildTokenWithUid(
      this.appID,
      this.appCertificate,
      appointment.id,
      uid,
      this.role,
      privilegeExpiredTs
    );
  }

  private extractToAndFromUsers(appointment: AgoraAppointment) {
    const { currentUser } = this.context;
    const toUser =
        currentUser.id === appointment.userId ? appointment.doctor.user : appointment.user,
      fromUser = currentUser.id === appointment.userId ? appointment.user : appointment.doctor.user;
    return { toUser, fromUser };
  }

  async replyMediaRequest(input: AgoraRequestReplyInput): Promise<AgoraRequestReplyResponse> {
    const { currentUser } = this.context;
    const appointment = await this.appointmentService.validAppointmentToCurrentUser(
      input.appointmentId,
      [AgoraAppointmentStatusEnum.IN_PROGRESS]
    );

    const appointmentMessage = await this.appointmentMessageService.appointmentMessageOrError(
      input
    );
    this.checkMessageMedia(appointmentMessage);

    const media = appointmentMessage.media;
    await this.appointmentMessageService.updateAppointmentMessageMedia({
      appointmentMessage,
      requestReply: input.reply
    });

    const agoraReplyTransformer = this.agoraTransformer.agoraReplyRequestTransformer({
        appointment,
        appointmentMessage,
        media,
        reply: input.reply,
        uniqueId: input.uniqueId
      }),
      { currentUserRes, toOtherUserRes } = agoraReplyTransformer;

    await this.pubSub.publish(NotificationTypeEnum.AGORA_MEDIA_REQUEST_REPLIED, {
      res: wrapEntityWithGqlRes(toOtherUserRes),
      otherUserId:
        currentUser.id === appointment.userId ? appointment.doctor.user : appointment.userId
    });
    await this.agoraNotificationEvents.notifyReplyMediaRequest(
      toOtherUserRes,
      appointment,
      appointmentMessage.id
    );

    return currentUserRes;
  }

  async changeAgoraMediaStatus(input: AgoraChangeStatusInput): Promise<AgoraChangeStatusResponse> {
    const { currentUser } = this.context;
    try {
      const appointment = await this.appointmentService.validAppointmentToCurrentUser(
        input.appointmentId,
        [AgoraAppointmentStatusEnum.IN_PROGRESS]
      );

      const appointmentMessage = await this.appointmentMessageService.appointmentMessageOrError(
        input
      );
      this.checkMessageMedia(appointmentMessage);
      const oldStatus = appointmentMessage.media.status;

      await this.appointmentMessageService.updateAppointmentMessageMedia({
        appointmentMessage,
        durationInSec: input.durationInSec,
        changedStatus: input.status
      });

      const agoraReplyTransformer = this.agoraTransformer.agoraChangeStatusTransformer({
          appointment,
          appointmentMessage,
          changedStatus: input.status,
          uniqueId: input.uniqueId
        }),
        { currentUserRes, toOtherUserRes } = agoraReplyTransformer;

      if (oldStatus !== <MediaStatusEnum>(<unknown>input.status)) {
        await this.pubSub.publish(NotificationTypeEnum.AGORA_MEDIA_STATUS_CHANGED, {
          res: wrapEntityWithGqlRes(toOtherUserRes),
          otherUserId:
            currentUser.id === appointment.userId ? appointment.doctor.user : appointment.userId
        });
        await this.agoraNotificationEvents.notifyAgoraChangeStatus(
          appointment,
          toOtherUserRes,
          appointmentMessage.id
        );
      }
      return currentUserRes;
    } catch (error) {
      throw new BaseHttpException(error.status || 500, error.message);
    }
  }

  private checkMessageMedia(message: AgoraAppointmentMessage) {
    if (!message.media || !message.media.uniqueId)
      throw new BaseHttpException(ErrorCodeEnum.INVALID_APPOINTMENT_MESSAGE_TYPE);
  }
}
