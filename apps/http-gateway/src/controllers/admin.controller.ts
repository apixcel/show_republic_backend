import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  AdminProfileDto,
  ChangePasswordDto,
  ChangeUserStatusDto,
  LoginDto,
  SendAdminInvitationDto,
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
      this.natsClient.send({ cmd: 'admin_change_password' }, { adminId: userId, changePasswordDto }),
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

  @Get('um/update/change-status')
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
}
