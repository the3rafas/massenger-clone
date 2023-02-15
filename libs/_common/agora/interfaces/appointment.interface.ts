import { User } from 'src/user/models/user.model';
import { AgoraDoctor } from './agora-doctor.interface';

export interface AgoraAppointment {
  id: string;
  userId: string;
  user: User;
  doctorId: string;
  doctor: AgoraDoctor;
  appointmentDurationInSec: number;
  attachments?: string[];
}
