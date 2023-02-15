import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AgoraService } from './agora.service';
import {
  GqlGenerateAgoraTokenResponse,
  GqlAgoraRequestReplyResponse,
  GqlAgoraChangeStatusResponse
} from './agora.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { GenerateAgoraTokenInput } from './inputs/generate-agora-token.input';
import { AgoraRequestReplyInput } from './inputs/agora-request-reply.input';
import { AgoraChangeStatusInput } from './inputs/agora-change-status.input';

@Resolver()
export class AgoraResolver {
  constructor(private readonly agoraService: AgoraService) {}

  //** --------------------- MUTATIONS --------------------- */

  @Mutation(returns => GqlGenerateAgoraTokenResponse)
  async generateAgoraToken(@Args('input') input: GenerateAgoraTokenInput) {
    return await this.agoraService.generateAgoraToken(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlAgoraRequestReplyResponse)
  async replyAgoraMediaRequest(@Args('input') input: AgoraRequestReplyInput) {
    return await this.agoraService.replyMediaRequest(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlAgoraChangeStatusResponse)
  async changeAgoraMediaStatus(@Args('input') input: AgoraChangeStatusInput) {
    return await this.agoraService.changeAgoraMediaStatus(input);
  }
}
