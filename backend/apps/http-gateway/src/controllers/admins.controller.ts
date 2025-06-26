import { Body, Controller, Get, Inject, Post, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller('admin')
export class AdminsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // ****** View Profile *******
  @Get('view_admins')
  async getAdmins(@Request() req: any) {
<<<<<<< HEAD
<<<<<<< HEAD

    return await lastValueFrom(
      this.natsClient.send({ cmd: 'viewAdmins' }, "")
    );
=======
    return await lastValueFrom(this.natsClient.send({ cmd: 'viewAdmins' }, ''));
>>>>>>> 2d2ef7ad1e13c6e5b7494907b15b0a3ab524e192
=======
    return await lastValueFrom(this.natsClient.send({ cmd: 'viewAdmins' }, ''));
>>>>>>> 472a59f912eae1a9a5baed8f9658cf8f65201029
  }

  @Post('login')
  async login(@Body() payload: any) {
    const res = await lastValueFrom(
      this.natsClient.send({ cmd: 'admin.login' }, payload),
    );
    return res;
  }

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 2d2ef7ad1e13c6e5b7494907b15b0a3ab524e192
=======
>>>>>>> 472a59f912eae1a9a5baed8f9658cf8f65201029
  @Post('signup')
  async signup(@Body() payload: any) {
    const res = await firstValueFrom(
      this.natsClient.send({ cmd: 'admin.signup' }, payload),
    );
    return res;
  }
}
