import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class AgoraRequestReplySubscriptionInput {
  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  appointmentId: string;
}
