import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { MediaRequestReplyEnum } from '../agora.enum';

@InputType()
export class AgoraRequestReplyInput {
  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  appointmentId: string;

  @Field(type => MediaRequestReplyEnum)
  @IsNotEmpty()
  reply: MediaRequestReplyEnum;

  @Field()
  @IsNotEmpty()
  uniqueId: string;
}
