import { ChangeMediaStatusEnum, MediaRequestReplyEnum } from '../agora.enum';
import { AgoraAppointmentMessage } from '../interfaces/appointment-message.interface';

export interface UpdateAppointmentMessageMediaInput {
  appointmentMessage: AgoraAppointmentMessage;
  requestReply?: MediaRequestReplyEnum;
  changedStatus?: ChangeMediaStatusEnum;
  durationInSec?: number;
}
