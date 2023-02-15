import { User } from 'src/user/models/user.model';
import { AgoraMediaTypeEnum } from '../agora.enum';
import { AgoraAppointmentMessage } from '../interfaces/appointment-message.interface';
import { AgoraAppointment } from '../interfaces/appointment.interface';

export interface AgoraGenerateTokenTransformerInput {
  appointment: AgoraAppointment;
  uniqueId: string;
  message: AgoraAppointmentMessage;
  fromUser: User;
  preGeneratedCallId: string;
  mediaType: AgoraMediaTypeEnum;
  uid: number;
  otherUid: number;
  publisherToken: string;
  customerToken: string;
}
