import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create')
  async createProduct(@Body() ceateProductDto: CreateProductDto, @Req() req: any) {
    const user = req.user || {};
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'product_create' }, { ceateProductDto, userId: user.userId }),
    );
  }
}
