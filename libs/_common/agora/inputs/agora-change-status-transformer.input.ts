import { ChangeMediaStatusEnum } from '../agora.enum';
import { AgoraAppointmentMessage } from '../interfaces/appointment-message.interface';
import { AgoraAppointment } from '../interfaces/appointment.interface';

export interface AgoraChangeStatusTransformerInput {
  appointmentMessage: AgoraAppointmentMessage;
  appointment: AgoraAppointment;
  changedStatus: ChangeMediaStatusEnum;
  uniqueId: string;
}
