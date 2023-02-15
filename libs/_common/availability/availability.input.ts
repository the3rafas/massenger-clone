import { Field, InputType, Int } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';
import { AvailabilityConstants } from './availability.enum';

@InputType()
export class AvailabilityDayShiftInput {
  @Field(type => Int)
  // Because of timezone (CLIENT SIDE MUST ADD TIME IN UTC)
  @Min(AvailabilityConstants.FIRST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES)
  @Max(AvailabilityConstants.LAST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES)
  fromInMinutes: number;

  @Field(type => Int)
  // Because of timezone (CLIENT SIDE MUST ADD TIME IN UTC)
  @Min(AvailabilityConstants.FIRST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES)
  @Max(AvailabilityConstants.LAST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES)
  toInMinutes: number;
}

@InputType()
export class AvailabilityDayInput {
  @Field()
  isAvailable: boolean;

  @Field(type => [AvailabilityDayShiftInput])
  shifts: AvailabilityDayShiftInput[];
}

@InputType()
export class AvailabilityInput {
  @Field(type => [AvailabilityDayInput])
  availability: AvailabilityDayInput[];
}
