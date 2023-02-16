import { SharedService } from '@app/shared';
import { CurrentUser } from '@app/shared/getUser.decorator';
import { JwtGuard } from '@app/shared/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from 'apps/auth/src/user/entities/user.entity';
import { CreatMessageDto } from './message/dto/craete-message.dto';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-Message' })
  async getMessage(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.presenceService.getAll();
  }

  @MessagePattern({ cmd: 'create-Message' })
  @UseGuards(JwtGuard)
  async getMessages(
    @Ctx() context: RmqContext,
    @Payload() input: CreatMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.presenceService.create(input);
  }
}
