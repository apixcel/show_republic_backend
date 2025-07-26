import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentType} from '@show-republic/types'; // Adjust the path as necessary

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService<EnvironmentType, true>) {}

  public get nodeEnv(): 'development' | 'production' {
    return this.config.get<'development' | 'production'>('NODE_ENV');
  }

  public get port(): number {
    return this.config.get<number>('PORT');
  }

  public get email(): string {
    return this.config.get<string>('EMAIL');
  }

  public get MONGO_CLIENT_URL(): string {
    return this.config.get<string>('MONGO_CLIENT_URL');
  }


  public get JWT_EXPIRE_KEY(): string {
    return this.config.get<string>('JWT_EXPIRE_KEY');
  }

  public get JWT_SECRET_KEY(): string {
    return this.config.get<string>('JWT_SECRET_KEY');
  }

  public get pass(): string {
    return this.config.get<string>('PASS');
  }

  public get isDevEnv(): boolean {
    return this.nodeEnv === 'development';
  }

  public get isProdEnv(): boolean {
    return this.nodeEnv === 'production';
  }


  public get DEFAULT_OTP_LENGTH(): number {
    return this.config.get<number>('DEFAULT_OTP_LENGTH');
  }

  public get DEFAULT_ITEM_ALPHABET(): string {
    return this.config.get<string>('DEFAULT_ITEM_ALPHABET');
  }

  public get OTP_EXPIRY_MINUTES(): number {
    return this.config.get<number>('OTP_EXPIRY_MINUTES');
  }
  public get JWT_RESET_SECRET(): string {
    return this.config.get<string>('JWT_RESET_SECRET');
  }
  public get SERVER_URL(): string {
    return this.config.get<string>('SERVER_URL');
  }
  public get FRONTEND_URL(): string {
    return this.config.get<string>('FRONTEND_URL');
  }
  public get GOOGLE_AUTH_CLIENT_ID(): string {
    return this.config.get<string>('GOOGLE_AUTH_CLIENT_ID');
  }
  public get GOOGLE_AUTH_CLIENT_SECRET(): string {
    return this.config.get<string>('GOOGLE_AUTH_CLIENT_SECRET');
  }

}
