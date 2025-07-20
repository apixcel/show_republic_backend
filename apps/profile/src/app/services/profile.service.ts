import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ChangePasswordDto, UpdateUserDto } from '@show-republic/dtos';
import { UserEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, hashPassword } from '@show-republic/utils';

@Injectable()
export class ProfileService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) { }

  async getUserProfile(userId: string) {
    const user = await this.pgEm.fork().getRepository(UserEntity).findOne({ id: userId });
    return {
      ...user,
      password: undefined,
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

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const forkedEm = this.pgEm.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const user = await userRepo.findOne({ id: userId });

    if (!user) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    // Verify new passwords match
    //@ts-ignore
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new RpcException(new BadRequestException('New passwords do not match'));
    }

    const isPasswordValid = await comparePassword(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
    }

    user.password = await hashPassword(changePasswordDto.newPassword);
    await forkedEm.persistAndFlush(user);

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

}
