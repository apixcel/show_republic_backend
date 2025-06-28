import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreatorDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@Controller('creator')
@UseGuards(AuthGuard('jwt'))
export class CreatorController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
  @Post('create')
  async createCreator(@Body() payload: CreatorDto, @Req() req: any) {
    const userId = req.user.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'create_creator_profile' }, { userId, payload }));
    return order;
  }
  @Get('/get')
  async getUserCreatorAccount(@Req() req: any) {
    const userId = req.user.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_creator_profile' }, userId));
    return order;
  }
}
