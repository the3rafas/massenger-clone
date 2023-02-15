import * as DataLoader from 'dataloader';
import { SecurityGroup } from '../../security-group/entity/security-group.model';
import { User } from '../../user/models/user.model';
import { Notification } from '../../notification/models/notification.model';
import { NotificationReceiver } from '../../notification/notification.type';

export type UserLoaderType = DataLoader<string, User>;
export type SecurityGroupLoaderType = DataLoader<string, SecurityGroup>;
export type NotificationParentLoaderType = DataLoader<Notification, any>;
export type NotificationReceiversLoaderType = DataLoader<Notification, NotificationReceiver[]>;

export type UserDataLoaderType = {
  userLoader: UserLoaderType;
  securityGroupLoader: SecurityGroupLoaderType;
};

export type NotificationDataLoaderType = {
  notificationParentLoader: NotificationParentLoaderType;
  notificationReceiversLoader: NotificationReceiversLoaderType;
};
