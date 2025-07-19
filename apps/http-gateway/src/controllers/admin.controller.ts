import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  AdminProfileDto,
  ChangePasswordDto,
  ChangeUserStatusDto,
  CreateRoleDto,
  LoginDto,
  SendAdminInvitationDto,
  UpdateNotificationPreferencesDto,
  UpdateRolePermissionsDto,
} from '@show-republic/dtos';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller('admin')
export class AdminController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const res = await lastValueFrom(this.natsClient.send({ cmd: 'admin_login' }, payload));
    return res;
  }

  // user management
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.userId;

    const res = await lastValueFrom(
      this.natsClient.send({ cmd: 'admin_change_password' }, { adminId: userId.toString(), changePasswordDto }),
    );
    return res;
  }
  // user management
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getAdminProfile(@Req() req: any) {
    const userId = req.user.userId;
    const res = await lastValueFrom(this.natsClient.send({ cmd: 'admin_profile' }, userId));
    return res;
  }

  @Post('signup')
  async signup(@Body() payload: any) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_signup' }, payload));
    return res;
  }

  // user management
  @UseGuards(AuthGuard('jwt'))
  @Get('um/get-all')
  async getAllUser(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_um_get_u' }, query));
    return res;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('um/get-user-state/:userId')
  async getUserProfileState(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_um_get_u_state' }, query));
    return res;
  }

  @Post('um/update/change-status')
  async changeUserStatus(@Body() payload: ChangeUserStatusDto) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_um_change_status' }, payload));
    return res;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('am/get-all')
  async getAllAdmins(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_get_a' }, query));
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('am/count-by-role')
  async countAdminsByRole(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_count_by_role' }, {}));
    return res;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('am/send-invitation')
  async sendInvitationLink(@Body() sendAdminInvitationDto: SendAdminInvitationDto) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_send_invitation' }, sendAdminInvitationDto));
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('am/create-profile/:token')
  async createAdminProfile(@Body() adminProfileDto: AdminProfileDto, @Param('token') token: string) {
    const res = await firstValueFrom(
      this.natsClient.send({ cmd: 'admin_am_create_profile' }, { adminProfileDto, token }),
    );
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('am/get-profile/:adminId')
  async getAdminProfileByAdminId(@Param('adminId') adminId: string) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_get_profile' }, adminId));
    return res;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('notification/my')
  async getAdminNotification(@Query() query: Record<string, any>, @Req() req: any) {
    const adminId = req.user.userId;
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_notification_my' }, { adminId, query }));
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('notification/my/preference')
  async getAdminNotificationPreference(@Req() req: any) {
    const adminId = req.user.userId;
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_notification_my_preference' }, adminId));
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('notification/update-preference')
  async updateAdminNotificationPreference(@Req() req: any, @Body() payload: UpdateNotificationPreferencesDto) {
    const adminId = req.user.userId;
    const res = await firstValueFrom(
      this.natsClient.send({ cmd: 'admin_notification_update_preference' }, { adminId, payload }),
    );
    return res;
  }

  // role permission api start
  @UseGuards(AuthGuard('jwt'))
  @Post('role-permission/create')
  async createRole(@Body() dto: CreateRoleDto, @Req() req: any) {
    // Optionally use user info for auditing
    const userId = req.user.userId;
    return await lastValueFrom(this.natsClient.send({ cmd: 'create_role' }, dto));
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('role-permission/get')
  async getAllRoles() {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_all_roles' }, {}));
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('role-permission/get/:id')
  async getRoleById(@Param('id') id: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_role_by_id' }, id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('role-permission/permissions/:roleId')
  async updatePermissions(@Body() dto: UpdateRolePermissionsDto, @Param('roleId') roleId: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'update_role_permissions' }, { dto, roleId }));
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('role-permission/delete/:id')
  async deleteRole(@Param('id') id: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'delete_role' }, id));
  }
}
