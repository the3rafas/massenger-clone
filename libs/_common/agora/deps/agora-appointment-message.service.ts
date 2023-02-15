import { Injectable } from '@nestjs/common';
import { AppointmentMessageInput } from '../inputs/appointment-message.input';
import { CreateAppointmentMessageMediaInput } from '../inputs/create-appointment-message-media.input';
import { UpdateAppointmentMessageMediaInput } from '../inputs/update-appointment-message-media.input';
import { IAgoraAppointmentMessageService } from '../interfaces/agora-appointment-message-service.interface';
import { AgoraAppointmentMessage } from '../interfaces/appointment-message.interface';

// Inherit from the parent class to override these methods with appropriate implementation
@Injectable()
export class AgoraAppointmentMessageService implements IAgoraAppointmentMessageService {
  appointmentMessageOrError(input: AppointmentMessageInput): Promise<AgoraAppointmentMessage> {
    return;
  }

  createAppointmentMessageMedia(
    input: CreateAppointmentMessageMediaInput
  ): Promise<AgoraAppointmentMessage> {
    return;
  }

  updateAppointmentMessageMedia(
    input: UpdateAppointmentMessageMediaInput
  ): Promise<AgoraAppointmentMessage> {
    return;
  }
}
