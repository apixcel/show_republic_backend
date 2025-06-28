import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChallengeDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@Controller('gamefication')
export class GameficationController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create-challenge')
  async createChallenge(@Body() payload: ChallengeDto) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'create_challenge' }, payload));
  }
  @Get('get-challenge')
  async getAllChallenge() {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_challenge' }, {}));
  }
}
