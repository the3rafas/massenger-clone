import { AgoraAppointmentMessageMedia } from '../agora.type';

export interface AgoraAppointmentMessage {
  id: string;
  media: AgoraAppointmentMessageMedia;
  uniqueId: string;
  fromUserId: string;
  toUserId: string;
}
