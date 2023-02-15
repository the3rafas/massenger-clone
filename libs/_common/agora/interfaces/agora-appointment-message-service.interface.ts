import { AppointmentMessageInput } from '../inputs/appointment-message.input';
import { CreateAppointmentMessageMediaInput } from '../inputs/create-appointment-message-media.input';
import { UpdateAppointmentMessageMediaInput } from '../inputs/update-appointment-message-media.input';
import { AgoraAppointmentMessage } from './appointment-message.interface';

export const IAgoraAppointmentMessageServiceToken = 'IAgoraAppointmentMessageService';

export interface IAgoraAppointmentMessageService {
  appointmentMessageOrError(input: AppointmentMessageInput): Promise<AgoraAppointmentMessage>;

  createAppointmentMessageMedia(
    input: CreateAppointmentMessageMediaInput
  ): Promise<AgoraAppointmentMessage>;

  updateAppointmentMessageMedia(
    input: UpdateAppointmentMessageMediaInput
  ): Promise<AgoraAppointmentMessage>;
}
