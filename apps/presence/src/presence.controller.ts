import { SharedService } from '@app/shared';
import { AuthGuard } from '@app/shared/auth.guard';
import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-Message' })
  async getMessage(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    this.authGuard.hasjwt('1213');
    return { message: 'message' };
  }

  @MessagePattern({ cmd: 'get-Messages' })
  async getMessages(@Ctx() context: RmqContext) {
    return { message: 'messages' };
  }
}
