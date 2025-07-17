import { Body, Controller, Get, Inject, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('my')
  async createProduct(@Req() req: any) {
    const user = req.user || {};

    return await lastValueFrom(this.natsClient.send({ cmd: 'my_profile' }, user?.userId));
  }
  @Put('my/update')
  async updateUserProfile(@Req() req: any, @Body() userProfileDto: UpdateUserDto) {
    const user = req.user || {};
    return await lastValueFrom(this.natsClient.send({ cmd: 'update_profile' }, { userId: user?.userId, userProfileDto }));
  }
}
