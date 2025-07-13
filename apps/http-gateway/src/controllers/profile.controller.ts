import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('my')
  async createProduct(@Req() req: any) {
    const user = req.user || {};
    console.log(user);

    return await lastValueFrom(this.natsClient.send({ cmd: 'my_profile' }, user?.userId));
  }
}
