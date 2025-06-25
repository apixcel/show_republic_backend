import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialLoginService {
  constructor() {}
  async googleAuthCallBack(user: { email: string; name: string }) {
    const payload = {
      email: user.email,
      name: user.name,
    };

    return payload;
  }
}
