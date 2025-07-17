import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ChangePasswordDto, ResetPasswordDto } from '@show-republic/dtos';
import { UserEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, hashPassword, SendEmailService } from '@show-republic/utils';

@Injectable()
export class PasswordService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: SendEmailService,
  ) {}
  async forgotPasswordRequest(userEmail: string) {
    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const user = await userRepo.findOne({ email: userEmail });
    if (!user) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }
    const payload = { email: user.email, userId: user.id };

    const secret = this.configService.get('JWT_RESET_SECRET') + user.id;

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret,
    });

    await this.emailService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="http://localhost:3000/reset-password?token=${token}">here</a> to reset your password.</p>`,
    });
    return {
      message: 'Email sent successfully',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    // Decode the token without verifying to extract the userId
    const decoded = this.jwtService.decode(token) as {
      userId: string;
      email: string;
    };
    if (!decoded || !decoded.userId) {
      throw new RpcException(new NotFoundException('Invalid or expired token'));
    }

    const secret = this.configService.get('JWT_RESET_SECRET') + decoded.userId;

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      throw new RpcException(new NotFoundException('Token verification failed or expired'));
    }

    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const user = await userRepo.findOne({ id: payload.userId });

    if (!user) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword; // Make sure the entity hashes this if needed
    await forkedEm.flush();

    return {
      message: 'Password has been reset successfully',
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(UserEntity);

    const user = await adminRepo.findOne({ id: userId });

    if (!user) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    const isPasswordValid = await comparePassword(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
    }

    user.password = await hashPassword(changePasswordDto.newPassword);
    await forkedEm.persistAndFlush(user);
    return true;
  }
}
