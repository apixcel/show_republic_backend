import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET')!,
      callbackURL: configService.get('SERVER_URL')! + '/api/auth/google/callback',
      scope: ['email', 'profile'],
    });

    console.log(configService.get('SERVER_URL')! + '/api/auth/google/callback');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      name: { givenName: string };
      emails: [{ value: string }];
      photos: [{ value: string }];
    },
    done: VerifyCallback,
  ): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
