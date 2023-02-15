import { User } from 'src/user/models/user.model';

export interface AgoraDoctor {
  id: string;
  userId: string;
  user: User;
}
