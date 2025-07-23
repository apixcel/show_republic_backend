import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { SubscribeToCreatorDto } from '@show-republic/dtos';
import { CreatorEntity, SubscriptionEntity } from '@show-republic/entities';

export class SubscriptionService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async subscribeToCreatorAccount(subscribeToCreatorDto: SubscribeToCreatorDto, userId: string) {
    const { userId: creatorUserId } = subscribeToCreatorDto;
    const forkedEm = this.pgEm.fork();

    const creator = await forkedEm.getRepository(CreatorEntity).findOne({ user: creatorUserId });
    if (!creator) {
      throw new RpcException('Creator not found.');
    }

    const isSubscribed = await forkedEm.getRepository(SubscriptionEntity).findOne({ subscriber: userId });
    if (isSubscribed) {
      await forkedEm.removeAndFlush(isSubscribed);
      return null;
    }

    const subscription = forkedEm
      .getRepository(SubscriptionEntity)
      .create({ subscriber: userId, creator: creator, isActive: true, postId: subscribeToCreatorDto.postId });
    await forkedEm.persistAndFlush(subscription);

    return subscribeToCreatorDto;
  }

  async getSubscriberCount(userId: string) {
    const forkedEm = this.pgEm.fork();
    const creator = await forkedEm.getRepository(CreatorEntity).findOne({ user: userId });
    if (!creator) {
      throw new RpcException('Creator not found.');
    }
    const creatorId = creator.id;

    const count = await forkedEm.getRepository(SubscriptionEntity).count({ creator: creatorId });

    return { count };
  }

  async subcriptionSuggestions(userId: string, query: Record<string, any>) {
    const forkedEm = this.pgEm.fork();

    const existingSubscriptions = await forkedEm
      .getRepository(SubscriptionEntity)
      .find({ subscriber: userId }, { populate: ['creator'] });

    const subscribedCreatorIds = new Set(
      existingSubscriptions.map((sub) => (typeof sub.creator === 'object' ? sub.creator.id : sub.creator)),
    );

    const filter: Record<string, any> = {};
    if (query.accountType) {
      filter.accountType = query.accountType;
    }

    const allCreators = await forkedEm.getRepository(CreatorEntity).find(filter, {
      populate: ['user'],
    });

    const suggestions = allCreators
      .filter((creator) => !subscribedCreatorIds.has(creator.id))
      .map((creator) => ({
        ...creator,
        user: {
          firstName: creator.user?.firstName,
          lastName: creator.user?.lastName,
          userName: creator.user?.userName,
          profilePicture: creator.user?.profilePicture,
          coverPhoto: creator.user?.coverPhoto,
          _id: creator.user.id,
        },
      }));

    return suggestions;
  }

  async getMySubscriptions(userId: string) {
    const forkedEm = this.pgEm.fork();

    const subscriptions = await forkedEm
      .getRepository(SubscriptionEntity)
      .find({ subscriber: userId }, { populate: ['creator.user'] });

    const result = subscriptions.map((sub) => {
      const creator = sub.creator;
      const user = creator.user;

      return {
        ...creator,
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          userName: user?.userName,
          profilePicture: user?.profilePicture,
          coverPhoto: user?.coverPhoto,
          _id: user.id,
        },
      };
    });

    return result;
  }
}
