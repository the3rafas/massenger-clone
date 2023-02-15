import { AvailabilityAppointmentStatusEnum } from './availability.enum';

export interface AvailabilityDoctor {
  id: string;
}

export interface AvailabilityAppointmentLifeTimeStatuses {
  status: AvailabilityAppointmentStatusEnum;
  reachedAt: Date;
}

export interface AvailabilityAppointment {
  appointmentDurationInSec: number;
  scheduledAt?: Date;
  lifeTimeStatuses: AvailabilityAppointmentLifeTimeStatuses[];
  currentStatus: AvailabilityAppointmentStatusEnum;
  createdAt: Date;
  userId: string;
  doctorId: string;
  summary?: object;
}
