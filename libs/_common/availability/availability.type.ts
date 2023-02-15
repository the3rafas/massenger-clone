import { ObjectType, Field } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

@ObjectType()
export class AvailabilityDayShift {
  @Field()
  @Min(0)
  @Max(1440)
  fromInMinutes: number;

  @Field()
  @Min(0)
  @Max(1440)
  toInMinutes: number;
}

@ObjectType()
export class AvailabilityDay {
  @Field()
  isAvailable: boolean;

  @Field(type => [AvailabilityDayShift])
  shifts: AvailabilityDayShift[];
}
