import { Injectable } from '@nestjs/common';
import { AgoraAppointmentStatusEnum } from '../agora.enum';
import { AgoraAppointment } from '../interfaces/appointment.interface';

// Inherit from the parent class to override these methods with appropriate implementation
@Injectable()
export class AgoraAppointmentService {
  validAppointmentToCurrentUser(
    appointmentId: string,
    validStatus?: AgoraAppointmentStatusEnum[]
  ): Promise<AgoraAppointment> {
    return;
  }

  getActualStartingDate(appointment: AgoraAppointment): number {
    return;
  }

  getEstimatedEndingDate(appointment: AgoraAppointment): number {
    return;
  }
}
