import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ChangeMediaStatusEnum } from '../agora.enum';

@InputType()
export class AgoraChangeStatusInput {
  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  appointmentId: string;

  @Field(type => ChangeMediaStatusEnum)
  @IsNotEmpty()
  status: ChangeMediaStatusEnum;

  @Field()
  @IsNotEmpty()
  uniqueId: string;

  @Field({ nullable: true })
  @IsOptional()
  durationInSec?: number;
}
