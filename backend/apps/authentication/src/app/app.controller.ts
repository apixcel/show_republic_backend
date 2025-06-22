import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginService } from './services/login.service';

@Controller()
export class AppController {
  constructor(private readonly authenticationService: LoginService) {}

  @MessagePattern({ cmd: 'auth_login' })
  login(): string {
    return this.authenticationService.login();
  }

  @MessagePattern({ cmd: 'auth_test' })
  test(): string {
    return 'Hello World!';
  }
}
