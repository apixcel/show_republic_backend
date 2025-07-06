import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AdminProfileDto,
  ChangePasswordDto,
  LoginDto,
  SendAdminInvitationDto,
  UpdateNotificationPreferencesDto,
} from '@show-republic/dtos';
import { UserStatus } from '@show-republic/entities';
import { AdminAuthService } from './services/adminAuth.service';
import { AdminManagementService } from './services/adminManageMent.service';
import { AdminNotificatonService } from './services/adminNotification.service';
import { UserManagementService } from './services/userManagement.service';

@Controller()
export class AppController {
  constructor(
    private readonly adminService: AdminAuthService,
    private readonly userManagementService: UserManagementService,
    private readonly adminManagementService: AdminManagementService,
    private readonly adminNotificationService: AdminNotificatonService,
  ) {}

  @MessagePattern({ cmd: 'admin_login' })
  login(loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @MessagePattern({ cmd: 'admin_change_password' })
  changePassword({ adminId, changePasswordDto }: { adminId: string; changePasswordDto: ChangePasswordDto }) {
    return this.adminService.changePassword(adminId, changePasswordDto);
  }
  @MessagePattern({ cmd: 'admin_profile' })
  getAdminProfile(adminId: string) {
    return this.adminService.getAdminProfile(adminId);
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
  @MessagePattern({ cmd: 'admin_am_create_profile' })
  createAdminProfile({ adminProfileDto, token }: { adminProfileDto: AdminProfileDto; token: string }) {
    return this.adminManagementService.createAdminProfileByInvitationToken(adminProfileDto, token);
  }

  @MessagePattern({ cmd: 'admin_am_send_invitation' })
  sendInvitationLink(sendAdminInvitationDto: SendAdminInvitationDto) {
    return this.adminManagementService.sendInvitationLink(sendAdminInvitationDto);
  }

  @MessagePattern({ cmd: 'admin_am_get_profile' })
  getAdminProfileByAdminId(adminId: string) {
    return this.adminManagementService.getAdminProfileByAdminId(adminId);
  }

  // notification
  @MessagePattern({ cmd: 'admin_notification_my' })
  getAdminNotification({ adminId, query }: { adminId: string; query: Record<string, any> }) {
    return this.adminNotificationService.getAdminNotification(adminId, query);
  }
  @MessagePattern({ cmd: 'admin_notification_my_preference' })
  getAdminNotificationPreference(adminId: string) {
    return this.adminNotificationService.getAdminNotificationPreference(adminId);
  }
  @MessagePattern({ cmd: 'admin_notification_update_preference' })
  updateAdminNotificationPreference({
    adminId,
    payload,
  }: {
    adminId: string;
    payload: UpdateNotificationPreferencesDto;
  }) {
    return this.adminNotificationService.updateAdminNotificationPreference(adminId, payload);
  }
}
