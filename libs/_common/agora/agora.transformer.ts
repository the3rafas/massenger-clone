import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { MediaStatusEnum } from './agora.enum';
import {
  AgoraChangeStatusResponse,
  AgoraRequestReplyResponse,
  GenerateAgoraTokenResponse
} from './agora.type';
import { AgoraChangeStatusTransformerInput } from './inputs/agora-change-status-transformer.input';
import { AgoraGenerateTokenTransformerInput } from './inputs/agora-generate-token-transformer.input';
import { AgoraReplyRequestTransformerInput } from './inputs/agora-reply-request-transformer.input';
import {
  IAgoraAppointmentService,
  IAgoraAppointmentServiceToken
} from './interfaces/agora-appointment-service.interface';
import { AgoraAppointmentMessage } from './interfaces/appointment-message.interface';

@Injectable()
export class AgoraTransformer {
  constructor(
    @Inject(CONTEXT) private readonly context: GqlContext,
    @Inject(IAgoraAppointmentServiceToken)
    private readonly appointmentService: IAgoraAppointmentService
  ) {}

  agoraGenerateTokenResTransformer(
    input: AgoraGenerateTokenTransformerInput
  ): { publisherRes: GenerateAgoraTokenResponse; customerRes: GenerateAgoraTokenResponse } {
    const { currentUser } = this.context,
      generatedAt = new Date().getTime(),
      actualStarting = this.appointmentService.getActualStartingDate(input.appointment),
      estimatedEndingDate = this.appointmentService.getEstimatedEndingDate(
        input.appointment,
        actualStarting
      );

    const commonRes = {
      channelName: input.appointment.id,
      mediaType: input.mediaType,
      whoStarts: currentUser.role,
      uniqueId: input.uniqueId,
      attachments: input.appointment.attachments,
      estimatedEndingDate,
      appointmentMessageId: input.message.id,
      fromUserId: input.fromUser.id,
      fromFirstName: input.fromUser.firstName,
      fromLastName: input.fromUser.lastName,
      fromProfilePicture: input.fromUser.profilePicture,
      generatedAt,
      preGeneratedCallId: input.preGeneratedCallId
    };
    const publisherRes: GenerateAgoraTokenResponse = {
      token: input.publisherToken,
      uid: input.uid,
      otherUid: input.otherUid,
      ...commonRes
    };
    const customerRes: GenerateAgoraTokenResponse = {
      token: input.customerToken,
      uid: input.otherUid,
      otherUid: input.uid,
      ...commonRes
    };

    return { publisherRes, customerRes };
  }

  agoraReplyRequestTransformer(
    input: AgoraReplyRequestTransformerInput
  ): { toOtherUserRes: AgoraRequestReplyResponse; currentUserRes: AgoraRequestReplyResponse } {
    const { currentUser } = this.context,
      { otherUid, uid } = this.extractUidForCurrentUser(input.appointmentMessage);

    const currentUserRes: AgoraRequestReplyResponse = {
        reply: input.reply,
        whoStarts: currentUser.role,
        mediaType: input.media.mediaType,
        appointmentId: input.appointment.id,
        appointmentMessageId: input.appointmentMessage.id,
        uniqueId: input.uniqueId,
        uid,
        otherUid,
        preGeneratedCallId: input.media.agoraMetadata.preGeneratedCallId
      },
      toOtherUserRes = {
        ...currentUserRes,
        uid: otherUid,
        otherUid: uid
      };

    return { currentUserRes, toOtherUserRes };
  }

  agoraChangeStatusTransformer(
    input: AgoraChangeStatusTransformerInput
  ): { toOtherUserRes: AgoraChangeStatusResponse; currentUserRes: AgoraChangeStatusResponse } {
    const { currentUser } = this.context,
      { otherUid, uid } = this.extractUidForCurrentUser(input.appointmentMessage);

    const currentUserRes: AgoraChangeStatusResponse = {
        status: (input.changedStatus as unknown) as MediaStatusEnum,
        whoStarts: currentUser.role,
        mediaType: input.appointmentMessage.media.mediaType,
        appointmentId: input.appointment.id,
        appointmentMessageId: input.appointmentMessage.id,
        uniqueId: input.uniqueId,
        uid: input.appointmentMessage.media.agoraMetadata.uid,
        otherUid: input.appointmentMessage.media.agoraMetadata.otherUid,
        preGeneratedCallId: input.appointmentMessage.media.agoraMetadata.preGeneratedCallId
      },
      toOtherUserRes = {
        ...currentUserRes,
        uid: otherUid,
        otherUid: uid
      };

    return { currentUserRes, toOtherUserRes };
  }

  private extractUidForCurrentUser(appointmentMessage: AgoraAppointmentMessage) {
    const { currentUser } = this.context;
    let uid: number, otherUid: number;
    if (currentUser.id === appointmentMessage.fromUserId) {
      uid = appointmentMessage.media.agoraMetadata.uid;
      otherUid = appointmentMessage.media.agoraMetadata.otherUid;
    } else {
      uid = appointmentMessage.media.agoraMetadata.otherUid;
      otherUid = appointmentMessage.media.agoraMetadata.uid;
    }
    return { uid, otherUid };
  }
}
