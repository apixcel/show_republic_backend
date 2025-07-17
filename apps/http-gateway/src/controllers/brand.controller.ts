import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { BrandDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';
// 012345698974
@UseGuards(AuthGuard('jwt'))
@Controller('brand')
export class BrandController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create')
  async createBrand(@Body() payload: BrandDto, @Req() req: any) {
    const userId = req.user?.userId;
    return await lastValueFrom(this.natsClient.send({ cmd: 'create_brand' }, { payload, userId }));
  }
  @Get('my')
  async getUserBrandDetails(@Req() req: any) {
    const userId = req.user?.userId;
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_my_brand' }, userId));
  }
}
