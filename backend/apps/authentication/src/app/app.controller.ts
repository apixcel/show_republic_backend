import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, UserDto, UserPreferencesDto } from '@show-republic/dtos';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Controller()
export class AppController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @MessagePattern({ cmd: 'auth_login' })
  login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.loginService.login(loginDto);
  }

  @MessagePattern({ cmd: 'auth_register' })
  register({
    preferences,
    ...userDto
  }: UserDto & { preferences: UserPreferencesDto }): Promise<null> {
    return this.registerService.register(userDto, preferences);
  }

  @MessagePattern({ cmd: 'auth_test' })
  test(): string {
    return 'Hello World!';
  }
}
