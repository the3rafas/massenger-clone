import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class CountryNameAnd2IsoCode {
  @IsString()
  @Field(() => String)
  localeName: string;

  @Field(() => String)
  isoCode: string;
}
