import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AdminProfileDto, ChangeUserStatusDto, LoginDto } from '@show-republic/dtos';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller('admin')
export class AdminController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const res = await lastValueFrom(this.natsClient.send({ cmd: 'admin_login' }, payload));
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
  @Post('am/create-profile')
  async createAdminProfile(@Body() adminProfileDto: AdminProfileDto) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_create_profile' }, adminProfileDto));
    return res;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('am/get-profile/:adminId')
  async getAdminProfileByAdminId(@Param('adminId') adminId: string) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_get_profile' }, adminId));
    return res;
  }
}
