import { Injectable } from '@nestjs/common';
import { addMinutes, addSeconds, differenceInMinutes } from 'date-fns';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { AvailabilityAppointmentStatusEnum, AvailabilityConstants } from './availability.enum';
import { AvailabilityDay, AvailabilityDayShift } from './availability.type';
import { isWithinInterval } from 'date-fns';
import { User } from 'src/user/models/user.model';
import { UserRoleEnum } from 'src/user/user.enum';
import { AvailabilityAppointment, AvailabilityDoctor } from './availability.interface';
import { ErrorCodeEnum } from '../exceptions/error-code.enum';
import { Timezone } from '../graphql/graphql-response.type';

@Injectable()
export class AvailabilityService {
  constructor() {}

  private initiateAvailabilityTimesObj() {
    return [1, 2, 3, 4, 5, 6, 7].map(() => ({ isAvailable: false, shifts: [] }));
  }

  private getShiftBasedOnTimezone(
    shift: AvailabilityDayShift,
    timezone: Timezone
  ): AvailabilityDayShift {
    shift.fromInMinutes = timezone.minusSign
      ? shift.fromInMinutes - timezone.hours * 60 - timezone.minutes
      : shift.fromInMinutes + timezone.hours * 60 + timezone.minutes;
    shift.toInMinutes = timezone.minusSign
      ? shift.toInMinutes - timezone.hours * 60 - timezone.minutes
      : shift.toInMinutes + timezone.hours * 60 + timezone.minutes;

    return shift;
  }

  isShiftIntersected(
    shift: AvailabilityDayShift,
    filter: { fromInMinutes: number; toInMinutes?: number }
  ) {
    const shiftFrom = shift.fromInMinutes,
      shiftTo = shift.toInMinutes,
      filterFrom = filter.fromInMinutes,
      filterTo = filter.toInMinutes;
    if (filterFrom > shiftTo) return false;
    if (filterTo && filterTo < shiftFrom) return false;
    return true;
  }

  isShiftIncludesRange(
    shift: AvailabilityDayShift,
    range: { fromInMinutes: number; toInMinutes: number }
  ) {
    return (
      shift.fromInMinutes <= range.fromInMinutes &&
      shift.toInMinutes > range.fromInMinutes &&
      shift.fromInMinutes < range.toInMinutes &&
      shift.toInMinutes >= range.toInMinutes
    );
  }

  availableAppointmentTimesBetweenStartAndEndDate(
    doctor: AvailabilityDoctor,
    shiftStartTimestamp: number,
    shiftEndTimestamp: number,
    appointmentDurationAfterCounterInSec: number,
    otherAppointmentsAtThatDay: AvailabilityAppointment[],
    recommendationDurationInMin: number,
    counterDurationInMin: number
  ): { startsAt: number; endsAt: number; isAvailable: boolean }[] {
    const chunkedTimes = [];
    for (
      let i = shiftStartTimestamp;
      i < shiftEndTimestamp;
      i += appointmentDurationAfterCounterInSec * 1000
    ) {
      const startTime = i;
      const endTime = i + appointmentDurationAfterCounterInSec * 1000;
      const isAppointmentAtThatTime = !!otherAppointmentsAtThatDay.find(app =>
        this.isAppointmentBetweenDateRange(
          app,
          doctor,
          { startTime: new Date(startTime), endTime: new Date(endTime) },
          { counterDurationInMin, recommendationDurationInMin }
        )
      );
      chunkedTimes.push({
        startsAt: startTime,
        endsAt: endTime,
        isAvailable: !isAppointmentAtThatTime
      });
    }
    return chunkedTimes;
  }

  public isAppointmentBetweenDateRange(
    app: AvailabilityAppointment,
    user: User | AvailabilityDoctor,
    dateRange: { startTime: Date; endTime?: Date },
    durations: {
      counterDurationInMin: number;
      recommendationDurationInMin: number;
    }
  ) {
    const successStatus = AvailabilityAppointmentStatusEnum.SUCCEEDED,
      inProgressStatus = AvailabilityAppointmentStatusEnum.IN_PROGRESS,
      inProgressStatuses = [
        AvailabilityAppointmentStatusEnum.REQUEST_SENT_TO_DOCTOR,
        AvailabilityAppointmentStatusEnum.DOCTOR_ACCEPTED_REQUEST,
        AvailabilityAppointmentStatusEnum.IN_PROGRESS
      ],
      appointmentDurationAfterCounterInSec =
        app.appointmentDurationInSec + durations.recommendationDurationInMin * 60,
      scheduledEndDate =
        app.scheduledAt && addSeconds(app.scheduledAt, appointmentDurationAfterCounterInSec),
      recommendationStartDate =
        app.currentStatus === successStatus &&
        new Date(app.lifeTimeStatuses.find(s => s.status === successStatus).reachedAt),
      recommendationEndDate =
        app.currentStatus === successStatus &&
        addMinutes(recommendationStartDate, durations.recommendationDurationInMin),
      appointmentStartDate =
        app.currentStatus === inProgressStatus
          ? new Date(app.lifeTimeStatuses.find(s => s.status === inProgressStatus).reachedAt)
          : app.createdAt,
      appointmentEndDate = addMinutes(
        appointmentStartDate,
        appointmentDurationAfterCounterInSec / 60 +
          (app.currentStatus === inProgressStatus ? 0 : durations.counterDurationInMin)
      ),
      endTime = dateRange.endTime || new Date(new Date().setUTCHours(24, 0, 0)),
      inputRange = { start: dateRange.startTime, end: endTime },
      appointmentRange = { start: appointmentStartDate, end: appointmentEndDate },
      recommendationRange = { start: recommendationStartDate, end: recommendationEndDate },
      scheduledRange = { start: app.scheduledAt, end: scheduledEndDate };

    return (
      ((<User>user).role && (<User>user).role === UserRoleEnum.USER
        ? app.userId === (<User>user).id
        : app.doctorId === (<AvailabilityDoctor>user).id) &&
      ((app.scheduledAt &&
        (isWithinInterval(app.scheduledAt, inputRange) ||
          isWithinInterval(scheduledEndDate, inputRange) ||
          (isWithinInterval(inputRange.start, scheduledRange) &&
            isWithinInterval(inputRange.end, scheduledRange)))) ||
        (!app.scheduledAt &&
          !app.summary &&
          !(<User>user).role &&
          app.currentStatus === successStatus &&
          (isWithinInterval(recommendationStartDate, inputRange) ||
            isWithinInterval(recommendationEndDate, inputRange) ||
            (isWithinInterval(inputRange.start, recommendationRange) &&
              isWithinInterval(inputRange.end, recommendationRange)))) ||
        (!app.scheduledAt &&
          inProgressStatuses.includes(app.currentStatus) &&
          (isWithinInterval(appointmentStartDate, inputRange) ||
            isWithinInterval(appointmentEndDate, inputRange) ||
            (isWithinInterval(inputRange.start, appointmentRange) &&
              isWithinInterval(inputRange.end, appointmentRange)))))
    );
  }

  public extractDayIndexAndFromInMinutes(dayInTimestamp: number, timezone: Timezone) {
    const timezonedDayInTimestamp = timezone.minusSign
      ? dayInTimestamp - timezone.hours * 60 * 60 * 1000 + timezone.minutes * 60 * 1000
      : dayInTimestamp + timezone.hours * 60 * 60 * 1000 + timezone.minutes * 60 * 1000;
    const utcDayInTimestamp = dayInTimestamp;
    const timezonedDayIndex = new Date(timezonedDayInTimestamp as number).getUTCDay();
    let timezonedStartOfDay = timezonedDayInTimestamp;
    timezonedStartOfDay = new Date(timezonedDayInTimestamp as number).setUTCHours(0, 0, 0);
    const fromInMinutes = differenceInMinutes(
      new Date(utcDayInTimestamp as number),
      new Date(timezonedStartOfDay)
    );
    return { timezonedDayIndex, fromInMinutes, timezonedStartOfDay };
  }

  getAvailableTimesBasedOnTimezone(
    availabilityWithoutTimezone: AvailabilityDay[],
    timezone: Timezone
  ): AvailabilityDay[] {
    const availableAtWithTimezone: AvailabilityDay[] = this.initiateAvailabilityTimesObj();

    if (!availabilityWithoutTimezone.length) return availableAtWithTimezone;

    availabilityWithoutTimezone.map((obj, dayIndex) => {
      availableAtWithTimezone[dayIndex].isAvailable = obj.isAvailable || false;
      obj.shifts.map(shift => {
        // { fromInMinutes: -100, toInMinutes: 200 } or { fromInMinutes: -200, toInMinutes: -100 } or  { fromInMinutes: 100, toInMinutes: 200 } or  (NOT EXPECTED) { fromInMinutes: 200, toInMinutes: -100 }
        // { fromInMinutes: 1200, toInMinutes: 1400 } or { fromInMinutes: 1200, toInMinutes: 1700 } or  { fromInMinutes: 1500, toInMinutes: 1700 } or  (NOT EXPECTED) { fromInMinutes: 1500, toInMinutes: 1200 }
        const shiftBasedOnTimezone = this.getShiftBasedOnTimezone(shift, timezone);
        const pastDayIndex =
          dayIndex - 1 < AvailabilityConstants.FIRST_DAY_IN_WEEK_INDEX
            ? AvailabilityConstants.LAST_DAY_IN_WEEK_INDEX
            : dayIndex - 1;
        const nextDayIndex =
          dayIndex + 1 > AvailabilityConstants.LAST_DAY_IN_WEEK_INDEX
            ? AvailabilityConstants.FIRST_DAY_IN_WEEK_INDEX
            : dayIndex + 1;
        const absoluteFrom = Math.abs(shiftBasedOnTimezone.fromInMinutes);
        const absoluteTo = Math.abs(shiftBasedOnTimezone.toInMinutes);

        if (
          shiftBasedOnTimezone.fromInMinutes < AvailabilityConstants.REAL_FIRST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes >= AvailabilityConstants.REAL_FIRST_DAY_MINUTE
        ) {
          availableAtWithTimezone[pastDayIndex].shifts.push({
            fromInMinutes: AvailabilityConstants.REAL_LAST_DAY_MINUTE - absoluteFrom,
            toInMinutes: AvailabilityConstants.REAL_LAST_DAY_MINUTE
          });
          availableAtWithTimezone[dayIndex].shifts.push({
            fromInMinutes: AvailabilityConstants.REAL_FIRST_DAY_MINUTE,
            toInMinutes: absoluteTo
          });
        }

        // { fromInMinutes: -200, toInMinutes: -100 }
        if (
          shiftBasedOnTimezone.fromInMinutes < AvailabilityConstants.REAL_FIRST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes < AvailabilityConstants.REAL_FIRST_DAY_MINUTE
        ) {
          availableAtWithTimezone[pastDayIndex].shifts.push({
            fromInMinutes: AvailabilityConstants.REAL_LAST_DAY_MINUTE - absoluteFrom,
            toInMinutes: AvailabilityConstants.REAL_LAST_DAY_MINUTE - absoluteTo
          });
        }

        // { fromInMinutes: 100, toInMinutes: 200 } or { fromInMinutes: 1200, toInMinutes: 1400 }
        if (
          shiftBasedOnTimezone.fromInMinutes >= AvailabilityConstants.REAL_FIRST_DAY_MINUTE &&
          shiftBasedOnTimezone.fromInMinutes <= AvailabilityConstants.REAL_LAST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes >= AvailabilityConstants.REAL_FIRST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes <= AvailabilityConstants.REAL_LAST_DAY_MINUTE
        ) {
          availableAtWithTimezone[dayIndex].shifts.push({
            fromInMinutes: absoluteFrom,
            toInMinutes: absoluteTo
          });
        }

        // { fromInMinutes: 200, toInMinutes: -100 } or { fromInMinutes: 1500, toInMinutes: 1200 } (NOT EXPECTED)

        // { fromInMinutes: 1200, toInMinutes: 1700 }
        if (
          shiftBasedOnTimezone.fromInMinutes <= AvailabilityConstants.REAL_LAST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes > AvailabilityConstants.REAL_LAST_DAY_MINUTE
        ) {
          availableAtWithTimezone[dayIndex].shifts.push({
            fromInMinutes: absoluteFrom,
            toInMinutes: AvailabilityConstants.REAL_LAST_DAY_MINUTE
          });
          availableAtWithTimezone[nextDayIndex].shifts.push({
            fromInMinutes: AvailabilityConstants.REAL_FIRST_DAY_MINUTE,
            toInMinutes: absoluteTo - AvailabilityConstants.REAL_LAST_DAY_MINUTE
          });
        }

        // { fromInMinutes: 1500, toInMinutes: 1700 }
        if (
          shiftBasedOnTimezone.fromInMinutes > AvailabilityConstants.REAL_LAST_DAY_MINUTE &&
          shiftBasedOnTimezone.toInMinutes > AvailabilityConstants.REAL_LAST_DAY_MINUTE
        ) {
          availableAtWithTimezone[nextDayIndex].shifts.push({
            fromInMinutes: absoluteFrom - AvailabilityConstants.REAL_LAST_DAY_MINUTE,
            toInMinutes: absoluteTo - AvailabilityConstants.REAL_LAST_DAY_MINUTE
          });
        }
      });
    });

    return availableAtWithTimezone;
  }

  validateAvailabilityInputOrError(
    input: AvailabilityDay[],
    shiftMinDurationInSec?: number
  ): boolean {
    if (input.length !== AvailabilityConstants.WEEK_DAYS_LENGTH)
      throw new BaseHttpException(ErrorCodeEnum.PROVIDE_AVAILABILITY_FOR_ALL_DAYS);
    return input.every((day: AvailabilityDay) => {
      if (!day) throw new BaseHttpException(ErrorCodeEnum.PROVIDE_AVAILABILITY_FOR_ALL_DAYS);
      return day.shifts.every((shift: AvailabilityDayShift) => {
        if (
          shift.fromInMinutes <
            AvailabilityConstants.FIRST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES ||
          shift.fromInMinutes > AvailabilityConstants.LAST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES ||
          shift.toInMinutes < AvailabilityConstants.FIRST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES ||
          shift.toInMinutes > AvailabilityConstants.LAST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES
        )
          throw new BaseHttpException(ErrorCodeEnum.INCORRECT_DATE);
        if (shift.fromInMinutes >= shift.toInMinutes)
          throw new BaseHttpException(ErrorCodeEnum.FROM_VALUE_HIGHER_THAN_OR_EQUAL_TO_VALUE);

        if (
          shiftMinDurationInSec !== undefined &&
          (shift.toInMinutes - shift.fromInMinutes) * 60 < shiftMinDurationInSec
        )
          throw new BaseHttpException(ErrorCodeEnum.SHIFTS_DURATION_LESS_THAN_APPOINTMENT_DURATION);
      });
    });
  }

  validateAvailabilityByDayIndexInput(fromInMinutes?: number, toInMinutes?: number) {
    if (
      fromInMinutes &&
      fromInMinutes < AvailabilityConstants.FIRST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES
    )
      throw new BaseHttpException(400, 'Invalid `fromInMinutes` input');
    if (
      toInMinutes &&
      toInMinutes > AvailabilityConstants.LAST_POSSIBLE_DAY_MINUTE_BASED_ON_TIMEZONES
    )
      throw new BaseHttpException(400, 'Invalid `toInMinutes` input');
  }
}
