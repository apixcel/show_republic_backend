import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ChallengeDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@Controller('gamefication')
export class GameficationController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create-challenge')
  async createChallenge(@Body() payload: ChallengeDto) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'create_challenge' }, payload));
  }
  @Get('upcomming-challenge')
  async getUpcommingChellenge(@Query() query: Record<string, any>) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_upcomming_challenge' }, query));
  }
  @Get('active-challenge')
  async getActiveChallenge(@Query() query: Record<string, any>) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_active_challenge' }, query));
  }
  @Get('completed-challenge')
  async getCompletedChallenges(@Query() query: Record<string, any>) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_completed_challenge' }, query));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-wallet')
  async getMyWallet(@Req() req: any) {
    const userId = req?.user?.userId;
    return await lastValueFrom(this.natsClient.send({ cmd: 'game_wallet' }, userId));
  }
}
