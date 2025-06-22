import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from '@show-republic/dtos';
import { LoginService } from './services/login.service';

@Controller()
export class AppController {
  constructor(private readonly authenticationService: LoginService) {}

  @MessagePattern({ cmd: 'auth_login' })
  login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authenticationService.login(loginDto);
  }

  @MessagePattern({ cmd: 'auth_test' })
  test(): string {
    return 'Hello World!';
  }
}
