import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import {
  GqlGenerateAgoraTokenResponse,
  GqlAgoraRequestReplyResponse,
  GqlAgoraChangeStatusResponse
} from './agora.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { NotificationTypeEnum } from 'src/notification/notification.enum';

import { GenerateAgoraTokenSubscriptionInput } from './inputs/generate-agora-token-subscription.input';
import { AgoraRequestReplySubscriptionInput } from './inputs/agora-request-reply-subscription.input';
import { AgoraChangeStatusSubscriptionInput } from './inputs/agora-change-status-subscription.input';

@Resolver()
export class AgoraSubscriptionResolver {
  constructor(@Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}

  //** --------------------- SUBSCRIPTIONS --------------------- */

  @UseGuards(AuthGuard)
  @Subscription(returns => GqlGenerateAgoraTokenResponse, {
    resolve: value => value.res,
    filter: (payload, variables, ctx) =>
      payload.otherUserId === ctx.currentUser.id &&
      payload.res.data.channelName === variables.input.appointmentId
  })
  agoraAccessTokenGenerated(@Args('input') input: GenerateAgoraTokenSubscriptionInput) {
    return this.pubSub.asyncIterator(NotificationTypeEnum.AGORA_ACCESS_TOKEN_GENERATED);
  }

  @UseGuards(AuthGuard)
  @Subscription(returns => GqlAgoraRequestReplyResponse, {
    resolve: value => value.res,
    filter: (payload, variables, ctx) =>
      payload.otherUserId === ctx.currentUser.id &&
      payload.res.data.appointmentId === variables.input.appointmentId
  })
  agoraMediaRequestReplied(@Args('input') input: AgoraRequestReplySubscriptionInput) {
    return this.pubSub.asyncIterator(NotificationTypeEnum.AGORA_MEDIA_REQUEST_REPLIED);
  }

  @UseGuards(AuthGuard)
  @Subscription(returns => GqlAgoraChangeStatusResponse, {
    resolve: value => value.res,
    filter: (payload, variables, ctx) =>
      payload.otherUserId === ctx.currentUser.id &&
      payload.res.data.appointmentId === variables.input.appointmentId
  })
  agoraMediaStatusChanged(@Args('input') input: AgoraChangeStatusSubscriptionInput) {
    return this.pubSub.asyncIterator(NotificationTypeEnum.AGORA_MEDIA_STATUS_CHANGED);
  }
}
