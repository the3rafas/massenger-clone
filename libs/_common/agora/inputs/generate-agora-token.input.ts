import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AgoraMediaTypeEnum } from '../agora.enum';

@InputType()
export class GenerateAgoraTokenInput {
  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  appointmentId: string;

  @Field(type => AgoraMediaTypeEnum)
  @IsNotEmpty()
  mediaType: AgoraMediaTypeEnum;

  @Field()
  @IsNotEmpty()
  preGeneratedCallId: string;
}
