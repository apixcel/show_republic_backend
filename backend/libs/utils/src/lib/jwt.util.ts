import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtUtilService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public generateAccessToken({ email, userId }: { email: string; userId: string }): string {
    const JWT_SECRET_KEY = this.configService.get<string>('JWT_SECRET_KEY');
    const JWT_EXPIRE_KEY = this.configService.get<string>('JWT_EXPIRE_KEY');

    const token = this.jwtService.sign(
      { email, userId },
      {
        expiresIn: JWT_EXPIRE_KEY,
        secret: JWT_SECRET_KEY,
      },
    );

    return token;
  }
  public generateRefreshToken({ email, userId }: { email: string; userId: string }): string {
    const JWT_SECRET_KEY = this.configService.get<string>('JWT_SECRET_KEY');
    const JWT_EXPIRE_KEY = this.configService.get<string>('JWT_EXPIRE_KEY');

    const token = this.jwtService.sign(
      { email, userId },
      {
        expiresIn: JWT_EXPIRE_KEY,
        secret: JWT_SECRET_KEY,
      },
    );

    return token;
  }
}
