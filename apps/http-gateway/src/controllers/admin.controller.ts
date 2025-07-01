import { Body, Controller, Get, Inject, Post, Query, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChangeUserStatusDto, LoginDto } from '@show-republic/dtos';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller('admin')
export class AdminController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // ****** View Profile *******
  @Get('view_admins')
  async getAdmins(@Request() req: any) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'viewAdmins' }, ''));
  }

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
  @Get('um/get-all')
  async getAllUser(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_um_get_u' }, query));
    return res;
  }

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
  @Get('am/get-all')
  async getAllAdmins(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_get_a' }, query));
    return res;
  }
  @Get('am/count-by-role')
  async countAdminsByRole(@Query() query: Record<string, any> = {}) {
    const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin_am_count_by_role' }, {}));
    return res;
  }
}
