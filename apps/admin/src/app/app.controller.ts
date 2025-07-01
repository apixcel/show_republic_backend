import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from '@show-republic/dtos';
import { UserStatus } from '@show-republic/entities';
import { AdminAuthService } from './services/adminAuth.service';
import { AdminManagementService } from './services/adminManageMent.service';
import { UserManagementService } from './services/userManagement.service';

@Controller()
export class AppController {
  constructor(
    private readonly adminService: AdminAuthService,
    private readonly userManagementService: UserManagementService,
    private readonly adminManagementService: AdminManagementService,
  ) {}

  @MessagePattern({ cmd: 'admin_login' })
  login(loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @MessagePattern({ cmd: 'admin_um_get_u' })
  getAllUser(query: Record<string, any>) {
    return this.userManagementService.getAllUsers(query);
  }
  @MessagePattern({ cmd: 'admin_um_get_u_state' })
  getUserProfileState(userId: string) {
    return this.userManagementService.getUserProfileState(userId);
  }

  @MessagePattern({ cmd: 'admin_um_change_status' })
  changeUserStatus({ userId, status }: { userId: string; status: UserStatus }) {
    return this.userManagementService.changeUserStatus(userId, status);
  }
  @MessagePattern({ cmd: 'admin_am_get_a' })
  getAllAdmins(query: Record<string, any>) {
    return this.adminManagementService.getAllAdmins(query);
  }
  @MessagePattern({ cmd: 'admin_am_count_by_role' })
  countAdminsByRole() {
    return this.adminManagementService.countAdminsByRole();
  }
}
