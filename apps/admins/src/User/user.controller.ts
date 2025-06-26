import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AdminDto, UpdateUserDto } from '@show-republic/dtos';
import { ViewUsersService } from './services/ViewUsersService';
import { AuthService } from './services/auth.service';

@Controller()
export class AdminUsersController {
  constructor(
    private readonly viewUsersService: ViewUsersService,
    private readonly authService: AuthService,
  ) {}
  // ****** View Profile *******
  @MessagePattern({ cmd: 'viewAdmins' })
  async viewAdmins(userId: string): Promise<any> {
    return await this.viewUsersService.view(); // Renamed method to reflect purpose
  }

  @MessagePattern({ cmd: 'admin.login' })
  async login(payload: any): Promise<any> {
    return await this.authService.login(payload); // Renamed method to reflect purpose
  }

  @MessagePattern({ cmd: 'admin.signup' })
  async signup(payload: AdminDto): Promise<any> {
    return await this.authService.signup(payload); // Renamed method to reflect purpose
  }
}
