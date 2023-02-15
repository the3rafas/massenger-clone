import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { UserRoleEnum } from 'src/user/user.enum';
import { GqlContext } from '../graphql/graphql-context.type';
import { PusherService } from '../pusher/pusher.service';
import { HelperService } from '../utils/helper.service';
import { AgoraMediaTypeEnum, MediaRequestReplyEnum } from './agora.enum';
import {
  AgoraChangeStatusResponse,
  AgoraRequestReplyResponse,
  GenerateAgoraTokenResponse
} from './agora.type';
import { GenerateAgoraTokenInput } from './inputs/generate-agora-token.input';
import { AgoraAppointment } from './interfaces/appointment.interface';

@Injectable()
export class AgoraNotificationEvents {
  constructor(
    private readonly pusher: PusherService,
    private readonly helpers: HelperService,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async notifyAgoraAccessToken(
    input: GenerateAgoraTokenInput,
    appointment: AgoraAppointment,
    customerResponse: GenerateAgoraTokenResponse
  ) {
    const { currentUser } = this.context;
    const message = `Incoming ${
      input.mediaType === AgoraMediaTypeEnum.VOICE ? 'voice' : 'video'
    } call from ${currentUser.role === UserRoleEnum.USER ? '' : 'Dr.'} ${
      currentUser.fullName || ''
    }`;
    await this.pusher.push(
      [currentUser.id === appointment.userId ? appointment.doctor.user : appointment.user],
      {
        arBody: message,
        enBody: message,
        notificationType: NotificationTypeEnum.AGORA_ACCESS_TOKEN_GENERATED,
        details: {
          ...customerResponse,
          appointmentId: appointment.id
        }
      },
      currentUser,
      customerResponse.appointmentMessageId
    );
  }

  async notifyReplyMediaRequest(
    replyResponse: AgoraRequestReplyResponse,
    appointment: AgoraAppointment,
    appointmentMessageId: string
  ) {
    const { currentUser } = this.context,
      { arBody, enBody } = this.getReplyNotificationBody(replyResponse);
    await this.pusher.push(
      [currentUser.id === appointment.userId ? appointment.doctor.user : appointment.user],
      {
        arBody,
        enBody,
        notificationType: NotificationTypeEnum.AGORA_MEDIA_REQUEST_REPLIED,
        details: replyResponse
      },
      currentUser,
      appointmentMessageId
    );
  }

  private getReplyNotificationBody(replyResponse: AgoraRequestReplyResponse) {
    const enMedia = this.helpers.upperCaseFirstLetter(replyResponse.mediaType.toLowerCase()),
      enReply = replyResponse.reply === MediaRequestReplyEnum.ACCEPTED ? 'accepted' : 'rejected',
      arMedia = replyResponse.mediaType === AgoraMediaTypeEnum.VIDEO ? 'الفيديو' : 'المكالمة',
      arReply = replyResponse.reply === MediaRequestReplyEnum.ACCEPTED ? 'قبول' : 'رفض';
    const enBody = `${enMedia} request has been ${enReply}`,
      arBody = `تم ${arReply} طلب ${arMedia}`;
    return { enBody, arBody };
  }

  async notifyAgoraChangeStatus(
    appointment: AgoraAppointment,
    agoraChangeStatusResponse: AgoraChangeStatusResponse,
    appointmentMessageId: string
  ) {
    const { currentUser } = this.context,
      { arBody, enBody } = this.getChangeStatusNotificationBody(agoraChangeStatusResponse);
    await this.pusher.push(
      [currentUser.id === appointment.userId ? appointment.doctor.user : appointment.user],
      {
        arBody,
        enBody,
        notificationType: NotificationTypeEnum.AGORA_MEDIA_STATUS_CHANGED,
        details: agoraChangeStatusResponse
      },
      currentUser,
      appointmentMessageId
    );
  }

  private getChangeStatusNotificationBody(agoraChangeStatusResponse: AgoraChangeStatusResponse) {
    const enMedia = this.helpers.upperCaseFirstLetter(
        agoraChangeStatusResponse.mediaType.toLowerCase()
      ),
      arMedia =
        agoraChangeStatusResponse.mediaType === AgoraMediaTypeEnum.VIDEO ? 'الفيديو' : 'المكالمة';
    let enBody = `${enMedia} has been completed`;
    let arBody = `تم انهاء ${arMedia}`;
    if (agoraChangeStatusResponse.status.includes('CANCELED')) {
      enBody = `${enMedia} has been canceled`;
      arBody = `تم الغاء ${arMedia}`;
    }
    if (agoraChangeStatusResponse.status.includes('NO_REPLY')) {
      enBody = `No reply on ${enMedia}`;
      arBody = `لا يوجد رد على ${arMedia}`;
    }
    return { enBody, arBody };
  }
}
