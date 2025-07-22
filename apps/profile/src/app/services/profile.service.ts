import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UpdateUserDto } from '@show-republic/dtos';
import { SubscriptionEntity, UserEntity } from '@show-republic/entities';

@Injectable()
export class ProfileService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.pgEm.fork().getRepository(UserEntity).findOne({ id: userId });
    return {
      ...user,
      password: undefined,
    };
  }

  async getProfileById(userId: string, currentUserId: string) {
    const user = await this.pgEm.fork().getRepository(UserEntity).findOne({ id: userId });
    const subscriberCount = await this.pgEm.fork().getRepository(UserEntity).count({ creatorAccount: userId });
    const isSubscribed = await this.pgEm
      .fork()
      .getRepository(SubscriptionEntity)
      .findOne({ creator: userId, subscriber: currentUserId });
    return {
      ...user,
      password: undefined,
      subscriberCount,
      isSubscribed: Boolean(isSubscribed),
    };
  }

  async updateUserProfile(userProfileDto: UpdateUserDto, userId: string) {
    const forkedEm = this.pgEm.fork();
    const userRepo = forkedEm.getRepository(UserEntity);

    const user = await userRepo.findOne({ id: userId });
    if (!user) {
      throw new RpcException('User not found');
    }

    if (userProfileDto.userName && userProfileDto.userName !== user.userName) {
      const existingUser = await userRepo.findOne({ userName: userProfileDto.userName });
      if (existingUser) {
        throw new RpcException('Username already exists');
      }
    }

    user.firstName = userProfileDto.firstName || user.firstName;
    user.lastName = userProfileDto.lastName || user.lastName;
    user.userName = userProfileDto.userName || user.userName;
    user.country = userProfileDto.country || user.country;
    user.bio = userProfileDto.bio || user.bio;
    user.websiteUrl = userProfileDto.websiteUrl || user.websiteUrl;
    user.contactNumber = userProfileDto.contactNumber || user.contactNumber;
    user.profilePicture = userProfileDto.profilePicture || user.profilePicture;
    user.coverPhoto = userProfileDto.coverPhoto || user.coverPhoto;

    await forkedEm.persistAndFlush(user);
    return {
      ...user,
      password: undefined,
    };
  }
}
