import { Module } from '@nestjs/common';
import { NotificationModule } from '../../notification/notification.module';
import { UserModule } from '../../user/user.module';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [NotificationModule, UserModule],
  providers: [DataloaderService],
  exports: [DataloaderService]
})
export class DataloaderModule {}
