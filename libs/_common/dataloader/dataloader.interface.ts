import { User } from '../../user/models/user.model';
import {
  NotificationParentLoaderType,
  NotificationReceiversLoaderType,
  SecurityGroupLoaderType,
  UserLoaderType
} from './dataloader.type';

export interface IDataLoaderService {
  createLoaders(current?: User);
}

export interface IDataLoaders {
  securityGroupLoader: SecurityGroupLoaderType;
  userLoader: UserLoaderType;
  notificationParentLoader: NotificationParentLoaderType;
  notificationReceiversLoader: NotificationReceiversLoaderType;
}
