import { User } from 'src/user/models/user.model';
import { AgoraMediaTypeEnum } from '../agora.enum';
import { AgoraAppointment } from '../interfaces/appointment.interface';

export interface CreateAppointmentMessageMediaInput {
  toUser: User;
  fromUser: User;
  appointment: AgoraAppointment;
  uniqueId: string;
  mediaType: AgoraMediaTypeEnum;
  uid: number;
  otherUid: number;
  preGeneratedCallId: string;
}
