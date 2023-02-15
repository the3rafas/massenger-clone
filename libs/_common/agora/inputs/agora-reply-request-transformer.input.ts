import { MediaRequestReplyEnum } from '../agora.enum';
import { AgoraAppointmentMessageMedia } from '../agora.type';
import { AgoraAppointmentMessage } from '../interfaces/appointment-message.interface';
import { AgoraAppointment } from '../interfaces/appointment.interface';

export interface AgoraReplyRequestTransformerInput {
  appointmentMessage: AgoraAppointmentMessage;
  reply: MediaRequestReplyEnum;
  media: AgoraAppointmentMessageMedia;
  appointment: AgoraAppointment;
  uniqueId: string;
}
