import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreatorDto, SubscribeToCreatorDto } from '@show-republic/dtos';
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
  @Get('channel/shows')
  async get_user_channel_shows(@Req() req: any) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const limit = req.query?.limit ? Number(req.query.limit) : 30;
    const userId = req.user.userId;
    const sort = req.query?.sort;
    const sortBy = req.query?.sortBy;
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'get_creator_channel_shows' }, { userId, page, limit, sort, sortBy }),
    );
    return order;
  }
  @Get('subcription/suggestions')
  async subcriptionSuggestions(@Req() req: any) {
    const userId = req.user.userId;
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'creator_subcription_suggestions' }, { userId, query: req.query }),
    );
    return order;
  }

  @Post('subscribe')
  async subscribeToCreator(@Body() payload: SubscribeToCreatorDto, @Req() req: any) {
    const userId = req.user.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'subscribe_to_creator' }, { userId, payload }));
    return order;
  }

  @Get('subscribe/count/:userId')
  async getSubscribedCreators(@Param('userId') userId: string) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_creator_subscriber_count' }, userId));
    return order;
  }
  @Get('subscription/my')
  async getMySubscriptions(@Req() req: any) {
    const userId = req.user.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_my_subscriptions' }, userId));
    return order;
  }

  // ---- analytics api start ----

  @Get('post/analytics/:postId')
  async getPostAnalytics(@Param('postId') postId: string, @Req() req: any) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'get_post_view_analytics' }, { postId, query: req.query }),
    );
    return order;
  }
}
