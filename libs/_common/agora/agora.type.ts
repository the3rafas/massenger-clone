import { Field, ObjectType, Int } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/user/user.enum';
import { Timestamp } from '../graphql/timestamp.scalar';
import { AgoraMediaTypeEnum, MediaRequestReplyEnum, MediaStatusEnum } from './agora.enum';

@ObjectType()
export class GenerateAgoraTokenResponse {
  @Field()
  channelName: string;

  @Field()
  token: string;

  @Field(type => Timestamp)
  generatedAt: Timestamp | number;

  @Field(type => AgoraMediaTypeEnum)
  mediaType: AgoraMediaTypeEnum;

  @Field(type => UserRoleEnum)
  whoStarts: UserRoleEnum;

  @Field()
  uniqueId: string;

  @Field(type => Int)
  uid: number;

  @Field(type => Int)
  otherUid: number;

  @Field(type => [String], { nullable: 'itemsAndList' })
  attachments?: string[];

  @Field()
  fromFirstName: string;

  @Field()
  fromLastName: string;

  @Field({ nullable: true })
  fromProfilePicture: string;

  @Field()
  appointmentMessageId: string;

  @Field(type => Timestamp)
  estimatedEndingDate: Timestamp | number;

  @Field()
  preGeneratedCallId: string;
}

@ObjectType()
export class AgoraRequestReplyResponse {
  @Field(type => MediaRequestReplyEnum)
  reply: MediaRequestReplyEnum;

  @Field(type => AgoraMediaTypeEnum)
  mediaType: AgoraMediaTypeEnum;

  @Field(type => UserRoleEnum)
  whoStarts: UserRoleEnum;

  @Field()
  appointmentId: string;

  @Field()
  appointmentMessageId: string;

  @Field()
  uniqueId: string;

  @Field(type => Int)
  uid: number;

  @Field(type => Int)
  otherUid: number;

  @Field()
  preGeneratedCallId: string;
}

@ObjectType()
export class AgoraChangeStatusResponse {
  @Field(type => MediaStatusEnum)
  status: MediaStatusEnum;

  @Field(type => AgoraMediaTypeEnum)
  mediaType: AgoraMediaTypeEnum;

  @Field(type => UserRoleEnum)
  whoStarts: UserRoleEnum;

  @Field()
  appointmentId: string;

  @Field()
  appointmentMessageId: string;

  @Field()
  uniqueId: string;

  @Field(type => Int)
  uid: number;

  @Field(type => Int)
  otherUid: number;

  @Field()
  preGeneratedCallId: string;
}

export type AgoraMetadata = {
  uid: number;
  otherUid: number;
  preGeneratedCallId: string;
};

export type AgoraAppointmentMessageMedia = {
  mediaType: AgoraMediaTypeEnum;
  duration?: number;
  recordUrl?: string;
  uniqueId: string;
  status: MediaStatusEnum;
  mediaLifeTimeStatuses: MediaLifeTimeStatuesType[];
  agoraMetadata: AgoraMetadata;
};

export class MediaLifeTimeStatuesType {
  status: MediaStatusEnum;
  reachedAt: Date | number;
}
