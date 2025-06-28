import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('creator')
export class CreatorController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
  @Post('create')
  async createCreator(payload: any) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'create_creator_profile' }, payload));
    return order;
  }
}
