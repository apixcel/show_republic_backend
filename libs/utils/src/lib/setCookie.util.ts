import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SetCookieUtilService {
  constructor(private configService: ConfigService) {}
  setCookie(
    { res, token, cookieName }: { res: any; token: string; cookieName: string },
    options?: Record<string, any>,
  ) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie(cookieName, token, {
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
      httpOnly: true,
      secure: isProduction,
      ...options,
    });
  }
}
