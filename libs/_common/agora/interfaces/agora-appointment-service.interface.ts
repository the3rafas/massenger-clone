import { AgoraAppointmentStatusEnum } from '../agora.enum';
import { AgoraAppointment } from './appointment.interface';

export const IAgoraAppointmentServiceToken = 'IAgoraAppointmentService';

export interface IAgoraAppointmentService {
  getActualStartingDate(appointment: AgoraAppointment): number;

  getEstimatedEndingDate(appointment: AgoraAppointment, actualStarting: number): number;

  validAppointmentToCurrentUser(
    appointmentId: string,
    validStatus?: AgoraAppointmentStatusEnum[]
  ): Promise<AgoraAppointment>;
}
