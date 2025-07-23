import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatorDto, SubscribeToCreatorDto } from '@show-republic/dtos';
import { CreatorService } from './services/creator.service';
import { CreatorChannelService } from './services/creatorChannel.service';
import { SubscriptionService } from './services/subscription.service';

@Controller()
export class AppController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly creatorChannelService: CreatorChannelService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @MessagePattern({ cmd: 'create_creator_profile' })
  createCreatorProfile({ payload, userId }: { payload: CreatorDto; userId: string }) {
    return this.creatorService.createCreatorAccount(payload, userId);
  }
  @MessagePattern({ cmd: 'get_creator_profile' })
  getUserCreatorAccount(userId: string) {
    return this.creatorService.getUserCreatorAccount(userId);
  }

  // ---------- channel api start-----
  @MessagePattern({ cmd: 'get_creator_channel_shows' })
  getUserChannelShows({
    userId,
    limit,
    page,
    sort,
    sortBy,
  }: {
    userId: string;
    page?: number;
    limit?: number;
    sort?: string;
    sortBy?: string;
  }) {
    return this.creatorChannelService.getUserChannelShows({ userId, page, limit, sort, sortBy });
  }

  @MessagePattern({ cmd: 'creator_subcription_suggestions' })
  subcriptionSuggestions({ userId, query }: { userId: string; query: Record<string, any> }) {
    return this.subscriptionService.subcriptionSuggestions(userId, query);
  }

  @MessagePattern({ cmd: 'subscribe_to_creator' })
  subscribeToCreatorAccount({ payload, userId }: { payload: SubscribeToCreatorDto; userId: string }) {
    return this.subscriptionService.subscribeToCreatorAccount(payload, userId);
  }
  @MessagePattern({ cmd: 'get_creator_subscriber_count' })
  getSubscriberCount(userId: string) {
    return this.subscriptionService.getSubscriberCount(userId);
  }
  @MessagePattern({ cmd: 'get_my_subscriptions' })
  getMySubscriptions(userId: string) {
    return this.subscriptionService.getMySubscriptions(userId);
  }
}
