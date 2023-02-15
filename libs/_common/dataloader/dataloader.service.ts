import { Inject, Injectable } from '@nestjs/common';
import { NotificationDataloader } from '../../notification/notification.dataloader';
import { User } from '../../user/models/user.model';
import { UserDataloader } from '../../user/user.dataloader';
import { IDataLoaders, IDataLoaderService } from './dataloader.interface';

@Injectable()
export class DataloaderService implements IDataLoaderService {
  constructor(
    @Inject(UserDataloader) private readonly userLoader: IDataLoaderService,
    @Inject(NotificationDataloader) private readonly notificationLoader: IDataLoaderService
  ) {}

  createLoaders(currentUser: User): IDataLoaders {
    return {
      ...this.userLoader.createLoaders(),
      ...this.notificationLoader.createLoaders(currentUser)
    };
  }
}
