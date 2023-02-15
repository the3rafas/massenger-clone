import { NotificationPayload } from 'src/notification/notification.type';
import { User } from 'src/user/models/user.model';

export const IAgoraPusherServiceToken = 'IAgoraPusherService';

export interface IAgoraPusherService {
  push(
    toUsers: User[],
    payloadData: NotificationPayload,
    fromUser?: User,
    notificationParentId?: string,
    scheduledTime?: Date
  ): Promise<{ status: string }>;
}
