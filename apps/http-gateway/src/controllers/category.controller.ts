import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CategoryDto, UserDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';
@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create')
  async createCategory(@Body() createCategoryData: CategoryDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'category_create' }, createCategoryData),
    );
  }

  @Get('get')
  async getAllCategory() {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'category_getall' }, {}),
    );
  }

  @Put('update/user-interests')
  async updateCategory(
    @Body() categoryIds: Pick<UserDto, 'interests'>,
    @Request() req: any,
  ) {
    const user = req.user || {};
    return await lastValueFrom(
      this.natsClient.send(
        { cmd: 'category_user_interest_update' },
        { categoryIds: categoryIds.interests, userId: user.userId },
      ),
    );
  }
}
